// refactoring tasks: 
// 1. deal with the callback hell
// 2. organize code into functions and remove comments


// please run `npm init` then `npm install --save request cheerio fs` to install the below 3rd party packages 
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');



// variable values you need to provide:
// 你需要提供一下参数：
const postID = 123456789;
const cookie = "YOUR DOUBAN COOKIE";
const ck = "YOUR DOUBAN PARAM USED TO ADD COMMENT - ck";
const interval = 2 * 60 * 1000;  // interval in ms. (2 * 60 * 1000) represents a 2 minutes interval

const chaojiyingUserID = "YOUR CHAOJIYING USER NAME";
const chaojiyingPassword = "YOUR CHAOJIYING PASSWORD";
const chaojiyingSoftID = "YOUR CHAOJIYING SOFTID";
const chaojiyingCodeType = "YOUR CHAOJIYING CODETYPE";

const commentCaptcha = "YOUR COMMENT WHEN CAPTCHA IS PRESENTED";
const commentNoCaptcha = "YOUR COMMENT WHEN CAPTCHA IS NOT PRESENTED";




const doubanOptions = {
  url: `https://www.douban.com/group/topic/${postID}/add_comment`,
  headers: {
    "Host": "www.douban.com",
    "Referer": `https://www.douban.com/group/topic/${postID}/`,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
    "Cookie": cookie
  }
};

const fetchImgOptions = {
  url: null,
  headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36" }
};

const captchaRecogOptions = {
  url: 'http://upload.chaojiying.net/Upload/Processing.php',
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
    'Content-Type' : 'application/x-www-form-urlencoded' 
  },
  formData: {   
    'user': chaojiyingUserID,
    'pass': chaojiyingPassword,
    'softid': chaojiyingSoftID,
    'codetype': chaojiyingCodeType,
    'userfile': null
  }
};




setInterval(() => {
  request(doubanOptions, (err, res, html) => {
    if (err || res.statusCode != 200) { return console.log("Failed to scrape the post page."); }
    const $ = cheerio.load(html);
    const captcha = $(".captcha_image");
    if (captcha.attr()) {
      const captchaImgURL = captcha.attr().src;
      const captchaID = captchaImgURL.slice(captchaImgURL.indexOf("id=")+3, captchaImgURL.indexOf("&size"));
      fetchImgOptions.url = captchaImgURL;
      const lengthOfCaptchaID = 24;
      const imgFilePath = captchaID.slice(0, lengthOfCaptchaID)+".jpeg";
      request.get(fetchImgOptions).pipe(fs.createWriteStream(imgFilePath)).on('close', () => {
        captchaRecogOptions.formData.userfile = fs.createReadStream(imgFilePath);
        request.post(captchaRecogOptions, (err, res, data) => {
          if (err || res.statusCode != 200) { return console.log("Chaojiying OCR failed.. err:", err); }
          doubanOptions.form = {
            "ck": ck,
            "rv_comment": commentCaptcha,
            "captcha-solution": JSON.parse(data).pic_str,
            "captcha-id": captchaID
          };
          request.post(doubanOptions, (err, res, _) => {
            if (err) { return console.log("Needed to solve captcha then post but failed somewhere.. err:", err); }
            console.log("Solved captcha and posted!");
          });
        });
      });
    } else {
      doubanOptions.form = {
        "ck": ck,
        "rv_comment": commentNoCaptcha,
      };
      request.post(doubanOptions, (err, res, _) => {
        if (err) { return console.log("No need to solve captcha then post but failed somewhere.. err:", err); }
        console.log("Posted w/o needing to solve captcha!");
      });
    }
  });
}, interval);