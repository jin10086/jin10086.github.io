---
title: 抓取手机app的数据（摩拜单车）
categories:
  - 爬虫
date: 2018-02-03 17:42:29
tags:
  - 手机app抓包
  - fiddle
---

## 背景
前几天有人私信我，问能不能帮忙抓取摩拜单车的数据。。。
我想着授人以鱼不如授人以渔，所以本次我们就讲讲如何抓取手机app的内容吧
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3eefpyn0j20k703gq4h.jpg)
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3eenva64j20zq049tch.jpg)

## fiddle的安装与配置
抓手机包我用的是fiddle。
### 安装
先在下载页面下载--->[Download Fiddler Web Debugging Tool for Free by Telerik](https://www.telerik.com/download/fiddler)

选择你“准备用fiddle来干嘛”

你的邮箱

以及同意“最终用户许可协议”就可以下载了

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3efqsytmj20k00b9diq.jpg)
下载后按照提示安装就可以了。

### 配置
- 点击tool->telerik fiddler options...
- ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3egyj6e7j20gk08mtbx.jpg)
- 点击connections，然后勾选 `allow remote computers to connect`
记住这边的端口号（`8888`）
- ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3ehhpvhej20fd0aawjg.jpg)

## 抓包前设置
1. 首先确保电脑和手机连在同一个WiFi下面
2. 打开fiddle
3. 获取电脑ip
  1. 打开cmd命令行
  2. 输入ipconfig,如图所示，192.168.31.146就是我的ip地址
  ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3eigqm4wj20rf0e80vp.jpg)
4. 打开手机WiFi设置，找到你当前链接的WiFi
  1. 我当前链接的是Xiaomi_E172_5G
  2. ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3ej0khpjj20yi1pcwrg.jpg)
5. 设置代理服务器为你电脑的ip，端口号为上面设置的端口号（默认为8888）
  1. ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3ejpdwshj20yi1pcakm.jpg)
6. 安装https证书
  1. 在手机浏览器上打开 你电脑ip:你设置的端口号
  2. 我的是192.168.31.146:8888
  3. 点击框框处安装证书
    ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3ekjddrzj20hs0di40s.jpg)
7. 设置fiddle监听所有请求
  1. 选择all process
  ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3el4w4dij20rs0d5wil.jpg)

## 开始抓包
打开摩拜单车app
然后你会看到定位的时候一辆车也没有。。。
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3em8t60rj20k00zkkbs.jpg)
打开个人详情页还提示“抱歉，服务暂不可用。。。”
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3emjgaggj20k00zkajb.jpg)
这是因为摩拜有防抓取限制（我猜是检测，如果有使用代理的话，直接让你用不了。。。）
那这样的话我们就没办法抓到么？？？
因为我之前还用过摩拜的小程序，所以我们抓抓微信小程序试试看
打开摩拜单车的小程序
我们看到已经定位了。。，并且把附件的单车都显示出来了
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3emy2bh2j20k00zkkgd.jpg)

我们可以多移动我们的位置，然后等有把附近的车显示出来
可以看到fiddle上面已经有好多请求了
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3enb2gqyj20nm09qago.jpg)
那么如何找到摩拜的那一条呢。。。
很简单，看单词就好。。。
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3enl8gw7j21cf0p54gg.jpg)

mobike-api。。。这很明显就是我们要找的请求
请求头如下图所示，方法是post
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3eny90p9j20hv0br441.jpg)
参数如下图
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3eo78v3uj20np080n05.jpg)
返回值因为我看到是json的格式了，所以直接以json的格式看。
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3eoogktnj20of0a077i.jpg)

## 模拟发送
```python
import requests
# 如果headers里面没有referer则会访问异常
# referer表示上一个页面是什么。
headers = {
'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 MicroMessenger/6.5.7 NetType/WIFI Language/zh_CN',
'Content-Type': 'application/x-www-form-urlencoded',
'Referer': 'https://servicewechat.com/wx80f809371ae33eda/23/page-frame.html',
}
url = 'https://mwx.mobike.com/mobike-api/rent/nearbyBikesInfo.do'
data = {
'longitude':'121.1883',# 经度
'latitude':'31.05147', # 纬度
'citycode':'021',
'errMsg':'getMapCenterLocation:ok'

}
# 下面必须加上verify=False,表示不验证ssl，要不然一直报错。。。
z = requests.post(url,data=data,headers=headers,verify=False)
```
可以看到我们已经抓取了需要的数据，那么怎么抓取整个上海的摩拜单车情况呢？？

只要获取上海的所有经纬度，然后替换上面data中的经度及纬度就可以了。。。

那么怎么获取上海的所有经纬度。。。

我发现挺难的。。。（有人拿到了请告诉我一声，谢谢）

然后我用了高德地图api的搜索功能，搜索了上海的所有小区的经纬度。一共898个，

然后查了这898个小区附件的摩拜单车情况....

## 总结
看完本编文章，你应该学会“如何抓取手机app的包”

其实挺简单的（就是你手机通过电脑上网，然后这台电脑上所有的请求都被抓下来了，那么你手机的请求自然也被抓下来了）

大家还可以试着抓抓知乎客户端的包。。。

更多fiddle的使用技巧，请善用百度、Google

最后所有代码在https://github.com/kimg1234/pachong/blob/master/mobai.py



