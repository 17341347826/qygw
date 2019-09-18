/**
 * Created by Administrator on 2017/12/4.
 */
define([
        C.CLF('avalon.js'),
        C.Co("products", "product/product", "css!"),
        C.Co("products", "product/product", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice')
    ],
    function (avalon, css,html, layer, advice,page_title,notice) {
        var queryProductByID = api.api + 'official_website/product/get_product_info_by_id';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "product",
                productInfo: [],
                productName: '',
                home_page_picture: "", // 首页图片
                seekPhone:function(){
                    // console.log(window.location.host);
                    //页面层
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['420px', '240px'], //宽高
                        tips: 1,
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
                on_request_complete: function (cmd, status, data, is_suc, msg, is_check) {
                    if (is_suc) {
                        switch (is_check) {
                            // 分页查询新闻
                            case 'queryProductByID':
                                this.productInfo.push(data.data);
                                this.productName = data.data.product_name;
                                if (this.productInfo[0].detail_picture && this.productInfo[0].detail_picture !== '[]') {
                                    var guid = JSON.parse(this.productInfo[0].detail_picture)[0].guid;
                                    this.home_page_picture = api.api + "file/get?img=" + guid + "&token=" + this.token;
                                }
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
            });
            vm.$watch("onReady", function() {
                // vm.noticeData();
                window.sessionStorage.removeItem('goto_product');
                let productID = sessionStorage.getItem('product_id');
                if (!productID) { window.location.hash = '#'; return}
                ajax_post(queryProductByID, {id: productID}, this, 'queryProductByID');
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
