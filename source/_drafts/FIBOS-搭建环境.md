---
title: FIBOS-搭建环境
categories:
  - FIBOS
date: 2018-08-31 13:04:03
tags:
---

## 下载 fibos

在 命令行输入  `curl -s https://fibos.io/download/installer.sh |sh`
然后应该会要求你输入 密码，输入后，按回车就行...

然后就是在下载了（是有点慢）
![下载过程](http://ww1.sinaimg.cn/large/cfc08357gy1fussyit3xwj2158072aid.jpg)

![下载完了](http://ww1.sinaimg.cn/large/cfc08357gy1fusszh5aajj21mo0asdry.jpg)

 ## 配置项目环境

在命令行里面，依次输入下面的命令

```mkdir fibos_client```

`cd fibos_client`

`fibos --init`
然后一直按回车
`fibos --install fibos.js`

最后fibos 的基础环境就搭建好了

记得记住`fibos_client`的目录,后面所有的

## 参考

[fibos 环境配置](https://fibos.io/docs/guide/basic/install.md.html)