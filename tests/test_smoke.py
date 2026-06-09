import os
import sqlite3
import tempfile
import unittest


class SmokeTests(unittest.TestCase):
    def test_main_compiles(self):
        with open(os.path.join(os.path.dirname(__file__), "..", "main.py")) as f:
            source = f.read()
        compile(source, "main.py", "exec")

    def test_init_db_creates_users_table(self):
        with tempfile.TemporaryDirectory() as tmp:
            db_path = os.path.join(tmp, "users.db")
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
                """
            )
            conn.commit()
            cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
            )
            self.assertIsNotNone(cursor.fetchone())
            conn.close()


if __name__ == "__main__":
    unittest.main()
