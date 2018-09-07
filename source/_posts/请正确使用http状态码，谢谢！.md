---
title: 请正确使用http状态码，谢谢！
categories:
  - 爬虫
date: 2018-02-03 18:13:25
tags:
  - http状态吗
  - http451
---

## 背景
最近，由于某些特别原因。打开一些网址一直显示404，
想请问下，xx站的程序员，能不能按照http协议来返回呢？

## 什么是http状态码451
> 根据定义，HTTP 451错误代码状态出现，不代表这个地址是否存在，而代表该网页可能对于国家安全产生危险，或是该网页可能违反著作权、隐私权、亵渎神明或其他法律或法院命令。
该响应代码有如下的性质：
除非另外指明，否则这个响应代码是可以被缓存的。
必须携带一个带有一个Link头部，列出要求封禁该地址的实体URI；且应带有一个"rel"字段，值应为"blocked-by"[1]。
简单的讲 就是由于某些政治原因，所以，该页面不予访问

## HTTP451的来源
> 本代码于2013年由提姆·布雷（Tim Bray）正式提出，主要基于博客Terence Eden的文章所提出的非正式提案[2]。2015年12月18日，此代码由国际网络工程研究团队通过[3]。
451这个代码源于1953年的反乌托邦小说《华氏451度》(纸的燃点为华氏451度)，在这部小说中，所有书籍是违禁品[4]。相比较HTTP 403代码，451可更好描述一种由于法律规定或受权威部门要求而导致的封禁状态[5]

## 一个示例
某地一用户以GET方式请求http://example.org的/index.php路径：

```html
GET /index.php HTTP/1.1
Host: www.example.org
```
由于用户所在地的某项法律规定，网站不可以向该地区用户返回这个页面，所以服务器做出回应，设置了有效期为一年的缓存头部，并在Link头部中加入了指定的政府部门URL`http://www.xxx.gov.tld`
```html
HTTP/1.1 451 Unavailable For Legal Reasons
Link: <http://www.xxx.gov.tld>; rel="blocked-by"
Cache-control: max-age=31536000; public
Content-Type: text/html; charset=utf-8

<html>
<head><title>因法律原因不可用</title></head>
  <body>
    <h1>HTTP/1.1 451 因法律原因，本页面不可用</h1>
    <p>根据《某法》第某条之规定，本网站页面对来自某地的访客不可用。</p>
  </body>
</html>
```
{% asset_img 0.jpg  %}

文章参考于 维基百科 https://zh.wikipedia.org/wiki/HTTP_451

[RFC 7725](https://tools.ietf.org/html/rfc7725) - HTTP 451的正式RFC文件


