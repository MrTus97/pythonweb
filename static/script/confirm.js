$(document).ready(function() {
    $('.rowJapan').hide();
    $('#eligibility').click(function(){
        $('.rowJapan').show();
        //Get trình độ tiếng nhật của user đó
        $.get("/get-user-session", function(data, status){
            if (status == 'success'){
                var obj = JSON.parse(data);
                if (obj.code_level != 0){
                    $('#name_level').text(obj.name_level);
                    $('#total').text(obj.total);   
                    $('#start_date').text(obj.start_date_year + "/" + obj.start_date_month + "/" + obj.start_date_date);
                    $('#end_date').text(obj.end_date_year + "/" + obj.end_date_month + "/" + obj.end_date_date);
                }
            }
        });
    });
    $('#btnback').click(function(){
        window.location = '/create-user'
    });

});