/**
 * Created by Administrator on 2017/11/22.
 */
$(function (){
    $("#sou").keyup(function(){
        $("#sou_label").css("visibility","hidden");
    });
});
// function inputEvent(){
//     var ip=$("#sou").val();
//     console.log(ip);
//     if(ip!=''){
//         // $("#sou_label").style="visibility:hidden";
//         $("#sou_label").removeClass("show");
//         $("#sou_label").addClass("hide");
//     }else{
//         // $("#sou_label").style="visibility:visible";
//         $("#sou_label").removeClass("hide");
//         $("#sou_label").addClass("show");
//     }
// }
// function labelEvent(){
//     $("#sou").focus();
// }