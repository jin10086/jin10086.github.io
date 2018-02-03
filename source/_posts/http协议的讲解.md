---
title: http协议的讲解
date: 2018-02-03 15:41:28
tags:
- 爬虫
- http协议
categories:
- 爬虫
---


## 什么是HTTP协议？

引用自维基百科
> 超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是互联网上应用最为广泛的一种网络协议。设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。通过HTTP或者HTTPS协议请求的资源由统一资源标识符（Uniform Resource Identifiers，URI）来标识。
HTTP的发展是由蒂姆·伯纳斯-李于1989年在欧洲核子研究组织（CERN）所发起。由万维网协会（World Wide Web Consortium，W3C）和互联网工程任务组（Internet Engineering Task Force，IETF）制定标准，最终发布了一系列的RFC，其中最著名的是1999年6月公布的 RFC 2616，定义了HTTP协议中现今广泛使用的一个版本——HTTP 1.1。
2014年12月，互联网工程任务组（IETF）的Hypertext Transfer Protocol Bis（httpbis）工作小组将HTTP/2标准提议递交至IESG进行讨论[1]，于2015年2月17日被批准。[2] HTTP/2标准于2015年5月以RFC 7540正式发表，替换HTTP 1.1成为HTTP的实现标准。[3]

>HTTP是一个客户端终端（用户）和服务器端（网站）请求和应答的标准（TCP）。通过使用网页浏览器、网络爬虫或者其它的工具，客户端发起一个HTTP请求到服务器上指定端口（默认端口为80）。我们称这个客户端为用户代理程序（user agent）。应答的服务器上存储着一些资源，比如HTML文件和图像。我们称这个应答服务器为源服务器（origin server）。在用户代理和源服务器中间可能存在多个“中间层”，比如代理服务器、网关或者隧道（tunnel）。
尽管TCP/IP协议是互联网上最流行的应用，HTTP协议中，并没有规定必须使用它或它支持的层。事实上，HTTP可以在任何互联网协议上，或其他网络上实现。HTTP假定其下层协议提供可靠的传输。因此，任何能够提供这种保证的协议都可以被其使用。因此也就是其在TCP/IP协议族使用TCP作为其传输层。
通常，由HTTP客户端发起一个请求，创建一个到服务器指定端口（默认是80端口）的TCP连接。HTTP服务器则在那个端口监听客户端的请求。一旦收到请求，服务器会向客户端返回一个状态，比如"HTTP/1.1 200 OK"，以及返回的内容，如请求的文件、错误消息、或者其它信息。

## 一个实例
- 打开[爬虫从入门到精通系统教程---目录](https://zhuanlan.zhihu.com/p/25296437) 这个网页
- 按键盘上的F12（开发者工具）
- 点击键盘上的F5刷新下网页
- 点击Network
- 点击Doc

应该会看到如下界面
![](http://ww1.sinaimg.cn/large/cfc08357gy1fcue2xxtzfj21hb0j5q6q)

然后我们点击`25296437`

应该会看到如下界面
![](http://ww1.sinaimg.cn/large/cfc08357gy1fcue7p6k7sj21hb0m90wh)

## General

    Request URL:https://zhuanlan.zhihu.com/p/25296437 （爬虫会用到）
这个对应HTTP协议中的**统一资源定位符**也就是我们打开的网址

	Request Method:GET（爬虫会用到）
这个对应HTTP协议中的**请求方法**,我们这次用的是GET

请求方法有以下这些，常用的是**GET**,**POST**

- GET：向指定的资源发出“显示”请求。使用GET方法应该只用在读取数据，而不应当被用于产生“副作用”的操作中，例如在Web Application中。其中一个原因是GET可能会被网络蜘蛛等随意访问。参见安全方法
- POST：向指定资源提交数据，请求服务器进行处理（例如提交表单或者上传文件）。数据被包含在请求本文中。这个请求可能会创建新的资源或修改现有资源，或二者皆有。
- OPTIONS：这个方法可使服务器传回该资源所支持的所有HTTP请求方法。用'*'来代替资源名称，向Web服务器发送OPTIONS请求，可以测试服务器功能是否正常运作。
- HEAD：与GET方法一样，都是向服务器发出指定资源的请求。只不过服务器将不传回资源的本文部分。它的好处在于，使用这个方法可以在不必传输全部内容的情况下，就可以获取其中“关于该资源的信息”（元信息或称元数据）。
- PUT：向指定资源位置上传其最新内容。
- DELETE：请求服务器删除Request-URI所标识的资源。
- TRACE：回显服务器收到的请求，主要用于测试或诊断。
- CONNECT：HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。通常用于SSL加密服务器的链接（经由非加密的HTTP代理服务器）。

`Status Code:200 OK`（爬虫会用到）

这个对应HTTP协议中的**状态码**,我们这次返回的是200 OK、

> 所有HTTP响应的第一行都是状态行，依次是当前HTTP版本号，3位数字组成的状态代码，以及描述状态的短语，彼此由空格分隔。
状态代码的第一个数字代表当前响应的类型：

- 1xx消息——请求已被服务器接收，继续处理
- 2xx成功——请求已成功被服务器接收、理解、并接受
- 3xx重定向——需要后续操作才能完成这一请求
- 4xx请求错误——请求含有词法错误或者无法被执行
- 5xx服务器错误——服务器在处理某个正确请求时发生错误

> 常见状态代码、状态描述、说明：

- 200 OK //请求成功
- 400 Bad Request //客户端请求有语法错误，不能被服务器所理解
- 401 Unauthorized //请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用 
- 403 Forbidden //服务器收到请求，但是拒绝提供服务 
- 404 Not Found //请求资源不存在，eg：输入了错误的URL
- 500 Internal Server Error //服务器发生不可预期的错误
- 503 Server Unavailable //服务器当前不能处理客户端的请求，一段时间后可能恢复正常

## Requests Headers(请求头)

`Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8`（爬虫会用到）
> Accept请求报头域用于指定客户端接受哪些类型的信息。eg：Accept：image/gif，表明客户端希望接受GIF图象格式的资源；Accept：text/html，表明客户端希望接受html文本。

`Accept-Encoding:gzip, deflate, sdch, br`

>Accept-Encoding请求报头域类似于Accept，但是它是用于指定可接受的内容编码。eg：Accept-Encoding:gzip.deflate.如果请求消息中没有设置这个域服务器假定客户端对各种内容编码都可以接受。

`Accept-Language:zh-CN,zh;q=0.8`

>Accept-Language请求报头域类似于Accept，但是它是用于指定一种自然语言。eg：Accept-Language:zh-cn.如果请求消息中没有设置这个报头域，服务器假定客户端对各种语言都可以接受

`Cache-Control:no-cache`

Cache-Control 是用来控制网页的缓存，详细可以[Cache-control_百度百科](http://baike.baidu.com/link?url=OiJmCPnBNa2iTR8oSQlLircjkN0f_jSkaDI3uv88SYwx9JOl3q8PrlRJMoq87hE4ZSyUfe8n3byeogqZcztpEEkUjaLBJwpuXm_AcLw740_)

`Connection:keep-alive`

> HTTP持久连接（HTTP persistent connection，也称作HTTP keep-alive或HTTP connection reuse）是使用同一个TCP连接来发送和接收多个HTTP请求/应答，而不是为每一个新的请求/应答打开新的连接的方法。
详情介绍请参考[HTTP持久连接](https://zh.wikipedia.org/wiki/HTTP%E6%8C%81%E4%B9%85%E8%BF%9E%E6%8E%A5)

`Cookie:d_c0="AACAWNtZswqPTnJ8dFXqaygiq82ekPD5_-xxxx`（爬虫会用到）

>Cookie（复数形态Cookies），中文名称为“小型文本文件”或“小甜饼”[1]，指某些网站为了**辨别用户身份而储存在用户本地终端**（Client Side）上的数据（通常经过加密）。定义于RFC2109。是网景公司的前雇员卢·蒙特利在1993年3月的发明[2]。详情介绍请参考[Cookie](https://zh.wikipedia.org/wiki/Cookie)

举个例子，当我登录知乎后，知乎会给我一个cookie，然后我在以后的一段时间内，每次打开知乎，都不需要重新登录。这是因为浏览器每次都会把我之前存储的cookie带上。

`Host:zhuanlan.zhihu.com`

当前请求网址的请求域

`User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36（爬虫会用到）`

用户是通过什么工具来请求的，（因为我用的Google浏览器，所以显示的是`Chrome`）

`Referer:https://www.zhihu.com/people/pa-chong-21/activities（爬虫会用到）`

是通过哪个页面到当前页面的（也就是上一个页面是什么？当前截图里面没有）

举个例子，当我是通过百度搜索页面点到当前页面的，那么Referer就是百度搜索页


`If-Modified-Since:Wed, 15 Feb 2017 09:14:13 GMT`
`If-None-Match:W/"58a41be5-190aa"`

`Last-Modified:Wed, 15 Feb 2017 09:14:13 GMT`
`ETag:"58a41be5-190aa"`

这4个一般静态页面会用到 `If-Modified-Since,If-None-Match `
这两个是请求头，`ETag,Last-Modified`是返回头（服务器返回的）

如果`If-Modified-Since`的值和`Last-Modified`相等 则表明当前请求的内容没有变动，服务器返回 `Status Code:304 Not Modified`
`If-None-Match`和`ETag` 同理

![](http://ww1.sinaimg.cn/large/cfc08357gy1fcug3muzx4j20ol0fe769)

## 总结
看完本篇文章后，你应该要

- 大概了解什么是HTTP协议
- HTTP常见请求方法有哪几种？
- HTTP常见状态码有哪些？
- HTTP请求头中，大概了解`Accept,Cookie,User-Agent,Referer`是干啥的？







