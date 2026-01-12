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

    # 1. 待审核产品
    cur.execute("""
        INSERT INTO catalogs (id, name, description, version, status, provider_id, create_time, update_time, full_data_json)
        VALUES (%s, '全国企业工商全维数据(待审)', '包含企业基本信息、分支机构及变更记录', '1.0', 'PENDING', 'did:tds:mock:active_corp_01', NOW(), NOW(), '{\"name\":\"全国企业工商全维数据(待审)\",\"topicCategory\":\"B0000\"}')
        ON CONFLICT DO NOTHING;
    """, (f"110101DID:CAT_{uuid.uuid4().hex[:6]}",))

    # 2. 已发布产品
    cur.execute("""
        INSERT INTO catalogs (id, name, description, version, status, provider_id, create_time, update_time, full_data_json)
        VALUES (%s, '城市交通实时路况API', '高精度实时路况数据接口，支持秒级更新', '2.1', 'ACTIVE', 'did:tds:mock:active_corp_01', NOW() - INTERVAL '10 days', NOW(), '{\"name\":\"城市交通实时路况API\",\"topicCategory\":\"A0000\"}')
        ON CONFLICT DO NOTHING;
    """, ("110101DID:CAT_ACTIVE_01",))

    conn.commit()
    cur.close()
    conn.close()
    logging.info("Catalogs injected.")

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
