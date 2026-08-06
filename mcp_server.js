#!/usr/bin/env node
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORTS_DIR = path.join(os.homedir(), '.vscode-mcp-jupyter-ports');

function findPortForNotebook(notebookPath) {
    if (!fs.existsSync(PORTS_DIR)) return null;
    
    const files = fs.readdirSync(PORTS_DIR);
    let bestMatchPort = null;
    let maxPrefixLen = -1;
    let anyPort = null;
    
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        try {
            const data = JSON.parse(fs.readFileSync(path.join(PORTS_DIR, file), 'utf8'));
            if (data.pid) {
                try {
                    process.kill(data.pid, 0);
                } catch (e) {
                    try { fs.unlinkSync(path.join(PORTS_DIR, file)); } catch (e2) {}
                    continue;
                }
            }
            if (anyPort === null) anyPort = data.port;
            
            if (data.workspaces && Array.isArray(data.workspaces)) {
                for (const ws of data.workspaces) {
                    if (notebookPath.startsWith(ws)) {
                        if (ws.length > maxPrefixLen) {
                            maxPrefixLen = ws.length;
                            bestMatchPort = data.port;
                        }
                    }
                }
            }
        } catch (e) {
            // ignore unparseable files
        }
    }
    
    return bestMatchPort || anyPort;
}

// Helper to make requests to the VS Code extension
function makeRequest(apiPath, data) {
    return new Promise((resolve, reject) => {
        const notebookPath = data.notebook_path;
        if (!notebookPath) {
            return reject(new Error("notebook_path is required to route the request to the correct VS Code window."));
        }
        
        const port = findPortForNotebook(notebookPath);
        if (!port) {
            return reject(new Error("Could not find any running VS Code Jupyter MCP server instance. Ensure the extension is active."));
        }

        const req = http.request({
            hostname: '127.0.0.1',
            port: port,
            path: apiPath,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        let err;
                        try {
                            err = JSON.parse(body);
                        } catch (parseError) {
                            err = { error: body || `HTTP ${res.statusCode}` };
                        }
                        reject(new Error(err.error || `HTTP ${res.statusCode}`));
                    } else {
                        resolve(JSON.parse(body));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', (e) => {
            if (e.code === 'ECONNRESET' || e.code === 'ECONNREFUSED') {
                reject(new Error(`MCP error: Jupyter backend connection failed (${e.code}). Please ask the user to manually reconnect/select the kernel in VS Code and try again.`));
            } else {
                reject(e);
            }
        });
        req.write(JSON.stringify(data));
        req.end();
    });
}

const server = new McpServer({
    name: "jupyter-local-mcp",
    version: "1.0.0",
});

server.tool(
    "notebook_list_cells",
    "List all cells in a Jupyter notebook",
    {
        notebook_path: z.string().describe("Absolute path to the notebook file (required to route to correct window)"),
        include_outputs: z.boolean().optional().describe("If true, also retrieves the execution output/stdout of the cells"),
        cell_indices: z.array(z.number()).optional().describe("If provided, only returns the cells at these specific indices. Use this to prevent massive JSON outputs from entire notebooks.")
    },
    async ({ notebook_path, include_outputs, cell_indices }) => {
        try {
            const result = await makeRequest('/list_cells', { notebook_path, include_outputs, cell_indices });
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

server.tool(
    "notebook_run_cell",
    "Run a specific cell by index",
    { 
        cell_index: z.number().describe("0-based index of the cell to run"),
        notebook_path: z.string().describe("Absolute path to the notebook file (required to route to correct window)"),
        wait_sync: z.boolean().optional().describe("If true, the tool will block until the cell finishes execution"),
        include_outputs: z.boolean().optional().describe("If true (requires wait_sync=true), the tool will return the outputs of the cell after execution")
    },
    async ({ cell_index, notebook_path, wait_sync, include_outputs }) => {
        if (wait_sync === undefined) wait_sync = true;
        if (include_outputs === undefined && wait_sync) include_outputs = true;

        try {
            const result = await makeRequest('/run_cell', { cell_index, notebook_path, wait_sync, include_outputs });
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

server.tool(
    "notebook_edit_cell",
    "Edit the source code of a specific cell",
    { 
        cell_index: z.number().describe("0-based index of the cell to edit"),
        new_source: z.string().describe("New source code for the cell"),
        notebook_path: z.string().describe("Absolute path to the notebook file (required to route to correct window)")
    },
    async ({ cell_index, new_source, notebook_path }) => {
        try {
            const result = await makeRequest('/edit_cell', { cell_index, new_source, notebook_path });
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

server.tool(
    "notebook_insert_cell",
    "Insert a new cell",
    { 
        cell_index: z.number().describe("0-based index to insert the cell AT"),
        kind: z.enum(["code", "markdown"]).describe("Type of cell"),
        source: z.string().describe("Source code for the new cell"),
        notebook_path: z.string().describe("Absolute path to the notebook file (required to route to correct window)")
    },
    async ({ cell_index, kind, source, notebook_path }) => {
        try {
            const result = await makeRequest('/insert_cell', { cell_index, kind, source, notebook_path });
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

server.tool(
    "notebook_delete_cell",
    "Delete a cell at a specific index",
    {
        cell_index: z.number().int().describe("The index of the cell to delete (0-indexed)"),
        notebook_path: z.string().describe("Absolute path to the notebook file (required to route to correct window)")
    },
    async ({ cell_index, notebook_path }) => {
        try {
            const result = await makeRequest('/delete_cell', { cell_index, notebook_path });
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

server.tool(
    "notebook_save",
    "Save the active notebook document",
    {
        notebook_path: z.string().describe("Absolute path to the notebook file (required to route to correct window)")
    },
    async ({ notebook_path }) => {
        try {
            const result = await makeRequest('/save', { notebook_path });
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
