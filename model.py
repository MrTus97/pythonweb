from runfile import db
from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user

class mst_japan(db.Model):
    __tablename__ = "mst_japan"
    code_level = Column('code_level', String, primary_key=True)
    name_level = Column('name_level', String (255),nullable=False)


class mst_group(db.Model):
    __tablename__ = "mst_group"
    group_id = Column('group_id', Integer, primary_key=True)
    group_name = Column('group_name',String(255))


class tbl_user(db.Model, UserMixin):
    __tablename__='tbl_user'
    id = Column('user_id',Integer,primary_key=True)
    group_id = Column('group_id',Integer, ForeignKey('mst_group.group_id'),nullable = False)
    login_name = Column('login_name',String(15),nullable= False)
    password = Column('password',String(50),nullable= False)
    full_name = Column('full_name',String(255),nullable= False)
    full_name_kana =Column('full_name_kana',String(255),nullable= False)
    email = Column('email',String(255),nullable= False)
    tel = Column('tel',String(15),nullable= False)
    birthday = Column('birthday',Date,nullable= False)
    mst_group = relationship(mst_group)

    @property
    def group_name(self):
        
        from config import Config
        session = Config.connect()
        Groups = mst_group
        
        group =  session.query(Groups).filter(
            Groups.group_id == self.group_id
        )
        return group.group_name if group else None

class tbl_detail_user_japan(db.Model):
    __tablename__ = 'tbl_detail_user_japan'
    detail_user_japan_id = Column('detail_user_japan_id', Integer, primary_key=True)
    user_id = Column('user_id',Integer, ForeignKey('tbl_user.user_id'), nullable = False)
    code_level = Column('code_level',String(15),ForeignKey('mst_japan.code_level'), nullable = False)
    start_date = Column('start_date',Date,nullable=False)
    end_date = Column('end_date',Date,nullable=False)
    total = Column('total',Integer,nullable=False)
    user = relationship(tbl_user)
    japan = relationship(mst_japan)

