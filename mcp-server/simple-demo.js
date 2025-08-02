#!/usr/bin/env node

import { StarlightMCPServer } from './server.js';

async function simpleDemo() {
  console.log('🚀 Starting Simple Demo...\n');
  
  try {
    const server = new StarlightMCPServer();
    
    console.log('1. Testing list_docs...');
    const listResult = await server.listDocs({ category: 'all' });
    console.log('✅ Success! Found documents:');
    console.log(listResult.content[0].text.substring(0, 300) + '...\n');
    
    console.log('2. Testing search_docs...');
    const searchResult = await server.searchDocs({ query: 'example' });
    console.log('✅ Success! Search results:');
    console.log(searchResult.content[0].text.substring(0, 300) + '...\n');
    
    console.log('3. Testing get_site_structure...');
    const structureResult = await server.getSiteStructure({});
    console.log('✅ Success! Site structure:');
    console.log(structureResult.content[0].text.substring(0, 300) + '...\n');
    
    console.log('4. Testing get_doc_content...');
    const contentResult = await server.getDocContent({ path: 'guides/example.md' });
    console.log('✅ Success! Document content:');
    console.log(contentResult.content[0].text.substring(0, 300) + '...\n');
    
    console.log('🎉 All server functions work correctly!');
    console.log('\nThe MCP server is ready to use.');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

simpleDemo(); 