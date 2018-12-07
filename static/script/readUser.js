
$(document).ready(function() {
    $('.eligibility').hide();
    $('#eligibility').click(function(){
        $('.eligibility').show();

        //Lấy trình độ tiếng nhật
        var user_id = window.location.pathname.substring(11,window.location.pathname.length);
        $.get("/get_japan_by_id/"+user_id, function(data,status){
            if (status == 'success'){
                var obj = JSON.parse(data);
                $('#name_level').text(obj.name_level);
                $('#start_date').text(obj.start_date);
                $('#end_date').text(obj.end_date);
                $('#total').text(obj.total);

            }else{
                alert("not ok");
            }
        });
    });


    $('#btn-delete-user').click(function(){
        var user_id = window.location.pathname.substring(11,window.location.pathname.length);
        if (window.confirm("Bạn có chắc muốn xóa nhân viên " + user_id + " này không ?")){
            window.location = '/delete-user/'+userId;
        }
    });
});


