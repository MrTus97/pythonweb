$(document).ready(function() {

    //Sinh ra ngày tháng năm ở các selector
    function generationYear(selectorYear,minYear,maxYear){
        $(selectorYear).find('option').remove().end();
        for (year = minYear; year < maxYear; year++){
            $(selectorYear).append('<option value="'+year+'">'+ year +'</option>');
        }
    }
    function generationMonth(selectorMonth){
        $(selectorMonth).find('option').remove().end();
        for(month = 1; month <= 12; month++){
            $(selectorMonth).append('<option value="'+month+'">'+ month +'</option>');
        }
    }
    function generationDate(selectorDate,dateEnd){
        $(selectorDate).find('option').remove().end();
        for(date =1 ;date <= dateEnd ; date++){
            $(selectorDate).append('<option value="'+date+'">'+ date +'</option>');
        }
    }
    generationYear('#dateOfBirth_year',1900,(new Date()).getFullYear());
    generationMonth('#dateOfBirth_month');
    generationDate('#dateOfBirth_date',31);

   
    

    function customDate(yearSelector,monthSelector,dateSelector){
        //Xóa hết tất cả các ngày
        $(dateSelector).find('option').remove().end();
        yearSelect = $(yearSelector).val();
        monthSelect = $(monthSelector).val();
        if (monthSelect == 2){
            if (yearSelect % 4 == 0){
                generationDate(dateSelector,29);
            }else{
                generationDate(dateSelector,28);
            }
            
        }else if (monthSelect == 4 || monthSelect == 6 || monthSelect == 9 || monthSelect == 11 ){
            generationDate(dateSelector,30);
        }else{
            generationDate(dateSelector,31);
        }
    }

    $('#group_id').change(function(){
        $('#groupname').val($( "#group_id option:selected" ).text());
    });
    $('#groupname').val($( "#group_id option:selected" ).text());

    // Bắt validate các err Message trong form
    var xxx = function(input){
        if (input.value.length < 1){
            input.setCustomValidity('Chưa nhập 1');
        }else{
            input.setCustomValidity('"' + input.value + '" is not a feeling.');
        }   
    }

    //Click vào trường tiếng nhật
    $('.japan_level').hide();
    

    // $('#kyu_id').change(function(){
    //     if ($('#kyu_id').val() != "0"){
    //         $('#total').prop('required',true);
    //         $('#kyu_name').val($( "#kyu_id option:selected" ).text());
    //     }else{
    //         $('#total').prop('required',false);
    //     }
    // });

    function iaaSsValidateForm(){
        password = $('#password').val();
        repassword = $('#repassword').val();
        if (password != repassword){
            alert('Re-password does not correct');
            return false;
        }
        return true;
    }
    
    $('#japan_level').click(function(){
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
    });
});

