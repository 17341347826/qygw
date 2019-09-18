/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("service", "schemeManage/schemeManage", "css!"),
        C.Co("service", "schemeManage/schemeManage", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css, html, layer,  advice, page_title, uploader, notice, amazeui) {
        // 保存或修改
        var save_scheme = api.api+'official_website/scheme/save_or_modify_scheme_info';
        // 分页查询
        var query_scheme_list = api.api + 'official_website/scheme/list_page_scheme_info';
        // 查询所有产品
        var query_product = api.api + 'official_website/product/list_all_product_info';
        // 修改状态
        var update_scheme_status = api.api + 'official_website/scheme/batch_modify_scheme_info_status';
        // 删除
        var remove_by_id = api.api + 'official_website/scheme/remove_scheme_info_by_id';
        var avalon_define = function () {
            require(["summernote_zh_cn"], function () {});
            require(["bootstrap"], function () {});
            var vm = avalon.define({
                $id: "schemeManage",
                check: "check",
                dialog_title: '',
                scheme_title: '',
                add_page: false,
                ids: [],
                // 产品
                allProductInfo: [],
                schemeListInfo: [],
                row_info: {},
                add_or_update: '',
                products_type_update:'',
                scheme_describe: '',
                query_list: {
                    page_num: '0',
                    page_size: '15',
                    fk_product_id: '',
                    scheme_title: '',
                    status: '',
                },
                add_scheme: {
                    fk_product_id: '',
                    id: '',
                    remark: '',
                    scheme_content: '',
                    scheme_title: '',
                    status: '',
                },
                check_list:function (e, row, id) {
                    let check = document.getElementById(id).checked;
                    console.log(id);
                    if (check) {
                        this.arr_repetition(check, row.id)
                    } else {
                        this.arr_repetition(check, row.id)
                    }
                    // console.log(e, this.ids);
                    // console.log(document.getElementById("check1").checked)
                },
                onAllCheck:function(){
                    let check = document.getElementById('all_check').checked;
                    if (check) {
                        for (let i = 0 ; i < this.schemeListInfo.length; i++) {
                            document.getElementById(this.check + i).checked = true;
                            this.arr_repetition(check, this.schemeListInfo[i].id)
                        }
                    } else {
                        for (let i = 0 ; i < this.schemeListInfo.length; i++) {
                            document.getElementById(this.check + i).checked = false;
                            this.ids = [];
                            console.log(this.ids)
                        }
                    }
                },

                // 选择产品类型
                getType: function (id, num){
                    if (num === 1) {
                        let $obj = document.getElementById(id);
                        this.query_list.fk_product_id = $obj.options[$obj.selectedIndex].value;
                        this.currentPage = 0;
                        this.query_list.page_num = 0;
                        ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                    } else {
                        let $obj = document.getElementById(id);
                        this.query_list.status = $obj.options[$obj.selectedIndex].value;
                        this.currentPage = 0;
                        this.query_list.page_num = 0;
                        ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                    }

                    // console.log($obj.options[$obj.selectedIndex].value, $obj.options[$obj.selectedIndex].label)
                },
                // 文件名称输入框失去焦点
                queryByTitle: function () {
                    this.currentPage = 0;
                    this.query_list.page_num = 0;
                    this.query_list.scheme_title = this.scheme_title;
                    ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                },
                // 选择产品类
                getAddProductsType: function (id, type){
                    let $obj = document.getElementById(id);
                    this.add_scheme.fk_product_id = $obj.options[$obj.selectedIndex].value;
                },
                // 发布文件
                onBatchIssue: function () {
                    $(".am-modal")[0].style.display = 'block';
                    this.dialog_title = '确认发布';
                    this.api_type = 1;
                    this.onOperate('');
                },
                // 撤销
                onRevocation: function (el) {
                    $(".am-modal")[0].style.display = 'block';
                    this.ids = [];
                    for (let i = 0; i < this.schemeListInfo.length; i++) {
                        document.getElementById(this.check + i).checked = false;
                    }
                    this.dialog_title = '确认撤销';
                    this.api_type = 2;
                    this.ids.push(el.id);
                    this.onOperate();
                },
                // 删除
                onRemove: function (el) {
                    this.ids = [];
                    for (let i = 0; i < this.schemeListInfo.length; i++) {
                        document.getElementById(this.check + i).checked = false;
                    }
                    this.dialog_title = '确认删除';
                    this.api_type = 3;
                    this.ids.push(el.id);
                    this.onOperate();
                },
                onOperate: function() {
                    $('#my-confirm').modal({

                    });
                },

                // 弹框确认
                onConfirm: function() {
                    $(".am-modal")[0].style.display = 'none';
                    if (this.ids.length || this.api_type === 4) {
                        if (this.api_type === 1) {
                            ajax_post(update_scheme_status, {ids : this.ids.join(","), status: '1'}, this, this.is_check);
                        } else if (this.api_type === 2) {
                            ajax_post(update_scheme_status, {ids : this.ids.join(","), status: '0'}, this, this.is_check);
                        } else if (this.api_type === 3) {
                            ajax_post(remove_by_id, {id : this.ids.join(",")}, this, this.is_check);
                        }
                    } else {
                        alert('未选择数据');
                    }
                },
                onCancel: function () {
                    $(".am-modal")[0].style.display = 'none';
                    console.log("取消");
                    this.ids = [];
                    for (let i = 0; i < this.schemeListInfo.length; i++) {
                        document.getElementById(this.check + i).checked = false;
                    }
                },


                // 新增
                onUpload: function (row) {
                    console.log(123)
                    this.add_page = true;
                    $('#summernote').summernote({
                        height:400,
                        focus: true,
                        toolbar: [
                            ['style', ['style']],
                            ['font', ['bold', 'italic', 'underline', 'clear']], // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],  ['fontname', ['fontname']],
                            ['fontsize', ['fontsize']],
                            ['color', ['color']],
                            ['para', [ 'ol', 'paragraph']],
                            ['height', ['height']],
                            ['insert', ['link', 'picture', 'hr']],
                            ['view', ['fullscreen', 'codeview']],
                            ['help', ['help']],
                            ['mybutton', ['hello']]
                        ],
                        lang: 'zh-CN'
                    });
                    if (row !== '') {
                        this.row_info = row;
                        this.add_or_update = '编辑方案';
                        this.add_scheme.id = row.id;
                        this.scheme_title = row.scheme_title;
                        $(".note-editable")[0].innerHTML = row.scheme_content;
                        let $obj = document.getElementById('add_products_type');
                        document.getElementById('add_products_type').options[$obj.selectedIndex].value = row.fk_product_id;
                        for (let i = 0; i < this.allProductInfo.length; i++) {
                            if (this.allProductInfo[i].id === row.fk_product_id) {
                                this.products_type_update = this.allProductInfo[i].product_name;
                            }
                        }

                    } else {
                        $(".note-editable")[0].innerHTML = '';
                        this.row_info = this.add_scheme;
                        this.add_or_update = '新增方案';
                        this.scheme_title = '';
                        this.new_info_content = '';
                        this.intercepted_word_num = 0;
                    }

                },

                onAddConfirm: function () {
                    let $obj = document.getElementById("news_type_add");
                    this.add_scheme.scheme_title = this.scheme_title;
                    this.add_scheme.scheme_content =  $('#summernote').summernote('code');
                    this.add_scheme.status = '0';
                    this.add_scheme.remark = this.scheme_describe;
                    ajax_post(save_scheme, this.add_scheme.$model, this, this.is_check);
                    this.add_page = false;
                },



                // 分页功能
                queryProjectProgress:function () {
                    this.query_list.page_num = this.currentPage;
                    ajax_post(query_scheme_list, this.query_list.$model, this);
                },
                currentChange:function (currentPage) {
                    this.currentPage = currentPage;
                    this.queryProjectProgress();
                },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 查询所有产品
                            case query_product:
                                this.allProductInfo = data.data;
                                break;
                            // 新增或修改
                            case save_scheme:
                                ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                                break;
                            case query_scheme_list:
                                this.total = data.data.totalElements;
                                this.schemeListInfo = [];
                                this.schemeListInfo = data.data.content;
                                break;
                            case update_scheme_status:
                                toastr.success('成功');
                                this.ids = [];
                                ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                                for (let i = 0; i < this.schemeListInfo.length; i++) {
                                    document.getElementById(this.check + i).checked = false;
                                }
                                break;
                            case remove_by_id:
                                toastr.success('删除成功');
                                ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
                // 查询参数 初始化
                clear_query_list: function () {
                    this.query_list = {
                        // 新闻标题
                        file_name: '',
                        // 新闻类型（1：兴唐新闻；2：行业资讯；）
                        status: '',
                        // 第几页
                        page_num: '0',
                        // 多少条数据
                        page_size: '15',
                        // 产品编号
                        fk_product_id: ""
                    }
                },
                clear_add_scheme: function () {
                    this.scheme_title = '';
                    this.scheme_describe = '';
                    this.add_scheme = {
                        fk_product_id: '',
                        id: '',
                        remark: '',
                        scheme_content: '',
                        scheme_title: '',
                        status: '',
                    }
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
                    console.log(this.ids)
                }
            });
            vm.$watch('onReady', function () {
                // $('#edit').editable({inlineMode: false, alwaysBlank: true});
                let token = window.sessionStorage.getItem("token");
                if (!token) { window.location.hash = '#'; }

                // vm.noticeData();
                ajax_post(query_scheme_list, this.query_list.$model, this, this.is_check);
                ajax_post(query_product, {status: '1'}, this, this.is_check)
            });
            vm.$watch('add_page', function () {
                vm.clear_add_scheme();
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
