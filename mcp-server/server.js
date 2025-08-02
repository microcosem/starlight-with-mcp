#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { glob } from 'glob';
import { readFile, stat } from 'fs/promises';
import { join, relative, dirname, basename } from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

class StarlightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'starlight-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {
            schemes: ['file'],
            methods: ['read', 'list', 'watch']
          }
        }
      }
    );

    this.contentDir = join(process.cwd(), '..', 'src', 'content', 'docs');
    this.setupHandlers();
  }

  setupHandlers() {
    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_docs',
            description: 'List all documentation pages in the Starlight site',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Filter by category (guides, reference, etc.)',
                  enum: ['all', 'guides', 'reference']
                }
              },
              required: []
            }
          },
          {
            name: 'search_docs',
            description: 'Search documentation content by keyword',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query'
                },
                category: {
                  type: 'string',
                  description: 'Filter by category',
                  enum: ['all', 'guides', 'reference']
                }
              },
              required: ['query']
            }
          },
          {
            name: 'get_doc_content',
            description: 'Get the content of a specific documentation page',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the documentation file (relative to docs directory)'
                }
              },
              required: ['path']
            }
          },
          {
            name: 'get_site_structure',
            description: 'Get the complete site structure and navigation',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'list_docs':
          return await this.listDocs(args);
        case 'search_docs':
          return await this.searchDocs(args);
        case 'get_doc_content':
          return await this.getDocContent(args);
        case 'get_site_structure':
          return await this.getSiteStructure(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });

    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (uri === 'file:///') {
        return await this.listResources();
      }
      
      throw new Error(`Unsupported URI scheme: ${uri}`);
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (uri.startsWith('file:///')) {
        const filePath = uri.replace('file:///', '');
        return await this.readResource(filePath);
      }
      
      throw new Error(`Unsupported URI scheme: ${uri}`);
    });

    // WatchResourceRequestSchema is not available in current SDK version
    // Resource watching functionality can be added later when supported
  }

  async listDocs(args = {}) {
    const { category = 'all' } = args;
    
    try {
      let pattern = join(this.contentDir, '**', '*.md');
      if (category !== 'all') {
        pattern = join(this.contentDir, category, '**', '*.md');
      }

      const files = await glob(pattern, { absolute: true });
      const docs = [];

      for (const file of files) {
        const relativePath = relative(this.contentDir, file);
        const stats = await stat(file);
        const content = await readFile(file, 'utf-8');
        const { data: frontmatter } = matter(content);

        docs.push({
          path: relativePath,
          title: frontmatter.title || basename(file, '.md'),
          category: dirname(relativePath),
          lastModified: stats.mtime,
          size: stats.size,
          frontmatter
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: `Found ${docs.length} documentation files:\n\n${docs.map(doc => 
              `- **${doc.title}** (${doc.path})\n  Category: ${doc.category}\n  Last modified: ${doc.lastModified.toISOString()}`
            ).join('\n\n')}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to list docs: ${error.message}`);
    }
  }

  async searchDocs(args) {
    const { query, category = 'all' } = args;
    
    try {
      let pattern = join(this.contentDir, '**', '*.md');
      if (category !== 'all') {
        pattern = join(this.contentDir, category, '**', '*.md');
      }

      const files = await glob(pattern, { absolute: true });
      const results = [];

      for (const file of files) {
        const content = await readFile(file, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(content);
        
        if (content.toLowerCase().includes(query.toLowerCase())) {
          const relativePath = relative(this.contentDir, file);
          const htmlContent = md.render(markdownContent);
          
          results.push({
            path: relativePath,
            title: frontmatter.title || basename(file, '.md'),
            category: dirname(relativePath),
            frontmatter,
            content: markdownContent,
            htmlContent
          });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `Found ${results.length} results for "${query}":\n\n${results.map(result => 
              `## ${result.title}\n**Path:** ${result.path}\n**Category:** ${result.category}\n\n${result.content.substring(0, 200)}...`
            ).join('\n\n---\n\n')}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to search docs: ${error.message}`);
    }
  }

  async getDocContent(args) {
    const { path } = args;
    
    try {
      const filePath = join(this.contentDir, path);
      const content = await readFile(filePath, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      const htmlContent = md.render(markdownContent);

      return {
        content: [
          {
            type: 'text',
            text: `# ${frontmatter.title || basename(path, '.md')}\n\n**Path:** ${path}\n**Frontmatter:** ${JSON.stringify(frontmatter, null, 2)}\n\n## Content\n\n${markdownContent}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to get doc content: ${error.message}`);
    }
  }

  async getSiteStructure(args = {}) {
    try {
      const files = await glob(join(this.contentDir, '**', '*.md'), { absolute: true });
      const structure = {};

      for (const file of files) {
        const relativePath = relative(this.contentDir, file);
        const content = await readFile(file, 'utf-8');
        const { data: frontmatter } = matter(content);
        
        const parts = relativePath.split('/');
        const category = parts[0];
        const filename = parts[parts.length - 1];
        
        if (!structure[category]) {
          structure[category] = [];
        }
        
        structure[category].push({
          path: relativePath,
          title: frontmatter.title || basename(filename, '.md'),
          frontmatter
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: `# Starlight Site Structure\n\n${Object.entries(structure).map(([category, docs]) => 
              `## ${category}\n${docs.map(doc => `- [${doc.title}](${doc.path})`).join('\n')}`
            ).join('\n\n')}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to get site structure: ${error.message}`);
    }
  }

  async listResources() {
    try {
      const files = await glob(join(this.contentDir, '**', '*.md'), { absolute: true });
      
      return {
        resources: files.map(file => ({
          uri: `file:///${relative(process.cwd(), file)}`,
          name: basename(file),
          description: `Documentation file: ${relative(this.contentDir, file)}`,
          mimeType: 'text/markdown'
        }))
      };
    } catch (error) {
      throw new Error(`Failed to list resources: ${error.message}`);
    }
  }

  async readResource(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      return {
        contents: [
          {
            uri: `file:///${filePath}`,
            mimeType: 'text/markdown',
            text: content
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to read resource: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Starlight MCP Server started');
  }
}

// Export the class for testing
export { StarlightMCPServer };

// Only run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new StarlightMCPServer();
  server.run().catch(console.error);
} 