/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("products", "productsManage/productsManage", "css!"),
        C.Co("products", "productsManage/productsManage", "html!"),
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
        var query_product_list = api.api + 'official_website/product/list_page_product_info';
        // 根据编号修改新闻信息 首页推荐
        var home_flag_by_id = api.api + 'official_website/product/modify_product_info_home_page_recommend_flag_by_id';
        // 批量修改新闻信息 状态（发布/逻辑删除）
        var status_by_id = api.api + 'official_website/product/batch_modify_product_info_status';
        // 批量修改新闻信息 通知项
        var batch_delete = api.api + 'official_website/product/batch_remove_product_info';
        var avalon_define = function () {
            require(["summernote_zh_cn"], function () {});
            require(["bootstrap"], function () {});
            var vm = avalon.define({
                $id: "productsManage",
                token: "",
                files: [],
                api_type: 0,
                add_or_update: "",
                am_btn: "am-btn",
                am_btn_primary: "am-btn-primary",
                am_btn_xs: "am-btn-xs",
                am_active: "am-active",
                checked: "checked",
                check: "check",
                hot_page: '',
                product_title: "", // 新闻标题搜索框
                product_info_title: "", // 修改或新增时标题
                product_info_content: "", // 修改或新增时内容
                intercepted_word_num: "", // 修改或新增时摘要字数
                detail_picture: "", // 修改时的详情页图片
                detail_url: '',
                form_list_score: "",
                dialog_title: "",
                operate_list: "",
                add_page: false,
                ids: [],
                row_info: "", // 当前进行操作的行
                currentPage:0,
                total:0,
                add_product: {
                    add_fast_login_flag: '0',
                    fast_login_addr: '',
                    home_page_recommend_flag: '0',
                    detail_picture: '',
                    id: '',
                    product_content: '',
                    product_name: '',
                    remark: '',
                    status: '0',
                },
                query_list: {
                    // 新闻标题
                    product_name: '',
                    // 新闻类型（1：兴唐新闻；2：行业资讯；）
                    status: '',
                    // 第几页
                    page_num: '0',
                    // 多少条数据
                    page_size: '15',
                },
                data: {
                    uploader_url: api_file_uploader,
                },
                product_info: {},
                onAllCheck:function(){
                    let check = document.getElementById('all_check').checked;
                    if (check) {
                        for (let i = 0 ; i < this.product_info.length; i++) {
                            document.getElementById(this.check + i).checked = true;
                            this.arr_repetition(check, this.product_info[i].id)
                        }
                    } else {
                        for (let i = 0 ; i < this.product_info.length; i++) {
                            document.getElementById(this.check + i).checked = false;
                            this.ids = [];
                        }
                    }
                },
                check_list:function (e, row, id) {
                    let check = document.getElementById(id).checked;
                    if (check) {
                        this.arr_repetition(check, row.id)
                    } else {
                        this.arr_repetition(check, row.id)
                    }
                    // console.log(e, this.ids);
                    // console.log(document.getElementById("check1").checked)
                },
                // 选择新闻类型
                getProductType: function (id){
                    let $obj = document.getElementById(id);
                    this.query_list.status = $obj.options[$obj.selectedIndex].value;
                    this.currentPage = 0;
                    this.query_list.page_num = 0;
                    ajax_post(query_product_list, this.query_list.$model, this, this.is_check);

                    // console.log($obj.options[$obj.selectedIndex].value, $obj.options[$obj.selectedIndex].label)
                },
                // 新闻标题输入框失去焦点
                queryByTitle: function () {
                    this.query_list.product_name = this.product_title;
                    this.currentPage = 0;
                    this.query_list.page_num = 0;
                    ajax_post(query_product_list, this.query_list.$model, this, this.is_check);
                },
                // 操作按钮
                tcClick: function(type, row) {
                    switch (type) {
                        case 0:
                            if (row.status === '1') {
                                toastr.success('已经发布,无需重复发布');
                                return;
                            }
                            $(".am-modal")[0].style.display = 'block';
                            vm.dialog_title = '确认发布';
                            this.onOperate();
                            this.api_type = 1;
                            this.add_product.id = row.id;
                            this.add_product.status = '1';
                            break;
                        case 1:
                            vm.dialog_title = '预览';
                            this.add_product.id = row.id;
                            break;
                        case 3:
                            if (row.status === '0') {
                                toastr.success('尚未发布,无需重复撤回');
                                return;
                            }
                            $(".am-modal")[0].style.display = 'block';
                            vm.dialog_title = '确认撤回';
                            this.onOperate();
                            this.api_type = 1;
                            this.add_product.id = row.id;
                            this.add_product.status = '0';
                            break;
                    }
                },
                // 批量发布产品
                batchIssue: function () {
                    $(".am-modal")[0].style.display = 'block';
                    vm.dialog_title = '确认发布';
                    this.onOperate();
                    this.api_type = 1;
                    this.add_product.id = this.ids.join(',');
                    this.add_product.status = '1';
                },
                // 批量删除
                batchDelete: function () {
                    $(".am-modal")[0].style.display = 'block';
                    vm.dialog_title = '确认删除';
                    this.onOperate();
                    this.api_type = 2;
                    this.add_product.id = this.ids.join(',');
                },
                onOperate: function() {
                    $('#my-confirm').modal({

                    });
                },
                // 弹框确认
                onConfirm: function() {
                    $(".am-modal")[0].style.display = 'none';
                    if (this.api_type === 1) {
                        ajax_post(status_by_id, {ids : this.add_product.id, status: this.add_product.status }, this, this.is_check);
                        ajax_post(home_flag_by_id, {id : this.add_product.id, home_page_recommend_flag: '0'}, this, this.is_check);
                    } else if (this.api_type === 2) {
                        ajax_post(batch_delete, {ids : this.add_product.id}, this, this.is_check);
                    }
                },
                onCancel: function () {
                    $(".am-modal")[0].style.display = 'none';
                    console.log("取消")
                },
                // 是否推荐按钮
                recommend: function(which, row, $idx) {
                    let id = '#option' + $idx.toString();
                    if (which === '1') {
                        if ($(id)[0].className.indexOf('am-active') === -1) {
                            ajax_post(home_flag_by_id, {id : row.id, home_page_recommend_flag: which}, this, this.is_check);
                        } else {
                            toastr.success('已推荐, 无需点击');
                        }
                    } else {
                        if ($(id)[0].className.indexOf('am-active') === -1) {
                            toastr.success('已不推荐, 无需点击');
                        } else {
                            ajax_post(home_flag_by_id, {id : row.id, home_page_recommend_flag: which}, this, this.is_check);
                        }
                    }
                },
                // 预览
                onPreview: function (row) {
                    // sessionStorage.setItem('product_id', row.id);
                    // sessionStorage.setItem('goto_product', '1');
                    // if (window.location.hash === "") {
                    //     window.location.hash = '#product';
                    // } else {
                    //     window.location.hash = '#';
                    // }
                    // history.go(0);


                    $("#preview_content")[0].innerHTML = row.product_content;
                    $("#preview_title")[0].innerHTML = row.product_name;
                    $(".am-modal")[1].style.display = 'block';
                    $(".am-modal-dialog")[1].style.width = '76%';
                    $(".am-modal-dialog")[1].style.maxHeight = '80%';
                    $(".am-modal-dialog")[1].style.overflow = 'auto';
                    $('#my-preview').modal({

                    });
                },
                onBack: function () {
                    $(".am-modal")[1].style.display = 'none';
                },
                // 编辑
                onUpdate: function (row) {
                    console.log(row)
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
                        this.add_or_update = '编辑产品';
                        this.add_product.id = row.id;
                        this.product_info_title = row.product_name;
                        $(".note-editable")[0].innerHTML = row.product_content;
                        if (row.detail_picture && row.detail_picture !== '[]') {
                            this.detail_url = row.detail_picture;
                            var guidOne = JSON.parse(row.detail_picture)[0].guid;
                            this.detail_picture = api.api + "file/get?img=" + guidOne + "&token=" + this.token;
                        }
                        if (row.detail_picture && row.detail_picture !== '[]') {
                            this.detail_url = row.detail_picture;
                        }
                        if (row.fast_login_addr) { this.add_product.fast_login_addr = row.fast_login_addr; }
                        else { this.add_product.fast_login_addr = ''; }
                    } else {
                        this.row_info = this.add_product;
                        this.add_or_update = '新增产品';
                        this.product_info_title = '';
                        this.product_info_content = '';
                    }
                },

                titlePage: function (type) {
                    switch (type) {
                        case 3:
                            if (this.row_info.home_page_recommend_flag === '1') {
                                this.row_info.home_page_recommend_flag = '0';
                            } else {
                                this.row_info.home_page_recommend_flag = '1';
                            }
                            break;
                        case 4:
                            if (this.row_info.add_fast_login_flag === '1') {
                                this.row_info.add_fast_login_flag = '0';
                            } else {
                                this.row_info.add_fast_login_flag = '1';
                            }
                            break;
                    }
                },
                onUploaderHome: function () {
                        var imgFrom = document.getElementById("ttt");
                        imgFrom.click();
                },
                onUpDeleteHome: function () {
                    this.detail_picture = '';
                    this.detail_url = '';
                    var del = document.getElementById("up_delete");
                    if (del) { del.click(); }
                },
                onAddConfirm: function () {
                    if (this.detail_url && this.detail_url != 0) {
                        this.add_product.detail_picture = this.detail_url;
                    } else {
                        var add_productsManage = data_center.ctrl("add_productsManage");
                        var is_complete = add_productsManage.is_finished();
                        if (is_complete == true) {
                            var files = add_productsManage.get_files();
                            if (files.length > 0 && (files.$model)[0].mini_type.slice(0, 5) !== 'image') {
                                toastr.error('首页图片格式不正确');
                                return;
                            }
                            this.add_product.detail_picture = JSON.stringify(files);
                        }
                    }
                    let $obj = document.getElementById("news_type_add");
                    this.add_product.product_name = this.product_info_title;

                    this.add_product.product_content = $('#summernote').summernote('code');

                    this.add_product.add_fast_login_flag = this.row_info.add_fast_login_flag;
                    this.add_product.home_page_recommend_flag = this.row_info.home_page_recommend_flag;
                    this.add_product.intercepted_content_flag = this.row_info.intercepted_content_flag;
                    this.add_product.status = '0';

                    ajax_post(save_product, this.add_product.$model, this, this.is_check);
                    this.add_page = false;
                },
                // 分页功能
                queryProjectProgress:function () {
                    this.query_list.page_num = this.currentPage;
                    ajax_post(query_merchants_list, this.query_list.$model, this);
                },
                currentChange:function (currentPage) {
                    this.currentPage = currentPage;
                    this.queryProjectProgress();
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
                                ajax_post(query_product_list, this.query_list.$model, this, this.is_check);
                                break;
                            // 分页查询
                            case query_product_list:
                                // console.log(data);
                                this.total = data.data.totalElements;
                                this.product_info = [];
                                this.product_info = data.data.content;
                                break;
                            // 产品发布
                            case status_by_id:
                                // console.log(data);
                                toastr.success('成功');
                                history.go(0);
                                this.clear_add_product();
                                break;
                            // 是否首页推荐
                            case home_flag_by_id:
                                this.clear_add_product();
                                toastr.success('成功');
                                break;
                            // 批量删除
                            case batch_delete:
                                toastr.success('删除成功');
                                this.clear_add_product();
                                ajax_post(query_product_list, this.query_list.$model, this, this.is_check);
                                break;

                        }
                    } else {
                        toastr.error(msg)
                    }
                },
                // 点击详情页图片
                gotoProductPicture: function (el) {
                    sessionStorage.setItem('product_id', el.id);
                    window.location.hash = '#productPicture';
                    history.go(0);
                },




                // add_product 初始化
                clear_add_product: function () {
                    this.product_info_content = '';
                    this.detail_picture = '';
                    this.add_product = {
                        add_fast_login_flag: '1',
                        fast_login_addr: '0',
                        home_page_recommend_flag: '0',
                        id: '',
                        product_content: '',
                        product_name: '',
                        detail_picture: '',
                        remark: '',
                        status: '0',
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
                }
            });
            vm.$watch('onReady', function () {
                let token = window.sessionStorage.getItem("token");
                if (!token) { window.location.hash = '#'; }
                // vm.noticeData();
                vm.token = window.sessionStorage.getItem('token');
                ajax_post(query_product_list, this.query_list.$model, this, this.is_check);
            });
            vm.$watch('product_title', function () {
                // vm.noticeData();
                console.log(vm.product_title)
            });
            vm.$watch('add_page', function () {
                vm.clear_add_product();
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
