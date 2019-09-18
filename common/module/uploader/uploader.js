/**
 * Created by maweifeng on 2017.04.27.
 */


define([
        C.CLF('avalon.js'),

        C.CM("uploader", "css!"),
        C.CM("uploader", "html!"),
        "plupload",
        C.CMF("data_center.js"),
        'layer'
    ],
    function (avalon,  css, html, plupload, data_center, layer) {
        var self = undefined;
        var uploader = undefined;
        var get_file = [];

        function previewImage(file, callback) {
            var get_name = file.name;
            var index1 = get_name.lastIndexOf(".");
            var index2 = get_name.length;
            var get_type = get_name.substring(index1, index2);//后缀名
            var s_get_type = get_type.toLowerCase();
            var is_v = true;
            var valid_fmt = ['.mp4', '.mov', '.avi', '.flv', '.swf', ".pdf", ".xls", ".xlsx", ".txt", ".docx", ".doc", ".jpg", ".jpeg", ".png", ".ppt", '.pptx'];

            // 判断文件格式
            if (valid_fmt.indexOf(s_get_type) < 0) {
                is_v = false;
                if (uploader.msg_format.indexOf(file.name) < 0)
                    uploader.msg_format.push(file.name);

            }
            // 判断文件大小
            if (file.size > 100 * 1024 * 1024) {
                is_v = false;
            }
            if (!is_v) {
                if (uploader.msg_format.indexOf(file.name) < 0)
                    uploader.msg_format.push(file.name);
                uploader.removeFile(file.id);
                callback && callback("", false, "");
                return;
            }

            if (file.type == 'image/gif') {
                //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                var fr = new mOxie.FileReader();
                fr.onload = function () {
                    callback(fr.result, true, "image/jpeg");
                    //fr.destroy();
                    //    fr = null;
                }
                fr.readAsDataURL(file.getSource());
            } else {
                if (s_get_type == ".jpg" ||
                    s_get_type == ".jpeg" ||
                    s_get_type == ".png"
                ) {
                    var preloader = new mOxie.Image();

                    preloader.onload = function () {
                        var is_valid = true;
                        // preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
                        //得到图片src,实质为一个base64编码的数据
                        var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL();

                        //preloader.destroy();
                        // preloader = null;
                        imgWidth = preloader.width;
                        imgHeight = preloader.height;
                        var get_img_name = preloader.name;
                        var ratio = imgWidth > imgHeight ? imgHeight / imgWidth : imgWidth / imgHeight;//长宽比
                        // if (imgWidth < 300 || imgHeight < 300 || ratio < 0.5 || ratio > 1) {
                        //     uploader.msg_size.push(get_img_name);
                        //
                        //     // console.log(self.files)
                        //     for (var i = 0; i < self.files.length; i++) {
                        //         if (file.id == self.files[i].id) {
                        //             self.on_remove_file(i);
                        //         }
                        //     }
                        //
                        //     uploader.removeFile(file.id);
                        //     is_valid = false;
                        //     //callback传入的参数为预览图片的url
                        // }
                        callback && callback(imgsrc, is_valid, "image/jpeg");
                    };
                    preloader.load(file.getSource());
                } else {
                    callback && callback(undefined, true, "");
                }

            }
        }

        function file_uploaded(uploader, file, responseObject) {
            var status = "success";
            var message = "";
            if (responseObject.status != 200) {
                status = "fail";
                message = "通信错误";
            }
            else {
                var vret = JSON.parse(responseObject.response);
                if (vret.status != 200) {
                    status = "fail";
                    message = vret.msg;
                }
                for (var x = 0; x < self.files.length; x++) {
                    if (self.files[x].id == file.id) {

                        self.files[x].status = status;
                        self.files[x].guid = vret.data.guid;
                        self.files[x].inner_name = vret.data.inner_name;
                        self.files[x].mini_type = vret.data.mini_type;
                        self.files[x].name = vret.data.name;
                    }
                }
            }

            self.n++;
        }

        function file_progress(uploader, file) {
            self.process = uploader.total.percent;

        }

        function complete(uploader, files) {
            self.process = 0;
            if (self.cb != undefined)
                self.cb(uploader, self.files, 'success')
        }

        function on_error(uploader, err) {

            if (self.cb != undefined)
                self.cb(uploader, self.files, err)
        }

        function on_add(up, files) {
            uploader.msg_format = [];
            uploader.msg_size = [];
            if (uploader.files.length > 9) {
                for (var i = 0; i < files.length; i++) {
                    uploader.removeFile(files[i].id);
                }
                layer.alert("<label>抱歉:</label>\r\n" + "最多只能上传9个文件", {skin: 'layui-layer-lan', closeBtn: 0, anim: 4});
                return true;
            }
            // 本地图片预览
            self.count = uploader.files.length;
            var review_count = uploader.files.length - files.length;
            files.forEach(function (file) {
                var local_file = file;
                previewImage(file, function (imgsrc, is_succ, minitype) {

                    if (is_succ) {
                        self.size += file.origSize;
                        review_count++;
                        self.files.push({
                            "src": imgsrc,
                            "guid": "",
                            "inner_name": "",
                            "mini_type": minitype,
                            "desc": "",
                            "status": "ready",
                            "rotation": 0,
                            "file_name": local_file.name,
                            "id": local_file.id,
                            'name': local_file.name
                        });


                    }

                    if (review_count >= uploader.files.length) {
                        var error_msg = "";

                        if (uploader.msg_format.length != 0) {
                            //抱歉,文件格式不支持!暂时只支持.png .jpg .jpeg .pdf .xls .txt .docx .mp4 .wmv .avi .rmvb格式的文件,并且视频大小不能大于100MB
                            var msg = "";
                            for (var i = 0; i < uploader.msg_format.length; ++i) {
                                if (msg != "")
                                    msg += ", ";
                                msg += "[" + uploader.msg_format[i] + "]";
                            }
                            error_msg = "<label>以下文件格式不支持:</label><br/>" + msg + ":<br/>";
                            error_msg += "<label style='color:red;'>暂时只支持.png .jpg .jpeg .并且视频大小不能大于100MB</label>"

                        }

                        if (uploader.msg_size.length != 0) {
                            //抱歉,文件格式不支持!暂时只支持.png .jpg .jpeg .pdf .xls .txt .docx .mp4 .wmv .avi .rmvb格式的文件,并且视频大小不能大于100MB
                            var msg = "";
                            for (var i = 0; i < uploader.msg_size.length; ++i) {
                                if (msg != "")
                                    msg += ",";
                                msg += "[" + uploader.msg_size[i] + "]";
                            }
                            error_msg += "<br/><label>以下文件长宽比不正确:</label><br/>" + msg + ":<br/>";

                            error_msg += "<label style='color:red'>图片要求:<br/>①长度大于等于300；<br/>②宽度大于等于300；<br/>③长宽比大于等于0.5小于等于1.0</label>"

                        }
                        if (error_msg != "") {
                            layer.alert("<label>抱歉:</label>\r\n" + error_msg, {
                                skin: 'layui-layer-lan',
                                closeBtn: 0,
                                anim: 4
                            });
                        }
                        if (uploader.files.length != 0) {
                            self.start();
                        }

                    }

                });
            })
        }

        var detail = avalon.component('ms-ele-uploader', {
            template: html,
            defaults: {
                as_json: function (data) {
                    return JSON.stringify(data)
                },
                opt: [],
                files: [],
                url: "",
                size: 0,
                token: sessionStorage.getItem("token"),
                name: "ttt",
                back_tip: "",
                id_prefix: "",
                process: -0,
                already_size: 0,
                n: 0,
                count: 10,


                current_hover: -1,
                is_modify: false,
                show_opt: false,
                icon_success: C.CI("success.png"),

                on_mouse_enter: function (idx) {

                    this.current_hover = idx;
                },
                on_mouse_leave: function (idx) {

                    this.current_hover = -1;
                },

                rotation_str: function (idx) {
                    var deg = 'rotate(' + this.files[idx].rotation + 'deg)'
                    return {
                        'WebkitTransform': deg,
                        'MosTransform': deg,
                        'OTransform': deg,
                        'transform': deg
                    }
                },
                json: function (x) {
                    return JSON.stringify(x)
                },
                // image_info: {
                //     "guid": "",
                //     "inner_name": "",
                //     "mini_type": "",
                //     "desc": "",
                //     "status": "",
                //     "rotation": 0,
                //     "src": "",
                //     'name':""
                // },
                clear: function () {
                    this.files = [];
                    for (var i = 0; i < this.files.length; i++) {
                        uploader.removeFile(this.files[i].id);
                    }
                },
                get_file_info: function () {
                    // console.info("正在提取:image"+this.image_info.$id)
                    // return this.image_info.$model;
                    return {
                        "guid": this.files.guid,
                        "inner_name": this.files.inner_name,
                        "mini_type": this.files.mini_type,
                        "desc": this.files.desc,
                        "status": this.files.status,
                        "rotation": this.files.rotation,
                        "name": this.files.name
                    };
                },
                rotate: function (idx, x) {
                    this.files[idx].rotation += x;
                    // 同步图片方向
                    ajax_post(api.api + "file/set_file_info", {
                        file_id: this.files[idx].guid,
                        rotation: this.files[idx].rotation
                    }, this)
                },
                on_request_complete: function(cmd, status, data, is_suc, msg){
                },
                url_image: function (src, guid) {
                    if (src != "" || src != undefined) {
                        return api.api + "file/get?img=" + guid + "&token=" + this.token;
                    }


                },
                is_sup_view: function (x) {
                    var ary = [];
                    ary.push('image/jpeg');
                    ary.push('image/png');
                    ary.push('image/jpeg');
                    if (ary.indexOf(x) >= 0)
                        return true;
                    return false;
                },
                cb: function () {

                },
                show_file_dia: function () {
                    $("#" + this.name).click();
                },
                on_remove_file: function (idx) {
                    if (this.files[idx].hasOwnProperty('id')) {
                        uploader.removeFile(this.files[idx].id);
                    }
                    this.files.removeAt(idx);
                    this.opt.removeAt(idx);
                    self.count = uploader.files.length;
                },
                start: function (cb) {
                    this.cb = cb;
                    uploader.start();
                },

                is_finished: function (a) {
                    for (var i = 0; i < this.files.length; i++) {
                        if (this.files[i]["guid"] == "")
                            return false
                    }
                    return true;

                },
                get_files: function () {
                    for (var i = 0; i < this.files.length; i++) {
                        this.files[i].src = '';
                    }
                    return this.files;
                    // var lists = data_center.get_sub_link(this.$id);
                    // var vret = []
                    // for( var i = 0; i < lists.length; i++ ){
                    //     vret.push(lists[i].get_file_info())
                    // }
                    // return vret;
                },
                onDispose: function () {
                    data_center.remove_link(this.$id)
                },
                onReady: function () {

                    data_center.link(this.$id, this);
                    self = this;

                    uploader = new plupload.Uploader({
                        runtimes: 'html5,flash,silverlight,html4',
                        // Maximum file size
                        // max_file_size: '100MB',
                        // chunk_size: '100MB',
                        //触发文件选择对话框的按钮，为那个元素id
                        browse_button: self.name,
                        //服务器端的上传页面地址
                        url: self.url,
                        //swf文件，当需要使用swf方式进行上传时需要配置该参数
                        flash_swf_url: '/js/lib/uploader/Moxie.swf',
                        //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                        silverlight_xap_url: '/js/lib/uploader/Moxie.xap,',
                        // 文件过虑
                        // filters: [
                        //     {title: "Image files", extensions: "jpg,gif,png"},
                        //     {title: "Zip files", extensions: "zip,avi"}
                        // ],
                        // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
                        dragdrop: true,
                        // fileNumLimit: '',//上传数量限制
                        // fileSizeLimit: 100*1024*1024,//限制上传所有文件大小
                        // fileSingleSizeLimit: 100*1024*1024,//限制上传单个文件大小100MB
                        headers: {
                            Token: self.token
                        },

                    });
                    uploader.bind("FileUploaded", file_uploaded);
                    uploader.bind("UploadProgress", file_progress);
                    uploader.bind("UploadComplete", complete);
                    uploader.bind("Error", on_error);
                    uploader.bind("FilesAdded", on_add);
                    uploader.init();
                    //this.uploader('notify', 'info', "This might be obvious, but you need to click 'Add Files' to add some files.");
                },
                quit: function () {
                },
                who: detail
            }
        })
        return {
            control: detail
        }
    })