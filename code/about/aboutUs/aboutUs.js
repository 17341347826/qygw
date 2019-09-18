/**
 * Created by Administrator on 2017/12/7.
 */
define([
        C.CLF('avalon.js'),
        C.Co("about", "aboutUs/aboutUs", "css!"),
        C.Co("about", "aboutUs/aboutUs", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css,html, layer, advice,page_title,notice,amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';

        var avalon_define = function () {
            var vm = avalon.define({
                $id: "aboutUs",
                moduleImage: [],
                api: api.api,
                imageTime: 3000,
                // index:news1
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
                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C36'}}, this, this.is_check);
                //banner轮播
                if (sessionStorage.getItem("image_time"))
                    this.imageTime = Number(sessionStorage.getItem("image_time")) * 1000;

            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
