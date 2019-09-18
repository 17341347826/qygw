/**
 * Created by uptang on 2017.04.26.
 */
//const里面自定义的模块：require.js的用法--模块的加载
require.config(glb_staus.map);
require([
        C.CLF("avalon.js"),
        C.CMF("header/header.js"),
        C.CMF("footer/footer.js"),
        C.Com("about"),
        C.Com("products"),
        C.Com("dynamic"),
        C.Com("slideshow"),
        C.Com("service"),
        C.Com("systems"),
        C.Com("investment"),
        C.CMF("router.js"),
        C.CMF("data_center.js")
    ],
    function(avalon, header,footer,about,products,dynamic,slideshow,service,systems,investment,
        x, data_center) {
        // data_center.uin(function(resp) {
        //     var user_type = resp.data.user_type;
        //     var user_info = JSON.parse(resp.data["user"]);
        //     console.info(user_info);

            var ary_session = ["", "", "", "", "", ""];

            var main = avalon.define({
                $id: "main",
                data: {
                    page_index: -1,
                    // bodys: [
                    //     { view: "", ctrl: null, url: ary_session[0] },
                    //     { view: "", ctrl: null, url: ary_session[news1] },
                    //     { view: "", ctrl: null, url: ary_session[2] },
                    //     { view: "", ctrl: null, url: ary_session[3] },
                    //     { view: "", ctrl: null, url: ary_session[4] }
                    // ],
                    body:{ view: "", ctrl: null, url: ary_session[0] },
                   // menu: menu.menu(user_type),
                   // user: user_info,
                },
                is_show_menu:false,
                change_menu:function () {
                    $(".head-menu").hide();
                    // $(".head-left ul li").removeClass('menu-active');
                }
            });
            main.$watch('onReady', function() {
                $("#wait").remove();
            });

            x.on("/", "home.js", main);

            about.init(main);
            products.init(main);
            dynamic.init(main);
            slideshow.init(main);
            service.init(main);
            systems.init(main);
            investment.init(main);
            // all_index.init(main);
            // evaluation_item.init(main);
            // stu_comment.init(main);
            x.start("/");
            avalon.scan(document.body)

       // })

    }
);