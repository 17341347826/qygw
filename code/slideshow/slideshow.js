/**
 * Created by Administrator on 2017/12/12.
 */
define([ C.CMF("router.js")],
    function ( x) {
        var on_by_config = {
            // ============================轮播图管理============================
            "/slideshow": "slideshow/slideshow.js",
            // ============================轮播图管理============================
            "/slideManage": "slideManage/slideManage.js",
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "slideshow");
        }
        return {
            init: init
        }
    });