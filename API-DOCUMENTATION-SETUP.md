# API Documentation Setup

This project uses the [starlight-openapi](https://github.com/HiDeoo/starlight-openapi) plugin to automatically generate API documentation from OpenAPI specifications.

## Configuration

The plugin is configured in `astro.config.mjs`:

```javascript
plugins: [
  starlightOpenapi([
    {
      base: 'api/petstore-api',
      label: 'Pet Store API',
      schema: './petstore-mcp-server/petstore-api.json',
    },
  ]),
],
```

## Generated Documentation

The plugin automatically generates comprehensive API documentation from the OpenAPI specification located at `petstore-mcp-server/petstore-api.json`.

### Features

- **Automatic Documentation Generation**: The plugin reads the OpenAPI spec and generates interactive documentation
- **Individual Operation Pages**: Each API endpoint gets its own detailed page with parameters, schemas, and examples
- **Tag-based Organization**: Operations are organized by tags (pets, orders, etc.)
- **Interactive API Reference**: Includes all endpoints, parameters, request/response schemas, and examples
- **Sidebar Integration**: Automatically adds the API documentation to the Starlight sidebar
- **Responsive Design**: Documentation is styled to match the Starlight theme
- **Search Integration**: All API documentation is searchable through Starlight's search functionality

### Accessing the Documentation

- **Main API Page**: `/api/petstore-api` - Overview of all API operations
- **Individual Operations**: 
  - `/api/petstore-api/operations/listpets/` - List all pets endpoint
  - `/api/petstore-api/operations/createpet/` - Create pet endpoint
  - `/api/petstore-api/operations/getpetbyid/` - Get pet by ID endpoint
  - And many more individual operation pages
- **Tag-based Pages**: `/api/petstore-api/operations/tags/pets/` - All pet-related operations
- **Sidebar Navigation**: Available under "API Reference" in the sidebar
- **Homepage Link**: Linked from the main documentation index

## OpenAPI Specification

The current API documentation is generated from `petstore-mcp-server/petstore-api.json`, which includes:

- **Pet Management**: CRUD operations for pets
- **Order Management**: Order creation and retrieval
- **Data Models**: Pet, Category, Tag, Order, and Error schemas
- **Server Information**: Production and staging server URLs

## Customization

To customize the generated documentation:

1. **Modify the OpenAPI spec**: Edit `petstore-mcp-server/petstore-api.json`
2. **Update plugin configuration**: Modify the plugin settings in `astro.config.mjs`
3. **Add multiple APIs**: Add additional schema configurations to the plugin array

## Plugin Options

The starlight-openapi plugin supports various configuration options:

- `base`: The URL path for the generated documentation
- `label`: The sidebar label for the API documentation
- `schema`: Path to the OpenAPI specification file
- `sidebar`: Customize sidebar behavior and styling
- `operations`: Configure operation display options

For more details, see the [starlight-openapi documentation](https://github.com/HiDeoo/starlight-openapi). 