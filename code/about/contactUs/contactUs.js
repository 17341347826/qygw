/**
 * Created by Administrator on 2017/12/5.
 */
define([
        C.CLF('avalon.js'),
        C.Co("about", "contactUs/contactUs", "css!"),
        C.Co("about", "contactUs/contactUs", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css,html, layer,advice,page_title,notice,amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';

        var avalon_define = function () {
            // avalon.filters.fmtDate_notice = function (a) {
            //     if (a) {
            //         return a.substring(0, 19);
            //     }
            // };

            var vm = avalon.define({
                $id: "contactUs",
                moduleImage: [],
                api: api.api,
                imageTime: 3000,
                seekPhone:function(){
                    // console.log(window.location.host);
                    //页面层
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['420px', '240px'], //宽高
                        content:
                        "<div style='margin-left:30px;'>"+
                        "<h2>我们随时准备为你提供服务</h2>" +
                        "<span style='font-size:news1.2em;margin-top:-20px;display:inline-block'>联系兴唐</span>"+
                        "<div style='font-size:news1.2em;'>" +
                        "<span style='font-size:news1.4em;margin-right:20px;color:#1E4999;' class='am-icon-volume-control-phone'></span>"+
                        '致电兴唐技术'+
                        "</div>"+
                        "<div style='font-size:news1.2em;margin-left:40px;'>" +
                        '400-028-4088'+
                        "</div>"+
                        "</div>"
                    });
                },
                gotoPage: function (el) {if (el.image_link) window.open(el.image_link); },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            case query_module:
                                for (let i = 0; i < data.data.length; i ++) {
                                    data.data[i].image_url = JSON.parse(data.data[i].image_url);
                                }
                                this.moduleImage = data.data;
                                $(function() {
                                    $('.slide').flexslider({
                                        pauseOnAction: false,
                                        maxItems:1,
                                        slideshowSpeed: vm.imageTime,
                                        start: function (slider) {
                                            let body = document.getElementsByTagName("body");
                                            body[0].style.overflowY = 'auto';
                                            console.log(body[0].style.overflowY);
                                        }
                                    });
                                });
                                setTimeout(function () {
                                    body[0].style.overflowY = '';
                                }, 1000);
                                break;
                        }
                    } else {
                        alert(msg);
                    }
                },
            });
            vm.$watch('onReady', function () {
                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C37'}}, this, this.is_check);
                //banner轮播
                if (sessionStorage.getItem("image_time"))
                    this.imageTime = Number(sessionStorage.getItem("image_time")) * 1000;

            });
//             vm.$watch("onReady", function() {
//                 $(function() {
//                     new BaiduMap({
//                         id: "container2",
//                         title: {
//                             text: "成都兴唐技术信息有限公司",
//                             className: "title"
//                         },
//                         content: {
//                             className: "content",
//                             text: ["地址：成都市武侯区长华路19号万科汇智中心", "电话：400-028-4088"]
//                         },
//                         point: {
// //            lng: "116.412222",
// //            lat: "39.912345"
//                             lng:'104.084933',
//                             lat:"30.610675"
//                         },
//                         level: 15,
//                         zoom: true,
//                         type: ["地图", "卫星", "三维"],
//                         width: 320,
//                         height: 70,
//                         icon: {
//                             url: "../../common/img/icon.png",
//                             width: 36,
//                             height: 36
//                         }
//                     });
//                 });
//             })
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
// $(function (){
//     var vm = avalon.define({
//         $id: "contactUs",
//         seekPhone:function(){
//             // console.log(window.location.host);
//             //页面层
//             layer.open({
//                 type: news1,
//                 skin: 'layui-layer-rim', //加上边框
//                 area: ['420px', '240px'], //宽高
//                 content:
//                 "<div style='margin-left:30px;'>"+
//                     "<h2>我们随时准备为你提供服务</h2>" +
//                     "<span style='font-size:news1.2em;margin-top:-20px;display:inline-block'>联系兴唐</span>"+
//                      "<div style='font-size:news1.2em;'>" +
//                         "<span style='font-size:news1.4em;margin-right:20px;color:#1E4999;' class='am-icon-volume-control-phone'></span>"+
//                         '致电兴唐技术'+
//                     "</div>"+
//                     "<div style='font-size:news1.2em;margin-left:40px;'>" +
//                         '400-028-4088'+
//                     "</div>"+
//                 "</div>"
//             });
//         }
//     });
//     //如果你将vm定义在jQuery的ready方法内部,那么avalon的扫描就会失效,需要手动扫描
//     //现在只要传入扫描范围的根节点就行
//     avalon.scan(document.body);
// })