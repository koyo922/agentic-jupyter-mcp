#!/usr/bin/env node
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const http = require("http");

// Helper to make requests to the VS Code extension
function makeRequest(path, data) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1',
            port: 41234,
            path: path,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        const err = JSON.parse(body);
                        reject(new Error(err.error || `HTTP ${res.statusCode}`));
                    } else {
                        resolve(JSON.parse(body));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', (e) => reject(e));
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
    "List all cells in the active Jupyter notebook",
    {},
    async () => {
        try {
            const result = await makeRequest('/list_cells', {});
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e) {
            return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
    }
);

server.tool(
    "notebook_run_cell",
    "Run a specific cell by index",
    { cell_index: z.number().describe("0-based index of the cell to run") },
    async ({ cell_index }) => {
        try {
            const result = await makeRequest('/run_cell', { cell_index });
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
        new_source: z.string().describe("New source code for the cell")
    },
    async ({ cell_index, new_source }) => {
        try {
            const result = await makeRequest('/edit_cell', { cell_index, new_source });
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
        source: z.string().describe("Source code for the new cell")
    },
    async ({ cell_index, kind, source }) => {
        try {
            const result = await makeRequest('/insert_cell', { cell_index, kind, source });
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
    },
    async ({ cell_index }) => {
        const res = await callExtension('/delete_cell', { cell_index });
        return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }
);

server.tool(
    "notebook_save",
    "Save the active notebook document",
    {},
    async () => {
        try {
            const result = await makeRequest('/save', {});
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
