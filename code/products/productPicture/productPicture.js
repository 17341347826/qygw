/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("products", "productPicture/productPicture", "css!"),
        C.Co("products", "productPicture/productPicture", "html!"),
        C.CMF("data_center.js"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css, html, data_center, layer, advice, page_title, uploader, notice, amazeui) {
        //文件上传
        var api_file_uploader = api.api + "file/uploader";
        // 保存或修改新闻
        var save_product = api.api+'official_website/product/save_or_modify_product_info';
        // 分页查询新闻
        var query_product_by_id = api.api + 'official_website/product/get_product_info_by_id';
        var avalon_define = function () {
            require(["summernote_zh_cn"], function () {});
            require(["bootstrap"], function () {});
            var vm = avalon.define({
                $id: "productPicture",
                token: "",
                files: [],
                hot_page: '',
                productID: '',
                home_page_picture: "", // 修改时的首页图片
                productIntro: "", // 简介
                home_page_url: '',
                productInfo: {},
                add_product: {
                    home_page_picture: '',
                    home_page_intro: '',
                    id: '',
                },
                data: {
                    uploader_url: api_file_uploader,
                },



                onUploaderHome: function () {
                    var imgFrom = document.getElementById("ttt");
                    imgFrom.click();
                },
                onUpDeleteHome: function () {
                    this.home_page_picture = '';
                    this.home_page_url = '';
                    var del = document.getElementById("up_delete");
                    if (del) { del.click(); }
                },
                onAddConfirm: function () {
                    this.add_product.home_page_intro = this.productIntro;
                    if (this.home_page_url && this.home_page_url != 0) {
                        this.add_product.home_page_picture = this.home_page_url;
                    } else {
                        var add_productsManage = data_center.ctrl("add_productsManage");
                        var is_complete = add_productsManage.is_finished();
                        if (is_complete == true) {
                            var files = add_productsManage.get_files();
                            if (files.length > 0 && (files.$model)[0].mini_type.slice(0, 5) !== 'image') {
                                toastr.error('首页图片格式不正确');
                                return;
                            }
                            this.add_product.home_page_picture = JSON.stringify(files);
                        }
                    }
                    this.add_product.id = this.productID;

                    ajax_post(save_product, this.add_product.$model, this, this.is_check);
                },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 新增或修改
                            case save_product:
                                // console.log(data);
                                // this.complete_daily_pub(data);
                                toastr.success('成功');
                                this.clear_add_product();
                                window.sessionStorage.removeItem("product_id");
                                window.location.hash = '#productsManage';
                                break;
                            // 根据id查询产品
                            case query_product_by_id:
                                this.productInfo = data.data;
                                let row = data.data;
                                if (row.home_page_picture && row.home_page_picture !== '[]') {
                                    this.home_page_url = row.home_page_picture;
                                    var guidOne = JSON.parse(row.home_page_picture)[0].guid;
                                    this.home_page_picture = api.api + "file/get?img=" + guidOne + "&token=" + this.token;
                                }
                                this.productIntro = row.home_page_intro;
                                if (row.home_page_intro == null) this.productIntro = '';
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },

                // 点击返回
                onBack: function () {
                    window.location.hash = '#productsManage';
                },


                // add_product 初始化
                clear_add_product: function () {
                    this.home_page_url = '';
                    this.home_page_picture = '';
                    this.add_product = {
                        home_page_picture: '',
                        id: '',
                    }
                },
            });
            vm.$watch('onReady', function () {
                vm.token = window.sessionStorage.getItem('token');
                vm.productID = window.sessionStorage.getItem("product_id");
                if (!vm.token) { window.location.hash = '#'; }
                // vm.noticeData();
                if (vm.productID)
                    ajax_post(query_product_by_id, {id: this.productID}, this, this.is_check);
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
