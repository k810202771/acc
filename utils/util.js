function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function isUserSelfComment(info, comments) {
  if(!info){
    return;
  }
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].user.objectId == info.objectId) {
      comments[i].isUser = true;
    }
  }
}

function delete_comment(objectId, apiUtils,fn,page) {
  var info = wx.getStorageSync('zyx_user')
  apiUtils.AJAX('/v1/user/comment?objectId='+objectId+'&sessiontoken='+info.sessiontoken, function (res) {
    if (res.data.status) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000
      })
      fn()
       var counts= page.data.counts
     counts.comment=  parseInt(counts.comment)-1
       page.setData({
       counts:counts
       })

       if(page.data.results){
         var results = page.data.results
         results.commentCount=  parseInt(results.commentCount)-1
         page.setData({
           results:results
         })
       }

    }

  }, 'DELETE', { objectId: objectId,
  sessiontoken:info.sessiontoken
   })

}


function  del_comment(page,e,fn,apiUtils) {
  
    // console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '评论删除',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          console.log(e.currentTarget.dataset.id)
          delete_comment(e.currentTarget.dataset.id,apiUtils,fn,page)
        }
      }
    })
  }

var arr = new Array()
arr['室内定位'] = '/images/tag_indoor.png'
arr['实地展览'] = '/images/tag_off_ine.png'
arr['线上展览'] = '/images/tag_on_line.png'
arr['展览资讯'] = '/images/tag_zhan_xun.png'

module.exports = {
  formatTime: formatTime,
  type_arr: arr,
  isUserSelfComment: isUserSelfComment,
  // delete_comment:delete_comment
  del_comment:del_comment
}
