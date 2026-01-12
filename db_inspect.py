import psycopg2
import logging
import os

# Configure logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s', # Keep simple format for inspection output
    handlers=[
        logging.FileHandler("logs/db_inspect.log"),
        logging.StreamHandler()
    ]
)

def inspect():
    try:
        conn = psycopg2.connect(
            host='192.170.12.201', 
            port=5432, 
            dbname='tds', 
            user='tds_admin',
            password='NuAQPtc2WuM#6Cbc'
        )
        cur = conn.cursor()
        
        # List tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        
        logging.info("Database Inspection for 'tds':")
        logging.info("=" * 40)
        
        for table in tables:
            logging.info(f"\n[Table: {table}]")
            cur.execute(f"SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '{table}' ORDER BY ordinal_position")
            columns = cur.fetchall()
            for col in columns:
                nullable = "NULL" if col[2] == 'YES' else "NOT NULL"
                logging.info(f"  - {col[0]:<20} | {col[1]:<20} | {nullable}")
                
        cur.close()
        conn.close()
    except Exception as e:
        logging.error(f"Error: {e}")

if __name__ == '__main__':
    inspect()
