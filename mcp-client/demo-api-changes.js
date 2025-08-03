#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile, readFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class APIDocsChangeDemo {
  constructor() {
    this.client = null;
    this.transport = null;
    this.backupPath = join(__dirname, '..', 'petstore-mcp-server', 'petstore-api.backup.json');
    this.apiPath = join(__dirname, '..', 'petstore-mcp-server', 'petstore-api.json');
    this.docsPath = join(__dirname, '..', 'src', 'content', 'docs', 'api');
  }

  async connectToPetStoreServer() {
    console.log('🔌 Connecting to Pet Store MCP server...');
    
    const transport = new StdioClientTransport({
      command: 'node',
      args: [join(__dirname, '..', 'petstore-mcp-server', 'server.js')]
    });
    
    this.client = new Client({
      name: 'api-docs-demo-client',
      version: '1.0.0',
    });
    
    await this.client.connect(transport);
    this.transport = transport;
    console.log('✅ Connected to Pet Store MCP server');
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }
    
    console.log('🔌 Disconnected from Pet Store MCP server');
  }

  async callTool(toolName, args = {}) {
    const response = await this.client.callTool({
      name: toolName,
      arguments: args
    });
    
    return response.content;
  }

  async backupCurrentAPI() {
    if (existsSync(this.apiPath)) {
      await copyFile(this.apiPath, this.backupPath);
      console.log('💾 Backed up current API specification');
    }
  }

  async restoreOriginalAPI() {
    if (existsSync(this.backupPath)) {
      await copyFile(this.backupPath, this.apiPath);
      console.log('🔄 Restored original API specification');
    }
  }

  async simulateAPIChanges() {
    console.log('🔄 Simulating API changes...');
    
    const currentSpec = await this.callTool('get_api_specification', {});
    const spec = JSON.parse(currentSpec[0].text);
    
    // Simulate version bump
    spec.info.version = '1.1.0';
    spec.info.description = 'A comprehensive REST API for managing pets, orders, and store operations. This API provides full CRUD operations for pets and order management with proper error handling and validation. **NEW: Added support for pet health tracking and vaccination records.**';
    
    // Add a new endpoint
    spec.paths['/pets/{petId}/health'] = {
      "get": {
        "summary": "Get pet health information",
        "description": "Retrieve health and vaccination information for a specific pet",
        "operationId": "getPetHealth",
        "tags": ["pets", "health"],
        "parameters": [
          {
            "name": "petId",
            "in": "path",
            "description": "ID of the pet",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved pet health information",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PetHealth"
                }
              }
            }
          },
          "404": {
            "description": "Pet not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    };
    
    // Add a new schema
    spec.components.schemas.PetHealth = {
      "type": "object",
      "description": "Health and vaccination information for a pet",
      "properties": {
        "petId": {
          "type": "integer",
          "description": "ID of the pet"
        },
        "weight": {
          "type": "number",
          "description": "Current weight in kilograms"
        },
        "vaccinations": {
          "type": "array",
          "description": "List of vaccinations",
          "items": {
            "$ref": "#/components/schemas/Vaccination"
          }
        },
        "lastCheckup": {
          "type": "string",
          "format": "date",
          "description": "Date of last veterinary checkup"
        },
        "healthStatus": {
          "type": "string",
          "enum": ["excellent", "good", "fair", "poor"],
          "description": "Overall health status"
        }
      },
      "required": ["petId", "healthStatus"]
    };
    
    spec.components.schemas.Vaccination = {
      "type": "object",
      "description": "Vaccination record",
      "properties": {
        "name": {
          "type": "string",
          "description": "Name of the vaccination"
        },
        "date": {
          "type": "string",
          "format": "date",
          "description": "Date when vaccination was given"
        },
        "nextDue": {
          "type": "string",
          "format": "date",
          "description": "Date when next vaccination is due"
        }
      },
      "required": ["name", "date"]
    };
    
    // Update existing pets endpoint to include health tag
    if (spec.paths['/pets/{petId}'] && spec.paths['/pets/{petId}'].get) {
      spec.paths['/pets/{petId}'].get.tags.push('health');
    }
    
    // Write the updated specification
    await writeFile(this.apiPath, JSON.stringify(spec, null, 2));
    console.log('✅ API specification updated with new features');
    
    return {
      newVersion: spec.info.version,
      newEndpoint: '/pets/{petId}/health',
      newSchemas: ['PetHealth', 'Vaccination']
    };
  }

  async generateCurrentDocs() {
    console.log('📚 Generating current API documentation...');
    
    const docs = await this.callTool('generate_markdown_docs', {
      format: 'full',
      include_examples: true
    });
    
    await mkdir(this.docsPath, { recursive: true });
    const docPath = join(this.docsPath, 'petstore-api-current.md');
    await writeFile(docPath, docs[0].text);
    
    console.log(`✅ Current docs generated: ${docPath}`);
    return docPath;
  }

  async generateUpdatedDocs() {
    console.log('📚 Generating updated API documentation...');
    
    const docs = await this.callTool('generate_markdown_docs', {
      format: 'full',
      include_examples: true
    });
    
    await mkdir(this.docsPath, { recursive: true });
    const docPath = join(this.docsPath, 'petstore-api-updated.md');
    await writeFile(docPath, docs[0].text);
    
    console.log(`✅ Updated docs generated: ${docPath}`);
    return docPath;
  }

  async compareDocs(currentPath, updatedPath) {
    console.log('🔍 Comparing documentation changes...');
    
    const currentContent = await readFile(currentPath, 'utf-8');
    const updatedContent = await readFile(updatedPath, 'utf-8');
    
    const currentLines = currentContent.split('\n');
    const updatedLines = updatedContent.split('\n');
    
    console.log(`\n📊 Documentation Comparison:`);
    console.log(`   Current version: ${currentLines.length} lines`);
    console.log(`   Updated version: ${updatedLines.length} lines`);
    console.log(`   Lines added: ${updatedLines.length - currentLines.length}`);
    
    // Find new sections
    const newSections = [];
    const healthSection = updatedContent.match(/### Health/);
    const petHealthSection = updatedContent.match(/### PetHealth/);
    const vaccinationSection = updatedContent.match(/### Vaccination/);
    
    if (healthSection) newSections.push('Health endpoints');
    if (petHealthSection) newSections.push('PetHealth schema');
    if (vaccinationSection) newSections.push('Vaccination schema');
    
    if (newSections.length > 0) {
      console.log(`   New sections: ${newSections.join(', ')}`);
    }
    
    return {
      currentLines: currentLines.length,
      updatedLines: updatedLines.length,
      newSections
    };
  }

  async createChangeLog(changes) {
    console.log('📝 Creating change log...');
    
    const changeLog = `# API Documentation Changes

## Version ${changes.newVersion}

### New Features Added

#### New Endpoint
- **GET /pets/{petId}/health** - Retrieve health and vaccination information for a specific pet
  - Added to support pet health tracking
  - Returns vaccination records and health status

#### New Data Models
- **PetHealth** - Health and vaccination information for a pet
  - Includes weight, vaccination records, and health status
- **Vaccination** - Individual vaccination record
  - Tracks vaccination name, date given, and next due date

### Updated Features
- Enhanced pet endpoints to include health-related information
- Updated API description to reflect new health tracking capabilities

### Documentation Impact
- Added new endpoint documentation with examples
- Added schema documentation for new data models
- Updated existing documentation to reference health features

Generated on: ${new Date().toISOString()}
`;

    const changeLogPath = join(this.docsPath, 'changelog.md');
    await writeFile(changeLogPath, changeLog);
    console.log(`✅ Change log created: ${changeLogPath}`);
    
    return changeLogPath;
  }

  async runDemo() {
    console.log('🚀 Starting API Documentation Change Demo\n');
    
    try {
      // Step 1: Connect to server
      await this.connectToPetStoreServer();
      
      // Step 2: Backup current API
      await this.backupCurrentAPI();
      
      // Step 3: Generate current documentation
      console.log('\n📋 Step 1: Generating Current Documentation');
      const currentDocPath = await this.generateCurrentDocs();
      
      // Step 4: Get current API info
      const currentInfo = await this.callTool('get_api_info', {});
      const currentApiInfo = JSON.parse(currentInfo[0].text);
      console.log(`   Current API: ${currentApiInfo.title} v${currentApiInfo.version}`);
      
      // Step 5: Simulate API changes
      console.log('\n📋 Step 2: Simulating API Changes');
      const changes = await this.simulateAPIChanges();
      console.log(`   New version: ${changes.newVersion}`);
      console.log(`   New endpoint: ${changes.newEndpoint}`);
      console.log(`   New schemas: ${changes.newSchemas.join(', ')}`);
      
      // Step 6: Generate updated documentation
      console.log('\n📋 Step 3: Generating Updated Documentation');
      const updatedDocPath = await this.generateUpdatedDocs();
      
      // Step 7: Compare documentation
      console.log('\n📋 Step 4: Comparing Documentation Changes');
      const comparison = await this.compareDocs(currentDocPath, updatedDocPath);
      
      // Step 8: Create change log
      console.log('\n📋 Step 5: Creating Change Log');
      const changeLogPath = await this.createChangeLog(changes);
      
      // Step 9: Demonstrate MCP client capabilities
      console.log('\n📋 Step 6: Demonstrating MCP Client Capabilities');
      
      // List available tools
      const tools = await this.client.listTools();
      console.log(`   Available tools: ${tools.tools.length}`);
      tools.tools.forEach(tool => {
        console.log(`     - ${tool.name}: ${tool.description}`);
      });
      
      // List available resources
      const resources = await this.client.listResources();
      console.log(`   Available resources: ${resources.resources.length}`);
      resources.resources.forEach(resource => {
        console.log(`     - ${resource.name}: ${resource.description}`);
      });
      
      // Step 10: Show how to detect changes
      console.log('\n📋 Step 7: Change Detection Process');
      console.log('   The MCP client can:');
      console.log('   - Connect to the Pet Store MCP server');
      console.log('   - Call tools to generate updated documentation');
      console.log('   - Compare old vs new documentation');
      console.log('   - Automatically update documentation files');
      console.log('   - Create change logs and summaries');
      
      console.log('\n🎉 Demo completed successfully!');
      console.log('\n📁 Generated files:');
      console.log(`   - Current docs: ${currentDocPath}`);
      console.log(`   - Updated docs: ${updatedDocPath}`);
      console.log(`   - Change log: ${changeLogPath}`);
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    } finally {
      // Step 11: Cleanup
      console.log('\n🧹 Cleaning up...');
      await this.restoreOriginalAPI();
      await this.disconnect();
    }
  }
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = new APIDocsChangeDemo();
  demo.runDemo().catch(console.error);
}

export default APIDocsChangeDemo; 