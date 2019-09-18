/**
 * Created by Administrator on 2017/12/12.
 */
define([
        C.CM("footer", "html!"),
        C.CM("footer", "css!")
    ],
    function (html, css) {
        // 产品查询接口
        var queryAllProduct = api.api + 'official_website/product/list_all_product_info';
        var detail = avalon.component('ms-ele-footer', {
            template: html,
            defaults: {
                token: '',
                user_type: '',
                productInfoList: [],
                // nick_name: "",
                // user_type: 0,
                // stus_sel_show: false,
                // menu: [],
                // local_href: '',
                // current_up_pos: 0,
                // user: undefined,
                // is_pop_status: false
                //蜀
                gotoPlace: function ($id) {
                    if (window.location.href === window.location.origin + '/front/index.html#' || window.location.href === window.location.origin + '/front/#') {
                        $("html, body").animate({
                            scrollTop: $($id).offset().top - 106 + 'px' }, {duration: 500,easing: "swing"});
                    } else {
                        sessionStorage.setItem("goto", $id);
                        window.location = '/front/index.html';
                    }
                },
                onPageChange: function (url) {
                    window.location.hash = url;
                    if (this.token) history.go(0);
                },
                turn_shu:function(){
                    window.location.href = 'http://www.miibeian.gov.cn';
                },

                onProductPage: function (el) {
                    sessionStorage.setItem('product_id', el.id);
                    sessionStorage.setItem('goto_product', '1');
                    // if (window.location.hash === "") {
                    //     window.location.hash = '#product';
                    // } else {
                    //     window.location.hash = '#';
                    // }
                    window.location.hash = '#product';
                    if (this.token) history.go(0);
                },

                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            case queryAllProduct:
                                this.productInfoList = data.data;
                                sessionStorage.setItem("product_list", JSON.stringify(this.productInfoList));
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
                onReady: function() {
                    this.token = window.sessionStorage.getItem("token");
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

                }

            }
        })
    });