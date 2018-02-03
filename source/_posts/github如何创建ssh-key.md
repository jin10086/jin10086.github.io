---
title: github如何创建ssh-key
categories:
  - github
date: 2018-02-03 19:07:56
tags:
  - sshkey
---
## 背景
最近在写几个私有项目,每次提交都需要输入账号密码，很烦...

搜索发现如果使用ssh协议来提交的话，只要生成ssh key，就不需要输入账号密码了

## 本地ssh-key的创建

默认已经装好了git,如果没有安装的话，请百度如何安装

在命令行中输入下面命令
`ssh-keygen -t rsa -C "你的邮箱地址"`

如果提示找不到ssh-keygen 这个命令的话,请检查是否有安装git 以及是否要ssh-keygen加入环境变量
然后直接回车三连（三次回车）
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3h4q7e9xj20gz09wwf1.jpg)

然后 li* mac 等系统的同学 直接输入
`cat ~/.ssh/id_rsa.pub` 然后直接复制里面的所有的内容

windows的同学,打开当前计算机名（如我当前计算机名是 `kimga`
`C:\Users\kimga\.ssh`下面的`id_rsa.pub`,然后复制里面的所有内容
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3h7ooj2gj20ay044jre.jpg)

## github 设置
1. 打开github[设置ssh-key的地址](https://github.com/settings/ssh/new)
2. 在title里面输入你这个key用在哪的,(可以随便写)
3. 在key里面粘贴进去上面复制的
4. ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3haocqmmj20lt0c83yu.jpg)
5. 点击add ssh key，然后输入GitHub密码就好了

## 测试
在命令行输入
`ssh -T git@github.com`
会有一个警告,直接输入`yes`
然后会看到 `Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
`
则成功了
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3hfokg3kj20k103hmxf.jpg)

## 在项目中使用ssh协议
有两种情况
1. 你项目还没有clone 下来，则你clone的时候直接使用ssh协议
如下图，点击Use SSH,然后复制地址
![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3hj3l773j20b205y3yt.jpg)
正常clone，如`git clone git@github.com:jin10086/pachong.git`

2. 你项目已经clone下来了，但是用的是https协议，则需要更改下remote url
怎么做的，看下面
  1. 输入`git remote -v` 查看当前的url，可以发现我使用的https协议
  2. ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3hm0gw5kj20cl020748.jpg)
  3. 输入`git remote set-url origin git@github.com:jin10086/pachong.git`,后面的git协议的地址获取方法和 方法1一样的.
  4. 输入`git remote -v`看看是否有修改成功
  5. ![](http://ww1.sinaimg.cn/large/cfc08357gy1fo3hnu7ygaj20k002owel.jpg)

最后，愉快的使用github把，再也不用每次都输入密码了~