/**
 * Created by uptang on 2017/4/28.
 */
define([
        C.CLF('avalon.js'),
        C.CM("pagination", "html!"),
        C.CM("pagination", "css!"),
        "jquery", C.CMF("data_center.js")],
    function (avalon, html, css, $, data_center) {
        var vm = avalon.component('ms-ele-pagination', {
            template: html,
            defaults: {
                // 每页条数
                pageSize:15,
                // 数据总数
                total:0,
                /*总页数*/
                pageCount: 0,
                // 计算分页
                totalPageArr: [],
                /*当前是第几页*/
                currentPage:0,
                offset:0,
                currentChange:null,
                onReady: function () {
                    this.$watch('currentPage',function (currentPage) {
                        this.setTotalPage();
                    });
                    this.$watch('total',function (total) {
                        if(total === undefined || total === null) {
                            this.total = 0;
                        }
                        this.setTotalPage();
                    });
                    this.setTotalPage();
                },
                /*设置总页数*/
                setTotalPage: function () {
                    if (this.total == 0) {
                        this.pageCount = 1;
                        this.totalPageArr = new Array(this.pageCount);
                    } else {
                        if (this.total % this.pageSize == 0) {
                            this.pageCount = Math.floor(this.total / this.pageSize);
                        } else {
                            this.pageCount = (Math.floor(this.total / this.pageSize)) + 1;
                        }
                        if (this.pageCount >= 5) {
                            this.totalPageArr = this.page_data(this.currentPage, 5);
                        } else {
                            this.totalPageArr = this.page_data(this.currentPage, this.pageCount);
                        }
                    }
                },
                currentPageDate:function (currentPage) {
                    this.currentPage = currentPage;
                    if(this.currentChange && typeof this.currentChange == 'function') {
                        this.currentChange(currentPage);
                    }
                },
                // 计算当前开始显示的页码
                page_data: function (currentPage, pageCount) {
                    var x = 0, z = 0;
                    var x_len = 0, y_len = 0;
                    if (pageCount % 2 == 0) {
                        x_len = pageCount / 2;
                        y_len = pageCount / 2 - 1
                    } else {
                        x_len = (pageCount - 1) / 2;
                        y_len = x_len
                    }
                    x = currentPage - x_len;
                    z = currentPage + y_len;
                    if (x < 0 && z >= this.pageCount)
                        return new Array(this.pageCount);
                    var over_x = 0 - x > 0 ? 0 - x : 0;
                    z += over_x;
                    if (z >= this.pageCount) {
                        var over_y = z - this.pageCount + 1;
                        z = this.pageCount;
                        x -= over_y;
                    }
                    x = x > 0 ? x : 0;
                    this.offset = x;
                    return new Array(pageCount)
                }
            }
        });
    });