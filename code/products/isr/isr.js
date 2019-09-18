/**
 * Created by Administrator on 2017/12/22.
 */
define([
        C.CLF('avalon.js'),
        C.Co("products", "isr/isr", "css!"),
        C.Co("products", "isr/isr", "html!"),
        "layer",
        C.CM('advice'),
        C.CM('page_title'),
        C.CM('notice')
    ],
    function (avalon, css,html, layer, advice,page_title,notice) {

        var avalon_define = function () {
            var vm = avalon.define({
                $id: "isr",
                // index:news1

            });
            return vm;
        }
        return {
            view: html,
            define: avalon_define
        }
    })
