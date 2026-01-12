# UI Technical Design

## Context
To achieve rapid, high-quality frontend development, we utilize **Ant Design ProComponents**. This design document provides the configuration "schema" for all UI implementations.

## Implementation Standards

### 1. Global Theme Configuration (ConfigProvider)
All components are wrapped in a `ConfigProvider` with the following `token` and `components` schema:

```typescript
const tdsTheme = {
  token: {
    colorPrimary: '#0050b3', // Trust Blue
    borderRadius: 6,
    colorLink: '#096dd9',
    fontFamily: 'Inter, -apple-system, system-ui',
  },
  components: {
    Layout: { headerBg: '#ffffff' },
    Menu: { itemSelectedBg: '#0050b3' }
  }
};
```

### 2. ProTable Component Protocol
Every data table implementation MUST follow this attribute structure:

| Prop | Requirement | Purpose |
| :--- | :--- | :--- |
| `cardBordered` | Always `true` | Standard card styling |
| `search` | `{ labelWidth: 'auto' }` | Standardized search bar layout |
| `pagination` | `{ pageSize: 5/10/20 }` | Consistent paging |
| `dateFormatter` | `"string"` | Simplified date handling |
| `actionRef` | Required | For programmatic reloads after audit actions |

### 3. ProForm & StepsForm Protocol
- **StepsForm**: MUST be used for creation workflows requiring > 5 fields.
- **ProFormText/Select**: MUST use the `rules={[{ required: true }]}` pattern for mandatory metadata.

### 4. Semantic Status Mapping (ProColumns ValueEnum)
All status columns MUST use the following unified `valueEnum` mapping:

```typescript
const statusEnum = {
  PENDING: { text: '待审核', status: 'Processing' },
  ACTIVE: { text: '已生效', status: 'Success' },
  CANCELLED: { text: '已注销', status: 'Error' },
  REJECTED: { text: '已拒绝', status: 'Error' },
};
```

## UI Structure Blueprint (Pseudo-YAML Representation)

```yaml
ui_standard_version: "1.0"
layout:
  type: ProLayout
  header: StandardHeader
  sidebar: SiderMenu (width: 220px)
components:
  table:
    library: @ant-design/pro-components/ProTable
    defaults: { size: middle, bordered: true }
  form:
    library: @ant-design/pro-components/ProForm
    defaults: { layout: vertical }
  feedback:
    success: antd.message.success
    error: antd.message.error
```
