# Tasks: Enhance Contract Management

## 1. Standard Compliance & API Definition
- [x] 1.1 **YAML Definition**: Create `contract-standard.yaml` based on TC609-6-2025-14 (Interfaces B.2-B.7, Dictionaries C.1-C.6).
- [ ] 1.2 **Code Generation**: Configure Maven to generate Java interfaces (`api`) and DTOs (`model`) from the YAML.

## 2. Backend: Policy Template Service
- [x] 2.1 **Entity Design**: Create `PolicyTemplate` entity in `contract-service`.
- [ ] 2.2 **Controller Implementation**: Implement `PolicyTemplateController` based on the generated `TemplateApi` interface.
- [ ] 2.3 **Mock Data**: Inject standard-compliant templates (Permission/Prohibition/Obligation).

## 3. Backend: Contract Lifecycle & Filing
- [ ] 3.1 **Contract Entity Update**: Align `ContractEntity` fields with standard DTOs (e.g., `contractStatus`, `signMode`).
- [ ] 3.2 **Controller Refactoring**: Refactor `ContractController` to implement generated interfaces (`LifecycleApi`, `ExecutionApi`).
    - `/contractCreate`: Use `ContractCreateRequest` DTO.
    - `/contractRegistrate`: Implement filing logic.
- [ ] 3.3 **Status Mapping**: Ensure internal status codes map correctly to standard codes (01, 02, 0301, etc.).

## 4. Frontend: Policy Template Management
- [x] 4.1 **New Page**: Create `frontend/src/pages/PolicyTemplateManagement.tsx`.
- [x] 4.2 **Standardized Forms**: Update `PolicyForm` to use standard dictionaries (Actions C.5, Constraints C.6).
- [ ] 4.3 **Integration**: Connect frontend to the new standard-compliant backend APIs.

## 5. Frontend: Enhanced Contract Lifecycle
- [ ] 5.1 **Create Flow Update**: Use `ContractCreateRequest` structure payload.
- [ ] 5.2 **Filing Action**: Call `/contractRegistrate` endpoint.
- [ ] 5.3 **Type Safety**: Generate or update TypeScript interfaces to match YAML definitions.

## 6. Verification
- [ ] 6.1 Verify API conformity using Swagger UI or curl.
- [ ] 6.2 Verify standard compliance of created contract data.

