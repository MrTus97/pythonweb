
$(document).ready(function() {
    
});
function isValidate(){
    userName = $('#username').val();
    password = $('#password').val();
    if (userName== "" || userName.length < 1){
        alert("Tên đăng nhập sai định dạng");
        return false;
    }else if (password ="" || password.length < 1){
        alert("Mật khẩu sai định dạng");
        return false;
    }
    return true;
}

