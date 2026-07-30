# Agentic Jupyter (MCP) 🚀

[English](#english) | [中文](#中文)

---

## English

**Agentic Jupyter** is a revolutionary VS Code extension that exposes your local Jupyter Notebooks directly to AI Agents (like Claude Code, Cursor, Codex, etc.) via the Model Context Protocol (MCP).

Stop relying on headless background Jupyter Servers! This extension turns your VS Code editor into a steering wheel for your AI. The AI can read, insert, edit, and run cells *live in your UI*.

### Features
- ⚡ **Zero Setup Backend**: No need to start or manage background `jupyter notebook` servers.
- 👁️ **Visual & Immersive**: Watch the AI type and run code in real-time, right in your active editor.
- 🔄 **Perfect Hot-Reload**: Output, variables, and state remain exactly where you expect them.
- 🛠️ **Full MCP Support**: `notebook_list_cells`, `notebook_read_cell`, `notebook_insert_cell`, `notebook_edit_cell`, `notebook_run_cell`, `notebook_delete_cell`, `notebook_save`.

### Security & Privacy 🛡️
- **Local Sandbox Execution**: The AI controls your *active VS Code tab*. It uses VS Code's native API, meaning it cannot bypass your system's directory permissions or execute hidden malicious background kernels.
- **Explicit Proxying**: The local MCP server runs strictly on `127.0.0.1:41234`. External networks cannot connect or hijack your Jupyter kernel.
- **Visual Auditing**: Because the AI modifies cells directly in your editor, you see exactly what code is being inserted and run before and during execution. No silent background execution!

### Installation
1. Install this extension from the VS Code Marketplace.
2. In your AI Agent's `mcpServers` configuration (e.g., `settings.json` or `claude_desktop_config.json`), add:
```json
"mcpServers": {
  "jupyter-local": {
    "command": "node",
    "args": ["<path-to-extension>/out/mcp_server.js"]
  }
}
```

---

## 中文

**Agentic Jupyter** 是一款革命性的 VS Code 插件，它通过 Model Context Protocol (MCP) 将你本地的 Jupyter Notebook 直接暴露给 AI Agent（如 Claude Code, Cursor, Antigravity 等）。

不再需要依赖无头的后台 Jupyter Server！这个插件直接把你的 VS Code 编辑器变成了 AI 的操纵杆。AI 可以在你的前端界面上**实时地读取、插入、修改、运行和删除**代码单元格。

### 核心特性
- ⚡ **零配置后端**：无需繁琐地启动和维护后台 `jupyter notebook` 进程。
- 👁️ **沉浸式视觉体验**：亲眼看着 AI 就像一个真实的人类结对编程助手一样，在你的编辑器里敲代码、点运行。
- 🔄 **完美的“热重载”**：无需刷新，输出结果、变量状态和界面渲染完美同步。
- 🛠️ **全套 MCP 接口**：支持 `notebook_list_cells`, `notebook_insert_cell`, `notebook_edit_cell`, `notebook_run_cell`, `notebook_delete_cell` 等完整操作闭环。

### 安全性设计 🛡️
我们深知 AI 执行代码可能带来的顾虑，因此在设计上做到了：
- **本地沙盒边界**：AI 的所有读写执行动作，完全受限于你当前打开的 VS Code 实例及其原生 API 权限，绝无静默越权越界访问的可能。
- **本地显式代理**：MCP 桥接服务严格绑定在本地 `127.0.0.1:41234` 端口，外网及局域网均无法窃取或劫持你的内核。
- **100% 可视化审计**：AI 写入的每一行代码、执行的每一个单元格，都会实时弹现在你的屏幕上，彻底告别“后台黑盒恶意执行”的担忧。

### 安装指南
1. 从 VS Code 插件市场下载并安装本插件。
2. 在你的 AI Agent MCP 配置文件中加入以下配置：
```json
"mcpServers": {
  "jupyter-local": {
    "command": "node",
    "args": ["<path-to-extension>/out/mcp_server.js"]
  }
}
```
