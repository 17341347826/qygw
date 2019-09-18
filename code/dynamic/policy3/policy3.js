/**
 * Created by Administrator on 2017/12/27.
 */
define([
        C.CLF('avalon.js'),
        C.Co("dynamic", "policy3/policy3", "css!"),
        C.Co("dynamic", "policy3/policy3", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice')
    ],
    function (avalon, css,html, layer,advice,page_title,notice) {

        var avalon_define = function () {
            var vm = avalon.define({
                $id: "policy3",
                thumbsNum:109,
                //点赞
                thumbs:function(){
                    this.thumbsNum++;
                    $('.thumbs-num').text();
                }
            });
            return vm;
        }
        return {
            view: html,
            define: avalon_define
        }
    })
