/**
 * Created by Administrator on 2017/12/4.
 */

define([
        C.CLF('avalon.js'),
        C.Co("dynamic", "newsManage/newsManage", "css!"),
        C.Co("dynamic", "newsManage/newsManage", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        C.CM("pagination"),
        "amazeui",
    ],
    function (avalon, css, html, layer,  advice, page_title, notice, pagination, amazeui) {
        // 保存或修改新闻
        var save_news = api.api+'official_website/news/save_or_modify_news_info';
        // 分页查询新闻
        var query_news_list = api.api + 'official_website/news/list_page_news_info';
        // 根据编号修改新闻信息 首页推荐
        var home_flag_by_id = api.api + 'official_website/news/modify_news_info_home_page_recommend_flag_by_id';
        // 根据编号修改新闻信息 首页热门
        var hot_flag_by_id = api.api + 'official_website/news/modify_news_info_home_page_hot_flag_by_id';
        // 批量修改新闻信息 状态（发布/逻辑删除）
        var status_by_id = api.api + 'official_website/news/batch_modify_news_info_status';
        // 批量修改新闻信息 通知项
        var notice_item = api.api + 'official_website/news/batch_modify_news_info_notice_item_flag';
        // 批量删除
        var batch_remove = api.api + 'official_website/news/batch_remove_news_info';
        var avalon_define = function () {
            // require(["froala_editor"], function () {
            //     require(["froala_editor_tables"]);
            //     require(["froala_editor_lists"]);
            //     require(["froala_editor_colors"]);
            //     require(["froala_editor_media_manager"]);
            //     require(["froala_editor_font_family"]);
            //     require(["froala_editor_font_size"]);
            //     require(["froala_editor_block_styles"]);
            //     require(["froala_editor_video"]);
            // });
            require(["summernote_zh_cn"], function () {});
            require(["bootstrap"], function () {});


            var vm = avalon.define({
                $id: "newsManage",
                api_type: 0,
                add_or_update: "",
                am_btn: "am-btn",
                am_btn_primary: "am-btn-primary",
                am_btn_xs: "am-btn-xs",
                am_active: "am-active",
                checked: "checked",
                check: "check",
                hot_page: '',
                new_title: "", // 新闻标题搜索框
                new_info_title: "", // 修改或新增时标题
                new_info_content: "", // 修改或新增时内容
                intercepted_word_num: 0, // 修改或新增时摘要字数
                news_type_update: '',
                form_list_score: "",
                dialog_title: "",
                operate_list: "",
                add_page: false,
                currentPage:0,
                $idx: '',
                total:0,
                ids: [],
                row_info: "", // 当前进行操作的行
                add_new: {
                    get_first_picture_flag: '1',
                    home_page_hot_flag: '0',
                    home_page_recommend_flag: '0',
                    id: '',
                    intercepted_content_flag: '0',
                    intercepted_word_num: 0,
                    intercepted_content: '',
                    news_content: '',
                    news_title: '',
                    news_type: '0',
                    notice_item_flag: '0',
                    remark: '',
                    status: '0',
                },
                query_list: {
                    // 新闻标题
                    news_title: '',
                    // 新闻类型（1：slideshowSpeed: 3000新闻；2：行业资讯；）
                    news_type: '',
                    // 第几页
                    page_num: '0',
                    // 多少条数据
                    page_size: '15',
                },
                news_info: {},
                onAllCheck:function(){
                    let check = document.getElementById('all_check').checked;
                    if (check) {
                        for (let i = 0 ; i < this.news_info.length; i++) {
                            document.getElementById(this.check + i).checked = true;
                            this.arr_repetition(check, this.news_info[i].id)
                        }
                    } else {
                        for (let i = 0 ; i < this.news_info.length; i++) {
                            document.getElementById(this.check + i).checked = false;
                            this.ids = [];
                            console.log(this.ids)
                        }
                    }
                },
                check_list:function (e, row, id) {
                    let check = document.getElementById(id).checked;
                    this.arr_repetition(check, row.id)
                    // console.log(e, this.ids);
                    // console.log(document.getElementById("check1").checked)
                },
                // 选择新闻类型
                getNewType: function (id, type){

                    let $obj = document.getElementById(id);
                    this.query_list.news_type = $obj.options[$obj.selectedIndex].value;
                    if (type === 1) {
                        this.currentPage = 0;
                        this.query_list.page_num = 0;
                        ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
                    }

                    // console.log($obj.options[$obj.selectedIndex].value, $obj.options[$obj.selectedIndex].label)
                },
                // 新闻标题输入框失去焦点
                queryNewsByTitle: function () {
                    this.query_list.news_title = this.new_title;
                    this.currentPage = 0;
                    this.query_list.page_num = 0;
                    ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
                },
                // 操作按钮
                tcClick: function(type, row, idx) {
                    this.$idx = idx;
                    let $modal = $(".am-modal");
                    switch (type) {
                        case 0:
                            $modal[0].style.display = 'block';
                            vm.dialog_title = '确认发布';
                            this.onOperate();
                            this.api_type = 1;
                            this.add_new.id = row.id;
                            this.add_new.status = '1';
                            break;
                        case 1:
                            vm.dialog_title = '预览';
                            this.add_new.id = row.id;
                            break;
                        case 2:
                            vm.dialog_title = '编辑';
                            this.add_new.id = row.id;
                            break;
                        case 3:
                            $modal[0].style.display = 'block';
                            vm.dialog_title = '确认撤回';
                            this.onOperate();
                            this.api_type = 4;
                            this.add_new.id = row.id;
                            this.add_new.status = '0';
                            break;
                    }
                },
                // 批量发布新闻
                batchIssueNews: function () {
                    $(".am-modal")[0].style.display = 'block';
                    vm.dialog_title = '确认发布';
                    this.onOperate();
                    this.api_type = 1;
                    this.add_new.id = this.ids.join(',');
                    this.add_new.status = '1';
                },
                // 发布通知
                onIssueInform: function () {
                    $(".am-modal")[0].style.display = 'block';
                    vm.dialog_title = '确认发布通知';
                    this.onOperate();
                    this.api_type = 2;
                    this.add_new.id = this.ids.join(',');
                    this.add_new.notice_item_flag = '1';
                },
                // 批量删除
                batchRemove: function () {
                    $(".am-modal")[0].style.display = 'block';
                    vm.dialog_title = '确认删除';
                    this.api_type = 3;
                    this.add_new.id = this.ids.join(',');
                },
                onOperate: function() {
                    $('#my-confirm').modal({

                    });
                },
                // 弹框确认
                onConfirm: function() {
                    $(".am-modal")[0].style.display = 'none';
                    if (this.api_type === 1) {
                        ajax_post(status_by_id, {ids : this.add_new.id, status: this.add_new.status}, this, this.is_check);
                    } else if (this.api_type === 2) {
                        ajax_post(notice_item, {ids : this.add_new.id, notice_item_flag: this.add_new.notice_item_flag}, this, this.is_check);
                    } else if (this.api_type === 3) {
                        ajax_post(batch_remove, {ids : this.add_new.id}, this, this.is_check);
                    } else if (this.api_type === 4) {
                        ajax_post(hot_flag_by_id, {id : this.add_new.id, home_page_hot_flag: '0'}, this, this.is_check);
                        ajax_post(home_flag_by_id, {id : this.add_new.id, home_page_recommend_flag: '0'}, this, this.is_check);
                        ajax_post(status_by_id, {ids : this.add_new.id, status: this.add_new.status}, this, this.is_check);
                    }
                },
                onCancel: function () {
                    $(".am-modal")[0].style.display = 'none';
                    console.log("取消")
                },
                // 是否推荐按钮
                recommend: function(which, row, $idx) {
                    let id = '#option' + $idx.toString();
                    if (row.status === '1') {
                        if (which === '1') {
                            let check = 0;
                            if ($(id)[0].className.indexOf('am-active') === -1) {
                                for (let i = 0 ; i < this.news_info.length; i++) {
                                    if ($("#option" + i)[0].className.indexOf('am-active') !== -1) {
                                        check++;
                                    }
                                }
                                if (check > 4) {
                                    toastr.error('首页推荐最多五条');
                                    setTimeout(function () {
                                        $(id)[0].className = 'am-btn am-btn-primary am-btn-xs';
                                        $('#option_no' + $idx.toString())[0].className = 'am-btn am-btn-primary am-btn-xs am-active';
                                    }, 200);
                                } else {
                                    ajax_post(home_flag_by_id, {id : row.id, home_page_recommend_flag: which}, this, this.is_check);
                                }
                            } else {
                                toastr.success('已推荐');
                            }
                        } else {
                            if ($(id)[0].className.indexOf('am-active') === -1) {
                                toastr.success('已不推荐');
                                return;
                            }
                            if ($("#hot" + $idx)[0].checked) {
                                $("#hot" + $idx)[0].checked = false;
                                ajax_post(hot_flag_by_id, {id : row.id, home_page_hot_flag: '0'}, this, this.is_check);
                            }
                            ajax_post(home_flag_by_id, {id : row.id, home_page_recommend_flag: which}, this, this.is_check);
                        }
                    } else {
                        if (which !== '1') {
                            if ($(id)[0].className.indexOf('am-active') === -1) {
                                toastr.success('已不推荐');
                                return;
                            }
                            if ($("#hot" + $idx)[0].checked) {
                                $("#hot" + $idx)[0].checked = false;
                                ajax_post(hot_flag_by_id, {id : row.id, home_page_hot_flag: '0'}, this, this.is_check);
                            }
                            ajax_post(home_flag_by_id, {id : row.id, home_page_recommend_flag: which}, this, this.is_check);
                        } else {
                            toastr.success('当前新闻未发布');
                            setTimeout(function () {
                                $(id)[0].className = 'am-btn am-btn-primary am-btn-xs';
                                $('#option_no' + $idx.toString())[0].className = 'am-btn am-btn-primary am-btn-xs am-active';
                            }, 200);
                        }
                    }


                },
                // 热门勾选
                onChangeHot: function(row, idx) {
                    if (row.status === '1') {
                        if ($( '#option' + idx.toString())[0].className.indexOf('am-active') === -1) {
                            toastr.error('只有首页推荐新闻才能勾选首页热门');
                            $("#hot" + idx)[0].checked = false;
                            return;
                        }for (let i = 0; i <this.news_info.length; i++) {
                            if (i !== idx) {
                                $("#hot" + i)[0].checked = false;
                            }
                        }
                        if ($("#hot" + idx)[0].checked) {
                            ajax_post(hot_flag_by_id, {id : row.id, home_page_hot_flag: '1'}, this, this.is_check);
                        } else {
                            ajax_post(hot_flag_by_id, {id : row.id, home_page_hot_flag: '0'}, this, this.is_check);
                        }
                    } else {
                        toastr.success('当前新闻未发布');
                        $("#hot" + idx)[0].checked = false;
                    }
                },
                // 预览
                onPreview: function (row) {
                    $("#preview_content")[0].innerHTML = row.news_content;
                    $("#preview_title")[0].innerHTML = row.news_title;
                    $(".am-modal")[1].style.display = 'block';
                    $(".am-modal-dialog")[1].style.width = '70%';
                    $(".am-modal-dialog")[1].style.maxHeight = '80%';
                    $(".am-modal-dialog")[1].style.overflow = 'auto';
                    $('#my-preview').modal({

                    });
                },
                onBack: function () {
                    $(".am-modal")[1].style.display = 'none';
                },
                // 编辑
                onNewUpdate: function (row) {
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
                        this.add_or_update = '编辑新闻';
                        this.add_new.id = row.id;
                        let $obj = document.getElementById('news_type_add');
                        document.getElementById('news_type_add').options[$obj.selectedIndex].value = row.news_type;
                        if (row.news_type === '1') {
                            this.news_type_update = '兴唐新文';
                        } else {
                            this.news_type_update = '行业资讯';
                        }
                        this.new_info_title = row.news_title;
                        $(".note-editable")[0].innerHTML = row.news_content;
                        this.add_new.notice_item_flag = row.notice_item_flag;
                        if (row.intercepted_word_num) {
                            this.intercepted_word_num = Number(row.intercepted_word_num);
                        } else {
                            this.intercepted_word_num = 0;
                        }
                        this.add_new.status = this.row_info.status;
                    } else {
                        $(".note-editable")[0].innerHTML = '';
                        this.row_info = this.add_new;
                        this.add_or_update = '新增新闻';
                        this.new_info_title = '';
                        this.new_info_content = '';
                        this.intercepted_word_num = 0;
                    }

                },

                titlePage: function (type) {
                    switch (type) {
                        case 1:
                            if (this.row_info.get_first_picture_flag === '1') {
                                this.row_info.get_first_picture_flag = '0';
                            } else {
                                this.row_info.get_first_picture_flag = '1';
                            }
                            break;
                        case 2:
                            if (this.row_info.home_page_hot_flag === '1') {
                                this.row_info.home_page_hot_flag = '0';
                            } else {
                                this.row_info.home_page_hot_flag = '1';
                            }
                            break;
                        case 3:
                            if (this.row_info.home_page_recommend_flag === '1') {
                                this.row_info.home_page_recommend_flag = '0';
                            } else {
                                this.row_info.home_page_recommend_flag = '1';
                            }
                            break;
                        case 4:
                            if (this.row_info.intercepted_content_flag === '1') {
                                this.row_info.intercepted_content_flag = '0';
                            } else {
                                this.row_info.intercepted_content_flag = '1';
                            }
                            break;
                    }
                },

                onAddConfirm: function () {
                    let $obj = document.getElementById("news_type_add");
                    this.add_new.news_title = this.new_info_title;
                    this.add_new.news_type = $obj.options[$obj.selectedIndex].value;
                    this.add_new.get_first_picture_flag = this.row_info.get_first_picture_flag;
                    this.add_new.home_page_hot_flag = this.row_info.home_page_hot_flag;
                    this.add_new.home_page_recommend_flag = this.row_info.home_page_recommend_flag;
                    this.add_new.intercepted_content_flag = this.row_info.intercepted_content_flag;
                    this.add_new.intercepted_word_num = Number(this.intercepted_word_num);
                    // console.log(this.row_info.news_content);
                    // console.log(this.add_new)
                    var markupStr = $('#summernote').summernote('code');
                    this.add_new.news_content = markupStr;
                    this.add_new.intercepted_content = $(markupStr).text();
                    ajax_post(save_news, this.add_new.$model, this, this.is_check);
                    this.add_page = false;
                },
                // 分页功能
                queryProjectProgress:function () {
                    this.query_list.page_num = this.currentPage;
                    ajax_post(query_news_list, this.query_list.$model, this);
                },
                currentChange:function (currentPage) {
                    this.currentPage = currentPage;
                    this.queryProjectProgress();
                },
                on_request_complete: function (cmd, status, data, is_suc, msg) {
                    if (is_suc) {
                        switch (cmd) {
                            // 新增或修改
                            case save_news:
                                // console.log(data);
                                // this.complete_daily_pub(data);
                                toastr.success('成功');
                                this.clear_add_new();
                                ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
                                break;
                            // 分页查询新闻
                            case query_news_list:
                                // console.log(data);
                                this.news_info = [];
                                this.news_info = data.data.content;
                                this.total = data.totalElements;
                                if (this.api_type === 4) {
                                    $("#hot" + this.$idx)[0].checked = false;
                                }
                                break;
                            // 新闻发布
                            case status_by_id:
                                // console.log(data);
                                if (this.api_type !== 4) {
                                    toastr.success('成功');
                                }
                                this.clear_add_new();
                                for (let i = 0; i < this.news_info.length; i++) {
                                    document.getElementById(this.check + i).checked = false;
                                    document.getElementById('all_check').checked = false;
                                }
                                ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
                                break;
                            // 是否首页推荐
                            case home_flag_by_id:
                                this.clear_add_new();
                                if (this.api_type !== 4) {
                                    toastr.success('成功');
                                }
                                break;
                            case hot_flag_by_id:
                                this.clear_add_new();
                                if (this.api_type !== 4) {
                                    toastr.success('成功');
                                }
                                break;
                            // 批量通知
                            case notice_item:
                                this.clear_add_new();
                                ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
                                break;
                            case batch_remove:
                                this.clear_add_new();
                                ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
                                break;

                        }
                    } else {
                        toastr.error(msg);
                    }
                },
                // add_new 初始化
                clear_add_new: function () {
                    this.query_list = {
                        // 新闻标题
                        news_title: '',
                        // 新闻类型（1：兴唐新闻；2：行业资讯；）
                        news_type: '',
                        // 第几页
                        page_num: '0',
                        // 多少条数据
                        page_size: '15',
                    };
                    this.add_new = {
                        get_first_picture_flag: '1',
                        home_page_hot_flag: '0',
                        home_page_recommend_flag: '0',
                        id: '',
                        intercepted_content_flag: '0',
                        intercepted_content: '',
                        intercepted_word_num: 0,
                        news_content: '',
                        news_title: '',
                        news_type: '0',
                        notice_item_flag: '0',
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
                    console.log(this.ids)
                }
            });
            vm.$watch('onReady', function () {
                let token = window.sessionStorage.getItem("token");
                if (!token) { window.location.hash = '#'; }
                ajax_post(query_news_list, this.query_list.$model, this, this.is_check);
            });
            vm.$watch('new_title', function () {
                // vm.noticeData();
                console.log(vm.new_title)
            });
            vm.$watch('add_page', function () {
               vm.clear_add_new();
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
