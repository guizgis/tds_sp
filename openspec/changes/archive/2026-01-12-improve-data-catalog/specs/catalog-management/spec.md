## ADDED Requirements

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
