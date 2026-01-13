# Proposal: Refactor Catalog into Governance Hub

## Why
Transition the Catalog module from a simple metadata repository to a robust governance hub for Data Products. This refactoring aligns with the Space Operator's role in auditing submissions from Connectors, registering them with higher-level NDI nodes, and managing usage entitlements. Raw "Data Resources" are removed to simplify the catalog, focusing exclusively on value-added "Data Products".

## What Changes
1.  **Remove Data Resource Logic**: Purge `RESOURCE` type references and focus on `PRODUCT`.
2.  **Modularized UI**: Split the single Catalog Management page into three specialized sub-pages:
    -   **Audit Registration (审核登记)**：管理方对提供方通过连接器提交的产品进行治理。
        1. **审核**：核验上架申请。状态从“待审核”变为“审核通过”。
        2. **登记**：模拟向节点登记标识。状态从“审核通过”变为“已登记”。**登记后的产品需在列表中保留**，支持查看已分配的 ID。
        3. **后期维护**：支持对已登记产品进行“**更新登记**”（同步最新元数据）或“**撤销登记**”（废止标识符）。
        4. **发布**：将已登记产品上架。状态从“已登记”变为“已发布”。
    -   **Product Catalog (产品目录)**：已发布产品的展示与发现门户。
    -   **Usage Applications (使用申请管理)**：跟踪并审核消费者的使用申请。
3.  **Enhanced Details View**: Refactor the detail modal to include **all metadata fields** from NDI-TR-2025-06 (7 major tables), presented in categorised tabs.
4.  **Standardized Identifier**: Implement Product ID generation strictly following **NDI-TR-2025-04**, using the `FrontCode (Area+Org) / BackCode (Type+Serial+Check)` format.
5.  **Provider Identity Mapping**: Display the **Entity Name** of the provider instead of just their DID in all governance lists.

## Desired Outcome
完整的治理生命周期：提供方通过连接器提交 -> 管理方审核（待审核 -> 审核通过） -> 节点登记（已登记，获得标准标识符） -> 上架发布（已发布） -> 需求方发现与申请 -> 提供方/管理方审批。
