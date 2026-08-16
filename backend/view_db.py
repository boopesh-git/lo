import psycopg2
from pprint import pprint

try:
    # Connect to your PostgreSQL database
    connection = psycopg2.connect(
        user="postgres",
        password="boopesh@2046",
        host="localhost",
        port="5432",
        database="hospital_db"
    )
    cursor = connection.cursor()
    
    # Query all rows from the users table
    cursor.execute("SELECT * FROM users")
    records = cursor.fetchall()
    
    # Get column names
    colnames = [desc[0] for desc in cursor.description]
    
    print(f"\n--- Users Table Content ---")
    print(f"Columns: {colnames}")
    print("-" * 50)
    
    if not records:
        print("No users found in the database.")
    else:
        for row in records:
            pprint(dict(zip(colnames, row)))
            print("-" * 50)

except Exception as error:
    print("Error fetching data from PostgreSQL:", error)
finally:
    if 'connection' in locals() and connection:
        cursor.close()
        connection.close()
