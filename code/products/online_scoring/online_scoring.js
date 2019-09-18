/**
 * Created by Administrator on 2017/12/22.
 */
define([
        C.CLF('avalon.js'),
        C.Co("products", "online_scoring/online_scoring", "css!"),
        C.Co("products", "online_scoring/online_scoring", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice')
    ],
    function (avalon, css,html, layer,advice,page_title,notice) {

        var avalon_define = function () {
            var vm = avalon.define({
                $id: "online_scoring",
                // index:news1

            });
            return vm;
        }
        return {
            view: html,
            define: avalon_define
        }
    })
