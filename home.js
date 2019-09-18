/**
 * Created by Administrator on 2017/12/11.
 */
define([
        C.CLF('avalon.js'),
        C.CBF('front/home', 'css!'),
        C.CBF('front/home', 'html!'),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui"
    ],
    function (avalon, css,html, layer, advice,page_title,notice,amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';
        // 查询设置
        var query_image_time = api.api+'official_website/option/get_option_info_by_option_name';
        // 热门新闻
        var hot_news = api.api + 'official_website/news/list_all_news_info';
        // 推荐新闻
        var recommend_news = api.api + 'official_website/news/list_all_news_info';
        // 产品查询接口
        var queryAllProduct = api.api + 'official_website/product/list_all_product_info';

        var avalon_define = function () {
            var vm = avalon.define({
                $id: "home",
                hotNewsInfo: "",
                imageTime: 3000, // 轮播图时间
                recommendNewsInfo: [],
                productThreeList: [],
                allProductList: [],
                moduleImage: [],
                api: api.api,
                newsList: [],
                imgList: '',
                indexOne: 0,
                token: '',
                userType: '',
                //三屏轮播p内容改变:0:显示少的 news1：教育质量综合评价 2：ISR只能高速图像扫描阅读机 3：OMR光标阅读机
                //4：网上阅卷系统
                p_type:-1,
                //进入视频
                video_click:function () {
                    //按钮隐藏
                    $("#switch").css("display",'none');
                    //视频显示
                    $('#videoPlay').css("display",'block');
                    //视频自动播放
                    // $('#videoPlay').addClass('play');
                },
                //视频播放暂停
                video_play:function(){

                    if ($('#videoPlay').hasClass('pause')) {
                        $('#videoPlay').removeClass('pause');
                        $('#videoPlay').addClass('play');
                        $('#videoPlay').trigger("play");
                        $('#videoPlay').css("display",'block');
                        $("#switch").css("display",'none');
                    } else {
                        $('#videoPlay').removeClass('play');
                        $('#videoPlay').addClass('pause');
                        $('#videoPlay').trigger("pause");
                        $('#videoPlay').css("display",'none');
                        //按钮隐藏
                        $("#switch").css("display",'block');
                    }
                },
               // 鼠标悬停事件
                li_hover:function(a){
                    this.p_type=Number(a.substr(8,1));
                    //整体
                    $(a).addClass("big");
                    //学唐云logo
                    $(a+">span").css({
                        'margin-top':'70px'
                    });
                    $(a+" button").css({
                        'margin-top':'160px',
                        'width': '130px',
                        'height': '35px',
                        'border-radius': '5px',
                        'border': '1px #FF8421 solid',
                        'background-color': '#FF8421',
                        'text-align': 'center',
                        'z-index': '10000',
                        'box-shadow': '0px 0px 10px #FF8421'
                    });
                    //内容p标签操作
                    $(a+" p").css({
                        "width":'300px',
                        "height":'430px',
                        'padding-top':'148px',
                    });
                    $(a+" p>span").css({
                        'margin-top':'38px'
                    });
                },
                //鼠标移开事件
                li_leave:function(b){
                    this.p_type= -1;
                    //整体
                    $(b).removeClass("big");
                    //学唐云logo
                    $(b+">span").css({
                        'margin-top':'35%'
                    });
                    //内容p标签操作
                    $(b+" p").css({
                        "width":'300px',
                        "height":'80px',
                        'padding-top':'0px'
                    });
                    $(b+" p span").css({
                        'margin-top':'0px'
                    });
                },
                onGotoProductLogin:function (el) {
                    // console.log(el.fast_login_addr.slice(0, 6));
                    if (el.fast_login_addr.slice(0, 6) !== 'http://') {
                        window.open('http://' + el.fast_login_addr);
                        return;
                    }
                    window.open(el.fast_login_addr);
                },
                //页面跳转
                page_turn:function(el){
                    window.location='#product';
                    sessionStorage.setItem('product_id', el.id);
                },
                //判断是否点击快速登录
                a_click:false,
                //快速登录跳转
                a_turn:function(){
                    this.a_click=true;
                    //打开新窗口
                    window.open("http://www.xtyun.net");
                },
                // 点击新闻
                newsMoreDetails: function (new_id) {
                    sessionStorage.removeItem('new_id');
                    sessionStorage.setItem('new_id', new_id);
                    window.location='#news1';
                },
                pageGoto: function () {
                    let x = sessionStorage.getItem("goto");
                    let height = this.getClientHeight();
                    height = Number(height) / 2;
                    // console.log(height);
                    if (x) {
                        $("html, body").animate({
                            scrollTop: $(x).offset().top + height + 'px' }, {duration: 500,easing: "swing"});
                    }
                    sessionStorage.removeItem("goto");
                },
                getClientHeight: function () {
                    let clientHeight = 0;
                    if (document.body.clientHeight && document.documentElement.clientHeight) {
                        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    }
                    else {
                        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    }
                    return clientHeight;
                },
                gotoPage: function (el) {if (el.image_link) window.open(el.image_link); },
                on_request_complete: function (cmd, status, data, is_suc, msg, is_check) {
                    if (is_suc) {
                        switch (is_check) {
                            case 'query_image_time':
                                sessionStorage.setItem("image_time", data.data.option_content);
                                if (data.data.option_content) this.imageTime = Number(data.data.option_content) * 1000;

                                break;
                            case 'query_module':
                                for (let i = 0; i < data.data.length; i ++) {
                                    data.data[i].image_url = JSON.parse(data.data[i].image_url);
                                }
                                this.moduleImage = data.data;
                                //banner轮播
                                $(function() {
                                    // console.log(vm.imageTime)
                                    $('.am-slider').flexslider({
                                        pauseOnAction: false,
                                        maxItems:1,
                                        slideshowSpeed: vm.imageTime,
                                        // options
                                    });
                                    //    三屏轮播
                                    var timer = '';
                                    // 列表长度-2
                                    var len=$("#imgList ul li").length-2;
                                    var left=$("#imgList ul li img").width()+60;

                                    //当前居中图片的index
                                    var index_2=0;

                                    // 点击下一个
                                    // $("#next").click(function(){
                                    // var imgPre=Number($("#imgList").css("margin-left").split('p')[0]);
                                    // if(imgPre<=-1180){
                                    //     $("#imgList").css({
                                    //         "margin-left":'-40px',
                                    //     });
                                    // }else{
                                    //     var newLeft=imgPre-380;
                                    //     $("#imgList").css({
                                    //         "margin-left":newLeft+'px',
                                    //     });
                                    // }
                                    // });
                                    // 点击上一页
                                    // $("#pre").click(function(){
                                    // var imgPre=Number($("#imgList").css("margin-left").split('p')[0]);
                                    // if(imgPre>=-40){
                                    //     $("#imgList").css({
                                    //         "margin-left":'-1180px',
                                    // });
                                    // }else{
                                    //     var newLeft=imgPre+380;
                                    //     $("#imgList").css({
                                    //         "margin-left":newLeft+'px',
                                    //     });
                                    // }
                                    // });
                                    //自动轮播
                                    // timer = setInterval(function(){
                                    //     $("#next").click();
                                    // },2000);
                                    //自动轮播
                                    // timer = setInterval(function(){
                                    //     $("#next").click();
                                    // },4000);
                                    // //刷新页面清除自动轮播
                                    // window.onbeforeunload = function (e) {
                                    //     e = e || window.event;
                                    //     // For IE and Firefox prior to version 4
                                    //     if (e) {
                                    //         clearInterval(timer);
                                    //     }
                                    //     // clearInterval(self.timer);
                                    // };
                                    // //页面跳转清除自动轮播
                                    // $('#content_body').bind('DOMNodeInserted', function(e) {
                                    //     clearInterval(timer);
                                    // });
                                });
                                break;
                            case 'hot_news':
                                this.hotNewsInfo = data.data;
                                if (this.hotNewsInfo[0] && this.hotNewsInfo[0].news_content != '') {
                                    document.getElementById("hot_new_img").innerHTML = this.hotNewsInfo[0].news_content;
                                    if (document.getElementById("hot_new_img").getElementsByTagName("img")[0]) {
                                        this.imgList = document.getElementById("hot_new_img").getElementsByTagName("img")[0].src;
                                    }
                                }
                                sessionStorage.setItem("hotNewsInfo", JSON.stringify(this.hotNewsInfo));
                                ajax_post(recommend_news, {home_page_recommend_flag: '1', home_page_hot_flag: '0', status: '1'}, this, 'recommend_news');
                                break;
                            case 'recommend_news':
                                this.recommendNewsInfo = data.data;
                                sessionStorage.setItem("recommendNewsInfo", JSON.stringify(this.recommendNewsInfo));
                                ajax_post(queryAllProduct, {status: '1', home_page_recommend_flag: '1'}, this, 'queryAllProduct');
                                break;
                            case 'queryAllProduct':
                                this.allProductList = [];
                                this.productThreeList = [];
                                this.allProductList = data.data;
                                for (let i = 0; i < this.allProductList.length; i++) {
                                    if (this.allProductList[i].home_page_picture == null || this.allProductList[i].home_page_picture.length === 0) {
                                        this.allProductList[i].home_page_picture = '';
                                    } else if (JSON.parse(this.allProductList[i].home_page_picture).length > 0) {
                                        var guid = JSON.parse(this.allProductList[i].home_page_picture)[0].guid;
                                        this.allProductList[i].home_page_picture = api.api + "file/get?img=" + guid + "&token=" + this.token;
                                    } else {
                                        this.allProductList[i].home_page_picture = '';
                                    }
                                }
                                sessionStorage.setItem("allProductList", JSON.stringify(this.allProductList));
                                if (this.allProductList.length > 3) {
                                    for (let i = 0; i < 3; i++) {
                                        this.productThreeList.push(this.allProductList[i])
                                    }
                                } else {
                                    for (let i = 0; i < this.allProductList.length; i++) {
                                        this.productThreeList.push(this.allProductList[i])
                                    }
                                }

                                this.pageGoto();

                                break;

                        }
                    } else {
                        toastr.error(msg)
                    }
                },
                onNext: function () {
                    if (this.allProductList.length > 3) {
                        this.productThreeList = [];
                        if (this.indexOne + 2 < this.allProductList.length - 1) {
                            this.indexOne += 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 2]);
                        } else if (this.indexOne + 2 === this.allProductList.length - 1) {
                            this.indexOne += 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[0]);
                        } else if (this.indexOne + 2 === this.allProductList.length) {
                            this.indexOne += 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[0]);
                            this.productThreeList.push(this.allProductList[1]);
                        } else if (this.indexOne + 2 > this.allProductList.length) {
                            this.indexOne = 0;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 2]);
                        }
                    }
                },
                onPre: function () {
                    if (this.allProductList.length > 3) {
                        this.productThreeList = [];
                        if (this.indexOne === 0) {
                            this.indexOne = this.allProductList.length - 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[0]);
                            this.productThreeList.push(this.allProductList[1]);
                        } else if (this.indexOne + 2 < this.allProductList.length - 1) {
                            this.indexOne -= 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 2]);
                        } else if (this.indexOne + 2 === this.allProductList.length - 1) {
                            this.indexOne -= 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 2]);
                        } else if (this.indexOne + 2 === this.allProductList.length) {
                            this.indexOne -= 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 2]);
                        } else if (this.indexOne + 2 > this.allProductList.length) {
                            this.indexOne -= 1;
                            this.productThreeList.push(this.allProductList[this.indexOne]);
                            this.productThreeList.push(this.allProductList[this.indexOne + 1]);
                            this.productThreeList.push(this.allProductList[0]);
                        }
                    }
                },
        });
            vm.$watch("onReady", function() {
                console.log('xtyun')
                ajax_post(query_image_time, {option_name: 'time'}, this, 'query_image_time');
                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C30'}}, this, 'query_module');
                if (sessionStorage.getItem('goto_product') === '1') {
                    window.location.hash='#product';
                } else {
                    this.token = window.sessionStorage.getItem('token');
                    this.userType = window.sessionStorage.getItem("user_type");
                    let hotNewsInfo = sessionStorage.getItem("hotNewsInfo");
                    let recommendNewsInfo = sessionStorage.getItem("recommendNewsInfo");
                    let allProductList = sessionStorage.getItem("allProductList");


                    if (this.userType == '1') {
                        ajax_post(hot_news, {home_page_hot_flag: '1'}, this, 'hot_news');
                    } else {
                        if (JSON.parse(hotNewsInfo) && JSON.parse(hotNewsInfo).length > 0) {
                            this.hotNewsInfo = JSON.parse(hotNewsInfo);
                            if (this.hotNewsInfo[0].news_content != '') {
                                document.getElementById("hot_new_img").innerHTML = this.hotNewsInfo[0].news_content;
                                if (document.getElementById("hot_new_img").getElementsByTagName("img")[0]) {
                                    this.imgList = document.getElementById("hot_new_img").getElementsByTagName("img")[0].src;
                                }
                            }
                        } else {
                            ajax_post(hot_news, {home_page_hot_flag: '1'}, this, 'hot_news');
                        }
                        if (JSON.parse(recommendNewsInfo) && JSON.parse(recommendNewsInfo).length > 0) {
                            this.recommendNewsInfo = JSON.parse(recommendNewsInfo);

                        }
                        if (JSON.parse(allProductList) && JSON.parse(allProductList).length > 0) {
                            this.allProductList = JSON.parse(allProductList);

                            if (this.allProductList.length > 3) {
                                for (let i = 0; i < 3; i++) {
                                    this.productThreeList.push(this.allProductList[i])
                                }
                            } else {
                                for (let i = 0; i < this.allProductList.length; i++) {
                                    this.productThreeList.push(this.allProductList[i])
                                }
                            }
                        }
                    }
                    this.pageGoto();




                }
            });


            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });