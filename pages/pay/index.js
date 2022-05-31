/*
1.页面加载的时候
  1.从缓存中获取购物车数据 渲染到页面中
    这些数据 check=true
2.微信支付
    1.哪些人 哪些账号 可以实现微信支付
      1.企业账号
      2.企业账号的小程序后台 必须 给开发者 添加上白名单
        1.一个 appid 可以同时绑定多个开发者
        2.这些开发者就可以这个appid 和 他的权限
3.支付按钮
  1.先判断缓存中有没有token
  2.没有 跳转到授权页面 进行获取token
  3.有token
  4.创建订单 获取订单编号
  5.已经完成了微信支付 
  6.手动删除缓存中 已经被选中的商品
  7.删除后的购物车数据重新填充回缓存
  8.在跳转页面
*/

import { request } from "../../request/index";
import {requestPayment} from"../../utils/asyncWx.js";

Page({
  data:{
    address:{},
    cart:[],
    totalprice:0,
    totalnum:0,
  },

  onShow(){
    const address=wx.getStorageSync('address')||[];
    let cart=wx.getStorageSync('cart')||[];
    cart=cart.filter(v=>v.checked)
    // const allchecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address});

    let totalprice=0;
    let totalnum=0;
    cart.forEach(v=> {
        totalprice+=v.num*v.goods_price;
        totalnum+=v.num;
    });
    this.setData({
      cart,
      totalprice,
      totalnum,
      address
    })
  },
//点击支付
 async handleorderpay(){
   try {
     //1.判断缓存中有没有token
    const token=wx.getStorageSync("token");
    //判断
    if(!token){
      wx.navigateTo({
        url:'/pages/auth/index'
      });
      return;
    }
    // const header={Authorization:token};
    //3.创建订单 请求头参数
    //3.创建订单 请求体参数
    const order_price=this.data.totalprice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    
    const orderparams={order_price,consignee_addr,goods};
      //4.发送请求 创建订单 获取订单编号 
    const res=await request({url:"/my/orders/create",method:"POST",data:orderparams});
    const {order_number}=res.data.message;
    // 5.发起预支付接口
    const a=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
    const{pay}=a.data.message;
    
    await requestPayment(pay);
//7.查看后台订单状态
    const result=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
    
    wx.showToast({ title: '支付成功'});
    //8.手动删除缓存中 已经支付的商品
    let newcart=wx.getStorageSync("cart");
    newcart=newcart.filter(v=>!v.checked);
    // 支付成功后跳转页面
    wx.setStorageSync('cart', newcart)


    wx.navigateTo({
      url: '../order/index',
    })
   } catch (err) {
    wx.showToast({ title: '支付失败',icon: 'none' });
    console.log(err); 
   }
  },


})
