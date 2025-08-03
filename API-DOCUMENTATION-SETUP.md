# API documentation setup

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

## Generated documentation

The plugin automatically generates comprehensive API documentation from the OpenAPI specification located at `petstore-mcp-server/petstore-api.json`.

### Features

- **Automatic documentation generation**: The plugin reads the OpenAPI spec and generates interactive documentation
- **Individual operation pages**: Each API endpoint gets its own detailed page with parameters, schemas, and examples
- **Tag-based organization**: Operations are organized by tags (pets, orders, etc.)
- **Interactive API reference**: Includes all endpoints, parameters, request/response schemas, and examples
- **Sidebar integration**: Automatically adds the API documentation to the Starlight sidebar
- **Responsive design**: Documentation is styled to match the Starlight theme
- **Search integration**: All API documentation is searchable through Starlight's search functionality

### Accessing the documentation

- **Main API page**: `/api/petstore-api` - Overview of all API operations
- **Individual operations**: 
  - `/api/petstore-api/operations/listpets/` - List all pets endpoint
  - `/api/petstore-api/operations/createpet/` - Create pet endpoint
  - `/api/petstore-api/operations/getpetbyid/` - Get pet by ID endpoint
  - And many more individual operation pages
- **Tag-based pages**: `/api/petstore-api/operations/tags/pets/` - All pet-related operations
- **Sidebar navigation**: Available under "API Reference" in the sidebar
- **Homepage link**: Linked from the main documentation index

## OpenAPI specification

The current API documentation is generated from `petstore-mcp-server/petstore-api.json`, which includes:

- **Pet management**: CRUD operations for pets
- **Order management**: Order creation and retrieval
- **Data models**: Pet, Category, Tag, Order, and Error schemas
- **Server information**: Production and staging server URLs

## Customization

To customize the generated documentation:

1. **Modify the OpenAPI spec**: Edit `petstore-mcp-server/petstore-api.json`
2. **Update plugin configuration**: Modify the plugin settings in `astro.config.mjs`
3. **Add multiple APIs**: Add additional schema configurations to the plugin array

## Plugin options

The starlight-openapi plugin supports various configuration options:

- `base`: The URL path for the generated documentation
- `label`: The sidebar label for the API documentation
- `schema`: Path to the OpenAPI specification file
- `sidebar`: Customize sidebar behavior and styling
- `operations`: Configure operation display options

For more details, see the [starlight-openapi documentation](https://github.com/HiDeoo/starlight-openapi). 