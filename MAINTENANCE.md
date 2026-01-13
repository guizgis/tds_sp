# TDS-SP 开发与运维手册

本文档记录了项目关键服务的启动、调试及数据 Mock 说明，以便在后续开发中参考。

## 1. 服务启动说明

### 1.1 目录管理服务 (catalog-service)
为了避免因系统代理配置导致的数据库连接超时（`SocketTimeoutException`），必须在启动时显式禁用代理并强制直连数据库。

**启动脚本：** `start_catalog.sh`
```bash
./start_catalog.sh
```

**关键启动参数：**
- `-Dhttp.proxyHost= -Dhttp.proxyPort=`: 禁用 HTTP 代理。
- `-Djava.net.useSystemProxies=false`: 禁用系统级代理探测。
- `-Dspring.datasource.url=...`: 显式指定数据库连接串，确保直连 192.170.12.201。

## 2. 数据 Mock 说明

### 2.1 注入多环节治理数据
为了测试“审核登记”页面的完整流程，使用了 `mock_data_injector.py` 注入不同状态的产品。

**执行方式：**
```bash
python3 mock_data_injector.py
```

**支持的状态阶段：**
- `PENDING` (待审核): 出现在“产品准入审核”签页。
- `AUDITED` (审核通过): 出现在“产品标识登记”签页。
- `REGISTERED` (已登记): 完成标识符分配，准备发布。
- `ACTIVE` (已发布): 出现在“产品目录”门户中。

## 3. 后端治理逻辑参考

### 3.1 状态映射逻辑
后端 `CatalogServiceImpl.java` 已实现中英文双向映射，前端请求参数与数据库存储值的对应关系如下：

| 前端参数 (status) | 数据库存储值 (status) | 说明 |
| :--- | :--- | :--- |
| `待审核` | `PENDING` | 连接器初始提交 |
| `审核通过` | `AUDITED` | 管理方已核验 |
| `已登记` | `REGISTERED` | 已分配 NDI 标识符 |
| `已发布` | `ACTIVE` | 门户可见 |

### 3.2 标识符生成
在“产品标识登记”环节点击“向节点登记标识”时，后端会调用 `CatalogIdentifierUtil` 根据 **NDI-TR-2025-04** 标准生成正式 ID，并替换原有的临时 ID (`TMP_...`)。

## 4. 常见问题排查
- **页面数据为空**：
    1. 检查 `catalog-service` 是否存活：`ps -ef | grep catalog-service`。
    2. 检查数据库连通性：`nc -zv 192.170.12.201 5432`。
    3. 确认是否通过 `start_catalog.sh` 禁用了代理启动。
