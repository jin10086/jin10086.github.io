---
title: 网页的解析之XPATH
date: 2018-02-03 16:13:48
tags:
  - XPATH
  - 爬虫解析
  - 爬虫
categories:
  - 爬虫
---

## 本文章属于[爬虫入门到精通系统教程](https://zhuanlan.zhihu.com/p/25296437)第六讲

在爬虫入门到精通第五讲中，我们了解了如何用正则表达式去抓取我们想要的内容.这一章我们来学习如何更加简单的来获取我们想要的内容.

## xpath的解释

> **XPath**即为[XML](http://link.zhihu.com/?target=https%3A//zh.wikipedia.org/wiki/XML)路径语言（XML Path Language），它是一种用来确定XML文档中某部分位置的语言。
XPath基于XML的树状结构，提供在数据结构树中找寻节点的能力。起初XPath的提出的初衷是将其作为一个通用的、介于[XPointer](http://link.zhihu.com/?target=https%3A//zh.wikipedia.org/w/index.php%3Ftitle%3DXPointer%26action%3Dedit%26redlink%3D1)与[XSL](http://link.zhihu.com/?target=https%3A//zh.wikipedia.org/wiki/XSL)间的语法模型。但是XPath很快的被开发者采用来当作小型[查询语言](http://link.zhihu.com/?target=https%3A//zh.wikipedia.org/wiki/%25E6%259F%25A5%25E8%25A9%25A2%25E8%25AA%259E%25E8%25A8%2580)。

## XPath的基本使用

要使用xpath我们需要下载lxml，在[爬虫入门到精通-环境的搭建](https://zhuanlan.zhihu.com/p/25315306)这一章也说明怎么装，如果还没有安装的话，那就去下载安装吧

直接看代码实战吧。
## 第一个案列
```python
from lxml import etree
# 定义一个函数，给他一个html，返回xml结构
def getxpath(html):
    return etree.HTML(html)
# 下面是我们实战的第一个html
sample1 = """<html>
<head>
<title>My page</title>
</head>
<body>
<h2>Welcome to my <a href="#" src="x">page</a></h2>
<p>This is the first paragraph.</p>
<!-- this is the end -->
</body>
</html>
"""
# 获取xml结构
s1 = getxpath(sample1)
# 获取标题(两种方法都可以)
#有同学在评论区指出我这边相对路径和绝对路径有问题，我搜索了下
#发现定义如下图
s1.xpath('//title/text()')
s1.xpath('/html/head/title/text()')
```

相对路径与绝对路径

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3bxd7qh0j20ko078t9t.jpg)

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3bxy0f6gj20o70g3dji.jpg)

### 总结及注意事项

* 获取文本内容用 `text()`
* 获取注释用 `comment()`
* 获取其它任何属性用`@xx`，如

* `@href`
* `@src`
* `@value`

## 第二个案列
```python
sample2 = """
<html>
<body>
<ul>
<li>Quote 1</li>
<li>Quote 2 with <a href="...">link</a></li>
<li>Quote 3 with <a href="...">another link</a></li>
<li><h2>Quote 4 title</h2> ...</li>
</ul>
</body>
</html>
"""
s2 = getxpath(sample2)
```
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3c3hu0ewj20nd0gntei.jpg)
### 总结及注意事项

* 上面的li 可以更换为任何标签，如 p、div
* **位置默认以1开始的**
* 最后一个用 **li[last()]** 不能用 **li[-1]**
* **这个一般在抓取网页的下一页，最后一页会用到**

## 第三个案列
```python
sample3 = """<html>
<body>
<ul>
<li id="begin"><a href="https://scrapy.org">Scrapy</a>begin</li>
<li><a href="https://scrapinghub.com">Scrapinghub</a></li>
<li><a href="https://blog.scrapinghub.com">Scrapinghub Blog</a></li>
<li id="end"><a href="http://quotes.toscrape.com">Quotes To Scrape</a>end</li>
<li data-xxxx="end" abc="abc"><a href="http://quotes.toscrape.com">Quotes To Scrape</a>end</li>
</ul>
</body>
</html>
"""
s3 = getxpath(sample3)

```

![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3c3xhw2ij20ji07ead0.jpg)
### 总结及注意事项

* 根据html的属性或者文本直接定位到当前标签
* 文本是 text()='xxx'
* 其它属性是@xx='xxx'
* 这个是我们用到最多的，如抓取知乎的xsrf(见下图)

* 我们只要用如下代码就可以了

`//input[@name="_xsrf"]/@value `
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3c4bepswj20fm063wik.jpg)
## 第四个案列
```python
sample4 = u"""
<html>
<head>
<title>My page</title>
</head>
<body>
<h2>Welcome to my <a href="#" src="x">page</a></h2>
<p>This is the first paragraph.</p>
<p class="test">
编程语言<a href="#">python</a>
<img src="#" alt="test"/>javascript
<a href="#"><strong>C#</strong>JAVA</a>
</p>
<p class="content-a">a</p>
<p class="content-b">b</p>
<p class="content-c">c</p>
<p class="content-d">d</p>
<p class="econtent-e">e</p>
<p class="heh">f</p>
<!-- this is the end -->
</body>
</html>
"""
s4 = etree.HTML(sample4)
```
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3c4q0cejj20jf0din1m.jpg)
### 总结及注意事项

* 想要获取某个标签下所有的文本（包括子标签下的文本），使用`string`
* 如 `<p>123<a>来获取我啊</a></p>`，这边如果想要得到的文本为`123`来获取我啊"，则需要使用`string`
* `starts-with` 匹配字符串前面相等
* `contains` 匹配任何位置相等
* 当然其中的`(@class,"content")`也可以根据需要改成`(text(),"content")`或者其它属性`(@src,"content")`

## 最后再次总结一下

看完本篇文章后，你应该要

* 能学会基本所有的xpath的使用
* css和这个的原理一样，所以就不介绍了，可以参考

* [CSS 选择器参考手册](http://link.zhihu.com/?target=http%3A//www.w3school.com.cn/cssref/css_selectors.asp)

* 所有代码在[kimg1234/pachong](http://link.zhihu.com/?target=https%3A//github.com/kimg1234/pachong/blob/master/xpath.ipynb)