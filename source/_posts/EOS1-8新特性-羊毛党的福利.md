---
title: 'EOS1.8新特性,羊毛党的福利'
categories:
  - 区块链
  - EOS
date: 2019-11-04 20:59:49
tags:
---
## 背景

最近EIDOS很火,一不小心挖矿就把自己的CPU挖爆了。。。

想出货都没有办法。。。

但是最近EOS1.8版本已经上线了

可以让别人帮你支付CPU费用

## 新特性的介绍

>如果一笔交易有两个或者两个以上的账户联合签名，则只会对排在第一位的账户收取资源费用。此外， EOSIO 1.8的新特性不只是“dApp为用户支付资源“，还包括：1.资源的付费方，可以是任意的账号或服务方，该账号不一定是dApp；2.交易所可以为用户承担资源费用，帮助用户充值至交易所；3.任意的EOS账号，都可以为其他的账号支付资源；4.dApp能够为用户支付资源；5.有可能借助于一项特殊的协议，扫描二维码即可完成资源支付。

## 测试一下

`cleos push action eidosonecoin transfer '["gy2dgmztgqge","mxcexdeposit","4642.9812 EIDOS","109257"]' -p bbheasxtlatd gy2dgmztgqge`

其实还是很简单的,只是签名的时候 把 支付cpu的那个号放在前面就好了

如上面 `bbheasxtlatd`是出cpu费用的号

详细请看这笔签名的tx [e7c203425927bb89928a33e3f1b41c75bf293cb84c29230ad68de36a061d95bb](https://bloks.io/transaction/e7c203425927bb89928a33e3f1b41c75bf293cb84c29230ad68de36a061d95bb)

## 延伸一下

感觉以后羊毛党很舒服了啊

只要给大号质押资源就可以了,然后全部用大号的资源

再也不怕小号动不了了
