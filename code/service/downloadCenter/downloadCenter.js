/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("service", "downloadCenter/downloadCenter", "css!"),
        C.Co("service", "downloadCenter/downloadCenter", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css, html, layer,advice, page_title, uploader, notice, amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';
        // 分页查询
        var query_down_list = api.api + 'official_website/download/list_page_download_info';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "downloadCenter",
                downloadList: [],
                token: "",
                productList: [],
                moduleImage: [],
                api: api.api,
                imageTime: 3000,
                down_title: '关键词搜索',
                onDownload: function(el) {
                    if (el.product_name === 'word') {
                        window.open(api.api + 'file/download_file?img=' + el.attachment_addr + '.docx');
                    } else {
                        window.open(api.api + 'file/download_file?img=' + el.attachment_addr + '.pdf');
                    }
                },
                queryDownByTitle: function () {
                    // ajax_post(query_down_list, {status: '1', file_name: this.down_title}, this, this.is_check);
                    if (this.down_title === '') {
                        this.down_title = '关键词搜索';
                    }
                },
                queryDownInfo: function () {
                    ajax_post(query_down_list, {status: '1', file_name: this.down_title}, this, this.is_check);
                },
                focusDownTitle: function () {
                    if (this.down_title === '关键词搜索') {
                        this.down_title = '';
                    }
                },
                gotoPage: function (el) {if (el.image_link) window.open(el.image_link); },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 新增或修改
                            case query_down_list:
                                this.downloadList = data.data.content;
                                let productList = JSON.parse(sessionStorage.getItem('product_list'));
                                for (let i = 0; i < productList.length; i++) {
                                    for (let j = 0; j < this.downloadList.length; j++) {
                                        if (productList[i].id === this.downloadList[j].product_info.id) {
                                            productList[i].pageShow = '';
                                            productList[i].pageShow = true;
                                        }
                                    }
                                }
                                this.productList = productList;
                                break;
                            case query_module:
                                for (let i = 0; i < data.data.length; i ++) {
                                    data.data[i].image_url = JSON.parse(data.data[i].image_url);
                                }
                                this.moduleImage = data.data;
                                let body = document.getElementsByTagName("body");
                                body[0].style.overflowY = 'hidden';
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
                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C32'}}, this, this.is_check);
                this.token = sessionStorage.getItem('token');
                ajax_post(query_down_list, {status: '1'}, this, this.is_check);
                //banner轮播

            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
