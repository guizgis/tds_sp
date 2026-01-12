## Context
鉴于标准要求的模块独立性，系统将采用 **微服务架构 (Microservices Architecture)**。每个核心功能模块（身份、连接器、目录、合约、空间管理、使用控制）将作为独立的服务进行开发和部署。

## Goals
1.  **解耦**: 模块间通过标准 API 交互，严禁数据库层面的直接耦合。
2.  **互联互通**: 
    - **北向**: 统一对接 NDI 区域/行业功能节点。
    - **南向**: 统一对接接入连接器。
3.  **标准兼容**: 所有模块的数据结构定义（Schema）必须严格遵循 NDI-TR-2025 系列标准文档。
4.  **平台定位**: 平台本身即为 **可信数据空间运营管理平台**，专供空间运营方使用，负责对接入主体通过连接器提交的各类业务进行审核与治理。

## Architecture Decisions

### User Roles & Platform Access
- **Platform User (Space Operator)**:
    - The ONLY user type that logs into the Platform Web UI.
    - **Responsibilities**: Audit identity registrations, review catalog listings, approve space creation requests, monitor contract execution.
    - **Access**: Full access to Identity, Catalog, Space, Contract management modules.
- **Participants (Provider/Consumer)**:
    - **DO NOT** log into the Platform Web UI.
    - Interact EXCLUSIVELY via **Access Connectors** (API-based interaction).
    - Their "interface" is their own local Connector system, not this platform.

### Functional Modules (Operator View)
The Platform UI is restructured to directly expose the core governance modules, removing the separate "Admin Console" concept:
1.  **Identity Management**: View and audit pending identity registrations submitted by connectors. Manage lifecycle of registered identities.
2.  **Connector Management**: Audit and manage the lifecycle of Access Connectors.
3.  **Catalog Management**: Review data product submissions ("Pending" -> "Active"). Manage the global/space-level catalog.
4.  **Space Management**: Review requests to create new logical spaces. Configure space policies.
5.  **Contract Management**: Monitor contract signing and execution status (Audit logs).

### Identity Lifecycle (Revised)
1.  **Submission**: Participants submit registration data via Connector API -> Platform Gateway.
2.  **Audit**: Space Operator views pending request in "Identity Management" module and approves/rejects.
3.  **Issuance**: Platform issues DID/Credential to the Connector.

## Tech Stack
- **Backend**: Java (JDK 17+), Spring Boot.
- **API Style**: RESTful API.
- **Service Registry**: Netflix Eureka.
- **Frontend**: React, Ant Design (Single Unified Layout for Operators).
- **Database**: PostgreSQL (Independent schema per service).

## Mock Strategy
- **Connectors**: Since real connectors are external, we will simulate connector API calls via CLI or Swagger to populate the "Pending" queues for the Operator to audit.