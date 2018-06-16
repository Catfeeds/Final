var app=getApp()

function downloadSaveFile(obj) {
  let that = this;
  let success = obj.success;
  let fail = obj.fail;
  let index = obj.index
  let id = "";
  let url = obj.url;
  if (obj.id) {
    id = obj.id+1;
  } else {
    id = url;
  }

  // console.info("%s 开始下载。。。", obj.url);
  wx.downloadFile({
    url: obj.url,
    success: function (res) {
        res.id = id;
        success(res, index)
    },
    fail: function (e) {
      //console.info("下载一个文件失败");
      if (fail) {
        fail(e, index);
      }

    }
  })
}
/**
 * 多文件下载并且保存，强制规定，必须所有文件下载成功才算返回成功
 */
function downloadSaveFiles(obj) {
  // console.info("准备下载。。。");
  let that = this;
  let success = obj.success; //下载成功
  let fail = obj.fail; //下载失败
  let urls = obj.urls;  //下载地址 数组，支持多个 url下载 [url1,url2]
  let savedFilePaths = new Map();
  let urlsLength = urls.length;  // 有几个url需要下载

  for (let i = 0; i < urlsLength; i++) {
    sleep(10)
      downloadSaveFile({
        url: app.globalData.uploadURL + urls[i],
        index: i,
        success: function (res, index) {
          console.dir(res);
          //一个文件下载保存成功
          let savedFilePath = res.savedFilePath;

          savedFilePaths.set(res.id+index, res);
          if (index == urlsLength-1) { //如果所有的url 才算成功
            if (success) {
              success(savedFilePaths)
            }
          }
        },
        fail: function (e, index) {

          let savedFilePath = "/image/Business@2x.png";

          savedFilePaths.set(index + "map_icon.png", { saveFilePath: savedFilePath });
          if (index == urlsLength-1) { //如果所有的url 才算成功
            if (success) {
              success(savedFilePaths)
            }

          }
        }
      })
    }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }

}
module.exports = {
  downloadSaveFiles: downloadSaveFiles
}
