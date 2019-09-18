/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("service", "solution/solution", "css!"),
        C.Co("service", "solution/solution", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css, html, layer,  advice, page_title, notice, amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';
        // 分页查询新闻
        var query_all_scheme = api.api + 'official_website/scheme/list_all_scheme_info';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "solution",
                moduleImage: [],
                api: api.api,
                schemeInfo: [],
                btnName: [],
                imageTime: 3000,
                query_list: {
                    status: '1'
                },

                onUnfold: function (idx) {
                    let id = 'retract' + idx;
                    let btn = 'btn' + idx;

                    if (this.btnName[idx] === '展开') {
                        document.getElementById(id).className = 'content_span';
                        document.getElementById(btn).innerHTML = '收起';
                        this.btnName[idx] = '收起';
                        return;
                    }
                    if (this.btnName[idx] === '收起') {
                        document.getElementById(id).className = 'content_span retract';
                        document.getElementById(btn).innerHTML = '展开';
                        this.btnName[idx] = '展开';
                    }
                },
                gotoPage: function (el) {if (el.image_link) window.open(el.image_link); },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 分页查询新闻
                            case query_all_scheme:
                                // console.log(data);
                                for (let i = 0; i < data.data.length; i++) {
                                    this.btnName[i] = '展开';
                                }
                                this.schemeInfo = data.data;
                                break;
                            case query_module:
                                for (let i = 0; i < data.data.length; i ++) {
                                    data.data[i].image_url = JSON.parse(data.data[i].image_url);
                                }
                                this.moduleImage = data.data;
                                //banner轮播
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
                        toastr.error(msg)
                    }
                },
            });
            vm.$watch('onReady', function () {
                if (sessionStorage.getItem("image_time"))
                    this.imageTime = Number(sessionStorage.getItem("image_time")) * 1000;
                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C33'}}, this, this.is_check);
                ajax_post(query_all_scheme, this.query_list.$model, this, this.is_check);

            });
            return vm;
        };




        return {
            view: html,
            define: avalon_define
        }
    });
