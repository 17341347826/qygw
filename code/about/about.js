/**
 * Created by Administrator on 2017/12/11.
 */
define([ C.CMF("router.js")],
    function ( x) {
        var on_by_config = {
            // ============================企业文化============================
            "/aboutUs": "aboutUs/aboutUs.js",
            // ============================联系我们============================
            "/contactUs": "contactUs/contactUs.js",
            // ============================招聘============================
            "/recruit": "recruit/recruit.js",
            // ============================兴唐简介============================
            "/uptangIntro": "uptangIntro/uptangIntro.js"
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "about");
        }
        return {
            init: init
        }
    });