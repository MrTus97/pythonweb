$(document).ready(function() {
    $('.rowJapan').hide();
    $('#eligibility').click(function(){
        $('.rowJapan').show();
        //Get trình độ tiếng nhật của user đó
        $.get("/get-user-session", function(data, status){
            if (status == 'success'){
                var obj = JSON.parse(data);
                $('#code_name').text(obj.kyu_name);
                if (obj.kyu_name !=""){
                    $('#total').text(obj.total);
                    $('#start_date').text(obj.qualification_year + "/" + obj.qualification_month + "/" + obj.qualification_day);
                    $('#end_date').text(obj.expire_year + "/" + obj.expire_month + "/" + obj.expire_day);
                }
            }
        });
    });
    $('#btnback').click(function(){
        window.location = '/create-user'
    });

});