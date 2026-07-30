# Agentic Jupyter (MCP)

[![Marketplace Version](https://vsmarketplacebadges.dev/version/koyo922.agentic-jupyter-mcp.svg)](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp)
[![Installs](https://vsmarketplacebadges.dev/installs/koyo922.agentic-jupyter-mcp.svg)](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文](#中文)

---

## English

A practical VS Code extension that bridges your local Jupyter Notebook UI Sessions with AI Agents (like the IDE's built-in Cursor, Windsurf, or Antigravity sidebar) using the Model Context Protocol (MCP).

> **Note**: If you already have a standalone Jupyter Server running locally or remotely, you don't need this extension (Agents can connect to it directly via HTTP). We recommend using our sister project **[agentic-jupyter-remote-mcp](https://github.com/koyo922/agentic-jupyter-remote-mcp)** for remote Jupyter servers (which supports WebSocket execution and local sync).
> 
> This extension is specifically designed for **IDE users** (VS Code / Cursor / Windsurf) who rely on the IDE's built-in IPython kernel, where no external Jupyter Server URL exists.

### 🤖 For AI Agents (Auto-Configuration Prompt)
*Tip for Humans: You can just give the URL of this README to your AI Agent, or copy-paste this block. The AI will read it, run the CLI commands to install the extension for you, and configure itself automatically!*

```text
Attention AI Agent: You are equipped with the Agentic Jupyter MCP tools. 

SETUP INSTRUCTIONS:
1. AUTOMATIC INSTALLATION: If the user hasn't installed this extension yet, you can do it for them! Run the appropriate shell command for their IDE:
   - VS Code: `code --install-extension koyo922.agentic-jupyter-mcp`
   - Cursor: `cursor --install-extension koyo922.agentic-jupyter-mcp`
   - Windsurf: `windsurf --install-extension koyo922.agentic-jupyter-mcp`
2. Add the following to your `mcpServers` configuration file (e.g., claude_desktop_config.json, settings.json). Replace `<EXTENSION_PATH>` with the real path (e.g., `~/.vscode/extensions/koyo922.agentic-jupyter-mcp-0.0.7/out/mcp_server.js`):
   "jupyter-local": {
     "command": "node",
     "args": ["<EXTENSION_PATH>", "--port", "41234"]
   }
3. If port 41234 is in use, instruct the user to change `agentic-jupyter-mcp.port` in VS Code settings and update your config args to match.

USAGE INSTRUCTIONS:
1. How to Read: Always start by calling `notebook_list_cells` to get the current state and `index` of each cell.
2. How to Write/Edit:
   - Call `notebook_edit_cell` with the `cell_index` and complete `new_source` to edit.
   - Call `notebook_insert_cell` with the `cell_index` (where to insert AT), `kind` ("code" or "markdown"), and `source`.
   - Call `notebook_delete_cell` with the `cell_index` to delete.
3. How to Run: After inserting or editing a cell, you MUST call `notebook_run_cell` with the `cell_index` to execute it. 
4. General Rules: The user can see everything you do live in their IDE. Do not write scratch code or destructive commands. Ensure you read the output carefully after running.
```

### The Pain Point
If you've ever asked an AI Agent to write or debug a Jupyter Notebook, you've likely run into these frustrations:
1. **The Black Box**: The AI starts a headless Jupyter server in the background. You can't see what cells it's running or what the charts/outputs look like until it's finished.
2. **File Save Conflicts**: When the AI edits the `.ipynb` file in the background while you have it open in VS Code, you get annoying "File has been modified on disk" overwrite warnings.
3. **Desynced State**: The AI's background kernel state and your frontend UI state are completely disconnected.

### How this solves it
This extension simply exposes VS Code's native Notebook API to your AI Agent via MCP. 
Instead of spinning up a background server, **the AI directly controls your active VS Code tab**. 
You can sit back and watch the AI insert cells, type code, and click "Run" right in front of your eyes—just like a human pair programmer.

### Installation

**Method 1: Web Marketplace**  
Visit the [VS Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp) and click the **Install** button to launch your IDE automatically.

**Method 2: IDE Search (VS Code / Cursor / Windsurf)**  
Open the Extensions sidebar (`Cmd+Shift+X` or `Ctrl+Shift+X`) in your IDE, search for **Agentic Jupyter**, and click Install.

### Security
- **No Background execution**: The AI can only act on the Notebook tab you currently have open in your UI.
- **Visual Auditing**: Because the AI types in your editor, you see exactly what is being executed *before* and *during* the run. 
- **Local Proxy Only**: The MCP communication runs strictly on `127.0.0.1`.

---

## 中文

这是一个实用的 VS Code 插件，主要作用是通过 Model Context Protocol (MCP) 让 AI Agent（比如 IDE 内置的 Cursor, Windsurf, Antigravity 侧边栏等）能够在 IDE 界面内直接操控你当前正在查看的 Jupyter Notebook 标签页会话。

> **写在前面**：如果你本地或远端已经单独启动了一个完整的 Jupyter Server，你其实不需要这个插件（AI Agent 可以直接通过 URL 连过去）。对于远端服务器的情况，推荐使用我们的兄弟项目 **[agentic-jupyter-remote-mcp](https://github.com/koyo922/agentic-jupyter-remote-mcp)**。
> 
> 这个插件**专为 IDE 环境设计**：在 VS Code 或 Cursor 中，往往没有独立的 Jupyter Server，只有一个运行在内存里的 IPython 动态 Kernel。这时候外部的 AI 侧边栏根本摸不到你的变量状态，才需要用到这个插件。

### 🤖 一键丢给 AI Agent 的全自动指令
*小贴士：你甚至不需要自己动手！直接把当前这个网页的 URL 发给你的 AI，或者把下面这段英文复制给它。AI 读完后会直接在后台帮你敲命令安装插件，并自动修改它的配置文件，一条龙服务。*

```text
Attention AI Agent: You are equipped with the Agentic Jupyter MCP tools. 

SETUP INSTRUCTIONS:
1. AUTOMATIC INSTALLATION: If the user hasn't installed this extension yet, you can do it for them! Run the appropriate shell command for their IDE:
   - VS Code: `code --install-extension koyo922.agentic-jupyter-mcp`
   - Cursor: `cursor --install-extension koyo922.agentic-jupyter-mcp`
   - Windsurf: `windsurf --install-extension koyo922.agentic-jupyter-mcp`
2. Add the following to your `mcpServers` configuration file (e.g., claude_desktop_config.json, settings.json). Replace `<EXTENSION_PATH>` with the real path (e.g., `~/.vscode/extensions/koyo922.agentic-jupyter-mcp-0.0.7/out/mcp_server.js`):
   "jupyter-local": {
     "command": "node",
     "args": ["<EXTENSION_PATH>", "--port", "41234"]
   }
3. If port 41234 is in use, instruct the user to change `agentic-jupyter-mcp.port` in VS Code settings and update your config args to match.

USAGE INSTRUCTIONS:
1. How to Read: Always start by calling `notebook_list_cells` to get the current state and `index` of each cell.
2. How to Write/Edit:
   - Call `notebook_edit_cell` with the `cell_index` and complete `new_source` to edit.
   - Call `notebook_insert_cell` with the `cell_index` (where to insert AT), `kind` ("code" or "markdown"), and `source`.
   - Call `notebook_delete_cell` with the `cell_index` to delete.
3. How to Run: After inserting or editing a cell, you MUST call `notebook_run_cell` with the `cell_index` to execute it. 
4. General Rules: The user can see everything you do live in their IDE. Do not write scratch code or destructive commands. Ensure you read the output carefully after running.
```

### 我们遇到过什么痛点？
如果你曾经让 AI 帮你写过或者调试过 Jupyter Notebook，你大概率遇到过这些让人头疼的问题：
1. **黑盒运行**：AI 总是在后台悄悄启动一个无头的 Jupyter 服务。它跑了什么单元格、画了什么图表，你在前台完全看不到，只能等它全部跑完。
2. **保存冲突**：你在 VS Code 里开着文件，AI 在后台强行修改了 `.ipynb` 文件，导致编辑器频繁弹窗警告你“文件在磁盘上已被修改，是否覆盖？”。
3. **状态割裂**：后台运行的变量状态和你前台看到的界面状态完全不同步，没法愉快地接手继续调试。

### 这个插件是怎么解决的？
它的思路非常直接：它将 VS Code 原生的 Notebook API 开放给了 MCP 协议。
这意味着，AI 不再需要去后台偷偷启动服务，而是**直接接管你当前正在 VS Code 里打开的那个页面**。
你可以靠在椅子上，亲眼看着 AI 就像一个活生生的结对程序员一样，在你的屏幕上新建单元格、敲击代码，并触发运行。所见即所得。

### 安装指南

**方式 1：网页端一键安装**  
访问 [VS Code 官方插件市场页面](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp)，点击绿色的 **Install** 按钮，网页会自动唤醒你本地的编辑器（支持 VS Code 等主流客户端）完成安装。

**方式 2：在 IDE 内搜索**  
在 VS Code 或 Cursor 的插件扩展面板（`Cmd+Shift+X` 或 `Ctrl+Shift+X`）中，直接搜索 **Agentic Jupyter** 并点击安装。

### 安全机制
- **拒绝后台搞事**：AI 的读写操作仅限于你当前肉眼正在查看的 Notebook 页面，不会越界操作。
- **透明可见**：由于所有的代码修改都会实时反应在你的编辑器中，任何风险代码在你按下运行前都能被直接审查。
- **本地安全绑定**：MCP 通信端口被严格限制在 `127.0.0.1`，杜绝局域网或外部劫持。
