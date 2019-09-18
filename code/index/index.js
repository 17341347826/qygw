/**
 * Created by Administrator on 2017/11/18.
 */
$(function (){
    //视频显示隐藏
    // $("#switch").click(function(){
       // console.log($('#videoPlay'));
        //视频显示
        // $('#videoPlay').css("display",'block');
        //按钮隐藏
        // $("#switch").css("display",'none');
        // $("#vPlay").css('background','none');
        // $('#videoPlay').css("width",'1281px');
        // $('#videoPlay').css("height",'556px');

        // $('#videoPlay').trigger('play');
        // $('#videoPlay').trigger('pause');

        // console.log($('#videoPlay')[0].videoHeight);
        // console.log($('#videoPlay')[0].videoWidth);
    // });
    //点击视频控制暂停和播放
    // $('#videoPlay').trigger("play");//for auto play
    // $('#videoPlay').addClass('pause');//for check pause or play add a class
    $('#videoPlay').click(function() {
        if ($(this).hasClass('pause')) {
            $('#videoPlay').trigger("play");
            $(this).removeClass('pause');
            $(this).addClass('play');
        } else {
            $('#videoPlay').trigger("pause");
            $(this).removeClass('play');
            $(this).addClass('pause');
            //视频显示
            $('#videoPlay').css("display",'none');
            //按钮隐藏
            $("#switch").css("display",'block');
        }
    })


    //导航上浮
    $(document).scroll(function(){
        var scoll_top=$(document).scrollTop();
        console.log(scoll_top);
        if (Math.abs(scoll_top)>0) {
           // 最上面
           $('.header_top').css('display','none');
           //logo
            $('.nav_img').css('background',"url('../../common/img/logoBlue2.png') no-repeat");
           //菜单
           $(".nav").css(
               {
                   'background-color':'white',
                   'color':'black',
                   'position':'fixed',
                   'top':'0px',
                   'margin-top':'0px',
                   'opacity':'.8',
                   'filter':'alpha(opacity=80)',
                   'transition':'all .5s linear',
                   '-webkit-transform':'all .5s linear',
                   '-moz-transform':'all .5s linear',
                   '-ms-transform':'all .5s linear',
                   '-o-transform':'all .5s linear',
           });
           $('.nav a').css('color','#0F61C4');
            //搜索
            $(".search").css('background-color','#ECECED');
        }else{
            $('.header_top').css('display','block');
            //logo
            $('.nav_img').css('background',"url('../../common/img/logo2.png') no-repeat");
            //菜单
            $(".nav").css(
                {
                    'background-color':'transparent',
                    'color':'white',
                    'position':'absolute',
                    'margin-top':'50px',
                    'transition':'all .5s linear',
                    '-webkit-transform':'all .5s linear',
                    '-moz-transform':'all .5s linear',
                    '-ms-transform':'all .5s linear',
                    '-o-transform':'all .5s linear',
                });
            $('.nav a').css('color','white');
        };
    })
});