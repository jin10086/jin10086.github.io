---
title: EIDOS 自动撸空投(不需要开电脑与手机版)
categories:
  - 区块链
date: 2019-11-01 15:46:26
tags:
---

## 什么是EIDOS

我感觉就是让大家疯狂干EOS主网，谁干的猛，谁拿的钱就多。。。

下面是老陆写的介绍,[EIDOS 自动撸空投详解](https://mp.weixin.qq.com/s/ep4HdVFc1AvOMTYkpJMuUg)

{% asset_img 1.webp  %}

>官网：http://eidos.one

官方推特：https://twitter.com/EnuMivo

早前消息是说啊，EIDOS 快来到EOS上发空投了，UBI理念的ENU已经死了。

简要回顾一下ENU，一次空投4000多个，一个最多涨到0.5元，批量撸ENU赚几十万的不在少数。

本着宁可做过不可错过的精神，现在开始教大家怎么撸EIDOS。


首先我们先了解空投的规则，用户可以将任意金额的 EOS 转账至 eidosonecoin 这个账户，智能合约会将等量的 EOS 返回至用户账户，并会将 eidosonecoin 这个账户中存有的 0.01% EIDOS 发送到用户账户中。 

按照 EIDOS 的规则，每一秒内，会有 25 个 EIDOS 产生，其中 20 个 EIDOS 用于空投给用户，剩余 5 个将发送到团队的账户。空投将持续 15 个月，最终，将有 10 亿 EIDOS 生成，其中 8 亿用于空投。

简单来说就是不停给 eidosonecoin 这个账号转账，每次转账消耗 CPU 资源来获取账号内万分之一的 EIDOS 。

{% asset_img 2.webp  %}

## 合约挖矿

正常的操作应该是我写一个脚本,每隔1秒疯狂向eidosonecoin发0.0001 EOS,但是这样比较麻烦的是 你需要有一台电脑一直开机

然后我就写了一个合约...

你只要部署这个合约,设置好参数,充值好CPU,NET后,就可以不用管了...

原理很简单,就是疯狂延时交易而已...

代码在：https://app.eosstudio.io/jin10086/fuckenu

### 先决条件

1. 需要先买200kb的内存 （后面不想跑了可以卖掉
2. 需要电脑装了scatter 
3. 需要给自己部署合约的这个账号加eosio.code权限

### 部署合约

按照下面图片1，2，3的顺序 部署合约

1. 登录scatter
2. build 合约
3. 部署合约

{% asset_img 3.png  %}

### 执行合约

{% asset_img 4.png  %}


1. 切成你部署好的合约
2. 先执行init 方法
3. 再执行run方法 就一直跑了

执行完应该如下图

{% asset_img 5.png  %}


### 停止合约

执行 stop方法就行了


最后放一张我撸的截图 1s一次

{% asset_img 6.png  %}


