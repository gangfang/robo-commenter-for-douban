# 这个python脚本是robo_commentor.js的前身
# 没有自动识别验证码功能。所以intervalInSecond（自动顶帖时间间隔，单位秒）需要足够大，才不会要求输入验证码


import requests
from apscheduler.schedulers.blocking import BlockingScheduler

postID = "YOUR DOUBAN POST ID"
intervalInSecond = 1800
params = {
    "ck": "YOUR CK PARAMS",
    "rv_comment": "顶",
}

headers = {
    "Host": "www.douban.com",
    "Referer": f"https://www.douban.com/group/topic/{postID}/?start=100",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
    "Cookie": "YOUR COOKIE"
}


def my_job():
    db_url = f"https://www.douban.com/group/topic/{postID}/add_comment"
    requests.post(db_url, headers=headers, data=params)


scheduler = BlockingScheduler()

scheduler.add_job(my_job, "interval", seconds=intervalInSecond, id="db")
scheduler.start()