/*
1.发送请求获取数据
2.点击轮播图 预览大图
  1。给轮播图绑定点击事件
  2.调用小程序的api previewImage
3.点击 加入购物车
  1.先绑定点击事件
  2.获取缓存中的购物车数据 数组格式
  3.先判断 当前的商品是否已经存在于 购物车
  4.已经存在 修改数据 执行购物车数据++ 重新把购物车数组 填充回缓存中
  5.新添加 不存在于购物车的数组中 直接给购物车数组添加一个新元素  新元素 带上 
    购买数量属性 num 重新把购物车数组 填充回缓存中
  6，弹出用户提示
4.商品收藏
  1.页面onShow的时候 加载缓存中的商品收藏的数据
  2.判断当前的商品是不是被收藏
    1.是 改变页面图标
    2.不是
  3.点击商品收藏按钮
    1.判断该商品是否存在于缓存数组中
    2.已经存在 把改商品删除
    3.没有存在 把商品添加到收藏数组中 存到缓存中即可
*/ 

import { request } from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsobj:{},
    iscollect:false
  },
  //全局商品对象
  goodsinfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //拿到当前页面
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    
    let options=currentPage.options;

    const{goods_id}=options;
    this.getgoodsdetail(goods_id);

  },
// 获取商品详情数据
  async getgoodsdetail(goods_id){
    const goodsobj = await request({ url: "/goods/detail", data: { goods_id } });
    this.goodsinfo=goodsobj;
    let collect = wx.getStorageSync("collect") || [];
    
    let iscollect = collect.some(v=>v.goods_id === this.goodsinfo.goods_id);

    // 优化数据传递
    this.setData({ 
      goodsobj: {
        goods_name: goodsobj.data.message.goods_name,
        goods_price: goodsobj.data.message.goods_price,
        //iphone部分手机 不识别webp图片格式
        //最好找到后台 让他进行修改
        //临时自己修改 保证后台存在 1.webp => 1.jpg
        goods_introduce: goodsobj.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsobj.data.message.pics,
        goods_small_logo: goodsobj.data.message.goods_small_logo,
        goods_id
      },
      iscollect,
      
    })

  },
//点击轮播图 放大预览
  handleprevewimage(e){
    //先构造要预览的图片数组
    const urls=this.data.goodsobj.pics.map(v=>v.pics_mid);
    //接收标签传递过来的图片url
    const current=e.currentTarget.dataset.url;
    
    wx.previewImage({
      current,
      urls: urls,
    })
  },
//点击加入购物车
  handlecartadd(){
    //1.获取缓存的购物车 数组
      //字符串转换成数组
    let cart=wx.getStorageSync('cart')||[];
    //2.判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.data.goodsobj.goods_id);
    if(index===-1){
      //不存在 第一次添加
      this.data.goodsobj.num=1;
      this.data.goodsobj.checked=true;
      cart.push(this.data.goodsobj);
    }else{
      //已经存在于购物车数据 执行 num++
      cart[index].num++;
    }
    //5.把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart)
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      //true 防止用户 手抖 疯狂点击按钮
      mask:true
    })
  },
//点击商品 收藏图标
  handlecollect(){
    let iscollect=false;
    //1获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[];

    //2判断该商品是否收藏过
    let index = collect.findIndex(v=>v.goods_id===this.data.goodsobj.goods_id);

    //当index==-1 表示已经收藏过
    if(index!==-1){
      //能找到 已经收藏过 在数组中删除
      collect.splice(index,1);
      iscollect=false;
      wx.showToast({
      title:'取消成功',
      mask:true,
      });
    }else{
      //没有收藏过 把数组加入缓存中
      collect.push(this.data.goodsobj);
      iscollect=true;
      wx.showToast({
      title:'收藏成功',
      mask:true,
    });
    }
    //把数字加入缓存中
    wx.setStorageSync("collect",collect);
    this.setData({
      iscollect,
    })


  }
})