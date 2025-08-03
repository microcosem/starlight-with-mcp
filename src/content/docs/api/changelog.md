# API Documentation Changes

## Version 1.1.0

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

Generated on: 2025-08-03T02:08:11.746Z
