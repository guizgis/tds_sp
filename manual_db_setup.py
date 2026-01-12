import psycopg2
import time
import logging
import os

# Configure logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/manual_db_setup.log"),
        logging.StreamHandler()
    ]
)

def create_tables():
    config = {
        'host': '192.170.12.201',
        'port': 5432,
        'dbname': 'tds',
        'user': 'tds_admin',
        'password': 'NuAQPtc2WuM#6Cbc',
        'connect_timeout': 10
    }
    
    queries = [
        """
        CREATE TABLE IF NOT EXISTS identities (
            identity_code VARCHAR(255) PRIMARY KEY,
            type VARCHAR(50),
            name VARCHAR(255),
            status VARCHAR(20),
            submit_time TIMESTAMP WITH TIME ZONE,
            data_json TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS catalogs (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            description TEXT,
            version VARCHAR(20),
            status VARCHAR(20),
            provider_id VARCHAR(255),
            target_space_id VARCHAR(255),
            create_time TIMESTAMP WITH TIME ZONE,
            update_time TIMESTAMP WITH TIME ZONE,
            full_data_json TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS spaces (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            description TEXT,
            status VARCHAR(20),
            usage_policies VARCHAR(1024),
            resource_ids VARCHAR(2048),
            created_at TIMESTAMP WITHOUT TIME ZONE
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS usage_logs (
            id UUID PRIMARY KEY,
            space_id VARCHAR(255),
            resource_id VARCHAR(255),
            participant_id VARCHAR(255),
            action VARCHAR(50),
            status VARCHAR(20),
            evidence_hash VARCHAR(255),
            timestamp TIMESTAMP WITHOUT TIME ZONE
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS connectors (
            identity_code VARCHAR(255) PRIMARY KEY,
            connector_name VARCHAR(255),
            connector_join_type VARCHAR(20),
            enterprise_code VARCHAR(255),
            identity_status VARCHAR(20),
            auth_time DATE,
            connector_type VARCHAR(20),
            connector_mac VARCHAR(255),
            connector_ip_list VARCHAR(1024),
            connector_domain_list VARCHAR(1024),
            enterprise_name VARCHAR(255),
            supplier_name VARCHAR(255),
            supplier_code VARCHAR(255),
            connector_sn VARCHAR(255),
            connector_version VARCHAR(255)
        );
        """
    ]

    retries = 3
    while retries > 0:
        try:
            logging.info(f"Connecting to {config['host']}...")
            conn = psycopg2.connect(**config)
            cur = conn.cursor()
            
            for query in queries:
                cur.execute(query)
                logging.info("Executed a CREATE TABLE query.")
            
            conn.commit()
            cur.close()
            conn.close()
            logging.info("Successfully created all tables manually.")
            return True
        except Exception as e:
            logging.error(f"Error during manual setup: {e}")
            retries -= 1
            time.sleep(2)
    return False

if __name__ == '__main__':
    create_tables()
