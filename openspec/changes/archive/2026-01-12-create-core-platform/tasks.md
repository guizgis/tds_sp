## 0. Project Initialization (Java/Spring/React)
- [x] 0.1 Initialize Git repository and directory structure
- [x] 0.2 Setup Spring Cloud Eureka Server
- [x] 0.3 Setup React + Ant Design frontend project skeleton
- [x] 0.4 Configure API Gateway (Spring Cloud Gateway)

## 1. Identity Management Implementation (Spring Boot)
- [x] 1.1 **Standard Mapping**: Define Java POJOs/DTOs strictly matching NDI-TR-2025-03 tables (Identity, Auth, etc.)
- [x] 1.2 **API Definition**: Add `RegisterPerson`, `RegisterEnterprise`, `RegisterOperator` endpoints to `identity-api.yaml` (Receives submissions from Connectors)
- [x] 1.3 **Implement Mock Credential Service**
- [x] 1.4 Implement Identity Registration REST Controller (Handles Connector-initiated registration)
- [x] 1.5 Implement Authentication Service
    - [x] 1.5.1 Local Login (Verify Mock Cert/Signature)
    - [x] 1.5.2 Mock Cross-domain Authentication Handler
    - [x] 1.5.3 **Enforce Login Restriction**: Block login for `PENDING_AUDIT` or `REJECTED` users
- [x] 1.6 Implement Identity Update & Synchronization Logic
- [x] 1.7 Implement Identity Deregistration Workflow
- [x] 1.8 **Identity Audit API**: Implement Platform Admin API to list pending registrations and approve/reject them

## 2. Connector Management Implementation (Spring Boot)
- [x] 2.1 **Standard Mapping**: Define Connector POJOs/DTOs strictly matching NDI-TR-2025-03 Tables 10-12 (Basic, Supplemental, Attachments)
- [x] 2.2 Implement **Connector Registration API** (Section 7.2.1):
    - [x] 2.2.1 `POST /connectors`: Submit registration application with full metadata
    - [x] 2.2.2 Implement Audit & ID Generation logic
    - [x] 2.2.3 Implement Mock Credential Issuance for connectors
- [x] 2.3 Implement **Authentication Interfaces** (Section 7.2.3):
    - [x] 2.3.1 `POST /connectors/auth`: Bidirectional authentication (Node <-> Connector)
    - [x] 2.3.2 `GET /GetIdentityProviderList`: Trusted root certificate query (Section 8.3.2.8)
- [x] 2.4 Implement **Global Node Synchronization** (Section 8.3.3.1):
    - [x] 2.4.1 `POST /SyncConnectorInfo`: Report connector status to Global Node (Mock implementation)
- [x] 2.5 Implement **Connector Deregistration** (Section 7.2.2):
    - [x] 2.5.1 `POST /connectors/deregister`: Handle revocation and status update
- [x] 2.6 Frontend: Implement Connector Management Page (List/Register)
- [x] 2.7 Implement **Connector Detail & Monitoring API**:
    - [x] 2.7.1 `GET /admin/connectors`: Retrieve full metadata list for governance
    - [x] 2.7.2 Implement status mapping in ConnectorController
- [x] 2.8 Frontend: Refine Connector Management Page:
    - [x] 2.8.1 Add Detail View (Modal/Descriptions)
    - [x] 2.8.2 Add Deregistration confirmation dialog
    - [x] 2.8.3 Add Monitoring dashboard for active connectors

## 3. Catalog Management Implementation (Spring Boot)
- [x] 3.1 **Standard Mapping**: Define Catalog POJOs/DTOs strictly matching NDI-TR-2025-06 Core Metadata (Section 7)
- [x] 3.2 Implement **Standard Identifier Utility**:
- [x] 3.3 Implement **Validation Logic** for Standard Code Tables (Tables 1-7)
- [x] 3.4 Implement Catalog Registration & Persistence:
    - [x] 3.4.1 Create database schema
    - [x] 3.4.2 Implement `POST /catalogs` (API for Connector-initiated product publishing)
    - [x] 3.4.3 **Modify Registration Logic**: Set initial status to `PENDING_APPROVAL`
- [x] 3.5 Implement Catalog Maintenance & Versioning
- [x] 3.6 Implement Catalog Search & Filtering:
    - [x] 3.6.1 Implement multi-dimensional filtering
    - [x] 3.6.2 Implement Keyword search
- [x] 3.7 **Catalog Audit API**: Implement Platform Management API to approve/reject catalog items
- [x] 3.8 Implement Audit Logging for all catalog operations
- [x] 3.9 Frontend: Implement Catalog Management UI (For Space Operators)
- [x] 3.10 Frontend: Implement Submission Review Page

## 5. Space Management Implementation (Spring Boot)
- [x] 5.1 **Standard Mapping**: Define Space POJOs
- [x] 5.1.1 **Extended Mapping**: Add `UsageControlPolicies` and `AssociatedResources` to Space model
- [x] 5.2 Implement **Logical Space CRUD API**:
    - [x] 5.2.1 `POST /spaces` (Receives creation requests from prospective Space Operators via Connectors)
    - [x] 5.2.1.1 **Modify Creation Logic**: Set initial status to `PENDING_APPROVAL`
    - [x] 5.2.2 `GET /spaces`: List/Query spaces
    - [x] 5.2.3 `GET /spaces/{id}`: Get space details
    - [x] 5.2.4 `PUT /spaces/{id}`: Update space info
    - [x] 5.2.5 `DELETE /spaces/{id}`: Delete space
- [x] 5.2.6 **Space Audit API**: Implement Admin API to approve/reject space creation requests
- [x] 5.3 Implement **Member Management API**
- [x] 5.3.4 **Access Control Enforcement**: Implement logic to restrict catalog visibility based on space membership
- [x] 5.4 Implement **Monitoring & Reporting**:
    - [x] 5.4.1 Heartbeat mechanism
    - [x] 5.4.2 Implement **NDI-TR-2025-02 Reporting**: Package operational & business data for higher-level nodes
- [x] 5.5 Frontend: Implement Space Management dashboard (For Space Operators)
- [x] 5.5.3 Frontend: Add Monitoring & Simulation UI

## 6. Usage Control Implementation (Spring Boot)
- [x] 6.1 Implement Policy Execution Monitoring interface
- [x] 6.2 Implement Evidence Collection (Proof of Usage)
- [x] 6.3 Implement Violation Alerting system

## 7. Frontend Architecture Refactoring (React)
- [x] 7.1 **Remove Role Separation**:
    - [x] 7.1.1 Remove `AdminLayout` and `UserLayout`.
    - [x] 7.1.2 Create single `OperatorLayout` for Space Operators.
    - [x] 7.1.3 Remove `PublicLayout` and Registration pages (Connectors handle this).
- [x] 7.2 **Integrate Audit into Core Modules**:
    - [x] 7.2.1 Move "Identity Audit" logic into `IdentityManagement.tsx`.
    - [x] 7.2.2 Move "Resource Audit" logic into `CatalogManagement.tsx`.
    - [x] 7.2.3 Move "Space Audit" logic into `SpaceManagement.tsx`.
- [x] 7.3 **Login Page Update**: Simplify to "Space Operator Login" only.

## 8. Integration & Verification
- [x] 8.1 Verify Interface Compliance against NDI-TR-2025-03
- [x] 8.2 End-to-end test: Connector Submit Identity -> Operator Audit -> Connector Submit Catalog -> Operator Audit -> Connector Create Space -> Operator Audit
