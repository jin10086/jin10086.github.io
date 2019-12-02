---
title: 程序员找对象聚合平台-xunta.today
categories:
  - 相亲
date: 2019-11-30 13:10:41
tags:
---


## 背景

程序员相亲的公众号最近也挺多的,但是因为微信平台的原因

导致无法搜索,不能更快的寻找需要的信息...

所以做了一个聚合N个相亲公众号信息的网站 https://xunta.today

网站名字叫 **XUNTA**

{% asset_img  xunta.png xunta %}



## 信息来源

目前只汇总以下公众号的文章

- CQ脱单联萌
- 程序员脱单实验室
- 村姑的个人农场
- 单身青年自救平台
- 脱单吖

如果还有新的公众号也提供相亲信息的话 欢迎邮件告诉我

上面那几个还是发朋友圈问来的

{% asset_img  pyq.jpeg 朋友圈截图 %}


## 原理

通过爬虫定期去爬取以上公众号的文章,下载网页源代码就好了

然后把源代码丢到[pelican](https://github.com/getpelican/pelican) 里面

再放到gihtub上面

源代码在:https://github.com/xunta-today/website

爬虫的没有公开,主要怕公开了微信限制接口,后面增加工作量,有需要可以邮件我.

碰到的问题
1. 微信图片有防盗链

使用nginx转发一下就可以了,当然需要先把图片域名改成你的

如下
```conf
location /mmbiz{
    proxy_set_header referer "https://mp.weixin.qq.com";
    proxy_set_header origin "https://mp.weixin.qq.com";
    proxy_set_header user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";

    rewrite /(.+)$ /$1 break;
    proxy_pass http://mmbiz.qpic.cn;
}

location /mp{
    proxy_set_header referer "https://mp.weixin.qq.com";
    proxy_set_header origin "https://mp.weixin.qq.com";
proxy_set_header user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";
    rewrite /(.+)$ /$1 break;
    proxy_pass https://mp.weixin.qq.com;
}
```

2. 搜索

目前站内也可以搜索

用的是 [tipue_search](https://github.com/getpelican/pelican-plugins/tree/master/tipue_search)

{% asset_img  xuntasearch.png xunta网站搜索截图 %}

显示结果有点辣眼睛

因为源代码里面太多乱七八糟的东西了,所以我直接在创建搜索的时候,只保留了文章中的中文内容,其他全部去掉了...

可以过几天等google爬虫把网站索引了

直接用 `site:xunta.today` 搜索

## 后续计划

爬虫会每天更新一次

公众号也会每周汇总一次,有人有兴趣一起参与的话欢迎邮件我,（不限于讨论,排版,等等...)

## 投诉与建议 

如果你觉得某篇文章有冒犯你,请直接邮件我 并且带上链接！

有好的建议也欢迎邮件！

## 邮件 

xunta@igaojin.me

## 一个彩蛋

删除一些不相关文章的时候发现的。。。

{% asset_img  caidan.png %}
