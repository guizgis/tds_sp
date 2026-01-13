## 1. Backend: Standard Compliance (Spring Boot)
- [x] 1.1 **Model Refactoring**:
    - [x] 1.1.1 Update `CatalogEntity` to support `type` (RESOURCE/PRODUCT).
    - [x] 1.1.2 Add standard fields: `dataSource` (Table 2), `deliveryMode` (Table 3), `securityLevel` (Table 6), etc.
- [x] 1.2 **ID Generator**: Implement `CatalogIdentifierUtil` to generate IDs format: `Area(6)+Org / Type(1)+Serial(6)+Check(2)`.
- [x] 1.3 **API Update**: Modify `catalog-api.yaml` to include new enums and fields.
- [x] 1.4 **Controller Logic**: Update `CatalogController` to handle the new registration logic and ID generation.

## 2. Frontend: Management UI (React)
- [x] 2.1 **Catalog Management Page**:
    - [x] 2.1.1 Split list into "Data Resource" and "Data Product" tabs.
    - [x] 2.1.2 Update columns to display standard labels (e.g., "001" -> "Real-time").
- [x] 2.2 **Registration Forms**:
    - [x] 2.2.1 Create "Register Resource" form (Focus on Source, Update Frequency).
    - [x] 2.2.2 Create "Register Product" form (Focus on Delivery Mode, Service Type).
    - [x] 2.2.3 Use standard code tables for all dropdowns.