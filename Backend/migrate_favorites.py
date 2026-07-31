import sys
import psycopg2

DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/saraswati_db"

def run_migration():
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cur = conn.cursor()

        print("Adding is_favorite to subjects...")
        try:
            cur.execute("ALTER TABLE subjects ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE NOT NULL;")
            print("Successfully added to subjects.")
        except Exception as e:
            print(f"Skipped subjects (might already exist): {e}")

        print("Adding is_favorite to documents...")
        try:
            cur.execute("ALTER TABLE documents ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE NOT NULL;")
            print("Successfully added to documents.")
        except Exception as e:
            print(f"Skipped documents (might already exist): {e}")

        cur.close()
        conn.close()
        print("Migration complete!")
    except Exception as e:
        print(f"Database connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()
