/**
 * Created by Administrator on 2017/12/21.
 */
define([
        C.CLF('avalon.js'),
        C.CM("page_title", "css!"),
        C.CM("page_title", "html!"),
        "layer"
    ],
    function(avalon,css,html,layer){
        var detail=avalon.component('ms-ele-title',{
            template:html,
            defaults: {
                //一级菜单名
                menuName:'',
                //当前二级菜单下的第一个页面路径
                firstPath:'',
                //二级菜单名
                pageName:'',
                //二级页面路径
                pagePath:'',
                //详情页面名
                pageDetail:'',
                //详情页面路径
                detailPath:'',
                //状态（是否有三级页面）：true:有；false:没有
                path_type:'',
                //二级页面跳转
                pageTurn:function(path){
                    window.location='#'+path;
                }
            }
        })
});