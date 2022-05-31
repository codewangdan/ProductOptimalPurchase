// pages/user/index.js
Page({

  data: {
    userinfo:{},
    //被收藏数组的数量
    collectNums:0
  },

  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    const collect=wx.getStorageSync("collect")||[];
    this.setData({userinfo,collectNums:collect.length});
  },




  handleGetuserInfo(e){
    // console.log(e);
    
    const{userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.reLaunch({
      url: '/pages/user/index',
    })
  }
})