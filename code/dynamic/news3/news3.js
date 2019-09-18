/**
 * Created by Administrator on 2017/12/27.
 */
define([
        C.CLF('avalon.js'),
        C.Co("dynamic", "news3/news3", "css!"),
        C.Co("dynamic", "news3/news3", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui"
    ],
    function (avalon, css,html, layer, advice,page_title,notice,amazeui) {
        var modify_user_password = api.api + 'official_website/user/modify_user_password';
        var query_new_by_id = api.api + 'official_website/news/get_news_info_by_id';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "news3",
                new_info: {},
                oldPassword: '',
                newPassword: '',
                verifyPassword: '',
                updateList: {
                    new_password:'',
                    user_account:'',
                    user_password:'',
                },

                updatePassword: function () {
                    if (!this.oldPassword) {
                        toastr.error('请输入原密码');
                        return;
                    }
                    if (!this.newPassword) {
                        toastr.error('请输入新密码');
                        return;
                    }
                    if (!this.verifyPassword) {
                        toastr.error('请输入确认密码');
                        return;
                    }
                    if (this.verifyPassword !== this.newPassword) {
                        toastr.error('确认密码与新密码不一致');
                        return;
                    }
                    this.updateList.user_account = sessionStorage.getItem("user_account");
                    this.updateList.new_password = this.newPassword;
                    this.updateList.user_password = this.oldPassword;

                    ajax_post(modify_user_password, this.updateList.$model, this, this.is_check);

                },
                on_request_complete: function (cmd, status, data, is_suc, msg, is_check) {
                    if (is_suc) {
                        switch (cmd) {
                            // 分页查询新闻
                            case query_new_by_id:
                                this.new_info = data.data;
                                break;
                            case modify_user_password:
                                toastr.success('修改成功');
                                this.oldPassword = '';
                                this.newPassword = '';
                                this.verifyPassword = '';
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
            });
            vm.$watch("onReady", function() {

            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
