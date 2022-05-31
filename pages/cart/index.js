// pages/cart/index.js
/*
1.获取用户的收入地址
  1.绑定点击事件
  2.调用小程序内置 api 获取用户收货地址 wx.chooseAddrss

  2.获取 用户 对小程序 所授予 获取地址的权限 状态 scope
    1.假设 用户 点击获取收货地址的提示 确定 authSetting scope.address
      scope 值 true 直接调用 获取收货地址
    2.假设用户 从来没有调过 收货地址api
      scope undefind 直接调用 获取收货地址
    3.假设 用户 点击获取收货地址的提示框 取消
      scope 值 为 false
      1.诱导用户自己打开 授权设置页面（wx.openSetting）当用户重新给与 获取地址权限的时候
      2.获取收获地址
    4.把获取到的收获地址存贮在 本地存储中
2.页面加载完毕
   0.onLoad onShow
   1.获取本地存储中的地址数据
   2.把数据 设置给data中的一个变量
3.onShow
  0.
  1.把缓存中的购物车数组
  2.购物车数据 填充到data中
4.全选的实现 数据显示
  1.onShow 获取缓存的中的购物车数组
  2.根据购物车中的商品数据 所有的商品都被选中
5.总价格和总数量
  1.都需要商品被选中 才能拿来计算
  2.遍历购物车数据
  3.遍历
  4.判断商品是否被选中
  5.总数量 +=商品数量
  6.把计算后的价格和数量 设置回到data中即可
6.商品的选中
  1.绑定change事件
  2.获取到被修改的商品对象
  3.商品对象的选中状态 取反
  4.重新填充回到data中和缓存中
  5.重新计算全选。总价格 总数量
7.全选和反选
  1.全选复选框绑定事件 change
  2.获取data中的全变量 allChecked
  3.直接取反 allChecked=！allChecked
  4.遍历购物车数组 让里面商品选中状态跟随 allChecked改变而gaib
  5.把购物车数组 和 allChecked 重新设置回data 把购物车设置回缓存中
8.商品数量的编辑
  1.“+” “-” 按钮 绑定同一个点击事件 区分的关键 自定义属性
    + +1，- -1  
  2.传递被点击的商品id goods_id
  3.获取购物车中的数组 来获取被修改的商品对象
  4.当购物车的数量=1 同时用户点击-
    单窗提示 询问是否删除
    1.确定 直接删除执行
    2.取消 什么都不做
    直接修改数据数量num
  5.把cart数组 重新设置回datathis.setCart中


*/
//////////////////////////////
import { request } from "../../request/index";
Page({
  data:{
    address:{},
    cart:[],
    allchecked:false,
    totalprice:0,
    totalnum:0
  },

  onShow(){
    //1.获取缓存中的收货地址信息
    const address=wx.getStorageSync('address')||[];
    //1.获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    this.setCart(cart);
    //2.给data赋值 
    this.setData({address});
  },

   handlechoose(){
    wx.getSetting({
      success: (result) => {
        console.log(result);
        
        const scopeAddress =result.authSetting["scope.address"];
       
        if(scopeAddress===true||scopeAddress===undefined){
          wx.chooseAddress({
            success: (res) => {
              res.all=res.provinceName+res.cityName+res.countyName+res.detailInfo;
              wx.setStorageSync('address', res)
            },
          })
        }else{
          wx.openSetting({
            success: (res1) => {
              
              wx.chooseAddress({
                success: (res3) => {
                  res3.all=res3.provinceName+res3.cityName+res3.countyName+res3.detailInfo;
                  wx.setStorageSync('address', res3)
                  
                },
              })
            },
          })
        }
      },

    })

  },
  
  // 1.绑定change事件
  // 2.获取到被修改的商品对象
  // 3.商品对象的选中状态 取反
  // 4.重新填充回到data中和缓存中
  // 5.重新计算全选。总价格 总数量
// 6.商品的选中
  handleitemchange(e){
    //1获取被修改商品的id
    const goods_id=e.currentTarget.dataset.id;
    //获取购物车数组
    let {cart}=this.data;
    //3.找到被修改商品的对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
   //选中状态取反
    cart[index].checked=!cart[index].checked;
    //把购物车数据重新设置回到data中和缓存中
    this.setCart(cart);
  },
//优化  购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数据
  setCart(cart){
    
    let allchecked=true;
    let totalprice=0;
    let totalnum=0;
    cart.forEach(v=> {
      if(v.checked){
        totalprice+=v.num*v.goods_price;
        totalnum+=v.num;
      }else{
        allchecked=false;
      }
    });
    allchecked=cart.length!=0?allchecked:false;
    this.setData({
      cart,
      allchecked,
      totalprice,
      totalnum
    })
    wx.setStorageSync("cart",cart);
  },
//商品全选功能
  handleitemallcheck(){
    //获取data中数据
    let {cart,allchecked}=this.data;
    //修改值
    allchecked=!allchecked;
    //循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allchecked);
    //4.把修改后的值 填充的cart中
    this.setCart(cart);
  },

  //商品数量的编辑功能
  handleitemnumedit(e){
    //1.获取传递过来的参数
    const{operation,id}=e.currentTarget.dataset;
    //2.获取购物车数组
    let {cart}=this.data;
    //3.找到需要修改数据商品索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //修改数量
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title:'提示',
        content: '您是否要删除?',
        success:(res)=>{
          if(res.confirm){
            cart.splice(index,1);
            this.setCart(cart);
          }else if(res.cancel){
            console.log("用户取消操作");
          }
        }
      })
    }else{
    cart[index].num+=operation;
    this.setCart(cart);
    }
  },
//点击结算
  handlepay(){
    //判断收货地址
    const{address,totalnum}=this.data;
    if(!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon:'none'
      })
    }
    //判断用户有没有选购商品
    else if(totalnum===0){
      wx.showToast({
        title: '您还没有选购商品',
        icon:'none'
      })
    }
//3.跳转到支付页面
    else{wx.navigateTo({
      url:'/pages/pay/index',

    })
  }
  }
})