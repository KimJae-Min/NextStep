# create_tables.py
import asyncio
from backend.database import engine, Base

async def run():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(run())
