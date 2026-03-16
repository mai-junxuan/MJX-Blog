# Claude Code 的 Skill 和 MCP 的区别

## 概述

在使用 Claude Code 时，你可能会遇到两个容易混淆的概念：**Skill（技能）** 和 **MCP（Model Context Protocol）**。虽然它们都是扩展 Claude Code 能力的方式，但它们的设计理念、实现方式和应用场景完全不同。本文将深入探讨这两者的区别，帮助你在实际开发中做出正确的选择。

## 什么是 Skill？

### 核心概念

Skill 是 Claude Code 中的**专用提示词模板系统**。它本质上是一组预定义的指令集，用于处理特定类型的任务。

### 工作原理

当你调用一个 Skill 时，实际上发生的是：

1. Claude Code 读取对应的 Skill 定义文件
2. 将 Skill 中的提示词**内联扩展**到当前对话中
3. Claude 按照扩展后的提示词执行任务
4. 整个过程在当前对话上下文中完成

### 特点

- **轻量级**：仅仅是提示词模板，不需要额外的进程或服务
- **即时执行**：在对话中直接扩展，无需外部通信
- **领域特定**：通常针对某个特定任务类型设计
- **易于创建**：只需编写 Markdown 格式的提示词文件

### 适用场景

- 文档格式处理（PDF、Excel、Word）
- 代码审查流程
- 特定格式的代码生成
- 重复性工作流的自动化

## 什么是 MCP？

### 核心概念

MCP（Model Context Protocol）是一个**开放的协议标准**，用于在 AI 模型和外部工具/数据源之间建立标准化的通信。它不是 Claude Code 独有的，而是一个可以被任何 AI 应用采用的通用协议。

### 工作原理

MCP 采用**客户端-服务器架构**：

1. **MCP Server**：独立运行的进程，提供工具、资源或提示
2. **MCP Client**：Claude Code 作为客户端，通过标准化协议与服务器通信
3. **RPC 调用**：使用 JSON-RPC 2.0 协议进行远程过程调用
4. **数据交换**：服务器响应请求，返回数据或执行操作

### 架构示意

```
┌─────────────┐         MCP Protocol        ┌──────────────┐
│             │◄──────────────────────────►│              │
│ Claude Code │     (JSON-RPC 2.0)         │  MCP Server  │
│  (Client)   │                            │              │
└─────────────┘                            └──────────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │  External APIs  │
                                           │  Databases      │
                                           │  File Systems   │
                                           └─────────────────┘
```

### 特点

- **重量级**：需要运行独立的服务器进程
- **标准化**：遵循 MCP 协议规范，跨应用兼容
- **功能丰富**：可以提供工具（Tools）、资源（Resources）、提示（Prompts）
- **外部集成**：连接真实的外部系统和服务
- **可扩展**：任何人都可以开发自己的 MCP Server

### 使用示例

```json
// 在 Claude Code settings 中配置 MCP Server
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

调用后，MCP 提供的工具会自动出现在 Claude Code 的工具列表中：
- `mcp__github__create_issue`
- `mcp__github__list_repositories`
- 等等

### 适用场景

- 访问外部数据源（PostgreSQL、MongoDB）
- 集成第三方服务（GitHub、Slack、Google Drive）
- 需要持久化状态的复杂工具
- 跨项目、跨团队共享的工具集
- 实时数据获取和处理

## 核心区别对比

| 维度 | Skill | MCP Server |
|------|-------|------------|
| **本质** | 提示词模板/指令集 | 外部工具服务器 |
| **架构** | 内联到对话中 | 独立进程，C/S 架构 |
| **通信方式** | 提示词扩展 | JSON-RPC 2.0 协议 |
| **执行环境** | Claude Code 内部 | 独立进程 |
| **功能范围** | 特定工作流指导 | 工具、资源、提示 |
| **外部依赖** | 无 | 需要服务器运行时 |
| **扩展性** | 有限（需 Claude Code 支持）| 高（开放标准） |
| **配置复杂度** | 低（只需文件） | 中等（需配置服务器） |
| **性能开销** | 几乎无 | 有进程和网络开销 |
| **跨应用兼容** | 否（Claude Code 特定） | 是（MCP 标准） |

## 技术深度对比

### Skill 的技术实现

```markdown
<!-- .claude/skills/my-skill.md -->
# 我的自定义 Skill

当用户调用这个 Skill 时，你将：

1. 分析项目结构
2. 检查代码规范
3. 生成报告

注意事项：
- 遵循项目的编码标准
- 提供具体的改进建议
```

这个文件会在调用时被直接读取并作为提示词发送给 Claude。

### MCP 的技术实现

一个简单的 MCP Server 示例：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "get_database_stats",
        description: "获取数据库统计信息",
        inputSchema: {
          type: "object",
          properties: {
            database_name: { type: "string" }
          }
        }
      }
    ]
  };
});

// 处理工具调用
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_database_stats") {
    // 实际连接数据库并返回数据
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ tables: 10, rows: 1000 })
      }]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## 实际应用场景示例

### 场景 1：代码审查

**使用 Skill**：
```bash
/skill code-review
```
Skill 会扩展成一组审查指令，引导 Claude 按照特定流程审查代码。

**使用 MCP**：
不太适合，因为代码审查主要是提示工程，不需要外部工具。

### 场景 2：数据库操作

**使用 Skill**：
不适合，Skill 无法实际连接数据库。

**使用 MCP**：
```typescript
// 配置 PostgreSQL MCP Server
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```
Claude 可以通过 MCP 提供的工具实际查询和操作数据库。

### 场景 3：GitHub 集成

**使用 Skill**：
只能提供指导，无法实际操作 GitHub。

**使用 MCP**：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```
可以创建 Issue、PR、读取仓库信息等实际操作。

## 如何选择？

### 选择 Skill 的情况

✅ 你需要标准化某个工作流程
✅ 任务主要依赖 Claude 的推理能力
✅ 不需要访问外部系统
✅ 追求简单、轻量的解决方案
✅ 快速原型或个人使用

### 选择 MCP 的情况

✅ 需要访问外部数据源或 API
✅ 需要在多个 AI 应用间共享工具
✅ 需要复杂的状态管理
✅ 工具需要团队协作开发
✅ 追求可扩展的企业级解决方案

## 组合使用

实际上，Skill 和 MCP 可以**协同工作**：

```markdown
<!-- custom-skill.md -->
# 数据分析 Skill

你将使用 MCP 提供的数据库工具完成以下任务：

1. 使用 `mcp__postgres__query` 获取数据
2. 分析数据并生成可视化建议
3. 使用 `mcp__github__create_issue` 创建分析报告

注意：确保查询优化，避免全表扫描。
```

这个 Skill 提供了工作流指导，而实际的数据库操作由 MCP 完成。

## 未来发展趋势

### Skill 的演进
- 更强大的模板系统
- 参数化 Skill
- Skill 组合与嵌套

### MCP 的演进
- 更多官方和社区 Server
- 协议标准的持续完善
- 跨平台 AI 应用的广泛采用
- 企业级安全和权限管理

## 总结

| 方面 | Skill | MCP |
|------|-------|-----|
| **定位** | 工作流模板 | 工具集成框架 |
| **复杂度** | 简单 | 复杂 |
| **能力边界** | 提示工程 | 系统集成 |
| **学习曲线** | 平缓 | 陡峭 |
| **最佳实践** | 标准化流程 | 外部工具桥接 |

**一句话总结**：
- **Skill 是"教 Claude 怎么做"**
- **MCP 是"给 Claude 工具去做"**

选择哪个取决于你的具体需求：如果只需要指导和流程，用 Skill；如果需要真实的外部能力，用 MCP。在复杂场景下，两者结合使用会获得最佳效果。

## 参考资源

- [Claude Code 官方文档](https://github.com/anthropics/claude-code)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [MCP Server 示例库](https://github.com/modelcontextprotocol/servers)

---

*本文基于 Claude Code 2025 年版本编写，部分特性可能随版本更新而变化。*
