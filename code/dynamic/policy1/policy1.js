/**
 * Created by Administrator on 2017/12/27.
 */
define([
        C.CLF('avalon.js'),
        C.Co("dynamic", "policy1/policy1", "css!"),
        C.Co("dynamic", "policy1/policy1", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice')
    ],
    function (avalon, css,html, layer,advice,page_title,notice) {
        var query_new_by_id = api.api + 'official_website/news/get_news_info_by_id';
        // 点赞
        var official_website = api.api + 'official_website/news/click_praise_news_info';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "policy1",
                thumbsNum:101,
                new_info: [],
                //点赞
                thumbs:function(){
                    if (document.getElementById('dz').style.color === 'red') {
                        toastr.success('您以点赞');
                        return;
                    }
                    ajax_post(official_website, {fk_news_id: this.new_info.id}, this, this.is_check);
                    document.getElementById('dz').style.color = 'red';
                },
                on_request_complete: function (cmd, status, data, is_suc, msg, is_check) {
                    if (is_suc) {
                        switch (cmd) {
                            // 分页查询新闻
                            case query_new_by_id:
                                this.new_info = data.data;
                                break;
                            case official_website:
                                this.new_info.click_praise_num = Number(this.new_info.click_praise_num) + 1;
                                break;
                        }
                    } else {
                        toastr.error(msg)
                    }
                },
            });
            vm.$watch("onReady", function() {
                let new_id = sessionStorage.getItem('new_id');
                if (!new_id) { window.location.hash = '#policyNews'; return}
                ajax_post(query_new_by_id, {id: new_id}, this, this.is_check);
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
