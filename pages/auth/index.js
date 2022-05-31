import { request } from "../../request/index";
import {login}from"../../utils/asyncWx.js";
// pages/auth/index.js
Page({
  //获取用户信息
async  bindGetuserInfo(e){
  try{
     //获取用户信息
    const{encryptedData,rawData,iv,signature}=e.detail;
    //2.获取小程序登录成功后code
    const {code}=await login();
    const loginparams={encryptedData,rawData,iv,signature,code}
        //3.发送请求获取用户的token
    const res=await request({url:"/users/wxlogin",data:loginparams,method:"post"});
    console.log(res);
    wx.setStorageSync('token', token);
    wx.navigateBack({
      delta:1
    });
      
  }catch(error){
    console.log(error);
    
  }
  
  }
})