#!/usr/bin/env node

import SimpleMCPClient from './simple-client.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateDocs() {
  console.log('📚 Generating documentation from MCP servers...\n');
  
  const client = new SimpleMCPClient();
  
  try {
    // Generate combined documentation
    const result = await client.generateCombinedDocs();
    
    console.log('\n✅ Documentation generation completed successfully!');
    console.log('\n📁 Generated files:');
    console.log(`   - API Documentation: ${result.apiPath}`);
    console.log(`   - Index Page: ${result.indexPath}`);
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Review the generated documentation');
    console.log('   2. Run "npm run dev" to preview the site');
    console.log('   3. Commit the changes to version control');
    
    return result;
    
  } catch (error) {
    console.error('❌ Documentation generation failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocs();
}

export default generateDocs; 