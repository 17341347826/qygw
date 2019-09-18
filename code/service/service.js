/**
 * Created by Administrator on 2017/12/12.
 */
define([ C.CMF("router.js")],
    function ( x) {
        var on_by_config = {
            // ============================下载管理============================
            "/downloadManage": "downloadManage/downloadManage.js",
            // ============================下载中心============================
            "/downloadCenter": "downloadCenter/downloadCenter.js",
            // ============================下载中心============================
            "/solution": "solution/solution.js",
            // ============================方案管理============================
            "/schemeManage": "schemeManage/schemeManage.js",
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "service");
        }
        return {
            init: init
        }
    });