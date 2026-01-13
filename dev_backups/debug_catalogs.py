import psycopg2

def check_catalogs():
    conn = psycopg2.connect(
        host='192.170.12.201', port=5432, dbname='tds', 
        user='tds_admin', password='NuAQPtc2WuM#6Cbc'
    )
    cur = conn.cursor()
    
    print("Distinct statuses in catalogs table:")
    cur.execute("SELECT status, count(*) FROM catalogs GROUP BY status")
    for row in cur.fetchall():
        print(f" - {row[0]}: {row[1]}")
    
    print("\nRecent 5 catalogs:")
    cur.execute("SELECT id, name, status, catalog_type FROM catalogs ORDER BY create_time DESC LIMIT 5")
    for row in cur.fetchall():
        print(f" - {row[0]} | {row[1]} | {row[2]} | {row[3]}")
    
    cur.close()
    conn.close()

if __name__ == '__main__':
    check_catalogs()
