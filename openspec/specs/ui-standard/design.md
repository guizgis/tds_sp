# UI Technical Design 2.0 (Pro Max)

## Context
This document defines the **Design System 2.0** for the Trusted Data Space Service Platform. It supersedes previous versions and mandates strict adherence to **Ant Design 5.0** tokens and ProComponents best practices. The goal is to build a "Trustworthy, Efficient, and Professional" interface.

## 1. Design Tokens (Global Theme)

All UI components must derive their styles from the following global tokens. Do not hardcode hex values in components; use the `theme` object or CSS variables.

### 1.1 Color Palette
We use a **Deep Ocean Blue** primary scheme to convey stability and trust.

| Token | Value | Semantic Usage |
| :--- | :--- | :--- |
| `colorPrimary` | `#0050B3` | Primary buttons, active states, links |
| `colorSuccess` | `#52C41A` | "Active", "Approved", "Filed" statuses |
| `colorWarning` | `#FAAD14` | "Pending", "Negotiating" statuses |
| `colorError` | `#FF4D4F` | "Rejected", "Terminated", "Revoked" statuses |
| `colorInfo` | `#1890FF` | Information alerts, standard tags |
| `colorBgLayout` | `#F5F7FA` | App background (slightly cool grey) |
| `colorTextBase` | `#1F1F1F` | Primary text |
| `colorTextSecondary` | `#595959` | Descriptions, labels |

### 1.2 Typography
- **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `'PingFang SC'`, `'Hiragino Sans GB'`, `'Microsoft YaHei'`, `sans-serif`.
- **Base Size**: `14px`.
- **Heading Scale**:
    - H1: `24px` (Page Titles)
    - H2: `20px` (Section Headers)
    - H3: `16px` (Card Titles)

### 1.3 Shape & Spacing
- **Border Radius**: `6px` (Modern, soft but professional).
- **Base Unit**: `4px`. All margins and paddings should be multiples of 4 (e.g., 8px, 16px, 24px).

## 2. Component Protocols

### 2.1 ProTable (The Data Grid)
- **Style**:
    - `cardBordered={true}`
    - `options={{ density: true, fullScreen: true, setting: true }}`
    - `search={{ filterType: 'query', span: 6, labelWidth: 'auto' }}`
- **Columns**:
    - **Status Columns**: MUST use `valueEnum` with standard status mapping.
    - **Action Columns**: Fixed to the right, using `Button type="link"` or `Button type="text"` for secondary actions. Primary action can be a ghost button.

### 2.2 Modal & Drawer (The Workspaces)
- **Modals**:
    - Use `width={800}` for standard forms.
    - Use `destroyOnClose={true}`.
    - Footer: Standard "Cancel" (Default) and "Submit" (Primary) buttons.
- **Drawers**:
    - Use for viewing details (read-only).
    - `width={600}` or `width="60%"`.

### 2.3 Cards (The Content Containers)
- **Product Card**:
    - `hoverable={true}`.
    - `bodyStyle={{ padding: '16px' }}`.
    - Shadow: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)` on hover.

## 3. Implementation Code Snippet (ConfigProvider)

```typescript
const tdsTheme = {
  token: {
    colorPrimary: '#0050B3',
    borderRadius: 6,
    wireframe: false,
    colorBgLayout: '#F5F7FA',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      siderBg: '#001529',
    },
    Card: {
      headerFontSize: 16,
    },
    Table: {
      headerBg: '#FAFAFA',
      rowHoverBg: '#F0F5FF',
    }
  }
};
```

## 4. Status Mapping Standard

| Internal Code | Chinese Label | Color (Status) |
| :--- | :--- | :--- |
| `PENDING` / `01` / `待审核` | 待审核 | `processing` (Blue) |
| `AUDITED` / `02` / `审核通过` | 审核通过 | `warning` (Orange) |
| `REGISTERED` / `0301` / `已登记` | 已登记 | `success` (Green) |
| `ACTIVE` / `05` / `已发布` | 已发布 | `success` (Green) |
| `REJECTED` / `已驳回` | 已驳回 | `error` (Red) |
| `UNFILED` | 未备案 | `default` (Grey) |
| `FILED` | 已备案 | `success` (Green) |