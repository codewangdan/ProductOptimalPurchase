// pages/feedback/index.js
/*
  1.点击+号 触发tap点击事件
    1.调用小程序内置的api 
    2.获取的图片的路径 数组
    3.把图片路径存到data变量中
    4.页面就可以根据 图片 进行循环显示自定义组件 
  2.点击 自定义图片 组件
    1.获取被点击事件的索引
    2.获取data中的图片数组
    3.根据索引 数组中删除对应的元素
    4.把数组重新设置回data中 
  3.点击 提交
    1.获取文本域内容
      1.data中定义变量 表示 输入框内容
      2.文本域 绑定 输入事件 事件触发的时候 把输入框的值 存到变量中
    2.对这些内容合法性验证
    3.验证通过 用户选择的图片 上传到专门的服务器 返回图片外网链接
    4.文本域 和外网的图片路径 一起提交的服务器
    5.情况当前页面
    6.返回上一页

*/
Page({

  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isactive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isactive:false
      },
    ],
    chooseImages:[],
    textVal:""
  },
  UploadImgs:[],
  handletabsitemchange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isactive=true:v.isactive=false);
    this.setData({
      tabs
    })
    
  },
//点击+ 选择图片
  handleChoose(){
    wx.chooseImage({
      success: (res) => {
        
        this.setData({
          //图片数组拼接
          chooseImages:[...this.data.chooseImages,...res.tempFilePaths]
        })
      },
    })
  },
//点击 自定义图片组件
  handleRemoveImg(e){
    //2.获取点击事件索引
    const {index}=e.currentTarget.dataset;
    //获取图片data数组图片索引
    let {chooseImages}=this.data;
    
    chooseImages.splice(index,1)
    this.setData({
      chooseImages
    })
  },
//文本域的输入事件
  handleTextInpute(e){
    this.setData({
      textVal:e.detail.value,
    })
  },
//提交按钮的点击事件
  handleFormSubmit(){
        //1.获取文本域内容
    const {textVal,chooseImages}=this.data;
//2。合法性验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon:'none',
        mask:true,
        duration: 1000,
      });
      return;
    }
   
    wx.showLoading({
      title: '正在上传中',
      mask:true
    })
    //判断有没有需要上传的图片数组
    if (chooseImages!=0) {
      chooseImages.forEach((v,i)=>{
      console.log(v);
       //3.准备上传到专门的服务器
       //上传文件的api 不支持 多个文件同时上传 遍历数组 挨个上传
      wx.uploadFile({
        //上传的文件名称
        filePath: 'v',
        //
        name: 'image',
        //上传到哪里
        url: 'https://img.coolcr.cn/api/upload',
        //顺带的文本信息
        formData:{}, 
        success:(res)=>{
          console.log(res);
          let url=JSON.parse (res.data).url;
          this.UploadImgs.push(url);
//所有图片上传完了才触发 提交
          if (i===chooseImages.length-1) {
            wx.hideLoading( );
            console.log("111");
            this.setData({
              textVal:"",
              chooseImages:[]
            })
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
    });
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta:1
      })
    }
    
  },
})