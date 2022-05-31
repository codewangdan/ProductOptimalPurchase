// 引入，用来发送请求的 小程序方法一定要把路径补全js
import {request} from "../../request/index";
Page({

  data: {
    //  轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数据
    floorList:[],
    
  },

  // 页面开始加载就会触发
onLoad: function(options) {
// 发送异步请求获取轮播图数据
  // wx.request({
  //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  //   success: (result)=>{
  //     this.setData({
  //       swiperList:result.data.message
  //     })
  //   },
  // });
  // 请求成功后传到then
  this.getSwiperList();
  this.getCatesList();
  this.getFloorList();
},
// 获取轮播图数据
 getSwiperList(){
  request({url:"/home/swiperdata"})
  .then(result=>{
    this.setData({
        swiperList:result.data.message
      })
  })
 },
//  获取 分类导航数据
getCatesList(){
  request({url:"/home/catitems"})
  .then(result=>{
    this.setData({
      catesList:result.data.message
      })
  })
 },
//  获取楼层数据
getFloorList(){
  request({url:"/home/floordata"})
  .then(result=>{
    this.setData({
      floorList:result.data.message
      })
  })
 },  
  
})