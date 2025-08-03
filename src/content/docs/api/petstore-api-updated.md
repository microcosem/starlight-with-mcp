# Pet Store API

A comprehensive REST API for managing pets, orders, and store operations. This API provides full CRUD operations for pets and order management with proper error handling and validation. **NEW: Added support for pet health tracking and vaccination records.**

**Version:** 1.1.0
**Contact:** API Support (support@petstore.com)

## Servers

- **Production server - Use for live applications:** `https://api.petstore.com/v1`
- **Staging server - Use for testing and development:** `https://staging-api.petstore.com/v1`

## API Endpoints

### Pets

#### GET /pets

List all pets

Retrieve a paginated list of all pets in the store. You can filter by status and limit the number of results returned.

**Parameters:**
- `limit` (query) - Maximum number of pets to return (1-100)
- `status` (query) - Filter pets by their current status in the store

**Responses:**
- `200` - Successfully retrieved list of pets
- `400` - Bad request - Invalid parameters provided

#### POST /pets

Create a new pet

Add a new pet to the store. The pet will be created with the provided information and assigned a unique ID.

**Responses:**
- `201` - Pet created successfully
- `400` - Bad request - Invalid pet data

#### GET /pets/{petId}

Get pet by ID

Retrieve detailed information about a specific pet by its unique identifier.

**Parameters:**
- `petId` (path) - Unique identifier of the pet

**Responses:**
- `200` - Successfully retrieved pet information
- `404` - Pet not found

#### PUT /pets/{petId}

Update pet information

Update the information for an existing pet. All fields will be replaced with the provided data.

**Parameters:**
- `petId` (path) - Unique identifier of the pet to update

**Responses:**
- `200` - Pet updated successfully
- `404` - Pet not found

#### DELETE /pets/{petId}

Delete a pet

Remove a pet from the store permanently. This action cannot be undone.

**Parameters:**
- `petId` (path) - Unique identifier of the pet to delete

**Responses:**
- `204` - Pet deleted successfully
- `404` - Pet not found

#### GET /pets/{petId}/health

Get pet health information

Retrieve health and vaccination information for a specific pet

**Parameters:**
- `petId` (path) - ID of the pet

**Responses:**
- `200` - Successfully retrieved pet health information
- `404` - Pet not found

### Health

#### GET /pets/{petId}

Get pet by ID

Retrieve detailed information about a specific pet by its unique identifier.

**Parameters:**
- `petId` (path) - Unique identifier of the pet

**Responses:**
- `200` - Successfully retrieved pet information
- `404` - Pet not found

#### GET /pets/{petId}/health

Get pet health information

Retrieve health and vaccination information for a specific pet

**Parameters:**
- `petId` (path) - ID of the pet

**Responses:**
- `200` - Successfully retrieved pet health information
- `404` - Pet not found

### Orders

#### GET /orders

List all orders

Retrieve a list of all orders in the system. Orders are sorted by creation date (newest first).

**Parameters:**
- `limit` (query) - Maximum number of orders to return

**Responses:**
- `200` - Successfully retrieved list of orders

#### POST /orders

Create a new order

Create a new order for a pet. The order will be placed with the provided details.

**Responses:**
- `201` - Order created successfully
- `400` - Bad request - Invalid order data

#### GET /orders/{orderId}

Get order by ID

Retrieve detailed information about a specific order by its unique identifier.

**Parameters:**
- `orderId` (path) - Unique identifier of the order

**Responses:**
- `200` - Successfully retrieved order information
- `404` - Order not found

## Data Models

### Pet

**Properties:**
- `id` (integer) - Unique identifier for the pet (auto-generated)
- `name` (string) (required) - Name of the pet
- `category` (undefined) - Category the pet belongs to
- `photoUrls` (array) (required) - List of photo URLs for the pet
- `tags` (array) - Tags associated with the pet for categorization
- `status` (string) - Current status of the pet in the store

### Category

**Properties:**
- `id` (integer) - Unique identifier for the category
- `name` (string) - Name of the category

### Tag

**Properties:**
- `id` (integer) - Unique identifier for the tag
- `name` (string) - Name of the tag

### Order

**Properties:**
- `id` (integer) - Unique identifier for the order (auto-generated)
- `petId` (integer) (required) - ID of the pet being ordered
- `quantity` (integer) (required) - Quantity of the pet being ordered
- `shipDate` (string) - Date when the order was shipped
- `status` (string) - Current status of the order
- `complete` (boolean) - Whether the order is complete

### Error

**Properties:**
- `code` (integer) (required) - HTTP status code
- `message` (string) (required) - Human-readable error message

### PetHealth

Health and vaccination information for a pet

**Properties:**
- `petId` (integer) (required) - ID of the pet
- `weight` (number) - Current weight in kilograms
- `vaccinations` (array) - List of vaccinations
- `lastCheckup` (string) - Date of last veterinary checkup
- `healthStatus` (string) (required) - Overall health status

### Vaccination

Vaccination record

**Properties:**
- `name` (string) (required) - Name of the vaccination
- `date` (string) (required) - Date when vaccination was given
- `nextDue` (string) - Date when next vaccination is due

