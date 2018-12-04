
 $(document).ready(function() {
 });
 var deleteUser = function(userId) {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên " + userId + " này không ?")){
        window.location.href = '/delete-user/'+userId;
    }
};
var editUser = function(userId){
    window.location.href = '/edit-user/'+userId;
}
var returnHome = function(){
    window.location = '/';
}
var create_user = function(){
    window.location = '/create-user'
}


