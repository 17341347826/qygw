/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("service", "downloadManage/downloadManage", "css!"),
        C.Co("service", "downloadManage/downloadManage", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css, html, layer,  advice, page_title, uploader, notice, amazeui) {
        //文件上传
        var api_file_uploader = api.api + "file/uploader";
        // 保存或修改
        var save_download = api.api+'official_website/download/save_or_modify_download_info';
        // 分页查询
        var query_down_list = api.api + 'official_website/download/list_page_download_info';
        // 查询所有产品
        var query_product = api.api + 'official_website/product/list_all_product_info';
        // 修改状态
        var update_down_status = api.api + 'official_website/download/batch_modify_download_info_status';
        // 删除
        var remove_by_id = api.api + 'official_website/download/remove_download_info_by_id';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "downloadManage",
                file_title: "", // 文件名称筛选框
                add_file_name: "", // 上传文件弹框的文件名称
                downloadInfo: "",
                dialog_title: "",
                allProductInfo: [],
                check: "check",
                currentPage:0,
                total:0,
                query_list: {
                    // 新闻标题
                    file_name: '',
                    // 新闻类型（1：兴唐新闻；2：行业资讯；）
                    status: '',
                    // 第几页
                    page_num: '0',
                    // 多少条数据
                    page_size: '15',
                    // 产品
                    product_info: {id:''},
                },
                add_download_info: {
                    // 附件地址
                    attachment_addr: "",
                    // 文件名称
                    file_name: "",
                    // 产品编号
                    product_info: {id:''},
                    // 记录编号
                    id: "",
                    // 备注
                    remark: "",
                    // 数据状态（-1：无效；0：未发布；1：已发布；）
                    status: "",
                    product_name: '',
                },
                api_type: '',
                ids: [],
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
                        for (let i = 0 ; i < this.downloadInfo.length; i++) {
                            document.getElementById(this.check + i).checked = true;
                            this.arr_repetition(check, this.downloadInfo[i].id)
                        }
                    } else {
                        for (let i = 0 ; i < this.downloadInfo.length; i++) {
                            document.getElementById(this.check + i).checked = false;
                            this.ids = [];
                            console.log(this.ids)
                        }
                    }
                },
                // 文件名称输入框失去焦点
                queryByTitle: function () {
                    this.currentPage = 0;
                    this.query_list.page_num = 0;
                    this.query_list.file_name = this.file_title;
                    ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                },
                // 选择产品类
                getAddProductsType: function (id, type){

                    let $obj = document.getElementById(id);
                    this.add_download_info.product_info.id = $obj.options[$obj.selectedIndex].value;
                    console.log(this.add_download_info.product_info.id);
                    if (type === 1) {
                        this.currentPage = 0;
                        this.query_list.page_num = 0;
                        ajax_post(query_down_list, this.add_download_info.$model, this, this.is_check);
                    }

                    // console.log($obj.options[$obj.selectedIndex].value, $obj.options[$obj.selectedIndex].label)
                },
                downUpload:function () {
                    this.add_file_name = $("#add_down_upload")[0].files[0].name;
                },
                // 点击上传文件按钮之后的弹框 确认按钮
                onAddConfirm: function () {
                    if (!this.add_download_info.product_info.id) { toastr.error('请选择产品类'); return; }
                    if (!this.add_file_name) { toastr.error('输入文件名称'); return; }
                    $(".am-modal")[0].style.display = 'none';
                    let $obj = $("#add_down_upload")[0].files;
                    let $file = $('input[id="add_down_upload"]').prop('files');
                    if ($obj[0].type === 'application/pdf') {
                        this.add_download_info.product_name = 'pdf';
                    } else if ($obj[0].type === 'application/msword' || $obj[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        this.add_download_info.product_name = 'word';
                    } else if ($obj[0].type === 'application/x-zip-compressed') {
                        this.add_download_info.product_name = 'zip';
                    } else {
                        toastr.error('请选择文件后缀为doc/docx/pdf/zip的文件');
                        return;
                    }



                    this.add_download_info.status = '0';
                    this.add_download_info.file_name = this.add_file_name;

                    var form_data = new FormData();
                    form_data.append('file',$obj[0], this.add_file_name);
                    fileUpload(api_file_uploader, this, form_data);





                    // if ( $obj[0].type === 'application/msword'
                    //     || $obj[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    //     || $obj[0].type === 'application/pdf') {
                    //
                    //     if ($obj[0].type === 'application/pdf') {
                    //         this.add_download_info.product_name = 'pdf';
                    //     } else {
                    //         this.add_download_info.product_name = 'word';
                    //     }
                    //     this.add_download_info.status = '0';
                    //     this.add_download_info.file_name = this.add_file_name;
                    //
                    //     var form_data = new FormData();
                    //     form_data.append('file',$obj[0], this.add_file_name);
                    //     fileUpload(api_file_uploader, this, form_data);
                    //
                    // } else {
                    //     alert('请选择 word 或者 pdf 文件');
                    // }

                },
                // 点击上传文件按钮之后的弹框 取消
                onAddCancel:function () {
                    $(".am-modal")[0].style.display = 'none';
                },
                // 选择产品类型
                getDownloadType: function (id, num){
                    if (num === 1) {
                        let $obj = document.getElementById(id);
                        this.query_list.product_info.id = $obj.options[$obj.selectedIndex].value;
                        this.currentPage = 0;
                        this.query_list.page_num = 0;
                        ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                    } else {
                        let $obj = document.getElementById(id);
                        this.query_list.status = $obj.options[$obj.selectedIndex].value;
                        this.currentPage = 0;
                        this.query_list.page_num = 0;
                        ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                    }

                    // console.log($obj.options[$obj.selectedIndex].value, $obj.options[$obj.selectedIndex].label)
                },
                // 上传文件
                onUpload: function () {
                    this.add_file_name = '';
                    this.api_type = 4;
                    this.onUploadAdd();
                },
                // 发布文件
                onBatchIssue: function () {
                    this.dialog_title = '确认发布';
                    this.api_type = 1;
                    this.onOperate('');
                },
                // 撤销
                onRevocation: function (el) {
                    this.ids = [];
                    for (let i = 0; i < this.downloadInfo.length; i++) {
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
                    for (let i = 0; i < this.downloadInfo.length; i++) {
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
                onUploadAdd: function() {
                    $('#upload_div').modal({

                    });
                },
                // 弹框确认
                onConfirm: function() {
                    $(".am-modal")[1].style.display = 'none';
                    if (this.ids.length || this.api_type === 4) {
                        if (this.api_type === 1) {
                            ajax_post(update_down_status, {ids : this.ids.join(","), status: '1'}, this, this.is_check);
                        } else if (this.api_type === 2) {
                            ajax_post(update_down_status, {ids : this.ids.join(","), status: '0'}, this, this.is_check);
                        } else if (this.api_type === 3) {
                            ajax_post(remove_by_id, {id : this.ids.join(",")}, this, this.is_check);
                        } else if (this.api_type === 4) {
                            console.log('上传')
                            // ajax_post(add_upload, this.add_download_info.$model, this, this.is_check);
                        }
                    } else {
                        alert('未选择数据');
                    }
                },
                onCancel: function () {
                    $(".am-modal")[1].style.display = 'none';
                    console.log("取消");
                    this.ids = [];
                    for (let i = 0; i < this.downloadInfo.length; i++) {
                        document.getElementById(this.check + i).checked = false;
                    }
                },

                // 分页功能
                queryProjectProgress:function () {
                    this.query_list.page_num = this.currentPage;
                    ajax_post(query_down_list, this.query_list.$model, this);
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
                                console.log(this.allProductInfo[0].product_name);
                                break;
                            // 新增或修改
                            case save_download:
                                ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                                break;
                            case query_down_list:
                                // console.log(data);
                                // this.complete_daily_pub(data);
                                this.total = data.data.totalElements;
                                this.downloadInfo = [];
                                this.downloadInfo = data.data.content;
                                break;
                            case update_down_status:
                                // toastr.success('成功');
                                this.ids = [];
                                ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                                for (let i = 0; i < this.downloadInfo.length; i++) {
                                    document.getElementById(this.check + i).checked = false;
                                }
                                break;
                            case remove_by_id:
                                // toastr.success('删除成功');
                                ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                                break;
                            case api_file_uploader:
                                console.log(data.data.guid);
                                this.add_download_info.attachment_addr = data.data.guid;
                                ajax_post(save_download, this.add_download_info.$model, this, this.is_check);
                                break;
                        }
                    } else {
                        alert(msg)
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
                        product_info: {id:''}
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
                ajax_post(query_down_list, this.query_list.$model, this, this.is_check);
                ajax_post(query_product, {status: '1'}, this, this.is_check)
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
