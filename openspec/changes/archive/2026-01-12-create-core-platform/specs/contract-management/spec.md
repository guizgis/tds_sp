## ADDED Requirements

### Requirement: Digital Contract Identifier
The system SHALL generate and maintain a unique `contractId` for each digital contract, strictly following the 47-character format specified in the TC609 standard (including type code, node info, time code, etc.).

#### Scenario: Verify contract ID format
- **WHEN** a contract is created
- **THEN** the system generates a `contractId` of length 47
- **AND** the ID contains valid business node and time encoding.

### Requirement: Comprehensive Contract Information
Digital contracts MUST contain basic information including `contractName`, `contractStatus` (Initiated, Negotiating, Signed, Executing, Terminated), `signMode` (P2P or Platform-assisted), and `indate` (Validity period in ISO-8601).

#### Scenario: Create contract with standard metadata
- **WHEN** a provider initiates a contract
- **THEN** the system validates that name, status, sign mode, and validity period are correctly defined.

### Requirement: Multi-Party Signatory Management
The system SHALL support multiple signatory entities (`signatoryEntities`), identifying each party as Data Provider, Data Consumer, or Data Service Provider, including their unique IDs and digital signatures.

#### Scenario: Add multiple parties to a contract
- **WHEN** a contract involves a provider, a consumer, and a platform service provider
- **THEN** each entity is assigned its respective role and unique identification in the contract structure.

### Requirement: Structured Usage Control Policies
Contracts MUST define usage control policies consisting of Permissions, Prohibitions, and Obligations, targeting specific Data Products and designated Execution Nodes (Connectors).

#### Scenario: Define permission with pre-obligation
- **WHEN** a provider allows "Read" access to a data product
- **AND** requires "Anonymization" before usage
- **THEN** the system stores this as an Allowed Policy with a Pre-obligation.

### Requirement: Standardized Action and Constraint Set
The system SHALL support standardized actions (Access, Read, Copy, Storage, Download, Process, etc.) and constraints (Time window, Region, Usage count, Algorithm, Execution environment like TEE/Sandbox) using standard operators (eq, lt, isA, etc.).

#### Scenario: Enforce usage count constraint
- **WHEN** a contract specifies a "Read" action with a "Usage Count" constraint of 1000
- **THEN** the policy execution point tracks and enforces this limit.

### Requirement: Contract Negotiation Lifecycle
The system SHALL facilitate the full negotiation lifecycle, including协商请求 (Negotiation Request), 合约查验 (Contract Inspection), 合约修订 (Revision), and 合约签署 (Signing) using digital certificates.

#### Scenario: Complete contract negotiation
- **WHEN** two parties exchange multiple versions of a contract
- **THEN** the system tracks all revision history
- **AND** finalizes the status to "Signed" only after both parties provide valid digital signatures.

### Requirement: Secure Registration and Archival
Signed contracts MUST be registered at the platform, encrypted for confidentiality, and protected against tampering to ensure non-repudiation.

#### Scenario: Archive signed contract
- **WHEN** a contract is signed
- **THEN** it is uploaded to the platform for backup
- **AND** encrypted using keys negotiated between the parties.

### Requirement: Standardized Management Interfaces
The service SHALL expose RESTful interfaces for Template Management (`/contractTemplate`), Creation (`/contractCreate`), Negotiation (`/contractNegotiate`), Registration (`/contractRegistrate`), Execution Reporting (`/contractExecution`), and Termination (`/contractTerminate`).

#### Scenario: Report contract execution status
- **WHEN** a connector performs a data transaction under a contract
- **THEN** it calls the `/contractExecution` interface to upload execution logs and status.

### Requirement: Compliance Monitoring and Alerting
The system SHALL monitor the fulfillment status of contracts in real-time and trigger alerts if any usage deviates from the agreed-upon policies.

#### Scenario: Trigger breach alert
- **WHEN** a data consumer attempts to download data exceeding the agreed "Usage Count"
- **THEN** the execution point blocks the action
- **AND** reports a violation event to the platform.