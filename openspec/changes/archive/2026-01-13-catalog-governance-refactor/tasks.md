## 1. Backend: Governance Logic Enhancement
- [x] 1.1 **Purge Resource References**: Remove `catalogType` logic or default all to `PRODUCT`. Update existing mock data.
- [x] 1.2 **Standardized ID Generation (NDI-TR-2025-04)**:
    - [x] 1.2.1 Implement `NdiIdentifierUtil` to generate IDs: `Area(6)+Org(9)/Type(1)+Serial(6)+Check(2)`.
    - [x] 1.2.2 Update `auditCatalog` to invoke this utility upon the "Node Registration" step.
- [x] 1.3 **Identity Integration**:
    - [x] 1.3.1 Ensure `CatalogItem` includes `providerName`.
    - [x] 1.3.2 Implement mapping logic to fetch entity names from `IdentityService` (mock lookup).
- [x] 1.4 **Status Mapping Robustness**: Implemented bi-directional mapping for Chinese/English statuses in `CatalogServiceImpl`.

## 2. Frontend: Multi-Page Implementation
- [x] 2.1 **Layout Update**: Add sub-menu under "目录管理" in `OperatorLayout.tsx`.
- [x] 2.2 **Page: Audit Registration (审核登记)**:
    - [x] 2.2.1 Update columns: Display Provider Name, use Chinese Status labels, restored Topic/Security Level columns.
    -   2.2.2 Implement action workflow:
        - [独立签页：产品准入审核] 处理 [待审核] -> [通过/驳回]。
        - [独立签页：产品标识登记] 展示 [审核通过、已登记、已发布] 状态的产品。
            - 针对 [审核通过]：显示 [向节点登记] 按钮。
            - 针对 [已登记/已发布]：显示 [更新登记]、[撤销登记] 按钮。
            - 针对 [已登记]：显示 [上架发布] 按钮。
- [x] 2.3 **Page: Product Catalog (产品目录)**:
    - [x] 2.3.1 Implement List/Card toggle switcher.
    - [x] 2.3.2 Filter by `已发布` (ACTIVE) status.

## 3. Component: Full Metadata Product Details
- [x] 3.1 **Comprehensive Details View (NDI-TR-2025-06)**:
    - [x] 3.1.1 Categorized display of metadata.
    - [x] 3.1.2 Unified `ProductDetailModal` used across all governance pages.

## 4. Maintenance & Operations (NEW)
- [x] 4.1 **Startup Optimization**: Created `start_catalog.sh` to bypass proxy issues.
- [x] 4.2 **Mock Data Expansion**: Updated `mock_data_injector.py` for full-lifecycle testing.
- [x] 4.3 **Documentation**: Created `MAINTENANCE.md` for long-term reference.
