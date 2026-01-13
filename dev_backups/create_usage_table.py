import psycopg2

def create_usage_table():
    conn = psycopg2.connect(
        host='192.170.12.201', port=5432, dbname='tds', 
        user='tds_admin', password='NuAQPtc2WuM#6Cbc'
    )
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS usage_applications (
            id VARCHAR(255) PRIMARY KEY,
            catalog_id VARCHAR(255),
            catalog_name VARCHAR(255),
            applicant_id VARCHAR(255),
            provider_id VARCHAR(255),
            reason TEXT,
            status VARCHAR(50),
            submit_time TIMESTAMP WITH TIME ZONE
        );
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Table usage_applications created.")

if __name__ == '__main__':
    create_usage_table()
