## ADDED Requirements

### Requirement: Unified Data Product Lifecycle
The system SHALL manage Data Products through a governed lifecycle: `Submitted` -> `Audited` -> `Registered` (ID Assigned) -> `Published` -> `Applying` -> `Authorized`.

#### Scenario: Register with External Node
- **WHEN** an operator clicks "Register to Node" for an audited product
- **THEN** the system simulates a handshake with the Regional/Industry Node
- **AND** updates the status to `ACTIVE`
- **AND** assigns the unique NDI-compliant Product ID.

### Requirement: Categorized Metadata Presentation
The Product Details view SHALL group metadata into distinct categories to facilitate discovery and compliance assessment.
-   **Category A: 基础信息** (Name, ID, Provider, Description)
-   **Category B: 分类分级** (Data Topic, Quality Grade, Security Level)
-   **Category C: 适用场景** (Applicable Industry, Application Scenario)
-   **Category D: 使用策略** (Usage Policy, Delivery Mode, Update Frequency)

### Requirement: Discoverability Toggle
The Product Catalog SHALL support discovering products from both the **Local Space** and the broader **Trusted Data Space Network** (simulated).

#### Scenario: Cross-Space Discovery
- **WHEN** a user searches for products with "Network Discovery" enabled
- **THEN** the system returns products registered in other nodes but marked as "Publicly Discoverable".
