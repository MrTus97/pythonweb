$(document).ready(function() {
    $('#btnLogin').click(function(e) {
        e.preventDefault();
        if (isValidate()) {
            $('form').submit();      
        }
    });
});

function isValidate(){
    $('.errMsg').text("");
    userName = $('#username').val();
    password = $('#password').val();
    var flag = true;
    if (userName== "" || userName.length < 1){
        $('.errMsg').append(ER001 + lbl_ten_dang_nhap );
        $('.errMsg').append("<br/>");
        flag = false;
    }
    if (password ="" || password.length < 1){
        $('.errMsg').append(ER001 + lbl_mat_khau);
        flag = false;
    }
    return flag;
}




