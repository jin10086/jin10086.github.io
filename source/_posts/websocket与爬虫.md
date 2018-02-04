---
title: websocket与爬虫
categories:
  - 爬虫
date: 2018-02-04 21:24:16
tags:
  - websocket
  - websocket抓包
---
## 背景

写爬虫的目的应该就是为了拿到数据，或者说模拟某种操作
如果他使用的是http(s) 协议来传输数据的，那么我们就模拟http协议来发送数据
如果它使用的是websocket协议来传输数据的，
那么我们理所当然的就模拟websocket来发送数据~

首先，我们需要了解什么是websocket
## websocket的介绍

> WebSocket是一种在单个TCP连接上进行全双工通讯的协议。WebSocket通信协议于2011年被IETF定为标准RFC 6455，并由RFC7936补充规范。WebSocket API也被W3C定为标准。

>WebSocket使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

上面是维基百科的介绍.
简单的将，websocket 和http一样，都是一种网络传输协议

### 他比http协议好的地址有哪些呢？

- 较少的控制开销。在连接创建后，服务器和客户端之间交换数据时，用于协议控制的数据包头部相对较小。在不包含扩展的情况下，对于服务器到客户端的内容，此头部大小只有2至10字节（和数据包长度有关）；对于客户端到服务器的内容，此头部还需要加上额外的4字节的掩码。相对于HTTP请求每次都要携带完整的头部，此项开销显著减少了。
- 更强的实时性。由于协议是全双工的，所以服务器可以随时主动给客户端下发数据。相对于HTTP请求需要等待客户端发起请求服务端才能响应，延迟明显更少；即使是和Comet等类似的长轮询比较，其也能在短时间内更多次地传递数据。
- 保持连接状态。于HTTP不同的是，Websocket需要先创建连接，这就使得其成为一种有状态的协议，之后通信时可以省略部分状态信息。而HTTP请求可能需要在每个请求都携带状态信息（如身份认证等）。
- 更好的二进制支持。Websocket定义了二进制帧，相对HTTP，可以更轻松地处理二进制内容。
- 可以支持扩展。Websocket定义了扩展，用户可以扩展协议、实现部分自定义的子协议。如部分浏览器支持压缩等。
- 更好的压缩效果。相对于HTTP压缩，Websocket在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著地提高压缩率

### websocket的应用场景

- 直播平台的弹幕
- 实时聊天
- 等等

## websocket 协议

WebSocket 是独立的、创建在 TCP 上的协议。

Websocket 通过 HTTP/1.1 协议的101状态码进行握手。

为了创建Websocket连接，需要通过浏览器发出请求，之后服务器进行回应，这个过程通常称为“握手”

那么websocket协议是如何握手的呢？

### websocket握手

下面是websocket一次握手的过程
**客户端请求**
```html
GET / HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: http://example.com
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13
```
**服务器响应**
```html
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Location: ws://example.com/
```
**和http字段不一样的地方**
- Connection必须设置Upgrade，表示客户端希望连接升级。
- Upgrade字段必须设置Websocket，表示希望升级到Websocket协议。
- Sec-WebSocket-Key是随机的字符串，服务器端会用这些数据来构造出一个SHA-1的信息摘要。把“Sec-WebSocket-Key”加上一个特殊字符串“258EAFA5-E914-47DA-95CA-C5AB0DC85B11”，然后计算SHA-1摘要，之后进行BASE-64编码，将结果做为“Sec-WebSocket-Accept”头的值，返回给客户端。如此操作，可以尽量避免普通HTTP请求被误认为Websocket协议。
- Sec-WebSocket-Version 表示支持的Websocket版本。RFC6455要求使用的版本是13，之前草案的版本均应当弃用。
- Origin字段是可选的，通常用来表示在浏览器中发起此Websocket连接所在的页面，类似于Referer。但是，与Referer不同的是，Origin只包含了协议和主机名称。
- 其他一些定义在HTTP协议中的字段，如Cookie等，也可以在Websocket中使用。

可以看到只是在http协议上增加了几个硬性规定，http协议的user-agent,cookie都可以在websocket握手过程中使用

**抓包时候的注意事项:因为websocket只有一次握手，握手成功后就可以双方发送消息了，假如你打开网页后没有找到你要抓的数据，那么你就需要重新刷新网页，让他重新握手一次**

## websocket的事件

### on_open
表示刚刚连接的时候

### onmessage
表示收到消息怎么做

### send
表示给服务器发送消息

### on_close
表示关闭连接

那么知道了这些对我们有什么好处么?
找js的时候会很好找，这几个关键词基本上都是固定的
你可以直接全局搜搜,然后很容易能找到发送的js代码

模拟发送的时候也是一样的.

## 实际案例

前面介绍了一堆websocket协议相关的东西，估计很多人已经晕了.
没关系，先看实例，有问题再回到上面看

### 抓包可以使用fiddle，chrome也是可以的

我们先使用chrome

本次要抓的网站的[一个投票网站](http://www.10brandchina.com/vote/startin.php?id=41867)
大家可以先随便投一个票，抓抓包看看
会发现怎么没有找到他是如何提交数据的...

选择ws,然后刷新下网页，再点击下投票，会发现有一个请求
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4rs5d7hjj20zf0bugmx.jpg)

可以看到是在握手阶段,请求头里面的参数和我们上面讲的是一样的.

请求地址是`ws://v5.10brandchina.com:8008/`
这边顺带说一下，有时候这边会看到 `wss://v5.10brandchina.com:8008/`
那么这两个有啥区别的，简单的讲就是http与https协议的区别一样...
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4rykh56tj20ah027mx2.jpg)

看一下交互的内容（点击Frames）
可以看到已经有四条消息了，但是消息内容是二进制的，chrome这边无法预览...
那么我们使用fiddle试一下

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4s0okwq0j20d505fmx7.jpg)

### 抓包与分析
打开fiddle，**刷新一下网页**
不刷新的话是看不到的，然后随便投一下票.

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4s4eceovj20ki08dmy3.jpg)

怎么找到请求呢，很简单，看状态码为101的就行，然后双击这一行

然后这边还是看到四条消息，我们点击第一条，然后用`TextView`展示，可以看到消息是这些
为啥用`TextView`呢？其实是一个一个的试过来的，假如你发现都试过了，还是乱码，那应该是他使用了其他的压缩或者加密方法，需要查看js看看他是如何加密的

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4si2qs3uj20d1074t8w.jpg)

这个网站的数据是没有加密过的.
带向上的箭头的是我们向服务器发送的，向下的箭头是服务器返回的(下面的数据，前面带黑点？,是我们发送的)
- `{"action":"auth","val":5}`

`{"action":"auth","msg":"eval(\"\\115\\141\\164\\150\\56\\163\\151\\156\\50\\61\\65\\61\\67\\67\\66\\62\\63\\61\\63\\51\")"}`

- `{"action":"auth","val":-0.3241458910493796}`

`{"action":"wait","msg":95420}`

- `{"action":"vote","val":"{\"itemid\":126067,\"catid\":41867,\"captcha\":\"%u7EC7%u65E7%u5F88%u9C7C\",\"auth\":5,\"rnd\":\"4186712606754595\"}"}`

`{"action":"vote","msg":"ok,231812,2018-02-04 22:32:55"}`

可以看出来
首先我们发送`{"action":"auth","val":5}`
然后服务器返回一串信息给我们,
然后我们根据服务器返回的算出一个值,也就是
`{"action":"auth","val":-0.3241458910493796}`
再发送给服务器.
服务器返回`{"action":"wait","msg":95420}`,表示验证通过
然后我们投票,发送了投票的一些信息给服务
服务器告诉我们投票成功.

以上就是整个通讯过程.

那如果我们要模拟发送的话，需要知道哪些信息呢

1. `{"action":"auth","val":5}`里面的`val:5`,这个5是固定的么？如果不是，是如何生成的
2. 服务器返回的是什么，如何解析
3. 如何根据服务器返回的生成一个新的val
4. 发送投票信息里面`{"action":"vote","val":"{\"itemid\":126067,\"catid\":41867,\"captcha\":\"%u7EC7%u65E7%u5F88%u9C7C\",\"auth\":5,\"rnd\":\"4186712606754595\"}"}`
itemid,catid,capthc,auth,rnd如何生成

## 找参数

还是使用chrome，直接用`ctrl + shift +f`，然后输入websocket（或者on_open,on_message，等等上面提到的事件去搜索）

运气很好，输入`websocket`直接就搜到了js,还是没有混淆的
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4t04u89ej20i30410t0.jpg)

首先发现 websocket 地址是根据catId变的，如果catId能被2整除则地址为xxx，否则为xxx
那么catId是什么呢，调试发现就是url中的id，我们当前url为`http://www.10brandchina.com/vote/startin.php?id=41867`则 catId为`41867`

然后onmessage也看到了，大概意思是收到信息后，用json解析，如果action是auth的话，则调用sendData这个方法，如果action是vote的话，则使用vote_resule方法.

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4t2w87vsj20gp0fm0to.jpg)

在看到onopen方法，是调用sendData,并发送`('auth',authType)`,在这边是不是联想到前面，我们第一次发送的数据？`{"action":"auth","val":5}`,是不是感觉一模一样

close方法就不说了,反正我们也用不上
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4tg5g7kyj20dl01ba9w.jpg)

再看看sendData这个方法,
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4tj2ks1vj20hw07awet.jpg)
用python实现的话是这样![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4tnwvhgjj20cd02qt8n.jpg)

再看vote_result方法，大概作用是判断投票结果
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4tpk059lj20nc0e0myk.jpg)

所有的方法我们都找到了，那么我们再和之前要找的参数走一遍.

1. `{"action":"auth","val":5}`里面的`val:5`,这个5是固定的么？如果不是，是如何生成的

  **这个5也就是onopen里面的authType，至于authType是不是固定的，搜索一下就知道了.**

2. 服务器返回的是什么，如何解析
3. 如何根据服务器返回的生成一个新的val

  **可以通过onmessage方法知道他返回的json数据，json解析一下就行，**
  **里面的val是通过执行 `eval(val)`得到的**
  **所以你也可以直接执行这个.或者用python实现**
  ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4twpructj20c109igm0.jpg)

4. 发送投票信息里面`{"action":"vote","val":"{\"itemid\":126067,\"catid\":41867,\"captcha\":\"%u7EC7%u65E7%u5F88%u9C7C\",\"auth\":5,\"rnd\":\"4186712606754595\"}"}`
itemid,catid,capthc,auth,rnd如何生成

**itemid 就是你投票的公司的id，catid之前讲过，captcha就是验证码,**
**auth和上面的authtype一样**
**rnd是通过搜索js发现了.**
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4u0llrazj20uo03t0sz.jpg)


再看看验证码是如何生成的呢
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4u2gg6f5j20o507x0t9.jpg)

检查验证码是否正确
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo4u3248gpj20um09adgu.jpg)

我们已经拿到所有需要的东西了，只要用程序模拟发送就行了.

## 模拟发送
使用的包是[websocket](https://github.com/websocket-client/websocket-client/)

官方demo
```python
import websocket
try:
    import thread
except ImportError:
    import _thread as thread
import time

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    def run(*args):
        for i in range(3):
            time.sleep(1)
            ws.send("Hello %d" % i)
        time.sleep(1)
        ws.close()
        print("thread terminating...")
    thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://echo.websocket.org/",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()
```

可以看到使用还是很简单的，也是`onopen,onmessage,send`

所以我们只要用我们上面得到的信息就行模拟发送就可以了

因为是投票网站，所以不提供代码...有啥问题，请留言~

