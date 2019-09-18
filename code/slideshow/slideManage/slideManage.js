/**
 * Created by Administrator on 2017/12/4.
 */
define([
        C.CLF('avalon.js'),
        C.Co("slideshow", "slideManage/slideManage", "css!"),
        C.Co("slideshow", "slideManage/slideManage", "html!"),
        C.CMF("data_center.js"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CMF("uploader/uploader.js"),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css,html,data_center,layer, advice,page_title,uploader,notice,amazeui) {
        //文件上传
        var api_file_uploader = api.api + "file/uploader";
        // 查询
        var query_image_list = api.api+'official_website/image/list_all_image_info';
        // 保存
        var save_image_info = api.api+'official_website/image/save_or_modify_image_info';
        // 删除
        var del_image_info = api.api+'official_website/image/remove_image_info_by_id';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "slideManage",
                moduleID: '',
                imageInfo: [],
                addPage: false,
                api: api.api,
                imageUrl: '',
                image: '',
                xh: '',
                delID:'',
                query_list: {
                    module_info: { id: '' },
                },
                add_list: {
                    image_link: '',
                    image_name: '',
                    image_url: '',
                    module_info: { id: '' },
                    xh: '',
                    id:'',
                },
                data: {
                    uploader_url: api_file_uploader,
                },
                seekPhone:function(){ layer.open({ type: 1, }); },
                // 页面返回按钮
                onGoBack: function () {
                    window.location.hash = "#slideshow";
                },
                // 图片添加按钮
                onAddImage: function () {
                    this.addOrUpdate = '添加图片';
                    this.addPage = true;
                },
                // 新增或修改时 的 确定按钮
                onAddConfirm: function () {
                    if (this.imageUrl) {
                        this.add_list.image_url = this.imageUrl;
                    } else {
                        var add_imageManage = data_center.ctrl("add_imageManage");
                        var is_complete = add_imageManage.is_finished();
                        if (is_complete == true) {
                            var files = add_imageManage.get_files();
                            if (files.length > 0 && (files.$model)[0].mini_type.slice(0, 5) !== 'image') {
                                toastr.error('首页图片格式不正确');
                                return;
                            }
                            this.add_list.image_url = JSON.stringify(files);
                        }
                    }
                    ajax_post(save_image_info, this.add_list.$model, this, this.is_check);
                },
                // 替换按钮
                onUploaderHome: function () {
                    var imgFrom = document.getElementById("ttt");
                    var imgDel = document.getElementById("up_delete");
                    if (imgDel) imgDel.click();
                    this.image = '';
                    this.imageUrl = '';
                    imgFrom.click();
                },
                // 编辑
                update: function (row) {
                    this.addOrUpdate = '编辑图片';
                    this.addPage = true;
                    this.add_list.image_name = row.image_name;
                    this.add_list.xh = row.xh;
                    this.add_list.image_link = row.image_link;
                    this.add_list.image_url = row.image_url;
                    this.imageUrl = row.image_url;

                    console.log(row)
                    if (row.image_url && row.image_url !== '[]') {
                        this.imageUrl = row.image_url;
                        this.image = api.api + "file/get?img=" + row.image_url[0].guid
                    }

                    this.add_list.id = row.id;
                },
                // 删除弹框
                delDialog: function (el) {
                    this.delID = el.id;
                    $('#delDialog').modal({

                    });
                },
                // 删除确认
                onConfirmDel: function () {
                    ajax_post(del_image_info, {id: this.delID}, this, this.is_check);
                },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 查询所有产品
                            case query_image_list:
                                this.imageInfo = data.data;
                                for (let i = 0; i < this.imageInfo.length; i ++) {
                                    this.imageInfo[i].image_url = JSON.parse(this.imageInfo[i].image_url);
                                }
                                break;
                            //  删除
                            case del_image_info:
                                toastr.success("删除成功");
                                ajax_post(query_image_list, this.query_list.$model, this, this.is_check);
                                break;
                            case save_image_info:
                                this.addPage = false;
                                toastr.success(this.addOrUpdate + "成功");
                                this.add_list.image_link = '';
                                this.add_list.image_name = '';
                                this.add_list.image_url = '';
                                this.add_list.xh = '';
                                this.add_list.id = '';
                                ajax_post(query_image_list, this.query_list.$model, this, this.is_check);
                                break;
                        }
                    } else {
                        alert(msg)
                    }
                },
            });
            vm.$watch('onReady', function () {
                vm.moduleID = window.sessionStorage.getItem("module_id");
                this.query_list.module_info.id = this.moduleID;
                this.add_list.module_info.id = this.moduleID;
                ajax_post(query_image_list, this.query_list.$model, this, this.is_check);
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
