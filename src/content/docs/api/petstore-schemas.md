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

