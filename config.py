from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class Config:
    def connect():
        """
        Hàm kết nối tới cơ sở dữ liệu
        Trả về kết nối nếu có
        Trả về False nếu kết nối thất bại
        """
        try:
            engine = create_engine('postgresql+psycopg2://postgres:12345@localhost:5432/FirstDB')
            session = sessionmaker(bind = engine)
            return session()
        except Exception as identifier:
            print(identifier)
            return False
