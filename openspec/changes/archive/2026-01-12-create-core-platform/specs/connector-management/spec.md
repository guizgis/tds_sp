## ADDED Requirements

### Requirement: Connector Identity Structure
The system SHALL define and persist a standardized Connector Identity data structure compliant with NDI-TR-2025-03, capturing all mandatory fields including ID, Name, MAC address, and Connection Type.

#### Scenario: Store connector identity profile
- **WHEN** a connector registers
- **THEN** the system validates that all mandatory fields (ID, Name, MAC, JoinType, etc.) are present
- **AND** stores the profile with support for optional fields and attachments.

### Requirement: Connector Detailed View
The system SHALL provide a comprehensive view of all registered connector information, including basic metadata, supplemental hardware info, and verifiable certificates.

#### Scenario: View connector details
- **WHEN** an operator selects a connector from the list
- **THEN** the system retrieves and displays the full identity profile and audit history.

### Requirement: Confirmed Connector Deregistration
The system SHALL implement a secure deregistration flow requiring user confirmation. Upon confirmation, the system MUST revoke credentials and update the status both locally and at the functional node.

#### Scenario: Secure deregistration
- **WHEN** a user initiates deregistration
- **THEN** the system prompts for confirmation and a reason
- **AND** updates the status to "Deregistered" only after confirmation.

### Requirement: Connector Operational Monitoring
The system SHALL provide real-time visibility into the operational status of connectors, including heartbeat status, network connectivity, and technical capability availability.

#### Scenario: Monitor connector health
- **WHEN** a connector is active
- **THEN** the dashboard displays its last heartbeat, CPU/Memory load (mocked), and capability status.


### Requirement: Connector Registration Lifecycle
The system SHALL implement the connector registration lifecycle as defined in **NDI-TR-2025-03 Section 7.2.1**, including Application, Audit, ID Allocation, and Credential Issuance.

#### Scenario: Process connector registration
- **WHEN** a user submits a connector registration application with required materials
- **THEN** the system (Regional/Industry Node) audits the information
- **AND** generates a unique `connectorId`
- **AND** requests a trusted credential from the CA upon successful configuration.

### Requirement: Connector Authentication (Node-to-Connector)
The system SHALL support bidirectional authentication between the Connector and the Regional/Industry Node as specified in **Section 7.2.3.1**.

#### Scenario: Bidirectional authentication
- **WHEN** a connector initiates a connection to the platform
- **THEN** the platform verifies the connector's credential and signature
- **AND** the platform sends its own credential and signature to the connector for mutual verification.

### Requirement: Trusted Root Certificate Management
The system SHALL provide an interface for connectors to query the list of Trusted Identity Provider Root Certificates (**Section 8.3.2.8** `GetIdentityProviderList`), enabling connectors to verify credentials from other entities.

#### Scenario: Connector fetches root certs
- **WHEN** a connector requests the trusted root list
- **THEN** the system returns the list of active root certificates from the global registry.

### Requirement: Connector Info Synchronization
The system SHALL support reporting connector identity information to the Global Node via the `SyncConnectorInfo` interface (**Section 8.3.3.1**) after successful registration.

#### Scenario: Sync to global node
- **WHEN** a connector is successfully registered and activated
- **THEN** the system automatically invokes the Global Node's sync interface to upload the connector's basic and supplemental info.

### Requirement: Connector Deregistration
The system SHALL support the connector deregistration flow (**Section 7.2.2**), including credential revocation and status synchronization with the Global Node.

#### Scenario: Deregister connector
- **WHEN** a user requests connector deregistration
- **THEN** the system validates the request
- **AND** revokes the associated credential
- **AND** marks the ID as "Deregistered" locally and globally.