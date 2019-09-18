/**
 * Created by Administrator on 2017/12/12.
 */
define([ C.CMF("router.js")],
    function ( x) {
        var on_by_config = {
            // ============================教育质量综合评价============================
            "/investmentManage": "investmentManage/investmentManage.js",
            // ============================教育质量综合评价============================
            "/investmentCenter": "investmentCenter/investmentCenter.js",
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "investment");
        }
        return {
            init: init
        }
    });