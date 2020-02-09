---
title: MAC 如何安装 bsddb3
categories:
  - 爬虫
date: 2018-08-06 18:46:33
tags:
---

更新于2020-02-09号

可以直接使用  `conda install -c conda-forge bsddb3` 安装了 

详细文档见 https://anaconda.org/conda-forge/bsddb3

## 背景

因为今天要写一个爬虫,需要长期爬，需要过滤一些重复的请求。。。

所以准备使用 [scrapy-deltafetch](https://github.com/scrapy-plugins/scrapy-deltafetch)

发现，要求必须先安装 `bsddb3`

## 如何安装bsddb3


当然`pip install bsddb3`直接安装肯定是失败了

使用 `anaconda`也失败了...

看了下官方文档[bsddb3](https://pypi.org/project/bsddb3/)

找半天，竟然没有找到如何安装...wtf!

最后直接使用google大法，

找到了 [Installing bsddb package - python](https://stackoverflow.com/questions/16003224/installing-bsddb-package-python)

{% asset_img 0.jpg  %}

然后试了下。。。发现还是不行

然后找到了 [https://github.com/scrapy-plugins/scrapy-deltafetch/issues/23](https://github.com/scrapy-plugins/scrapy-deltafetch/issues/23)

{% asset_img 1.jpg  %}

然后发现报错，提示我安装的`berkeley-db`版本过高...

那我就想如何安装低版本的 `berkeley-db`

然后一顿搜索，发现 `brew`支持安装不同版本的，发现竟然只有最新版的...(有一个4.几版本的,安装失败了。。。)

这时候，很气，甚至都想要用docker来跑了。。。

最后想想看，还是安装好吧。。。
## 手动安装

手动安装 `berkeley-db`

搜到一篇文章 [Berkeley DB 6.2インストール手順](https://qiita.com/kuranosuke-h/items/5f47573814fbfdd8d786)，真是太感谢这篇文章了！！！
## 如何安装 bsddb3
1. 先到 [oracle berkeleydb](http://www.oracle.com/technetwork/database/database-technologies/berkeleydb/downloads/index.html)下面指定的版本，推荐使用`6.2.32`其他的高版本不行...

2. 解压到适当的文件夹
```cmd
cd ./db-6.2.32/build_unix
../dist/configure --prefix =/usr/local/Cellar/berkeley-db/6.2.32
sudo make install
```
3. 记住上面的 `/usr/local/Cellar/berkeley-db/6.2.32`
4. 去[bsddb3](https://pypi.org/project/bsddb3/#files)下载 python bsddb3包
5. 解压后，并 `python setup.py install --berkeley-db=/usr/local/Cellar/berkeley-db/6.2.32`
  这后面的路径就是 刚刚上面相同的

然后就安装成功了

就可以直接 `pip install scrapy-deltafetch` 