/**
 * Created by Administrator on 2017/12/20.
 */
define([
        C.CLF('avalon.js'),
        C.CM("advice", "css!"),
        C.CM("advice", "html!"),
        "layer"
    ],
    function (avalon, css,html,layer) {
        var detail = avalon.component('ms-ele-advice', {
            template: html,
            defaults: {
                show_index: -1,
                mouse_in: function (x) {
                    this.show_index = x;
                }
                // seekPhone:function(){
                //     // 页面层
                //     layer.open({
                //         type: news1,
                //         // skin: 'layui-layer-rim', //加上边框
                //         skin: 'demo-class',//自定义样式demo-class
                //         area: ['420px', '240px'], //宽高
                //         content:
                //         "<div style='margin-left:30px;'>"+
                //         "<h2>我们随时准备为你提供服务</h2>" +
                //         "<span style='font-size:news1.2em;margin-top:-20px;display:inline-block'>联系兴唐</span>"+
                //         "<div style='font-size:news1.2em;'>" +
                //         "<span style='font-size:news1.4em;margin-right:20px;color:#1E4999;' class='am-icon-volume-control-phone'></span>"+
                //         '致电兴唐技术'+
                //         "</div>"+
                //         "<div style='font-size:news1.2em;margin-left:40px;'>" +
                //         '400-028-4088'+
                //         "</div>"+
                //         "</div>"
                //     });
                // },
                // onReady: function () {
                //     this.seekPhone();
                // }
            }
        })
    })
