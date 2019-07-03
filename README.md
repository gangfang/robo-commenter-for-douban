# robo-commenter-for-douban
豆瓣自动顶帖JS脚本 (A JS script that automatically post comments on douban)

credit: https://juejin.im/post/5b85630c6fb9a01a0231210c

## 功能
1. 定时并自动发送豆瓣评论
2. 接入超级鹰验证码识别，能够在需要输入验证码时仍然自动顶帖

## 使用方法
1. 在云主机上安装Node.js以及npm；
2. 将整个repo上传至云主机；
3. 云主机命令行运行`npm install`，安装第三方包裹；
4. 为`robo_commenter.js`提供参数（15-26行）：
    1. `postID`：您需要顶的帖子的ID，可从帖子URL中获得（例子：https://www.douban.com/group/topic/138541545/中的138541545就是postID）；
    2. `cookie`：您的豆瓣账号cookie，可以通过手动发表评论并通过浏览器的开发者工具查看post request的参数获得；（详情参见https://juejin.im/post/5b85630c6fb9a01a0231210c）
    3. `ck`：另一个参数，获取方法同上；
    4. `interval`：自动顶帖时间间隔，毫秒为单位；
    5. 所有以chaojiying为前缀的参数：超级鹰验证码自动识别API服务的参数，请在超级鹰官网（https://www.chaojiying.com/）注册账号并获取相应参数；
    6. `commentCaptcha`：在需要验证码时，顶帖的回复内容；
    7. `commentNoCaptcha`：在不需要验证码时，顶帖的回复内容；
5. 云主机命令行运行`node robo_commenter.js`测试代码，检验是否成功；
6. 检验成功后，云主机命令行运行`nohup node robo_commenter.js &`实现后台运行；
7. 断开本地与云主机连接，完成；

## 代码重构
1. 处理回调地狱，函数抽象

## 后续开发
1. 设计反爬机制，避免顶帖过于频繁被豆瓣限制评论
2. 自动测试

## 备注
1. 如需说明，请电邮至gfang@usc.edu

## license
MIT
