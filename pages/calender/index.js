/**
 * Created by User on 2016/10/25.
 */

var myDate = new Date();
var month = myDate.getMonth();
var year = myDate.getFullYear();

/**
 * 月份天数表
 * @type {*[]}
 */
var dayOfMonth = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

/**
 * 判断当前年是否闰年
 * @param year 年
 * @returns {number}
 */
var isLeapYear = (year) => {
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
        return 1
    else
        return 0
};

/**
 * 获取当月有多少天
 * @param year 年
 * @param month 月(未减1)
 * @returns {*}
 */
var get_day = (year, month) => {
    return dayOfMonth[isLeapYear(year)][month];
};

var apiUtils = require('../../utils/apiUtils.js')
Page({
    data: {
        colors: [],
        week: ["日", "一", "二", "三", "四", "五", "六"],
        monthStart: (new Date(year, month, 1)).getDay(),
        day: get_day(year, month),
        date: year + '年' + (month + 1) + '月',
        c_date: '',
        city: '',
        exhibitionData: [],
        page: 1,
        limit: 10
    },

    switchMonth(e) {
        this.takeColor()
        this.switchType(e.target.dataset.type)

    },

    //切换年月
    switchDate(y, m) {  //调用此方法切换指定时间

        //重置年月
        year = y;
        month = m - 1;
        this.setData({
            day: get_day(year, month),
            date: year + "年" + (month + 1) + "月",
            monthStart: (new Date(year, month, 1)).getDay()
        });

    },
    switchType(direction) {
        switch (+direction) {
            case 0:    //左切
                if (month == 0) {
                    year--;
                    month = 11;
                } else {
                    month--;
                }
                break;
            case 1:    //右切
                if (month == 11) {
                    year++;
                    month = 0;
                } else {
                    month++;
                }
                break;
        }
        this.switchDate(year, month + 1);
    }

    ,

    clickItem(e) {
        var day = e.target.dataset.day;
        console.log(e.target)
        console.log(year + '-' + (month + 1) + '-' + day);
        this.setData({
            c_date: year + '-' + (month + 1) + '-' + day
        })

        var row = e.target.dataset.row;
        var col = e.target.dataset.col;
        if (!day) {

            if (row < 3) {
                this.takeColor()
                this.switchType(0)
            } else {
                this.takeColor()
                this.switchType(1)
            }
            return;
        }


        console.log(col + "-----" + row)
        this.takeColor()
        var colors = this.data.colors
        colors[row][col] = 'calendar__item2';
        this.setData({
            colors: colors
        })
        this.reset_data()
        this.request_calendar_data()

    },
    onLoad() {
        this.takeTodayColor()


    },
    onShow() {
        var date = new Date()
        console.log(date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate())

        if (!this.data.c_date) {
            this.setData({
                c_date: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
            })
        }
        var city = wx.getStorageSync('city')

        console.log(city)
        if (!city) {
            city = '北京市'
        }
        if (city == this.data.city) {
            return;
        }
        this.setData({
            city: city
        })
        this.reset_data()
        this.request_calendar_data()


    },

    onReady() {



        //切换年份
        // this.switchDate(2017,4);

    },
    takeColor() {
        var day = new Date().getDate();
        var a = []
        for (var i = 0; i < 6; i++) {
            var b = [];
            for (var o = 0; o < 7; o++) {
                b[o] = 'calendar__item';
            }
            a.push(b)
        }
        this.setData({ colors: a })
        // console.log(this.data.monthStart)
    },
    takeTodayColor() {
        var day = new Date().getDate();
        var a = []
        for (var i = 0; i < 6; i++) {
            var b = [];
            for (var o = 0; o < 7; o++) {
                // console.log(i*6+o+'----'+day+'----'+this.data.monthStart) 
                if (i * 7 + o + 1 == day + this.data.monthStart) {
                    b[o] = 'calendar__item2'
                } else {
                    b[o] = 'calendar__item';
                }



            }
            a.push(b)
        }
        this.setData({ colors: a })
        // console.log(this.data.monthStart)
    },

    naviCityList() {
        wx.navigateTo({
            url: '../citylist/index',
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })

    },
    calender_lower(e) {
        console.log(e)
        this.setData({
            page: this.data.page + 1
        })
        this.request_calendar_data()
    },
    request_calendar_data() {
        var that = this;
        wx.showNavigationBarLoading()
        console.log('/v1/calendar?city=' + this.data.city + '&date=' + this.data.c_date)



        apiUtils.AJAX(encodeURI('/v1/calendar?city=' + this.data.city + '&date=' + this.data.c_date + '&page=' + this.data.page + '&limit=' + this.data.limit), function (res) {
            console.log(res.data)
            wx.hideNavigationBarLoading()

            var exhibitionData = that.data.exhibitionData.concat(res.data.results)
            that.setData({
                exhibitionData: exhibitionData,
            })

        })
    },
    exhibition_item_click: function (e) {
        wx.navigateTo({
            url: '../main_page/zhanxun/index' + '?id=' + e.currentTarget.dataset.id
        })
    },
    reset_data() {
        this.setData({
            exhibitionData: [],
            page: 1
        })
    }

});