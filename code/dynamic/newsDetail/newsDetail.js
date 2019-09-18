/**
 * Created by Administrator on 2017/12/22.
 */
define([
        C.CLF('avalon.js'),
        C.Co("dynamic", "newsDetail/newsDetail", "css!"),
        C.Co("dynamic", "newsDetail/newsDetail", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice')
    ],
    function (avalon, css,html, layer, advice,page_title,notice) {

        var avalon_define = function () {
            var vm = avalon.define({
                $id: "newsDetail",
                thumbsNum:0,
                //点赞
                thumbs:function(){
                    // console.log($('.thumbs-num').text());
                    // var thumbsNum=$('.thumbs-num').text();
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
