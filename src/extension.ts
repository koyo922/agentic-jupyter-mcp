import * as vscode from 'vscode';
import * as http from 'http';

let server: http.Server | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Jupyter Local MCP Extension activated');

    server = http.createServer((req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            if (req.method === 'POST') {
                try {
                    const data = body ? JSON.parse(body) : {};
                    const result = await handleRequest(req.url || '', data);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } catch (err: any) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message || String(err) }));
                }
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    });

    server.listen(41234, '127.0.0.1', () => {
        console.log('Jupyter Local MCP bridge listening on http://127.0.0.1:41234');
    });
    
    context.subscriptions.push({
        dispose: () => {
            if (server) {
                server.close();
            }
        }
    });
}

async function handleRequest(path: string, data: any): Promise<any> {
    const editor = vscode.window.activeNotebookEditor;
    if (!editor) {
        throw new Error("No active notebook editor found in VS Code");
    }

    const notebook = editor.notebook;

    if (path === '/list_cells') {
        const cells = notebook.getCells().map((cell, index) => ({
            index,
            kind: cell.kind === vscode.NotebookCellKind.Code ? 'code' : 'markdown',
            source: cell.document.getText(),
            executionSummary: cell.executionSummary
        }));
        return { cells };
    }

    if (path === '/run_cell') {
        const index = data.cell_index;
        if (typeof index !== 'number' || index < 0 || index >= notebook.cellCount) {
            throw new Error(`Invalid cell index: ${index}`);
        }
        await vscode.commands.executeCommand('notebook.cell.execute', {
            start: index,
            end: index + 1
        });
        return { success: true, message: `Executed cell ${index}` };
    }

    if (path === '/edit_cell') {
        const index = data.cell_index;
        const newSource = data.new_source;
        if (typeof index !== 'number' || index < 0 || index >= notebook.cellCount) {
            throw new Error(`Invalid cell index: ${index}`);
        }
        const cell = notebook.cellAt(index);
        const edit = new vscode.WorkspaceEdit();
        // Provide the full document range to replace
        const endLine = cell.document.lineCount > 0 ? cell.document.lineCount - 1 : 0;
        const endChar = cell.document.lineAt(endLine).text.length;
        edit.replace(cell.document.uri, new vscode.Range(0, 0, endLine, endChar), newSource);
        const success = await vscode.workspace.applyEdit(edit);
        return { success, message: success ? `Edited cell ${index}` : `Failed to edit cell ${index}` };
    }

    if (path === '/insert_cell') {
        const index = data.cell_index;
        const kind = data.kind === 'markdown' ? vscode.NotebookCellKind.Markup : vscode.NotebookCellKind.Code;
        const source = data.source || '';
        
        const cellData = new vscode.NotebookCellData(kind, source, kind === vscode.NotebookCellKind.Code ? 'python' : 'markdown');
        const edit = new vscode.WorkspaceEdit();
        edit.set(notebook.uri, [vscode.NotebookEdit.insertCells(index, [cellData])]);
        const success = await vscode.workspace.applyEdit(edit);
        return { success, message: success ? `Inserted cell at ${index}` : `Failed to insert cell` };
    }

    if (path === '/save') {
        const success = await notebook.save();
        return { success, message: success ? "Saved notebook" : "Failed to save notebook" };
    }

    throw new Error(`Unknown endpoint: ${path}`);
}

export function deactivate() {
    if (server) {
        server.close();
    }
}
