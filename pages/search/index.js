/*
1.输入框绑定 值改变事件 input事件
  1.获取到输入框的值
  2.合法性判断
  3.校验通过 把输入框的值 发送的后台
  4.返回的数据打印到页面上
2.防抖（防止抖动）节流 输入稳定才发生请求
  1.上拉下拉
*/

import { request } from "../../request/index";

Page({
  //请求成功后赋值
  data: {
    goods:[],
    //取消 按钮 显示隐藏
    isFocus:false,
    inpValue:""
  },
  TimeId:-1,
  //输入框的值改变 就会触发事件
  handleInput(e){
    //1.获取输入框的值
    const {value}=e.detail;
    //2.检验合法性
    if(!value.trim()){
      clearTimeout(this.TimeId);
      this.TimeId=setTimeout(() => {
          this.setData({
            goods:[],
            isFocus:false,
          })
    }, 500);
      return;
    }
    this.setData({
      isFocus:true,
    })
    //防抖 3.准备发送请求获取数据
    clearTimeout(this.TimeId);
    //发送请求数据
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
    
  },
//发送请求获取搜索建议 数据
  async qsearch(query){
    const res=await request({url:"/goods/search",data:{query}})
    this.setData({
      goods:res.data.message.goods,
    })
  },

  handlecancle(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
})