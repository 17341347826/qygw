/**
 * Created by Administrator on 2017/4/17.
 */
var HTTP_X = location.origin+"/";
prefix_base = HTTP_X;
// prefix_base = "http://" + window.location.host + "/";
prefix_common_img = prefix_base + "common/img/";
prefix_common_mod = prefix_base + "common/module/";
prefix_lib = prefix_base + "common/lib/";
prefix_code = prefix_base + "code/";

C = {
    CB: function(x) {
        return prefix_base + x;
    },
    CBF: function(x, tag) {
        var suffix = ""
        if (!tag) {
            suffix = ".js";
        }
        return (tag || "") + prefix_base + x + suffix;
    },
    // 加载通用模块
    // Common Model
    CM: function(x, tag) {
        var suffix = ""
        if (!tag) {
            suffix = ".js";
        }
        return (tag || "") + prefix_common_mod + x + "/" + x + suffix;
    },
    // 加载通用模块中的文件
    CMF: function(x, tag) {
        return (tag || "") + prefix_common_mod + x;
    },
    // 加载外部库
    // Common Library
    CL: function(x, tag) {
        return (tag || "") + prefix_lib + x + "/" + x;
    },
    // 加载外部库-加载文件
    // Common Library File
    // 主要用于处理:
    // avalon/avalon.js
    // 
    CLF: function(x, tag) {
        return (tag || "") + prefix_lib + x;
    },
    // 加载模块
    // Code
    Co: function(p, m, tag) {
        return (tag || "") + prefix_code + p + "/" + m;
    },
    // 加载模块C.Co2("weixin_xy/daily", "list", "css!"),
    Co2: function(p, m, tag) {
        return (tag || "") + prefix_code + p + "/" + m + '/' + m;
    },
    // 加载模块集
    // C original model
    Com: function(p) {
        return prefix_code + p + "/" + p + ".js";
    },
    // 加载通用模块
    // Common Model
    CP: function(x, tag) {
        return (tag || "") + prefix_common_mod + x + "/" + x;
    },
    //通用图片
    CI: function(x) {
        return prefix_common_img + x;
    }
};
// url_api_base="http://pj.xtyun.net:8014/api/";
// url_api_base=" http://dev.xtyun.net:8014/api/";
url_api_base=HTTP_X+'api/';
// 全局标志位
api = {
    current_url: "",
    com_set: {},
   //router: "news1.0.2",
   //  PCPlayer: url_api_base + "base/",
   //  growth: url_api_base + "GrowthRecordBag/",
    api: url_api_base,
    api_file: url_api_base,
    //  user: url_api_base + "base/",
   //  skip_on_not_login: "http://pj.xtyun.net:8014/index.html"
    skip_on_not_login:   HTTP_X + "/index.html"
};
glb_staus = {
    is_debug: true,
    inner: true,
    map: {
        "paths": {
            "text": C.CLF("require/text"),
            "css": C.CLF("require/css"),
            "html": C.CLF("require/html"),
            "lodash": "https://cdn.bootcss.com/lodash.js/4.17.4/lodash.min",
            "layer": "https://cdn.bootcss.com/layer/3.0/layer.min",
            "amazeui": "https://cdn.bootcss.com/amazeui/2.7.2/js/amazeui.min",
            // jquery 必须放于path 中，否则jquery会加载失败。require.js内部对jquery进行了amd处理
            "jquery": C.CLF("jquery.min"),
            "jquery_print":C.CLF("jQuery.print"),
            "tinyeditor": C.CLF("tinyeditor"),
            "PCAS": C.CP("pcasclass"),
            "plupload": C.CLF("uploader/plupload.full.min"),
            // "select2": "https://cdn.bootcss.com/select2/4.0.3/js/select2.min",
            "date_time_picker": C.CLF("amazeui.datetimepicker.min"),
            "date_zh": C.CLF("datetimepicker.zh"),
            "boot_time": C.CLF("bootstrap-datetimepicker"),
            "date_picker": C.CLF("bootstrap-datetimepicker"),
            "prettify": C.CLF("prettify"),
            "query_scrollbar": C.CLF("query.scrollbar"),
            "jsbn": C.CLF("jsbn"),
            "prng4": C.CLF("prng4"),
            "rng": C.CLF("rng"),
            "rsa": C.CLF("rsa"),
            "froala_editor": C.CLF("froala_editor-141021225227/js/froala_editor.min"),
            "froala_editor_tables": C.CLF("froala_editor-141021225227/js/plugins/tables.min"),
            "froala_editor_lists": C.CLF("froala_editor-141021225227/js/plugins/lists.min"),
            "froala_editor_colors": C.CLF("froala_editor-141021225227/js/plugins/colors.min"),
            "froala_editor_media_manager": C.CLF("froala_editor-141021225227/js/plugins/media_manager.min"),
            "froala_editor_font_family": C.CLF("froala_editor-141021225227/js/plugins/font_family.min"),
            "froala_editor_font_size": C.CLF("froala_editor-141021225227/js/plugins/font_size.min"),
            "froala_editor_block_styles": C.CLF("froala_editor-141021225227/js/plugins/block_styles.min"),
            "froala_editor_video": C.CLF("froala_editor-141021225227/js/plugins/video.min"),
            "summernote_min": C.CLF("summernote/summernote"),
            "summernote_zh_cn": C.CLF("summernote/lang/summernote-zh-CN"),
            "bootstrap": C.CLF("bootstrap/js/bootstrap.min")
            // "jsencrypt":C.CLF("jsencrypt"),
            // "jsencrypt_min":C.CLF("jsencrypt.min")
            // "JSEncrypt":"https://cdn.bootcss.com/jsencrypt/2.3.1/jsencrypt"
            // "highcharts":"https://cdn.bootcss.com/highcharts/6.0.news1/highcharts",
            // "highcharts_more":"https://img.hcharts.cn/highcharts/highcharts-more",
            // "exporting":"https://img.hcharts.cn/highcharts/modules/exporting",
            // "highcharts-zh_CN":"https://img.hcharts.cn/highcharts-plugins/highcharts-zh_CN",
            // "hls": C.CLF("hls.min")
            //地图
            // "ditu":"http://api.map.baidu.com/api?v=2.0&ak=A1LU7iHS0avqQwPLAxbhKn0UYSQCuRVH",
            // "jqueryDit":"http://www.jq22.com/jquery/jquery-news1.10.2.js",
            // "jquery1": C.CLF("jquery.baiduMap.min")
        },
        waitSeconds: 90,
        shim: {
            'summernote_min':{
                deps: [
                    'jquery'
                ],
                exports: 'summernote_min'
            },
            'summernote_zh_cn':{
                deps: [
                    'summernote_min'
                ],
                exports: 'summernote_zh_cn'
            },
            'plupload': {
                deps: [
                    'jquery'
                ],
                exports: 'plupload'
            },
            "froala_editor":{
                deps: [
                    'jquery'
                ],
                exports: 'PCAS'
            },
            'PCAS': {
                deps: [
                    'jquery'
                ],
                exports: 'PCAS'
            },
            'base': {
                deps: [
                    'jquery'
                ],
                exports: 'base'
            },
            'layer': {
                deps: [
                    'jquery'
                ],
                exports: 'layer'
            },
            'highcharts': {
                deps: [
                    'jquery'
                ],
                exports: 'highcharts'
            },
            'highcharts_more': {
                deps: [
                    'jquery'
                ],
                exports: 'highcharts_more'
            },
            'exporting': {
                deps: [
                    'jquery'
                ],
                exports: 'exporting'
            },
            'hls':{
                deps:[
                    'jquery'
                ],
                exports: 'hls'
            }
        }
    }
};