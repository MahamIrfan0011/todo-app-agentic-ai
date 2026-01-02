from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set.")

# Create the SQLModel engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Creates all tables defined in SQLModel metadata."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency to yield a database session."""
    with Session(engine) as session:
        yield session

# This block is for initial database setup or testing purposes
if __name__ == "__main__":
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created.")
