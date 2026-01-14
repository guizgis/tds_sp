# Proposal: Enhance Digital Contract Management

## 1. Background
Current Digital Contract management lacks flexibility in defining usage control policies and lacks a formal filing process. This proposal aims to introduce "Policy Templates" to streamline contract creation and implement a "Contract Filing" workflow to meet compliance requirements.

## 2. Goals
- **Standardize Policy Management**: Enable operators to create and manage reusable Policy Templates based on "Trustworthy Data Space Usage Control Technical Requirements".
- **Streamline Contract Creation**: Allow users to select templates and customize policies during contract initiation.
- **Compliance & Filing**: Implement a post-signing "Filing" (备案) process and allow querying filed contracts.

## 3. Key Features

### 3.1 Policy Template Management (New Sub-menu)
- **CRUD Operations**: Create, Read, Update, Delete policy templates.
- **Policy Definition**: Support comprehensive Usage Control Policies including but not limited to:
    - **Content Scope**: Limit specific Data Product content (fields/rows).
    - **Connector Scope**: Limit Delivery and Usage Connectors.
    - **Subject Scope**: Limit authorized Users/Operators.
    - **Action Scope**: Limit Allowed Actions (Read, Download, Compute, etc.).
    - **Quantitative Constraints**: Usage Count, Duration, Frequency.
    - **Environmental Constraints**: Visible Scope, Available Scope (Time/Location).
    - **Obligations**: Notify on Usage, Destroy after Usage.

### 3.2 Enhanced Contract Creation Flow
- **Template Selection**: During contract initiation, users can pick a pre-defined Policy Template.
- **Policy Customization**: Users can adjust the specific parameters of the selected template for the current contract (e.g., change "Expiration Date" or "Max Usage Count").
- **Save as New Template**: Option to save the customized policy configuration as a new template for future use.

### 3.3 Contract Filing & Governance
- **Filing Action**: After a contract reaches `SIGNED` status, an explicit `File` (备案) action is available.
- **Filing Status**: Track contract status as `FILED` (已备案).
- **Filing Registry**: A dedicated view or filter to query and audit filed contracts.

## 4. Architecture Impact

### API-First Design
- **Single Source of Truth**: All APIs and data models are strictly defined in `backend/src/main/resources/api/contract-standard.yaml`, following TC609-6-2025-14.
- **Code Generation**: Backend interfaces and DTOs are auto-generated from the YAML spec.

### Backend (`contract-service`)
- **New Entity**: `PolicyTemplate`
- **Updated Entity**: `Contract` (aligned with standard fields like `contractStatus`, `signMode`).
- **Standardized Interfaces**:
    - `/contractTemplate` (Template Retrieval)
    - `/contractCreate` (Contract Initiation)
    - `/contractNegotiate` (Strategy Negotiation)
    - `/contractRegistrate` (Filing/Registration)
    - `/contractExecution` (Execution Reporting)
    - `/contractTerminate` (Termination)

### Frontend (`ContractManagement`)
- **New Page**: `PolicyTemplateManagement.tsx`.
- **Updated Page**: `Contracts.tsx` (add Filing action, update Create Modal).
- **New Component**: `PolicyConfigurator` (strictly typed against standard constraints).

## 5. References
- *TC609-6-2025-14 Digital Contract Technical Requirements*
- *TC609-6-2025-15 Usage Control Technical Requirements*
