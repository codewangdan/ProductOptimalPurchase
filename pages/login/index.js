// pages/login/index.js
Page({
  handleGetUserInfo(e){
    // console.log(e);
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
  //跳回上一页
  wx.navigateBack({
    delta:1
  })
  }
  
})