# identity-management Specification

## Purpose
TBD - created by archiving change create-core-platform. Update Purpose after archive.
## Requirements
### Requirement: Identity Registration via Connector
The system SHALL support identity registration requests initiated through **接入连接器 (Access Connector)**. The platform acts as the proxy registration authority for the Regional/Industry Node.

#### Scenario: Register new User via Connector
- **WHEN** a prospective participant submits their identity materials (Personal/Enterprise/Operator) through their Connector
- **THEN** the platform receives the request and creates a `PENDING_AUDIT` identity record.

### Requirement: Identity Audit & Credential Issuance
The platform SHALL provide an interface for **平台运营方 (Space Operator/Admin)** to audit registration requests.
1.  **Approval**: Upon approval, the system SHALL mint a unique digital identity (Mock DID/Cert) and issue the credential to the Connector.
2.  **Access Control**: Only users with an `ACTIVE` identity status SHALL be permitted to access the data space resources.

#### Scenario: Audit Identity Registration
- **WHEN** an operator reviews a pending registration
- **THEN** the system allows approving or rejecting the request
- **AND** upon approval, generates and issues a credential to the connector.

### Requirement: Identity Authentication

The system SHALL provide identity authentication services compliant with NDI-TR-2025-03.
1.  **Local Authentication**: Authenticate users within the Trusted Data Space.
2.  **Cross-Node Authentication**: Interact with Regional/Industry Functional Nodes to authenticate users registered in other NDI nodes (Cross-domain Identity Authentication).

#### Scenario: Authenticate External User (Cross-domain)
- **WHEN** a user registered in another NDI node attempts to access this platform
- **THEN** the platform redirects the authentication request to the user's home Regional/Industry Functional Node
- **AND** validates the returned User Authorization Token
- **AND** retrieves the user's identity information from the home node to create a local session

### Requirement: Identity Update
The system SHALL allow users to update their identity information.
1.  **Synchronization**: If the update involves NDI-defined identity fields (e.g., certification status, basic attributes), the system SHALL synchronize the update request to the Regional/Industry Functional Node following NDI-TR-2025-03 processes.

#### Scenario: Update User Profile
- **WHEN** a user updates their phone number or authentication materials
- **THEN** the platform updates the local record
- **AND** sends a synchronization request to the Regional/Industry Functional Node
- **AND** confirms the update status from the upstream node

### Requirement: Identity Deregistration
The system SHALL support identity deregistration.
1.  **Space Deregistration**: Users can deregister their identity within the Trusted Data Space service platform.
2.  **NDI Continuity**: Deregistration from this platform SHALL NOT affect the user's existence in the broader Data Infrastructure (NDI) unless explicitly requested to deregister from the root.

#### Scenario: User Deregisters from Space
- **WHEN** a user requests to deregister their account from the platform
- **THEN** the system checks for any active contracts or pending transactions
- **AND** marks the local user status as "Deregistered" if no dependencies exist
- **AND** reports the deregistration event to the Regional/Industry Functional Node for auditing

