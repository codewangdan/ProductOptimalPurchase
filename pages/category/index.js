// 引入，用来发送请求的 小程序方法一定要把路径补全js
import {request} from "../../request/index";
// pages/category/index.js
Page({


  data: {
    // 左侧菜单数据
    leftContent:[],
    // 右侧菜单数据
    rightContent:[],
    // 被点击的左侧菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    // scrollTop=0
  },
  // 接口的返回数据
  Cates:[],

  onLoad(options) {
    /*
    0 . web中本地存储和小程序的本地存储的区别
      1.写代码的方式不一样
      web: localStorage.setItem("key",“value”）;localStorage.getItem("key")
      小程序中：wx.getStorageSync("key",“value”）;wx.getStorageSync("key")
    1.先判断本地存储数据有没有旧的数据
    {time:Data.now(),data:[...]}
    2.没有旧数据 直接发送新请求
    3.有旧的数据同时 旧的数据也没有过期 就使用 本地存储中的数据即可
    */
    // this.getCates();
    // 1.获取本地存储中的数据 （小程序中也是存在本地存储 技术）
    const Cates = wx.getStorageSync("cates");
    //2.判断
    if(!Cates){
      //不存在 发送请求获取数据
      this.getCates();
    }else{
      //存在旧数据 定义过期时间 10s 改成 5分钟
      if(Date.now()-Cates.time>1000*10){
        //重新发送数据
        this.getCates();
      }else{
        //可以使用旧的数据
        this.Cates=Cates.data;
         // 构造左侧的大菜单数据
         let leftMenuList=this.Cates.map(v=>v.cat_name);
         // 构造右侧的商品数据
         let rightContent=this.Cates[0].children;
         this.setData({
           leftMenuList, 
           rightContent
         })
      }

    }
  },
  // 获取分类数据
  getCates(){
    request({
      url: "/categories"
    })
      .then(res =>{
        // console.log(res);
        // Cates:[],
        this.Cates=res.data.message;

        //把接口的数据存到本地存储中
        wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})

        // 构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        // 构造右侧的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList, 
          rightContent
        })

      })
  },
  // 左侧菜单点击事件
  handleItemTap(e){
    
    // 1.获取被点击的标题身上的索引
    // 2.给data中的currentIndex赋值就可以
    // 3.根据不同的商品索引来渲染右侧商品的内容
    const {index} = e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index, 
      rightContent,
    // scrollTop重新设置 右侧内容的scroll-view标签距离顶部距离
      // scrollTop:0
    })
  }
})