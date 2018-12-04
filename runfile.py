from flask import Flask, render_template, request, redirect, url_for, flash,Response,session
from sqlalchemy import Column, Integer, String, ForeignKey, Date, or_,and_
import jinja2
import os
from flask_sqlalchemy import SQLAlchemy 
import flask_admin as admin
from flask_admin.contrib.sqla import ModelView
from sqlalchemy.orm import relationship
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
import datetime
import json
from urllib import parse
# my import
from config import Config

app = Flask(__name__)
# config app
app.config["DEBUG"] = True
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'

# flask-login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# Create dummy secret key so we can use sessions
app.config['SECRET_KEY'] = '123456790'

# Create in-memory database
app.config['DATABASE_FILE'] = 'sample_db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:12345@localhost:5432/FirstDB'
app.config['SQLALCHEMY_ECHO'] = True

# implement direction mock
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir))

# Initial db
db = SQLAlchemy(app)

import model
class GroupModelView():
    def get_all_group():
        conn = Config.connect()
        groups = conn.query(model.mst_group).all()
        conn.close()
        return groups

class UserModelView():
    @app.route('/create-user',methods =['GET','POST'])
    @login_required
    def create_user():
        if request.method == 'POST':
            # Lấy tất cả thông tin ở form lưu vào session
            session["user"] = request.form
            # Chuyển sang màn hình confirm
            return redirect(url_for('confirm'))

        else:
            user = session["user"] if "user" in session else None
            return render_template('ADM003.html', groups=GroupModelView.get_all_group(),user=user)
        
    @app.route('/read-user/<user_id>',methods = ['GET','POST'])
    @login_required
    def read_user(user_id):
        if request.method == 'POST':
            return redirect(url_for('update_user',user_id=user_id))
        else:
            conn = Config.connect()
            user = Common.get_user_view_detail_by_id(user_id)
            conn.close()
            return render_template('ADM005.html',user= user)

    @app.route('/update-user/<user_id>',methods = ['GET','POST'])
    @login_required
    def update_user(user_id):
        if request.method == 'POST':
            pass
        else:
            conn = Config.connect()
            user = Common.get_user_view_detail_by_id(user_id)
            conn.close()
            return render_template('ADM003.html', user = user)

    @app.route('/delete-user/<user_id>')
    @login_required
    def delete_user(user_id):
        try:
            conn = Config.connect()
            user = conn.query(model.tbl_user).filter(model.tbl_user.id == user_id).first()
            conn.delete(user)
            conn.commit()
            conn.close()
            return redirect(url_for('success', message = "Xóa thành công"))
        except Exception as identifier:
            return redirect(url_for('error',errors = identifier))

    @app.route('/get-user-session')
    @login_required
    def user_session():
        user = session["user"]
        return json.dumps(user)
    
class JapanModelView():
    @app.route('/japan')
    def get_all_japan():
        
        conn = Config.connect()
        japans = conn.query(model.mst_japan).all()
        xx = [{'code_level': r.code_level,'name_level': r.name_level} for r in japans]
        conn.close()
        return json.dumps(xx)

class Common():
    def get_all_field_all_user():
        '''
        Lấy tất cả các cột của các bảng từ id cho tới text
        '''
        conn = Config.connect()

        users = conn.query(
            model.tbl_user,
            model.tbl_detail_user_japan,
            model.mst_group,
            model.mst_japan
        ).join(
            model.mst_group
        ).outerjoin(
            model.tbl_detail_user_japan
        ).outerjoin(
            model.mst_japan
        ).filter(
            or_(model.tbl_detail_user_japan.detail_user_japan_id == None, model.tbl_detail_user_japan.user_id == model.tbl_user.id)
        ).all()
        return users

    def get_all_field_one_user(user_id):
        '''
        Lấy tất cả các cột của các bảng từ id cho tới text
        '''
        conn = Config.connect()

        users = conn.query(
            model.tbl_user,
            model.tbl_detail_user_japan,
            model.mst_group,
            model.mst_japan
        ).join(
            model.mst_group
        ).outerjoin(
            model.tbl_detail_user_japan
        ).outerjoin(
            model.mst_japan
        ).filter(
            or_(model.tbl_detail_user_japan.detail_user_japan_id == None, 
                model.tbl_detail_user_japan.user_id == model.tbl_user.id)
        ).filter(
            model.tbl_user.id == user_id
        ).first()
        return users



    def get_user_by_id(user_id):
        """
        Lấy thông tin của 1 user bằng id
        """
        conn = Config.connect()
        user = conn.query(model.tbl_user).filter(model.tbl_user.id == user_id).first()
        conn.close()
        return user

    @app.route('/get_japan_by_id/<user_id>')
    @login_required
    def get_japan_by_id(user_id):
        """
        Lấy thông tin trình độ tiếng nhật bằng id
        Thông tin:
        - Tên trình độ (name_level)
        - Ngày bắt đầu (start_date)
        - Ngày kết thúc (end_date)
        - Điểm (total)
        """
        conn = Config.connect()

        japan = conn.query(
            model.tbl_detail_user_japan,
            model.mst_japan
        ).join(
            model.tbl_detail_user_japan.japan
        ).filter(
            model.tbl_detail_user_japan.user_id == user_id
        ).first()
        xx = {}
        if japan is not None:
            xx = {
                'name_level' : japan.mst_japan.name_level,
                'start_date': str(japan.tbl_detail_user_japan.start_date),
                'end_date': str(japan.tbl_detail_user_japan.end_date),
                'total': japan.tbl_detail_user_japan.total
            }
            conn.close()
        return json.dumps(xx)

    def get_all_user_view_detail():
        '''
        Lấy toàn bộ thông tin nhân viên để hiển thị lên màn hình chính (ADM0002.html)
        '''
        
        conn = Config.connect()
        users = conn.query(
            model.tbl_user.id,
            model.tbl_user.full_name,
            model.tbl_user.birthday,
            model.mst_group.group_name,
            model.tbl_user.email,
            model.tbl_user.tel,
            model.mst_japan.name_level,
            model.tbl_detail_user_japan.end_date,
            model.tbl_detail_user_japan.total
        ).join(
            model.mst_group
        ).outerjoin(
            model.tbl_detail_user_japan
        ).outerjoin(
            model.mst_japan
        ).filter(
            or_(model.tbl_detail_user_japan.detail_user_japan_id == None, model.tbl_detail_user_japan.user_id == model.tbl_user.id)
        )
        return users

    def get_all_user_view_detail_follow_condition(group_id, name):
        '''
        Lấy toàn bộ thông tin nhân viên theo điều kiện để hiển thị lên màn hình chính (ADM0002.html)
        '''
        conn = Config.connect()
        conn = Config.connect()
        users = conn.query(
            model.tbl_user.id,
            model.tbl_user.full_name,
            model.tbl_user.birthday,
            model.mst_group.group_name,
            model.tbl_user.email,
            model.tbl_user.tel,
            model.mst_japan.name_level,
            model.tbl_detail_user_japan.end_date,
            model.tbl_detail_user_japan.total
        ).join(
            model.mst_group
        ).outerjoin(
            model.tbl_detail_user_japan
        ).outerjoin(
            model.mst_japan
        ).filter(
            or_(model.tbl_detail_user_japan.detail_user_japan_id == None,
                model.tbl_detail_user_japan.user_id == model.tbl_user.id
            )
        ).filter(
            and_(model.tbl_user.group_id == group_id,
                model.tbl_user.full_name.contains(name)
            )
        ).all()
        return users

    def get_user_view_detail_by_id(user_id):
        '''
        Lấy thông tin của user theo id(không bao gồm trình độ tiếng nhật) 
        '''
        conn = Config.connect()

        user = conn.query(
            model.tbl_user.id,
            model.tbl_user.login_name,
            model.tbl_user.group_id,
            model.tbl_user.password,
            model.mst_group.group_name,
            model.tbl_user.full_name,
            model.tbl_user.full_name_kana,
            model.tbl_user.birthday,
            model.tbl_user.email,
            model.tbl_user.tel,
        ).join(
            model.mst_group
        ).filter(
            model.tbl_user.id == user_id
        ).first()
        return user

    @app.route('/', methods = ['GET','POST'])
    @app.route('/home', methods = ['GET','POST'])
    @login_required
    def index():
        groups = GroupModelView.get_all_group()
        if request.method == 'POST':
            # Điều kiện group
            condition_group = request.form['group_id']

            # Điều kiện tên
            condition_name = request.form['name']

            conn = Config.connect()
            return render_template(
                'ADM002.html',
                groups = groups,
                users = Common.get_all_user_view_detail_follow_condition(condition_group,condition_name)
            )
        else:
            return render_template(
                'ADM002.html', 
                groups = groups,
                users = Common.get_all_user_view_detail()
            )

    @login_manager.user_loader
    def load_user(user_id):
        '''
        Tạo ra user từ user id để user này sử dụng web
        '''
        user = model.tbl_user()
        user.user_id = user_id
        return user

    @app.route("/logout")
    @login_required
    def logout():
        session['user']= None
        logout_user()
        return redirect(url_for('login'))

    @app.route('/login',methods = ['GET','POST'])
    def login():
        if request.method == 'POST':
            # Lấy user và mật khẩu từ request
            user_name = request.form['loginId']
            password = request.form['password']
            # Check user
            conn = Config.connect()
            user = conn.query(model.tbl_user).filter(model.tbl_user.login_name == user_name).filter(model.tbl_user.password == password).first()
            if user is not None:
                login_user(user)
                return redirect(request.args.get("next") or '/')
            flash("アカウント名およびパスワードを入力してくださいは不正です。", 'loginFailure')
            return redirect('/login')
        else:
            return render_template('ADM001.html')

    @app.before_request
    def make_session_permanent():
        '''
        Set thời gian time out session
        '''
        session.permanent = True
        app.permanent_session_lifetime = datetime.timedelta(minutes=5)

    @app.route('/success')
    def success():
        message = request.args.get("message", None)
        return render_template('ADM006.html', message = message)

    @app.route('/error')
    def error():
        message = request.args.get("errors", None)
        return render_template('System_Error.html', errors = message)

    @app.route('/confirm',methods = ['GET','POST'])
    def confirm():
        # Lấy user từ session
        user = session["user"]
        if request.method == 'POST':
            try:
                userdb = model.tbl_user()
                userdb.login_name = user['id']
                userdb.group_id = user['group_id']
                userdb.full_name = user['name']
                userdb.full_name_kana = user['namekata']
                userdb.email = user['email']
                userdb.tel = user['tel']
                userdb.password = user['password']
                birthday = user['dateOfBirth_year'] + "/" + user['dateOfBirth_month'] + "/" +user['dateOfBirth_date']
                userdb.birthday = birthday
                datetime.datetime
                conn = Config.connect()
                conn.add(userdb)
                
                if user.code_level !="0":
                    japan_detail = model.tbl_detail_user_japan()
                    japan_detail.user_id = userdb.id
                    japan_detail.code_level = usser['code_level']
                
                
                conn.commit()
                conn.close()
                return redirect(url_for('success',message="Insert Thành công"))
            except Exception as identifier:
                return redirect(url_for('error',errors=identifier))
        else:
            return render_template('ADM004.html',user = user)

if __name__ == "__main__":
    # Create db
    db.create_all()

    # start app
    app.run(debug=True)
