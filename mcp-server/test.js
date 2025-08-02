#!/usr/bin/env node

import { StarlightMCPServer } from './server.js';

async function testServer() {
  console.log('Testing Starlight MCP Server...\n');
  
  const server = new StarlightMCPServer();
  
  try {
    // Test list_docs
    console.log('1. Testing list_docs...');
    const listResult = await server.listDocs({ category: 'all' });
    console.log('✅ list_docs works');
    console.log(listResult.content[0].text.substring(0, 200) + '...\n');
    
    // Test search_docs
    console.log('2. Testing search_docs...');
    const searchResult = await server.searchDocs({ query: 'example' });
    console.log('✅ search_docs works');
    console.log(searchResult.content[0].text.substring(0, 200) + '...\n');
    
    // Test get_site_structure
    console.log('3. Testing get_site_structure...');
    const structureResult = await server.getSiteStructure({});
    console.log('✅ get_site_structure works');
    console.log(structureResult.content[0].text.substring(0, 200) + '...\n');
    
    // Test get_doc_content
    console.log('4. Testing get_doc_content...');
    const contentResult = await server.getDocContent({ path: 'guides/example.md' });
    console.log('✅ get_doc_content works');
    console.log(contentResult.content[0].text.substring(0, 200) + '...\n');
    
    console.log('🎉 All tests passed! The MCP server is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testServer(); 