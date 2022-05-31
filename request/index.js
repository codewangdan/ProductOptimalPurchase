
//同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
  let header={...params.header};
  if (params.url.includes("/my/")) {
      header["Authorization"]=wx.getStorageSync('token')
  }

  ajaxTimes++;
  //显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true,
    
  });
//定义公告URL
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,rejest)=>{

    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        rejest(err);
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          //关闭正在等待中图标
          wx:wx.hideLoading();
        }
        
      }
    });  
  })
}