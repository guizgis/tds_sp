# Change: Create Core Platform (TDS-SP)

## Why
依据 TC609-6-2025-01 标准，可信数据空间是支撑全国一体化数据市场的重要载体。当前急需一套符合标准架构、能够独立部署且与国家数据基础设施（NDI）互联互通的标准化服务平台，以解决跨主体数据流通中的信任与控制问题。

## What Changes
本项目将构建 **可信数据空间服务平台 (TDS-SP)** 的 MVP 版本，包含以下 6 个独立核心模块：

1.  **身份管理模块 (Identity Management)**: 负责用户身份的代理注册、认证与同步。
2.  **接入连接器管理模块 (Connector Management)**: 负责连接器的准入、鉴权与能力适配。
3.  **目录管理模块 (Catalog Management)**: 负责数据产品/服务的登记、检索与全网同步。
4.  **数字合约管理模块 (Digital Contract Management)**: 负责合约模板、协商、签署与指令生成。
5.  **可信数据空间管理模块 (Space Management)**: 负责逻辑空间的创建、配置与成员管理。
6.  **数据使用控制模块 (Usage Control)**: 负责使用策略的执行监控与环境联动。

## Impact
- **New Capabilities**:
    - `identity-management`
    - `connector-management`
    - `catalog-management`
    - `contract-management`
    - `space-management`
    - `usage-control`
- **Architecture**: 引入微服务架构，模块间解耦。
