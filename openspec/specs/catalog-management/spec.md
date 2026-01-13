# catalog-management Specification

## Purpose
TBD - created by archiving change create-core-platform. Update Purpose after archive.
## Requirements
### Requirement: Catalog Item Structure
The system SHALL support the Catalog Item data model with Core Metadata as defined in NDI-TR-2025-06, including fields for ID, name, description, categories (topic, industry, organization, application), source type, delivery mode, update frequency, quality level, security level, and service type.

#### Scenario: Metadata Validation
- **WHEN** a catalog item is created with all required core metadata
- **THEN** the system validates and accepts the record

### Requirement: Standard Code Tables
The system SHALL validate catalog attributes against the Standard Code Tables defined in NDI-TR-2025-06. The system MUST support a mapping mechanism between standard numeric codes (e.g., '001') and human-readable display names (e.g., 'Real-time', 'Original Data') for both form submission and data display.

#### Scenario: Code-to-Label Mapping
- **WHEN** a catalog item is stored with qualityLevel '001'
- **THEN** the UI displays '一级 (高)' to the user
- **WHEN** a user selects 'API接口' in the registration form
- **THEN** the system submits the standard code '002' to the backend

### Requirement: Identifier Generation
The system SHALL generate unique Data Catalog Identifiers in the format `FrontCode/BackCode` (`AreaCode` + `OrgCode` / `TypeID` + `SerialNo` + `CheckCode`) as specified in Standard Section 8.1.

#### Scenario: Generate ID
- **WHEN** a new catalog item is successfully registered
- **THEN** the system assigns a unique Global ID adhering to the standard format (e.g., `110101ORG001/D000001X9`)

### Requirement: Catalog Submission via Connector
The system SHALL provide an API for **接入连接器 (Access Connector)** to submit Data Product registration requests. The platform acts as the receiving and management hub for these submissions.

#### Scenario: Register Catalog via Connector
- **WHEN** a Data Provider uses their Connector to submit product metadata
- **THEN** the platform validates the metadata against standard code tables
- **AND** creates a record with status `PENDING_APPROVAL`

### Requirement: Platform Catalog Audit
The platform SHALL provide a management interface for **空间运营方 (Space Operator)** or Admins to review and audit pending catalog items.

#### Scenario: Approve Catalog on Platform
- **WHEN** an Operator reviews and approves a pending catalog item on the platform
- **THEN** the item status changes to `ACTIVE`
- **AND** the item becomes discoverable in the space/global directory

### Requirement: Catalog Maintenance
The system SHALL support updating, auditing, and versioning of catalog items. Updates to critical metadata MAY trigger a re-audit process.

#### Scenario: Update Catalog
- **WHEN** a provider updates the description of an existing catalog item
- **THEN** a new version is created, the content is updated, and the update time is refreshed

### Requirement: Catalog Sharing and Search
The system SHALL allow publishing catalogs to the service layer and provide a search interface supporting filters by category, industry, and application scenario.

#### Scenario: Search by Category
- **WHEN** a user searches for items with industryCategory 'B0500' (Finance)
- **THEN** the system returns a list of matching published catalog items

### Requirement: Catalog Cancellation
The system SHALL support the cancellation (logical deletion) of catalog items when they are no longer available or valid.

#### Scenario: Cancel Catalog
- **WHEN** a provider requests cancellation of a catalog item
- **THEN** the item status is changed to 'Cancelled'
- **AND** the item is removed from public search results

### Requirement: Security and Audit
The system SHALL enforce Access Control (RBAC/ABAC) on catalog operations and MUST log all creation, update, query, and deletion events for audit purposes.

#### Scenario: Audit Log
- **WHEN** a catalog item is updated by a user
- **THEN** an audit log entry is created containing the user ID, timestamp, operation type, and change details

### Requirement: Catalog Type Distinction
The system SHALL strictly distinguish between **Data Resources** and **Data Products** in storage, API, and UI.
- **Data Resource (数据资源)**: Assets primarily defined by their source (Original, Collected, etc.) and raw nature.
- **Data Product (数据产品)**: Assets primarily defined by their delivery form (API, Dataset, Report) and service nature.

#### Scenario: Register Data Resource
- **WHEN** a user registers a Data Resource
- **THEN** the system MUST require "Data Source" (Table 2) information
- **AND** assign a Type Identifier of 'D' (Structured) or 'F' (File) in its ID.

#### Scenario: Register Data Product
- **WHEN** a user registers a Data Product
- **THEN** the system MUST require "Delivery Mode" (Table 3) information
- **AND** assign a Type Identifier of 'A' (API) or 'S' (Service) or 'P' (Product) in its ID.

### Requirement: Standard Metadata Coding
The system SHALL enforce the use of NDI-TR-2025-06 Standard Code Tables for metadata fields.
- **Topic Category (Table 1)**: 001 (Topic), 002 (Industry), 003 (Org), 004 (App).
- **Data Source (Table 2)**: 001 (Original), 002 (Collected), 003 (Transaction), 004 (Other).
- **Delivery Mode (Table 3)**: 001 (Dataset), 002 (API), 003 (App), 004 (Report), 005 (Object), 006 (Other).
- **Update Frequency (Table 4)**: 001 (Real-time) ... 009 (Historical).
- **Quality Level (Table 5)**: 001 (A) ... 004 (D).
- **Security Level (Table 6)**: 001 (L1) ... 005 (L5).
- **Service Type (Table 7)**: 001 (Catalog) ... 005 (Analytics).

#### Scenario: Metadata Validation
- **WHEN** a catalog item is submitted with `securityLevel='High'`
- **THEN** the system rejects it, requiring the standard code `003` (Level 3) or `004` (Level 4).

### Requirement: Standard Identifier Generation
The system SHALL generate Catalog Identifiers following the `FrontCode/BackCode` format defined in Section 8.1.
- Format: `[AreaCode(6)][OrgCode] / [Type(1)][Serial(6)][Check(2)]`
- Example: `110101ORG001/D000001X9`

#### Scenario: Generate Compliance ID
- **WHEN** a new resource is approved
- **THEN** the system generates an ID using the Provider's Region and Org Code, combined with the Resource Type and a sequence number.

