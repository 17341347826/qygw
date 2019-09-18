/**
 * Created by Administrator on 2017/11/26.
 */
$(function(){
    var timer = '';
    // 列表长度-2
    var len=$("#imgList ul li").length-2;
//            ÿ���ƶ�����
    var left=$("#imgList ul li img").width()+60;
//        console.log(left);
    //当前居中图片的index
    var index_2=0;
//        function slide(){
//            var prev; var next; var hidden;
//            var curr=$("#imgCard"+index_2);//��ǰ������ʾ
//
////           ǰһ��
//            if(index_2==0){								//��ǰ������ʾ���ǵ�0��ʱ prevΪ���һ��
//                prev=$("#imgCard"+(len-news1));
//            }else{												//����  ���к�-news1
//                prev=$("#imgCard"+(index_2-news1));
//            }
////           ��һ��
//            if(index_2==(len-news1)){					//��ǰ������ʾ�������һ��ʱ nextΪ��0��
//                next=$("#imgCard0");
//            }else{											//����  ���к�+news1
//                next=$("#imgCard"+(index_2+news1));
//            }
//        }





    //页面一进来初始化最中间的图的阴影放大
    $("#imgCard0 p").css("width",'300px');
    $("#imgCard0 p").css("height",'430px');

// 点击下一个
    $("#next").click(function(){
        var imgPre=Number($("#imgList").css("margin-left").split('p')[0]);
            // console.log(imgPre);
        if(imgPre<=-1940){
            $("#imgList").css("margin-left",'-40px');
                // 动效移动
//               $("#imgList").animate({
//                   marginLeft:"-20px",
//               },"slow");
        }else{
            var newLeft=imgPre-380;
            $("#imgList").css("margin-left",newLeft+'px');
                // 动效移动
//               $("#imgList").animate({
//                   marginLeft:newLeft+'px'
//               },"slow");
        }
        // 判断当前图片是否放大
        if(index_2==(len-1)){
            $("#imgCard"+index_2).removeClass("big");
            $("#imgCard0").addClass("big");
            //p标签操作
            $("#imgCard"+index_2+" p").css("width",'300px');
            $("#imgCard"+index_2+" p").css("height",'80px');
            $("#imgCard0 p").css("width",'300px');
            $("#imgCard0 p").css("height",'430px');
            index_2=0;
        }else{
            $("#imgCard"+(index_2)).removeClass("big");
            $("#imgCard"+(index_2+1)).addClass("big");
            //p标签操作
            $("#imgCard"+(index_2)+" p").css("width",'300px');
            $("#imgCard"+(index_2)+" p").css("height",'80px');
            $("#imgCard"+(index_2+1)+" p").css("width",'300px');
            $("#imgCard"+(index_2+1)+" p").css("height",'430px');
            index_2=index_2+1;
        }
//           console.log(index_2);
    });
    // 点击上一页
    $("#pre").click(function(){
        var imgPre=Number($("#imgList").css("margin-left").split('p')[0]);
//            console.log(imgPre);
        if(imgPre>=-40){
            $("#imgList").css("margin-left",'-1940px');
        }else{
            var newLeft=imgPre+380;
            $("#imgList").css("margin-left",newLeft+'px');
//               $("#imgList").animate({
//                   marginLeft:newLeft+'px'
//               },"slow");
        }
        // 判断当前图片是否放大
        if(index_2==0){
            $("#imgCard"+index_2).removeClass("big");
            $("#imgCard"+(len-1)).addClass("big");
            //p标签操作
            $("#imgCard"+index_2+" p").css("width",'300px');
            $("#imgCard"+index_2+" p").css("height",'80px');
            $("#imgCard"+(len-1)+" p").css("width",'300px');
            $("#imgCard"+(len-1)+" p").css("height",'430px');
            index_2=len-1;
        }else{
            $("#imgCard" +index_2).removeClass("big");
            $("#imgCard"+(index_2-1)).addClass("big");
            //p标签操作
            $("#imgCard"+index_2+" p").css("width",'300px');
            $("#imgCard"+index_2+" p").css("height",'80px');
            $("#imgCard"+(index_2-1)+" p").css("width",'300px');
            $("#imgCard"+(index_2-1)+" p").css("height",'430px');
            index_2=index_2-1;
        }
        console.log(index_2);
    });
    // //自动轮播
    // timer = setInterval(function(){
    //     $("#next").click();
    // },4000);
    // //清除自动轮播
    // $("body").mouseleave(function(){
    //     clearInterval(timer);
    // });
    // //添加自动轮播
    // $("body").mouseenter(function(){
    //     timer = setInterval(function(){
    //         $(".next").click();
    //     },4000)
    // });

});