/**
 * Created by Administrator on 2017/12/12.
 */
define([ C.CMF("router.js")],
    function (x) {
        var on_by_config = {
            // ============================新闻管理============================
            "/newsManage": "newsManage/newsManage.js",
            // ============================企业新闻============================
            "/newsCenter": "newsCenter/newsCenter.js",
            // ============================行业资讯============================
            "/policyNews": "policyNews/policyNews.js",
            // ============================新闻详情============================
            "/newsDetail": "newsDetail/newsDetail.js",

            // ============================企业新闻详情============================
            "/news1": "news1/news1.js",
            "/news2": "news2/news2.js",
            "/personal": "news3/news3.js",
            // ============================行业资讯详情============================
            "/policy1": "policy1/policy1.js",
            "/policy2": "policy2/policy2.js",
            "/policy3": "policy3/policy3.js"
        };
        function init(main) {
            x.on_by_config(on_by_config, main, "dynamic");
        }
        return {
            init: init
        }
    });