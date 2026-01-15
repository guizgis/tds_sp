# Trusted Data Space Service Platform (TDS-SP)

A comprehensive reference implementation of the Trusted Data Space infrastructure, compliant with NDI standards (TC609-6-2025-14, TC609-6-2025-15).

## Features

- **Identity Management**: Decentralized identity registration and authentication.
- **Catalog Governance**: Multi-stage product audit, registration (NDI coding), and publication.
- **Digital Contract**: Full lifecycle management including policy template definition, negotiation, signing, and filing.
- **Usage Control**: Policy enforcement based on ODRL/standard dictionaries.
- **Workspace**: Unified "Operator Layout" for efficient governance.

## Architecture

- **Backend**: Java Spring Boot Microservices (Identity, Catalog, Contract, Connector, Space, Gateway, Eureka).
- **Frontend**: React + TypeScript + Ant Design Pro.
- **Database**: PostgreSQL.

## Quick Start

### Backend
```bash
# Start Eureka Server
cd backend/eureka-server && mvn spring-boot:run

# Start Gateway
cd backend/gateway-service && mvn spring-boot:run

# Start Core Services (e.g., Contract)
./start_contract.sh
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Documentation
See `MAINTENANCE.md` for operational details and `openspec/` for design specifications.
