import pandas as pd
from sqlalchemy import create_engine
import urllib.parse

# Setup connection
encoded_password = urllib.parse.quote_plus("boopesh@2046")
SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:{encoded_password}@localhost/hospital_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

file_path = r"X:\login\patient_journey_synthetic_final.xlsx"

print(f"Loading Excel file: {file_path}")
try:
    # Get sheet names
    xls = pd.ExcelFile(file_path)
    sheet_names = xls.sheet_names
    print(f"Found sheets: {sheet_names}")
    
    for sheet in sheet_names:
        print(f"Processing sheet: {sheet}...")
        df = pd.read_excel(xls, sheet_name=sheet)
        
        # Clean up column names (lowercase, replace spaces with underscores)
        df.columns = [str(c).lower().strip().replace(' ', '_').replace('-', '_') for c in df.columns]
        
        # Create table name from sheet name
        table_name = sheet.lower().strip().replace(' ', '_').replace('-', '_')
        
        # Insert into database
        print(f"Inserting into table '{table_name}' ({len(df)} rows)...")
        # if_exists='replace' will drop the table if it exists and recreate it
        df.to_sql(table_name, engine, if_exists='replace', index=False)
        print(f"Successfully created table '{table_name}'.")

    print("All sheets have been imported successfully!")

except Exception as e:
    print(f"An error occurred: {e}")
