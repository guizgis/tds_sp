# space-management Specification

## Purpose
TBD - created by archiving change create-core-platform. Update Purpose after archive.
## Requirements
### Requirement: Logical Space Lifecycle (Create/Delete)
The system SHALL support the management of logical spaces oriented towards specific data circulation scenarios.

#### Scenario: Request Space Creation via Connector
- **WHEN** a prospective Space Operator submits a space creation request (Participants, Resources, Policies) through their Connector.
- **THEN** the platform receives the request and sets it to `PENDING_APPROVAL`.

#### Scenario: Platform Audit & Activation
- **WHEN** a Platform Administrator reviews and approves the space request.
- **THEN** the system allocates a unique Space ID.
- **AND** automatically reports the space information to the Regional Node as per **NDI-TR-2025-02**.

#### Scenario: Delete Space
- **WHEN** a space operator decides to dissolve a space.
- **THEN** the system revokes all member access and marks the space as deleted.
- **AND** notifies the functional node to update the registry.

### Requirement: Configuration & Usage Policies
The system SHALL allow operators to modify basic configurations and define the boundaries of usage control within a space.

#### Scenario: Update Usage Policies
- **WHEN** an operator adds "Time-limited Access" as a supported policy for a space.
- **THEN** only data products with compatible policies can be associated with this space.
- **AND** the updated configuration is synchronized with the functional node.

### Requirement: Member & Resource Management
The system SHALL provide mechanisms to control which parties and resources belong to the logical space.

#### Scenario: Member Access Flow
- **WHEN** a Data Provider or Consumer applies to join a space.
- **THEN** the Space Operator reviews the application.
- **AND** upon approval, the system grants the member permissions to **discover and access** resources restricted to that specific space.

### Requirement: Resource Scoping
The system SHALL support setting Data Products and Services to be **visible and available ONLY** to members of a specific logical space.

#### Scenario: Restrict Resource Visibility
- **WHEN** a Data Provider publishes a resource to "Space A"
- **THEN** members of "Space A" can search and view it
- **BUT** users who are not members of "Space A" cannot find it in the global directory.

### Requirement: Operational Monitoring & Interconnection
The system SHALL monitor space activity and report **Operational Information** (health, uptime) and **Business Information** (transaction volume, member count) to regional/industry nodes following **NDI-TR-2025-02** protocols.

#### Scenario: Report Operational Status
- **WHEN** the daily reporting schedule triggers
- **THEN** the system aggregates transaction volume and active member counts
- **AND** sends a signed status report to the Regional Functional Node.

