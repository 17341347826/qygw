/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("investment", "investmentCenter/investmentCenter", "css!"),
        C.Co("investment", "investmentCenter/investmentCenter", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css, html, layer, advice, page_title, uploader, notice, amazeui) {
        // 模块
        var query_module = api.api + 'official_website/image/list_all_image_info';
        var send_email = api.api + 'official_website/merchants/send_email';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "investmentCenter",
                moduleImage: [],
                api: api.api,
                imageTime: 3000,
                ids: [],
                file_title: "", // 文件名称筛选框
                productInfoList: [],
                fk_product_id: '',
                product_name: '',
                unitName: '',
                name: '',
                telephone: '',
                query_list: {
                    product_name: '',
                    status: '',
                    // 第几页
                    page_num: '0',
                    // 多少条数据
                    page_size: '15',
                },

                getProductType: function () {
                    let $select = $("#product_type")[0];
                    if ($select.value === '0') {
                        $select.style.color = '#A9A9A9';
                    } else {
                        $select.style.color = 'black';
                        this.fk_product_id = $select.value;
                        for (let i = 0; i < this.productInfoList.length; i++) {
                            if (this.fk_product_id === this.productInfoList[i].id) {
                                this.product_name = this.productInfoList[i].product_name;
                            }
                        }
                    }
                },
                onSubmit: function () {
                    if ($("#product_type")[0].value === '0') { toastr.error('请选择意向产品'); return; }
                    if (this.unitName === '') { toastr.error('请输入单位名称'); return; }
                    if (this.name === '') { toastr.error('请输出姓名'); return; }
                    if (this.telephone === '') { toastr.error('请输入11位手机号码'); return; }
                    else if (this.telephone.length !== 11) { toastr.error('手机号码位数有误'); return; }
                    let emailInfo = {
                        fk_product_id: this.fk_product_id,
                        name: this.name,
                        product_name: this.product_name,
                        telephone: this.telephone,
                        unit_name: this.unitName,
                    };
                    ajax_post(send_email, emailInfo, this, this.is_check);
                },
                gotoPage: function (el) {if (el.image_link) window.open(el.image_link); },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 新增或修改
                            case send_email:
                                toastr.success('提交成功');
                                this.clear_add_product();
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
                clear_add_product: function () {
                    this.fk_product_id = '';
                    this.product_name = '';
                    this.unitName = '';
                    this.name = '';
                    this.telephone = '';
                },
                // 数组去重
                arr_repetition: function uniq(check, id) {
                    if (check) {
                        if (this.ids.indexOf(id) == -1) {
                            this.ids.push(id);
                        }
                    } else {
                        if (this.ids.indexOf(id) != -1) {
                            this.ids.remove(id);
                        }
                    }
                }
            });
            vm.$watch('onReady', function () {
                ajax_post(query_module, {module_info: {id: '0000000156559604088729E4E6454C34'}}, this, this.is_check);
                this.productInfoList = JSON.parse(sessionStorage.getItem('product_list'));
                console.log(this.productInfoList);



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
