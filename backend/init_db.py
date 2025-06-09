from backend.database import engine, Base
import asyncio

async def init_db():
    async with engine.begin() as conn:
        print("💣 모든 테이블 드랍(초기화) 중...")
        await conn.run_sync(Base.metadata.drop_all)
        print("✅ 테이블 드랍 완료. 새로 생성 중...")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ 테이블 생성 완료.")

if __name__ == "__main__":
    asyncio.run(init_db())
