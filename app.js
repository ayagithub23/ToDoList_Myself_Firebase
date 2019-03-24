$("#login").on("click",function(){
    auth.signInWithPopup(googleProvider);
    // index > firebase > index > dashboard
    // signInWithRedirect
});
$("#logout").on("click",function(){
    auth.signOut();
});
auth.onAuthStateChanged(function(user){
    if(user){
        location.href = "dashboard.html";
    }else{
        console.log("登出中");
        $("body").css("display","unset");
    }
});