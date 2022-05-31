import { request } from "../../request/index";

/*
1。页面被打开的时候 onshow
  0.onShow 不同于onLoad 无法在形参上接收option参数
  1.获取url上的参数type
  2.根据type 去发送请求获取订单数据
  3.渲染页面
2.单击布通的标题 重新发送请求来获取和渲染数据
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isactive:true
      },
      {
        id:1,
        value:"待付款",
        isactive:false
      },
      {
        id:2,
        value:"代发货",
        isactive:false
      },
      {
        id:3,
        value:"退款/退货",
        isactive:false
      }
    ],
  },

  onShow(options){
   
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    
    
     //1.获取小程序的页面栈-数组 长度最大10页
    let pages=getCurrentPages();
    //2.数组中 索引最大到页面就是当前页面
    let currentPage=pages[pages.length-1]
    //获取url页面上的type参数
    const {type}=currentPage.options;
    //4.激活选项中的页面标题 当 type=1 index=0
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
//获取订单列表方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    console.log(res);
    
    this.setData({
      orders:res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())})),
    })
  },
  changeTitleByIndex(index){
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isactive=true:v.isactive=false);
    this.setData({
      tabs
    })
  },
  handletabsitemchange(e){
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  },
  
})