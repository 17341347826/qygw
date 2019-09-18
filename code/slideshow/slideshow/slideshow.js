/**
 * Created by Administrator on 2017/12/4.
 */
define([
        C.CLF('avalon.js'),
        C.Co("slideshow", "slideshow/slideshow", "css!"),
        C.Co("slideshow", "slideshow/slideshow", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui",
    ],
    function (avalon, css,html, layer, advice,page_title,notice,amazeui) {
        // 查询模块
        var query_module_list = api.api+'official_website/module/list_all_module_info';
        // 查询设置
        var query_image_time = api.api+'official_website/option/get_option_info_by_option_name';
        // 保存设置
        var save_image_time = api.api+'official_website/option/save_or_modify_option_info';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "slideshow",
                slidesTime: "",
                timeID: '',
                moduleInfo: [],
                query_list: {
                },
                seekPhone:function(){ layer.open({ type: 1, }); },

                slidesTimeDialog: function() {
                    ajax_post(query_image_time, {option_name: 'time'}, this, this.is_check);
                    $('#slidesTimeDialog').modal({

                    });
                },
                onAddCancel: function () {
                    this.slidesTime = '';
                },
                onAddConfirm: function () {
                    ajax_post(save_image_time, {id: this.timeID,option_name: 'time',option_content: this.slidesTime}, this, this.is_check);
                },
                onImageManage: function (el) {
                    sessionStorage.setItem("module_id", el.id);
                    window.location.hash = "#slideManage";
                    history.go(0);
                },

                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 查询所有产品
                            case query_module_list:
                                this.moduleInfo = data.data;
                                break;
                            case query_image_time:
                                this.timeID = data.data.id;
                                this.slidesTime = data.data.option_content;
                                break;
                            case save_image_time:
                                toastr.success('设置成功');
                                break;
                        }
                    } else {
                        alert(msg)
                    }
                },
            });
            vm.$watch('onReady', function () {
                let token = window.sessionStorage.getItem("token");
                if (!token) { window.location.hash = '#'; }

                ajax_post(query_module_list, this.query_list.$model, this, this.is_check);
                // vm.noticeData();
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
