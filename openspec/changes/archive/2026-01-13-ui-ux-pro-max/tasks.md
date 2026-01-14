# Tasks: UI/UX Pro Max Optimization

## 1. Design System Foundation
- [ ] 1.1 **Update Design Spec**: Rewrite `openspec/specs/ui-standard/design.md` to reflect "Design System 2.0".
    - Define new Color Tokens (Primary, Info, Success, Warning, Error).
    - Define Typography Scale (H1-H5, Body, Caption).
    - Define Spacing & Layout Grid (4px/8px rule).
- [ ] 1.2 **Theme Implementation**: Update `frontend/src/App.tsx` `ConfigProvider` with new tokens.
    - `colorPrimary`: `#0050B3`
    - `borderRadius`: `6px`
    - `wireframe`: `false` (Enable AntD 5.0 algorithm)

## 2. Component Refactoring
- [ ] 2.1 **Catalog Management**:
    - Update `ProductCard` visuals (Shadows, Borders, Typography).
    - Refine `ProTable` query filter layout (more prominent).
- [ ] 2.2 **Contract Management**:
    - Enhance `Contracts.tsx` list view (Status tags, Action buttons).
    - Optimize `PolicyTemplateManagement.tsx` modal layout (Spacing, Form alignment).
- [ ] 2.3 **Common Components**:
    - Review `OperatorLayout.tsx`: Improve Sidebar and Header aesthetics (Logo, User Avatar, Breadcrumbs).
    - Refine `ProductDetailModal.tsx`: Use `Descriptions` with better spacing and labels.

## 3. Experience Enhancements
- [ ] 3.1 **Loading & Empty**: Add `Skeleton` components for loading states and custom `Empty` images.
- [ ] 3.2 **Micro-interactions**: Check button hover states and transition animations.

## 4. Verification
- [ ] 4.1 **Visual Regression**: Manually verify all pages against the new design spec.
- [ ] 4.2 **Responsiveness**: Check layout on smaller screens (laptop vs monitor).
