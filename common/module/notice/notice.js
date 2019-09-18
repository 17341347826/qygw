/**
 * Created by Administrator on 2017/12/25.
 */
define([
        C.CLF('avalon.js'),
        C.CM("notice", "css!"),
        C.CM("notice", "html!"),
        C.CMF("router.js"),
        C.CMF("data_center.js"),
        "layer"
    ],
    function (avalon, css,html,router,data_center,layer) {
        var query_all_news = api.api + 'official_website/news/list_all_news_info';
        var pdetail = undefined;
        var detail = avalon.component('ms-ele-notice', {
            template: html,
            defaults: {
                type:false,
                data:'',
                imgPre:0,
                timer:'',
                newsInfo: [],
                //通知个数
                top_len:6,
                //滑动轮播方法-top();
                top:function(){
                    var self=this;
                    // console.log($('.noticeCon').css('height'));
                    // console.log(self.imgPre);
                    if(self.imgPre>-(self.top_len-1)*40){
                    // if(self.imgPre+news1>-(self.top_len-news1)*40){
                        self.imgPre=self.imgPre-40;
                        $('.noticeCon').css({
                            // 'margin-top':newTop+'px',
                            'margin-top': self.imgPre+'px',
                            'transition':'all .5s linear',
                            '-webkit-transform':'all .5s linear',
                            '-moz-transform':'all .5s linear',
                            '-ms-transform':'all .5s linear',
                            '-o-transform':'all .5s linear'
                        });
                    }else{
                        self.imgPre=0;
                        $('.noticeCon').css({
                            'margin-top':self.imgPre+'px',
                            'transition':'all 0s linear',
                            '-webkit-transform':'all 0s linear',
                            '-moz-transform':'all 0s linear',
                            '-ms-transform':'all 0s linear',
                            '-o-transform':'all 0s linear'
                        });
                    }
                },
                gotoNewPage:function (row) {
                    sessionStorage.removeItem('new_id');
                    sessionStorage.setItem('new_id', row.id);
                    window.location='#news1';
                },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    let self = this;
                    if (is_suc) {
                        switch (cmd) {
                            case query_all_news:
                                this.newsInfo = data.data;
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
                onReady: function() {
                    ajax_post(query_all_news, {status: '1', notice_item_flag: '1'}, this, this.is_check);
                    var self=this;
                    self.imgPre=0;
                    // 刷新页面清除自动轮播
                    window.onbeforeunload = function (e) {
                        e = e || window.event;
                        // For IE and Firefox prior to version 4
                        if (e) {
                            window.clearInterval(self.timer);
                        }
                    };
                    //页面跳转清除自动轮播
                    $('#content_body').bind('DOMNodeInserted', function (e) {
                        window.clearInterval(self.timer);
                    });
                    setTimeout(function () {
                        self.timer = setInterval(function(){
                            self.top();
                        },4000);
                    }, 2000);









                }
            }

        })
    });
