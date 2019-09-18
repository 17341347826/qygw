/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("investment", "investmentManage/investmentManage", "css!"),
        C.Co("investment", "investmentManage/investmentManage", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        C.CM("pagination"),
        "amazeui",
    ],
    function (avalon, css, html, layer,advice, page_title, uploader, notice, pagination, amazeui) {
        // 分页查询
        var query_merchants_list = api.api + 'official_website/merchants/list_page_merchants_info';
        // 保存或修改
        var save_merchants = api.api + 'official_website/merchants/save_or_modify_merchants_info';
        // 删除
        var delete_merchants = api.api + 'official_website/merchants/remove_merchants_info_by_id';
        // 批量修改新闻信息 状态（发布/逻辑删除）
        var status_by_id = api.api + 'official_website/merchants/batch_modify_merchants_info_status';
        var avalon_define = function () {
            require(["summernote_zh_cn"], function () {});
            require(["bootstrap"], function () {});
            var vm = avalon.define({
                $id: "investmentManage",
                ids: [],
                add_page: false,
                check: 'check',
                dialog_title: "",
                file_title: "", // 文件名称筛选框
                investmentListInfo: {}, // 分页查询得到数据
                add_or_update: '',
                moduleName: '',
                moduleContent: '',
                currentPage:0,
                total:0,
                query_list: {
                    name: '',
                    status: '',
                    page_num: '0',
                    page_size: '2',
                },
                add_info: {
                    content: '',
                    id: '',
                    name: '',
                    remark: '',
                    status: '0',
                },
                onAllCheck:function(){
                    let check = document.getElementById('all_check').checked;
                    if (check) {
                        for (let i = 0 ; i < this.investmentListInfo.length; i++) {
                            document.getElementById(this.check + i).checked = true;
                            this.arr_repetition(check, this.investmentListInfo[i].id)
                        }
                    } else {
                        for (let i = 0 ; i < this.investmentListInfo.length; i++) {
                            document.getElementById(this.check + i).checked = false;
                            this.ids = [];
                        }
                    }
                    console.log(this.ids)
                },
                // 选择框勾选
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
                // 发布
                onIssueModule: function () {
                    $(".am-modal")[0].style.display = 'block';
                    this.dialog_title = '确认发布';
                    this.onOperate();
                    this.api_type = 1;
                },
                // 撤销
                onRevocation: function (el) {
                    $(".am-modal")[0].style.display = 'block';
                    this.ids = [];
                    for (let i = 0; i < this.investmentListInfo.length; i++) {
                        document.getElementById(this.check + i).checked = false;
                    }
                    this.dialog_title = '确认撤销';
                    this.api_type = 2;
                    this.ids.push(el.id);
                    this.onOperate();
                },
                onDelete: function (el) {
                    this.api_type = 3;
                    $(".am-modal")[0].style.display = 'block';
                    this.dialog_title = '确认删除';
                    this.ids = [];
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
                    if (this.api_type === 1) {
                        ajax_post(status_by_id, {ids : this.ids.join(','), status: '1'}, this, this.is_check);
                    } else if (this.api_type === 2) {
                        ajax_post(status_by_id, {ids : this.ids.join(','), status: '0'}, this, this.is_check);
                    } else if (this.api_type === 3) {
                        ajax_post(delete_merchants, {id : this.ids.join(',')}, this, this.is_check);
                    }
                },
                onCancel: function () {
                    $(".am-modal")[0].style.display = 'none';
                    console.log("取消")
                },
                // 新增或编辑
                onAddModule: function (el) {
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
                    if (el !== '') {
                        this.add_or_update = '修改';
                        this.add_info.id = el.id;
                        this.moduleName = el.name;
                        $(".note-editable")[0].innerHTML = el.content;

                    } else {
                        this.add_or_update = '新增'
                    }
                },
                onAddConfirm: function () {
                    this.add_info.name = this.moduleName;
                    this.add_info.content = $('#summernote').summernote('code');
                    ajax_post(save_merchants, this.add_info.$model, this, this.is_check);
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
                            // 保存或修改
                            case save_merchants:
                                toastr.success('保存成功');
                                ajax_post(query_merchants_list, this.query_list.$model, this, this.is_check);
                                break;
                            // 分页查询
                            case query_merchants_list:
                                // console.log(data);
                                // this.complete_daily_pub(data);
                                this.total = data.data.totalElements;
                                this.investmentListInfo = data.data.content;
                                break;
                            // 更改发布状态
                            case status_by_id:
                                toastr.success('发布状态更改成功');
                                this.ids = [];
                                for (let i = 0; i < this.investmentListInfo.length; i++) {
                                    document.getElementById(this.check + i).checked = false;
                                }
                                ajax_post(query_merchants_list, this.query_list.$model, this, this.is_check);
                                break;
                            // 删除
                            case delete_merchants:
                                toastr.success('删除成功');
                                this.ids = [];
                                for (let i = 0; i < this.investmentListInfo.length; i++) {
                                    document.getElementById(this.check + i).checked = false;
                                }
                                ajax_post(query_merchants_list, this.query_list.$model, this, this.is_check);
                                break;
                        }
                    } else {
                        toastr.error(msg)
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
                ajax_post(query_merchants_list, this.query_list.$model, this, this.is_check);
            });
            vm.$watch('add_page', function () {
                this.moduleName = '';
                this.add_info = {
                    content: '',
                    id: '',
                    name: '',
                    remark: '',
                    status: '0',
                };
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
