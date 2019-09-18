/**
 * Created by Administrator on 2017/12/12.
 */
define([C.CMF("router.js")],
    function (x) {
        var on_by_config = {
            // ============================新闻管理============================
            "/system": "system/system.js",
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "systems");
        }
        return {
            init: init
        }
    });