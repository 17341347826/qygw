/**
 * Created by Administrator on 2017/12/4.
 */
define([
        C.CLF('avalon.js'),
        C.Co("systems", "system/system", "css!"),
        C.Co("systems", "system/system", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice'),
        "amazeui"
    ],
    function (avalon, css,html, layer, advice,page_title,notice,amazeui) {
        //成长激励卡公示列表
        var api_card_pub=api.api+'everyday/page_gain_card_by_status';
        var avalon_define = function () {
            var vm = avalon.define({
                $id: "system",
                have_logo: false,
                previewFile: function () {
                    var preview = document.getElementById('logo');
                    var file = document.querySelector('input[type=file]').files[0];
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        preview.src = reader.result;
                    };

                    if (file) {
                        reader.readAsDataURL(file);
                        vm.have_logo = true;
                    } else {
                        preview.src = "";
                        vm.have_logo = false;
                    }
                }
            });
            vm.$watch('onReady', function () {
                // vm.noticeData();
                // ajax_post(api_card_pub,this.form_list_score.$model,this);
            });
            vm.$watch('new_title', function () {
                // vm.noticeData();
                console.log(vm.new_title)
            });
            return vm;
        };
        return {
            view: html,
            define: avalon_define
        }
    });
