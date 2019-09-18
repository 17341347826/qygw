/**
 * Created by Administrator on 2017/12/7.
 */
define([
        C.CLF('avalon.js'),
        C.Co("dynamic", "newsCenter/newsCenter", "css!"),
        C.Co("dynamic", "newsCenter/newsCenter", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css,html, layer, advice,page_title,notice,amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';
        // 新闻查询
        var query_news = api.api + 'official_website/news/list_all_news_info';
        // 点赞
        var official_website = api.api + 'official_website/news/click_praise_news_info';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "newsCenter",
                newsList: [],
                imgList: [],
                rowInfo: {},
                moduleImage: [],
                api: api.api,
                imageTime: 3000, // 轮播图时间
                index: '',
                thumbs:function($idx,row){
                    let dzBtn = 'dz_' + $idx;
                    if (document.getElementById(dzBtn).style.color === 'red') {
                        toastr.success('您以点赞');
                        return;
                    }
                    this.index = $idx;
                    this.rowInfo = row;
                    ajax_post(official_website, {fk_news_id: row.id}, this, this.is_check);
                    document.getElementById(dzBtn).style.color = 'red';
                },
                gotoPage: function (el) { if (el.image_link) window.open(el.image_link); },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 新增或修改
                            case query_news:
                                this.newsList = data.data;
                                for (let i = 0; i < this.newsList.length; i++) {
                                    if (this.newsList[i].news_content !== '') {
                                        this.imgList.push(this.newsList[i].news_content.match(/src="(\S*)"/));
                                    } else {
                                        this.imgList.push('');
                                    }
                                }
                                break;
                            case query_module:
                                for (let i = 0; i < data.data.length; i ++) {
                                    data.data[i].image_url = JSON.parse(data.data[i].image_url);
                                }
                                this.moduleImage = data.data;
                                // banner轮播
                                let body = document.getElementsByTagName("body");
                                body[0].style.overflowY = 'hidden';
                                $(function() {
                                    $('.slide').flexslider({
                                        pauseOnAction: false,
                                        slideshowSpeed: vm.imageTime,
                                        maxItems:1,
                                        start: function (slider) {
                                            body[0].style.overflowY = '';
                                            console.log(body[0].style.overflowY);
                                        }
                                    });
                                });
                                setTimeout(function () {
                                    body[0].style.overflowY = '';
                                }, 1000);

                                break;
                            case official_website:
                                this.newsList[this.index].click_praise_num = Number(this.rowInfo.click_praise_num) + 1;
                                break;
                        }
                    } else {
                        alert(msg);
                    }
                },
                page_turn:function(el){
                    sessionStorage.removeItem('new_id');
                    sessionStorage.setItem('new_id', el.id);
                    window.location="#news1";
                },

            });
            vm.$watch('onReady', function () {
                if (sessionStorage.getItem("image_time"))
                    this.imageTime = Number(sessionStorage.getItem("image_time")) * 1000;

                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C29'}}, this, this.is_check);
                ajax_post(query_news, {news_type: '1', status: '1'}, this, this.is_check);




            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
