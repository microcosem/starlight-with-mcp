# Starlight MCP Demo

A demonstration of using MCP (Model Context Protocol) to generate documentation from multiple sources.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
cd mcp-server && npm install && cd ..
cd petstore-mcp-server && npm install && cd ..
cd mcp-client && npm install && cd ..
```

### 2. Test the Workflow

```bash
# Test all components
npm run test-workflow

# Run the complete demo
npm run demo

# View the documentation
npm run dev
```

## 📋 What This Demo Shows

This project demonstrates a complete MCP workflow:

1. **MCP Client** connects to multiple MCP servers
2. **Pet Store MCP Server** provides API documentation from OpenAPI specs
3. **Starlight MCP Server** manages existing documentation
4. **Automated generation** creates combined documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Starlight     │    │   MCP Client     │    │  Pet Store      │
│   Docs Site     │◄───┤   (Orchestrator) │◄───┤  MCP Server     │
│                 │    │                  │    │                 │
│ - Guides        │    │ - Connects to    │    │ - OpenAPI Spec  │
│ - Reference     │    │   multiple MCP   │    │ - API Endpoints │
│ - API Docs      │    │   servers        │    │ - Data Schemas  │
│ - Generated     │    │ - Generates docs │    │ - Examples      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🧞 Available Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site (includes doc generation) |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run demo`            | Run the complete MCP workflow demo               |
| `npm run test-workflow`   | Test all MCP components                          |
| `npm run generate-docs`   | Generate documentation from MCP servers          |
| `npm run demo-petstore`   | Test Pet Store MCP server only                   |
| `npm run demo-starlight`  | Test Starlight MCP server only                   |

## 📁 Project Structure

```
.
├── mcp-server/              # Starlight MCP server
├── petstore-mcp-server/     # Pet Store API MCP server
├── mcp-client/              # MCP client orchestrator
├── src/content/docs/        # Generated documentation
├── test-workflow.js         # Workflow test script
└── MCP-DEMO-WORKFLOW.md     # Detailed documentation
```

## 🔍 Generated Documentation

After running the demo, you'll find:

- **API Documentation**: `src/content/docs/api/petstore-api.md`
- **Updated Index**: `src/content/docs/index.mdx`

## 📚 Learn More

- [MCP Demo Workflow Guide](MCP-DEMO-WORKFLOW.md) - Detailed documentation
- [Starlight Documentation](https://starlight.astro.build/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 👀 Want to learn more?

Check out [Starlight's docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
