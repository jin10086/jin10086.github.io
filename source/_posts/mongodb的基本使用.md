---
title: mongodb的基本使用
categories:
  - 爬虫
date: 2018-02-03 17:36:09
tags:
  - mongodb
---
本文章属于[爬虫入门到精通系统教程](https://zhuanlan.zhihu.com/p/25296437)第十讲

在之前我们讲解了如何爬取网页（不管是异步加载的还是普通的），但是爬取下来的数据该如何保存呢？

## 保存到文本文件？

可能有人会说那我保存在文本文件里面，这样也是可以的，但是到你需要用这个数据的时候，可能就会很麻烦了...

{% asset_img 0.jpg  %}
我今天爬取了10000部日本电影

假如说你要找苍老师出演的，那么你可能会说，我直接`ctrl+f`查找"苍老师"不就行了

但是假如你想要找"苍老师+无码"怎么办呢？？？

这个时候就是体现数据库的作用了。

## Mongodb的介绍

### 为什么用mongodb呢？
1. 文档结构的存储方式
1. 简单讲就是可以直接存json,list
2. 不要事先定义"表",随时可以创建
3. "表"中的数据长度可以不一样
1. 也就是第一条记录有10个值，第二条记录不要规定也要10个值
2. 对爬虫这种很乱的数据来说，很适用 。

## Mongodb的安装

直接到 [https://www.mongodb.com/download-center#community](https://www.mongodb.com/download-center#community)选择合适的版本下载安装就可以了。

安装完成后

windows用户在
`bin`目录下新建一个`data`的文件夹
{% asset_img 1.jpg  %}

然后在新建一个`start.bat`文件,内容写上
`mongod --dbpath ./data`
后面每次只要直接打开这个.bat 文件mongodb就运行了
{% asset_img 2.jpg  %}
你可以直接选中`start.bat`，发送到桌面快捷方式，这样你以后可以直接在桌面打开了
{% asset_img 3.jpg  %}
## mongodb的基本使用

首先 `pip install pymongo`

{% asset_img 4.jpg  %}
{% asset_img 5.jpg  %}
{% asset_img 6.jpg  %}
{% asset_img 7.jpg  %}
{% asset_img 8.jpg  %}
{% asset_img 9.jpg  %}
{% asset_img 10.jpg  %}

## 总结
### 爬虫经常用到的三条插入语句

下面的**test2为表名**,

- `test2.insert_one(xx)` 插入一条数据
- `test2.insert_many(xx)` 插入list
- **最常用>>>**`test2.update_one({'x':1},{'$set':{'x':3}},upsert=True)`
- 第三条一般会在防止重复的数据被存到数据库内 要用到

代码都在 [https://github.com/kimg1234/pachong/blob/master/mongodb%E7%9A%84%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.ipynb](https://github.com/kimg1234/pachong/blob/master/mongodb%E7%9A%84%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.ipynb)

参考文档

- [mongodb中文文档](http://www.runoob.com/mongodb/mongodb-tutorial.html)
- [mongodb官方文档](https://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one_and_update)

