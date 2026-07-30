# Agentic Jupyter (MCP)

[![Marketplace Version](https://vsmarketplacebadges.dev/version/koyo922.agentic-jupyter-mcp.svg)](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp)
[![Installs](https://vsmarketplacebadges.dev/installs/koyo922.agentic-jupyter-mcp.svg)](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文](#中文)

---

## English

A practical VS Code extension that bridges your local Jupyter Notebooks with AI Agents (like Claude Code, Cursor, Antigravity) using the Model Context Protocol (MCP).

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

**Method 1: One-Click Install**  
Click here to open VS Code and install directly:  
👉 [vscode:extension/koyo922.agentic-jupyter-mcp](vscode:extension/koyo922.agentic-jupyter-mcp)

**Method 2: IDE Search**  
Open the Extensions sidebar (`Cmd+Shift+X` or `Ctrl+Shift+X`) in VS Code or Cursor, search for **Agentic Jupyter**, and click Install.

**Method 3: Web Marketplace**  
Visit the [VS Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp) and click Install.

### Configuration (For AI Agents)
Once installed, you need to tell your AI Agent (via its `settings.json` or MCP config file) where the MCP server script is located. 

Add the following to your AI's `mcpServers` configuration:

```json
"mcpServers": {
  "jupyter-local": {
    "command": "node",
    "args": ["<YOUR_EXTENSION_PATH>/out/mcp_server.js"]
  }
}
```

**How to find `<YOUR_EXTENSION_PATH>`?**
VS Code installs extensions in your home directory. Replace `<YOUR_EXTENSION_PATH>` with the actual path based on your OS:
- **Mac/Linux**: `~/.vscode/extensions/koyo922.agentic-jupyter-mcp-0.0.3` (Note: replace `0.0.3` with the version you installed)
- **Windows**: `%USERPROFILE%\.vscode\extensions\koyo922.agentic-jupyter-mcp-0.0.3`
- **Cursor Users**: Look in `~/.cursor/extensions/...` instead.

### Security
- **No Background execution**: The AI can only act on the Notebook tab you currently have open in your UI.
- **Visual Auditing**: Because the AI types in your editor, you see exactly what is being executed *before* and *during* the run. 
- **Local Proxy Only**: The MCP communication runs strictly on `127.0.0.1:41234`.

---

## 中文

这是一个实用的 VS Code 插件，主要作用是通过 Model Context Protocol (MCP) 让 AI Agent（比如 Claude Code, Cursor, Antigravity 等）能够直接操控你本地的 Jupyter Notebook。

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

**方式 1：一键唤起 IDE 安装**  
点击下方链接，直接唤起 VS Code 进行安装：  
👉 [vscode:extension/koyo922.agentic-jupyter-mcp](vscode:extension/koyo922.agentic-jupyter-mcp)

**方式 2：在 IDE 内搜索**  
在 VS Code 或 Cursor 的插件扩展面板（`Cmd+Shift+X` 或 `Ctrl+Shift+X`）中，直接搜索 **Agentic Jupyter** 并点击安装。

**方式 3：网页端市场**  
访问 [VS Code 官方插件市场](https://marketplace.visualstudio.com/items?itemName=koyo922.agentic-jupyter-mcp) 点击 Install。

### 配置 MCP (写给 AI Agent)
安装好插件后，你需要告诉你的 AI Agent 这个 MCP 服务在哪里。
请在 AI Agent 的配置文件（如 `settings.json` 或 `claude_desktop_config.json`）中，加入以下配置：

```json
"mcpServers": {
  "jupyter-local": {
    "command": "node",
    "args": ["<你的插件完整路径>/out/mcp_server.js"]
  }
}
```

**如何找到 `<你的插件完整路径>`？**
插件通常安装在用户目录下的 `.vscode/extensions/` 文件夹中。请根据你的系统替换以下路径（注意修改最后的版本号匹配你实际下载的版本）：
- **Mac / Linux**: `~/.vscode/extensions/koyo922.agentic-jupyter-mcp-0.0.3`
- **Windows**: `%USERPROFILE%\.vscode\extensions\koyo922.agentic-jupyter-mcp-0.0.3`
- **如果你使用的是 Cursor**: 路径则在 `~/.cursor/extensions/...` 下面。

### 安全机制
- **拒绝后台搞事**：AI 的读写操作仅限于你当前肉眼正在查看的 Notebook 页面，不会越界操作。
- **透明可见**：由于所有的代码修改都会实时反应在你的编辑器中，任何风险代码在你按下运行前都能被直接审查。
- **本地安全绑定**：MCP 通信端口被严格限制在 `127.0.0.1:41234`，杜绝局域网或外部劫持。
