// pages/goods_list/index.js
// 引入，用来发送请求的 小程序方法一定要把路径补全js
import {request} from "../../request/index";
/*1.用户上滑页面 滚动条触底 开始加载下一页数据
    1.找到滚动条触底事件
    2.判断还有没有吓一页数据
      1.获取到总页数 只有总条数
        页码数 = Math.ceil（总条数 / 页容量 pagesize）
                Math.ceil（23 / 10） 有3页
      2.获取到当前的页码 pagenum
      3.判断一下当前的页码是否大于等于总页数
      表示 没有下一页

    3.假如没有吓一跳数据 弹出一个提示
    4.假如还有下一页数据  加载下一页数据
      1.当前的页码++
      2.重新发送请求
      3.数据请求回来  
          要对data数组 进行拼接 而不是全部替换！！！
2.下拉刷新页面
  1.触发下拉刷新页面  
    需要在页面的json文件中开启一个配置项
  2，重置 数据 数组
  3.重置页码 设置为1
  4.重新发送请求
  5.数据请求回来 需要手动关闭 等待效果
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive:true
      },
      {
        id: 1,
        value: "销量",
        isActive:false
      },
      {
        id: 2,
        value: "价格",
        isActive:false
      }
    ]
    ,
    goodsList:[]
  },
  // 接口 要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:"1",
    pagesize:"10"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 总页数
  totalPages:1,

  onLoad(options) {
    // console.log(options );
    // this.QueryParams.cid=options.cid;
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();

   
  },

// 获取商品列表数据
async getGoodsList(){
  const res=await request({url:"/goods/search",data:this.QueryParams});
 
  // console.log(res);
  // 获取总条数
  const total=res.data.message.total;
  // 计算总页数
  this.totalPages=Math.ceil(total/this.QueryParams.pagesize)
  console.log(this.totalPages);

  this.setData({
    // goodsList:res.data.message.goods
    // goodsList:[...this.data.goodsList,...res.goods]
    goodsList:this.data.goodsList.concat(res.data.message.goods)
  })
  //关闭下拉刷新的窗口，如果没有调通下拉刷新的窗口 直接关也不会报错
  wx.stopPullDownRefresh();
},

// 标题的点击事件
handleTabsItemChange(e){
  // 1.获取被点击的标题索引
  // console.log(e);

  const {index} = e.detail;
  // 2.修改原数组
  let {tabs}=this.data;
  tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false);
    // 3.赋值到data中
  this.setData({
    tabs
  })
  
},
//页面上滑 滚动条触底事件
onReachBottom(){
  // console.log("页面触底");
  // 1.判断还有没有下一页数据
  if(this.QueryParams.pagenum>=this.totalPages){
    //没有下一页数据
    // console.log("没有下一页数据");
    wx:wx.showToast({title: '没有下一页数据',});
  }else{
    //还有下一页数据
    this.QueryParams.pagenum++;
    this.getGoodsList();
  }
},
// 下拉刷新事件
onPullDownRefresh(){
  //1.重置数组
  this.setData({
    goodsList:[]
  })
  //2.重置页码
  this.QueryParams.pagenum=1;
  //发送请求
  this.getGoodsList();
}
  
})