---
title: headers的详细讲解（If-modified-since）
categories:
  - 爬虫
date: 2018-02-03 17:30:25
tags:
  - If-modified-since
  - headers
---

本文讲解的知识点是headers里面的If-modified-since

## 案例
本次我们要抓取的内容是苹果应用商店里面的所有app [从 iTunes 下载的 App Store](https://itunes.apple.com/cn/genre/ios/id36)
当我第一次打开[王者荣耀：在 App Store](https://itunes.apple.com/cn/app/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80/id989673964) 上的内容网页的时候，再次刷新的时候，你会看到http状态码返回 304
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3e36k8vrj210q0id49d.jpg)

那么知道了这个http状态码304对我们爬虫有什么用呢？

当我需要每天的爬取苹果应用商店的app的时候，因为苹果app很多，所以每次如果我全部爬取的话，会花费很多的时间，其实我只要抓取有更新的内容就好了。那么http状态码304就派上用场了。

## 看代码
```python
import requests

headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'}

url = 'https://itunes.apple.com/cn/app/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80/id989673964'

z = requests.get(url,headers=headers)
```
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3e3xshabj20yf07hwil.jpg)

```python
# 获取上次修改时间
last_modified = z.headers['Last-Modified']
# 修改headers
headers['If-Modified-Since'] = last_modified
```
### 方法1
```python
z1 = requests.get(url,headers=headers)
print z1.status_code
# 304
# 可以看到已经返回状态码304，表示网页没有更新
```
### 方法2
```python
z2 = requests.head(url,headers=headers)
if z1.headers['Last-Modified'] == last_modified:
print u'网页没有更新'
# 这种方法也可以知道网页是否有更新
```

## 总结
那么假如我要每天爬取苹果应该商店的app，那么我会在第一次请求的时候吧每个网页的上次修改时间存到数据库（也就是If-Modified-Since）

然后在我第二次爬取的时候，我会把上次存到数据库的时间放到headers里面，如果http状态码返回304,则表示网页没有更新，我可以不用再次解析网页，这样会节约大量时间...

最后代码在 [kimg1234/pachong](https://github.com/jin10086/pachong/blob/master/If-modified-since.ipynb)

