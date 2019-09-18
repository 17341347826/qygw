/**
 * Created by Administrator on 2017/12/11.
 */
define([
        C.CLF('avalon.js'),
        C.CM("header", "html!"),
        C.CM("header", "css!"),
        C.CMF("data_center.js")
    ],
    function (avalon,html, css,data_center) {
        var loginOut = api.api + "official_website/user/logout";
        // 产品查询接口
        var queryAllProduct = api.api + 'official_website/product/list_all_product_info';
        var detail = avalon.component('ms-ele-header', {
            template: html,

            defaults: {
                //上浮状态
                token: "",
                productInfoList: [],
                scoll_type:false,
                //0、没有  news1、首页 2、动态 3、产品 4、服务 5、案例 6、关于
                user_type:0,
                secStatus:0,
                //新闻
                slideshowEnter:function(){
                    this.secStatus=1;
                },
                dynamicEnter:function(){
                    this.secStatus=2;
                },
                //产品
                productEnter:function(){
                    this.secStatus=3;
                },
                //服务
                serviceEnter:function(){
                    this.secStatus=4;
                },
                //关于
                aboutEnter:function(){
                    this.secStatus=6;
                },
                investment: function(){
                    this.secStatus=7;
                },
                //离开
                menuLeaver:function(){
                    this.secStatus=0;
                },
                onOutLogin:function(){
                    ajax_post(loginOut,{},this, this.is_check);
                },
                onProductPage: function (el) {
                    sessionStorage.setItem('product_id', el.id);
                    sessionStorage.setItem('goto_product', '1');
                    window.location.hash = '#product';
                    history.go(0);
                },
                onPageChange: function (url) {
                    window.location.hash = url;
                    if (this.token) history.go(0);
                },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    let self = this;
                    if (is_suc) {
                        switch (cmd) {
                            case loginOut:
                                window.sessionStorage.removeItem('user_type');
                                window.sessionStorage.removeItem('token');
                                window.location = "/front/login.html";
                                break;
                            case queryAllProduct:
                                self.productInfoList = data.data;
                                sessionStorage.setItem("product_list", JSON.stringify(self.productInfoList));
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
                // menuEnter:function () {
                //    if(this.scoll_type){
                //        //    二级菜单
                //        $('.nav #menu').css('background-color', '#0F61C4');
                //        $('.nav #menu span a').css('color','white');
                //    }
                // },
                menu_color:function(){
                    if($(document).scrollTop()>0){
                       //二级菜单
                       $('.nav #menu').css('background-color', '#0F61C4');
                       $('.nav #menu span a').css('color','white');

                    }
                },
                onReady: function() {
                    this.user_type = Number(window.sessionStorage.getItem("user_type"));
                    let product_list = sessionStorage.getItem("product_list");
                    if (this.user_type != '1') {
                        if (JSON.parse(product_list) && JSON.parse(product_list).length > 0) {
                            this.productInfoList = JSON.parse(product_list);
                        } else {
                            ajax_post(queryAllProduct, {status: '1'}, this, this.is_check);
                        }
                    } else {
                        ajax_post(queryAllProduct, {status: '1'}, this, this.is_check);
                    }

                    this.token = window.sessionStorage.getItem("token");
                    // data_center.set_key('top',0);
                    var self=this;
                    //   导航上浮
                    $(document).scroll(function(){
                        var scoll_top=$(document).scrollTop();
                        //导航上浮菜单变化
                        if (Math.abs(scoll_top)>0) {
                            // self.scoll_type=true;
                            // 最上面
                            $('.header_top').css('display','none');
                            //logo
                            $('.nav_img').css({
                                'width':'100px',
                                'height':'86px',
                                'background':"url('../../common/img/logoBlue2.png') no-repeat",
                                'background-size':'100%'
                            });
                            //菜单
                            $(".nav").css(
                                {
                                    'background-color':'white',
                                    'color':'black',
                                    'position':'fixed',
                                    'top':'0px',
                                    'margin-top':'0px',
                                    // 'opacity':'.9',
                                    // 'filter':'alpha(opacity=90)',
                                    'transition':'all .5s linear',
                                    '-webkit-transform':'all .5s linear',
                                    '-moz-transform':'all .5s linear',
                                    '-ms-transform':'all .5s linear',
                                    '-o-transform':'all .5s linear',
                                });
                            $('.nav .nav_left a').css('color','#0F61C4');
                            //搜索
                            $(".search").css('background-color','#ECECED');
                        //    二级菜单
                            $('.nav #menu').css('background-color', '#0F61C4');
                            $('.nav #menu span a').css('color','white');
                        }else{
                            $('.nav #menu').css('background-color', 'rgba(255,255,255,0.3)');
                            $('.header_top').css('display','block');
                            //logo
                            $('.nav_img').css({
                                'width':'100px',
                                'height':'86px',
                                'background':"url('../../common/img/logo2.png') no-repeat",
                                'background-size':'100%'
                            });
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
                            $('.nav .nav_left a').css('color','white');
                            //搜索
                            $(".nav .nav_left span .search").css('background-color','#fff');
                        }
                    });
                    setInterval(function(){
                        self.menu_color();
                    },0);
                }
            },

        })
    });
