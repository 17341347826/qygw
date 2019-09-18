/**
 * Created by Administrator on 2017/12/12.
 */
define([C.CMF("router.js")],
    function ( x) {
        var on_by_config = {
            // ============================教育质量综合评价============================
            "/product": "product/product.js",
            // ============================OMR============================
            "/OMR": "OMR/OMR.js",
            // ============================网上阅卷============================
            "/online_scoring": "online_scoring/online_scoring.js",
            // ============================isr============================
            "/isr": "isr/isr.js",
            // ============================项目管理============================
            "/productsManage": "productsManage/productsManage.js",
            // ============================项目管理============================
            "/productPicture": "productPicture/productPicture.js"
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "products");
        }
        return {
            init: init
        }
    });