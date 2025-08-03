---
title: Pet Store API
description: Complete API reference for the Pet Store API with endpoints, schemas, and examples
---

# Pet Store API

A sample Pet Store API for demonstration purposes

**Version:** 1.0.0
**Contact:** API Support (support@petstore.com)

## Servers

- **Production server:** `https://api.petstore.com/v1`
- **Staging server:** `https://staging-api.petstore.com/v1`

## API Endpoints

### Pets

#### GET /pets

List all pets

Returns a list of all pets in the store

**Parameters:**
- `limit` (query) - Maximum number of pets to return
- `status` (query) - Filter pets by status

**Responses:**
- `200` - A list of pets
- `400` - Bad request

#### POST /pets

Create a pet

Add a new pet to the store

**Responses:**
- `201` - Pet created successfully
- `400` - Invalid input

#### GET /pets/{petId}

Get pet by ID

Returns a single pet by its ID

**Parameters:**
- `petId` (path) - ID of the pet to retrieve

**Responses:**
- `200` - Pet found
- `404` - Pet not found

#### PUT /pets/{petId}

Update pet

Update an existing pet

**Parameters:**
- `petId` (path) - ID of the pet to update

**Responses:**
- `200` - Pet updated successfully
- `404` - Pet not found

#### DELETE /pets/{petId}

Delete pet

Delete a pet from the store

**Parameters:**
- `petId` (path) - ID of the pet to delete

**Responses:**
- `204` - Pet deleted successfully
- `404` - Pet not found

### Orders

#### GET /orders

List all orders

Returns a list of all orders

**Parameters:**
- `limit` (query) - Maximum number of orders to return

**Responses:**
- `200` - A list of orders

#### POST /orders

Create an order

Place a new order

**Responses:**
- `201` - Order created successfully

#### GET /orders/{orderId}

Get order by ID

Returns a single order by its ID

**Parameters:**
- `orderId` (path) - ID of the order to retrieve

**Responses:**
- `200` - Order found
- `404` - Order not found

## Data Models

### Pet

**Properties:**
- `id` (integer) - Unique identifier for the pet
- `name` (string) (required) - Name of the pet
- `category` (undefined) - No description
- `photoUrls` (array) - List of photo URLs for the pet
- `tags` (array) - Tags associated with the pet
- `status` (string) (required) - Pet status in the store

### Category

**Properties:**
- `id` (integer) - No description
- `name` (string) - No description

### Tag

**Properties:**
- `id` (integer) - No description
- `name` (string) - No description

### Order

**Properties:**
- `id` (integer) - No description
- `petId` (integer) - No description
- `quantity` (integer) - No description
- `shipDate` (string) - No description
- `status` (string) - No description
- `complete` (boolean) - No description

### Error

**Properties:**
- `code` (integer) - No description
- `message` (string) - No description

