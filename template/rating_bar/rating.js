function changeTap(page, e, fn) {
    console.log(e)
    // console.log(e.touches[0].clientX)
    var x = (e.touches[0].clientX + 10 - e.currentTarget.offsetLeft) * page.data.pixelRatio;
    // console.log(e.touches[0].clientX * this.data.pixelRatio)
    var n = parseInt(x / 45)
    // var m = parseInt(x * 2 / 45 % 2)
    var arr = []
    for (var a = 0; a < 5; a++) {
        if (a < n) {
            arr[a] = '/images/star.png';
        }
        // else if (m == 1 && a == n) {
        //     arr[a] = '/images/star_half.png'
        // }
        else {
            arr[a] = '/images/star_grey.png';;
        }
    }
    // if (m == 1) {
    // console.log(n + .5)
    // fn(n + .5)
    // } else {
    console.log(n)
    fn(n)
    // }
    page.setData({
        star_state: arr
    })

}

function setStars(page, num) {
    var n = num / 2
    // var m  = num%2
    // console.log(n + "----" + m)
    var arr = []
    for (var a = 0; a < 5; a++) {
        if (a < n) {
            arr[a] = '/images/star.png';
        }
        // else if (m == 1 && a == n) {
        // arr[a] = '/images/star_half.png'
        // }
        else {
            arr[a] = '/images/star_grey.png';;
        }
    }
    page.setData({
        star_state: arr
    })
}

function setPageRatio(page) {
    var info = wx.getSystemInfoSync()
    page.setData({
        pixelRatio: info.pixelRatio
    })
}


module.exports = {
    changeTap: changeTap,
    setPageRatio: setPageRatio,
    setStars: setStars
}