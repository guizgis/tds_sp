import psycopg2
import uuid
from datetime import datetime, timedelta
import logging
import os

# Configure logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/mock_data_injector.log"),
        logging.StreamHandler()
    ]
)

def get_conn():
    return psycopg2.connect(
        host='192.170.12.201', port=5432, dbname='tds', 
        user='tds_admin', password='NuAQPtc2WuM#6Cbc'
    )

def inject_identities():
    conn = get_conn()
    cur = conn.cursor()
    
    # 1. 待审核：个人 (Pending)
    cur.execute("""
        INSERT INTO identities (identity_code, type, name, status, submit_time, data_json)
        VALUES (%s, 'Person', '张待审', '0', NOW(), '{\"baseInfo\":{\"fullName\":\"张待审\",\"phone\":\"13800000001\"},\"extendInfo\":{\"userEmail\":\"zhang@pending.com\"}}')
        ON CONFLICT DO NOTHING;
    """, (f"did:tds:mock:{uuid.uuid4().hex[:8]}",))

    # 2. 待审核：企业 (Pending)
    cur.execute("""
        INSERT INTO identities (identity_code, type, name, status, submit_time, data_json)
        VALUES (%s, 'Enterprise', '未来数据科技(待审)', '0', NOW(), '{\"baseInfo\":{\"enterpriseName\":\"未来数据科技(待审)\",\"enterpriseCode\":\"91110000PENDING\"},\"extendInfo\":{\"businessScope\":\"大数据服务\"}}')
        ON CONFLICT DO NOTHING;
    """, (f"did:tds:mock:{uuid.uuid4().hex[:8]}",))

    # 3. 已激活：企业 (Active)
    cur.execute("""
        INSERT INTO identities (identity_code, type, name, status, submit_time, data_json)
        VALUES (%s, 'Enterprise', '中数信安技术有限公司', '1', NOW() - INTERVAL '2 days', '{\"baseInfo\":{\"enterpriseName\":\"中数信安技术有限公司\",\"enterpriseCode\":\"91110000ACTIVE01\"},\"extendInfo\":{\"businessScope\":\"安全计算\"}}')
        ON CONFLICT DO NOTHING;
    """, ("did:tds:mock:active_corp_01",))

    conn.commit()
    cur.close()
    conn.close()
    logging.info("Identities injected.")

def inject_connectors():
    conn = get_conn()
    cur = conn.cursor()

    # 1. 待审核连接器
    cur.execute("""
        INSERT INTO connectors (identity_code, connector_name, connector_join_type, enterprise_code, identity_status, auth_time, connector_type, connector_mac, enterprise_name)
        VALUES (%s, '北京研发节点-待接入', '1', '91110000PENDING', '0', CURRENT_DATE, '1', 'AA:BB:CC:DD:EE:01', '未来数据科技(待审)')
        ON CONFLICT DO NOTHING;
    """, (f"did:tds:mock:conn_{uuid.uuid4().hex[:6]}",))

    # 2. 已激活连接器
    cur.execute("""
        INSERT INTO connectors (identity_code, connector_name, connector_join_type, enterprise_code, identity_status, auth_time, connector_type, connector_mac, enterprise_name)
        VALUES (%s, '上海数据中心核心节点', '2', '91110000ACTIVE01', '1', CURRENT_DATE - 5, '1', '00:11:22:33:44:55', '中数信安技术有限公司')
        ON CONFLICT DO NOTHING;
    """, ("did:tds:mock:conn_sh_01",))

    conn.commit()
    cur.close()
    conn.close()
    logging.info("Connectors injected.")

def inject_catalogs():
    conn = get_conn()
    cur = conn.cursor()

    # 1. 待审核产品 (PENDING) - 用于“产品准入审核”签页
    cur.execute("""
        INSERT INTO catalogs (id, name, description, version, status, provider_id, create_time, update_time, full_data_json, catalog_type)
        VALUES (%s, '企业征信评分API(待审核)', '实时查询企业信用评分及风险提示', '1.0', 'PENDING', 'did:tds:mock:active_corp_01', NOW(), NOW(), 
        '{\"name\":\"企业征信评分API(待审核)\",\"topicCategory\":\"B0000\",\"sourceType\":\"002\",\"securityLevel\":\"003\",\"deliveryMode\":\"002\"}', 'PRODUCT')
        ON CONFLICT DO NOTHING;
    """, (f"TMP_{uuid.uuid4().hex[:8].upper()}",))

    # 2. 审核通过产品 (AUDITED) - 用于“产品标识登记”签页
    cur.execute("""
        INSERT INTO catalogs (id, name, description, version, status, provider_id, create_time, update_time, full_data_json, catalog_type)
        VALUES (%s, '全球气象预报历史数据', '覆盖过去50年的全球分时段气象监测数据', '2.0', 'AUDITED', 'did:tds:mock:weather_org', NOW() - INTERVAL '1 days', NOW(), 
        '{\"name\":\"全球气象预报历史数据\",\"topicCategory\":\"C0000\",\"sourceType\":\"001\",\"securityLevel\":\"002\",\"deliveryMode\":\"001\"}', 'PRODUCT')
        ON CONFLICT DO NOTHING;
    """, (f"TMP_{uuid.uuid4().hex[:8].upper()}",))

    # 3. 已登记产品 (REGISTERED) - 准备发布环节
    cur.execute("""
        INSERT INTO catalogs (id, name, description, version, status, provider_id, create_time, update_time, full_data_json, catalog_type)
        VALUES (%s, '金融行业反欺诈特征库', '基于多维数据的风险特征集', '1.5', 'REGISTERED', 'did:tds:mock:finance_node', NOW() - INTERVAL '3 days', NOW(), 
        '{\"name\":\"金融行业反欺诈特征库\",\"topicCategory\":\"B0000\",\"sourceType\":\"003\",\"securityLevel\":\"004\",\"deliveryMode\":\"001\"}', 'PRODUCT')
        ON CONFLICT DO NOTHING;
    """, ("110101DID:CAT_REG_01",))

    # 4. 已发布产品 (ACTIVE) - 在产品目录可见
    cur.execute("""
        INSERT INTO catalogs (id, name, description, version, status, provider_id, create_time, update_time, full_data_json, catalog_type)
        VALUES (%s, '城市交通实时路况API', '高精度实时路况数据接口，支持秒级更新', '2.1', 'ACTIVE', 'did:tds:mock:active_corp_01', NOW() - INTERVAL '10 days', NOW(), 
        '{\"name\":\"城市交通实时路况API\",\"topicCategory\":\"A0000\",\"sourceType\":\"001\",\"securityLevel\":\"001\",\"deliveryMode\":\"002\"}', 'PRODUCT')
        ON CONFLICT DO NOTHING;
    """, ("110101DID:CAT_ACTIVE_01",))

    conn.commit()
    cur.close()
    conn.close()
    logging.info("Catalogs injected with multi-stage statuses.")

def inject_spaces():
    conn = get_conn()
    cur = conn.cursor()

    # 1. 待审批空间
    cur.execute("""
        INSERT INTO spaces (id, name, description, status, usage_policies, resource_ids, created_at)
        VALUES (%s, '长三角供应链金融协作空间(申请)', '面向银行与核心企业的供应链金融数据流通', 'PENDING', 'RBAC,TIME_RANGE', '110101DID:CAT_ACTIVE_01', NOW())
        ON CONFLICT DO NOTHING;
    """, (str(uuid.uuid4()),))

    # 2. 运行中空间
    cur.execute("""
        INSERT INTO spaces (id, name, description, status, usage_policies, resource_ids, created_at)
        VALUES (%s, '国家医疗健康科研数据空间', '汇聚多家三甲医院脱敏病例数据的科研专用空间', 'ACTIVE', 'USE_COUNT,PRIVACY_COMPUTE', '110101DID:CAT_ACTIVE_01', NOW() - INTERVAL '30 days')
        ON CONFLICT DO NOTHING;
    """, (str(uuid.uuid4()),))

    conn.commit()
    cur.close()
    conn.close()
    logging.info("Spaces injected.")

if __name__ == '__main__':
    try:
        inject_identities()
        inject_connectors()
        inject_catalogs()
        inject_spaces()
        logging.info("All mock data injected successfully.")
    except Exception as e:
        logging.error(f"Injection failed: {e}")
