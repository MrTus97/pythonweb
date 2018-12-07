$(document).ready(function() {
    var d = new Date();
    current_day = d.getDate();
    current_month = d.getMonth() +1;
    current_year = d.getFullYear();
    //Sinh ra ngày tháng năm ở các selector
    function generationYear(selectorYear,minYear,maxYear){
        $(selectorYear).find('option').remove().end();
        for (year = minYear; year < maxYear; year++){
            $(selectorYear).append('<option value="'+year+'">'+ year +'</option>');
        }
        $(selectorYear).append('<option value="'+maxYear+'" selected="selected">'+ maxYear +'</option>');

    }
    function generationMonth(selectorMonth){
        $(selectorMonth).find('option').remove().end();
        for(month = 1; month <= 12; month++){
            if (month.toString() == current_month.toString()){
                $(selectorMonth).append('<option value="'+month+'" selected="selected">'+ month +'</option>');
            }else{
                $(selectorMonth).append('<option value="'+month+'">'+ month +'</option>');
            }
        }
    }
    function generationDate(selectorDate,dateEnd){
        $(selectorDate).find('option').remove().end();
        for(date =1 ;date <= dateEnd ; date++){
            if (date.toString() == current_day.toString()){
                $(selectorDate).append('<option value="'+date+'" selected="selected">'+ date +'</option>');
            }else{
                $(selectorDate).append('<option value="'+date+'">'+ date +'</option>');
            }
        }
    }
    generationYear('#dateOfBirth_year',1900,(new Date()).getFullYear());
    generationMonth('#dateOfBirth_month');
    generationDate('#dateOfBirth_date',31);


    $('#group_id').change(function(){
        $('#groupname').val($( "#group_id option:selected" ).text());
    });
    $('#groupname').val($( "#group_id option:selected" ).text());

    //Click vào trường tiếng nhật
    $('.japan_level').hide();
    

    $('#code_level').change(function(){
        if ($('#code_level').val() != "0"){
            $('#total').prop('required',true);
            $('#name_level').val($( "#code_level option:selected" ).text());
        }else{
            $('#total').prop('required',false);
        }
    });

    
    $('#japan_level').click(function(){
        var user_id = window.location.pathname.substring(13,window.location.pathname.length);
        $.get("/japan", function(data, status){
            if (status == 'success'){
                var obj = JSON.parse(data);
                $('#code_level').find('option').remove().end();
                $('#code_level').append('<option value="0"> 選択してください </option>');
                for (egibility = 0; egibility < obj.length; egibility++){
                    $('#code_level').append('<option value="'+obj[egibility].code_level+'">'+ obj[egibility].name_level +'</option>');
                }
    
                //Sinh ngày tháng năm hết hạn của tiếng nhật
                generationYear('#end_date_year',1900,(new Date()).getFullYear());
                generationMonth('#end_date_month');
                generationDate('#end_date_date',31);
    
                generationYear('#start_date_year',1900,(new Date()).getFullYear());
                generationMonth('#start_date_month');
                generationDate('#start_date_date',31);   
                $('.japan_level').show();
            }
        });
        if (user_id !=""){
            $.get('/get_japan_by_id/'+ user_id, function(data,status){
                if (status == "success"){
                    var obj = JSON.parse(data);
                    $('#total').val(obj.total);
                }else{
                    alert("Đã có lỗi xảy ra khi lấy dữ liệu");
                }
            });
        }


        
    });

    $('#btn-submit').click(function(e){
        e.preventDefault();
        $('form').submit();  
        // $.get("/get_all_login_name", function(data, status){
        //     if (status == 'success'){
        //         var obj = JSON.parse(data);
        //         var user_db = new Array();
        //         var email_db = new Array();
        //         $.each(obj,function(i,item){
        //             user_db.push(item.login_name);
        //             email_db.push(item.email);
        //         });
        //         if (isValid(user_db,email_db)) {
        //             $('form').submit();      
        //         }
        //     }
        // });
        
    });
});

//Bắt validate form
function isValid(user_db,email_db){
    var flag = true;
    $('.errMsg').text("");
    //----------------------------------
    var login_name = $('#idUser').val();
    var group_id =$('#group_id').val();
    var full_name = $('#full_name').val();
    var full_name_kana = $('#full_name_kana').val();
    var email = $('#email').val();
    var tel = $('#tel').val();
    var password = $('#password').val();
    var repassword = $('#repassword').val();
    //birthday
    var birthday_year = $('#dateOfBirth_year').val();
    var birthday_month = $('#dateOfBirth_month').val();
    var birthday_day = $('#dateOfBirth_date').val();

    //japanese
    var code_level = $('#code_level').val();
        //start date
        var start_year = $('#start_date_year').val();
        var start_month = $('#start_date_month').val();
        var start_day = $('#start_date_date').val();
        //end date
        var end_year = $('#end_date_year').val();
        var end_month = $('#end_date_month').val();
        var end_day = $('#end_date_date').val();
    var total = $('#total').val();
    //----------------------------------
    

    
    //----------------------------------
    // Kiểm tra tên đăng nhập
    if (login_name.length < 1){
        //Chưa nhập
        $('.errMsg').append(ER001 + lbl_ten_dang_nhap + "<br/>");
        flag = false;
    }else if (/[^a-zA-Z0-9_İıĞğÇçÖöÜüÖö]/.test(login_name)){
        //Sai định dạng --> chưa bắt được
        $('.errMsg').append(ER019 + "<br/>");
        flag = false;
    }else if (login_name.length < 4 || login_name.length > 15){
        //Sai độ dài
        $('.errMsg').append(lbl_ten_dang_nhap + ER007 + 4 + ER007_1 + 15 + ER007_2 + "<br/>");
        flag = false;
    }else {
        //Bắt trường hợp trùng từ csdl
        for (var i = 0; i < user_db.length; i++){
            if(user_db[i] == login_name){
                $('.errMsg').append(lbl_ten_dang_nhap + ER003 +"<br/>");
                flag = false;
                break;
            }
        }
    }
    //---------------------------------
    // Kiểm tra nhóm
    if (group_id == "0"){
        $('.errMsg').append( ER002+ lbl_nhom +"<br/>");
        flag = false;
    }
    //--------------------------------
    // Kiểm tra full name
    if (full_name.length == 0){
        $('.errMsg').append(ER001 + lbl_ho_va_ten  +"<br/>");
        flag = false;
    }else if (full_name.length > 255){
        $('.errMsg').append(lbl_ho_va_ten + ER006 + 255 + ER006_1 +  +"<br/>");
        flag = false;
    }
    //--------------------------------
    // Kiểm tra kí tự kana
    for (var i = 0; i < full_name_kana.length; i++){
        var kana = full_name_kana.charCodeAt(i);
        //Kiểm tra với unicode
    }
    if (full_name_kana.length > 255){
        $('.errMsg').append(lbl_ho_va_ten_kana + ER006 + 255 + ER006_1 +  +"<br/>");
        flag = false;
    };
    //-------------------------------
    // Kiểm tra ngày sinh
    if (!checkDate(birthday_year,birthday_month,birthday_day)){
        $('.errMsg').append(lbl_ngay_sinh + ER011 +"<br/>");
        flag = false;
    }
    //-------------------------------
    // Kiểm tra email
    if (email.length ==0){
        $('.errMsg').append(ER001 + lbl_email  +"<br/>");
        flag = false;
    }else if (email.length > 100){
        $('.errMsg').append(lbl_email + ER006 + 100 + ER006_1 +  +"<br/>");
        flag = false;
    }else{
        for (var i = 0; i < user_db.length; i++){
            if(email_db[i] == email){
                $('.errMsg').append(lbl_email + ER003 +"<br/>");
                flag = false;
                break;
            }
        }
    }
    //-------------------------------
    // Kiểm tra điện thoại
    if (tel.length ==0){
        $('.errMsg').append(ER001 + lbl_so_dien_thoai  +"<br/>");
        flag = false;
    }else if (tel.length > 14){
        $('.errMsg').append(lbl_so_dien_thoai + ER006 + 14 + ER006_1 +  +"<br/>");
        flag = false;
    }
    //-------------------------------
    // kiểm tra mật khẩu
    if (password.length ==0){
        $('.errMsg').append(ER001 + lbl_mat_khau  +"<br/>");
        flag = false;
    }else if (password.length < 5 || password.length > 15){
        $('.errMsg').append(lbl_mat_khau + ER007 + 5 + ER007_1 + 15 + ER007_2 + "<br/>");
        flag = false;
    }
    //-------------------------------
    // Nhập lại mật khẩu
    if (repassword != password){
        $('.errMsg').append(ER017 + "<br/>");
        flag = false;
    }
    //-------------------------------
    //Phần tiếng nhật nè
    if (!code_level == 0){
        //start date
        if (!checkDate(start_year,start_month,start_day)){
            $('.errMsg').append(lbl_ngay_bat_dau + ER011 +"<br/>");
            flag = false;
        }
        //end date
        if (!checkDate(start_year,start_month,start_day)){
            $('.errMsg').append(lbl_ngay_bat_dau + ER011 +"<br/>");
            flag = false;
        }else if (!isDayAfterGreater(start_year,start_month,start_day,end_year,end_month,end_day)){
            $('.errMsg').append(ER012 +"<br/>");
            flag = false;
        }
        //total
        if (total.length ==0){
            $('.errMsg').append(ER001 + lbl_tong_diem  +"<br/>");
            flag = false;
        }
    }
    return flag;
    
}

function checkDate(year,month,day){
    if (day == 31 && (month ==2 || month == 4 || month == 6 || month == 9 || month == 11)){
        return false;
    }
    
    if (month == 2){
        if (year%4 == 0){
            //Năm nhuận
            if (day >29) return false;
        }else{
            if (day > 28) return false;
        }
    }
    return true;
}
function isDayAfterGreater(y1,m1,d1,y2,m2,d2){
    if (y1 > y2){
        return false;
    }
    if (m1 > m2){
        return false;
    }
    if (d1 >= d2){
        return false;
    }
    return true;
}
