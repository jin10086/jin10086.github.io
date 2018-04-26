---
title: 如何用myetherwallet 来玩智能合约
categories:
  - 区块链
date: 2018-04-26 20:05:47
tags:
  - myetherwallet
  - 智能合约
---

## 如何用myetherwallet 来玩智能合约

用myetherwallet之前，请先看看 [黑客已经盗了15,945,221.72 USD
](https://zhuanlan.zhihu.com/p/36105871)

看完应该会知道如何安全的使用 myetherwallet 了.

## 开始

**本次我们玩的合约是 https://ropsten.etherscan.io/address/0x39171828d0c6d072c19f5d32900e30343c296f38**

### 确定合约是在哪个网

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpucquu3ij20fe0b83zv.jpg)

以上就是常见的所有网了

如果网址 前缀是ropsten，那么就是 ropsten测试网...

如果网址 前缀是kovan，那么就是 kovan测试网...

网址前面没有带的，如https://etherscan.io/address/0x39171828d0c6d072c19f5d32900e30343c296f38

这种就是主网...

除了主网外，其他的网都是测试网（也就是获取ETH是免费的）

我们本次测试的时候，网址是https://ropsten.etherscan.io/address/0x39171828d0c6d072c19f5d32900e30343c296f38

那么我们本次玩的合约在 ropsten.

### 获取合约地址

合约地址还是很简单就能知道的

如本次我们要玩的网址是https://ropsten.etherscan.io/address/**0x39171828d0c6d072c19f5d32900e30343c296f38**

那么合约地址就是 **0x39171828d0c6d072c19f5d32900e30343c296f38**

### 获取ABI

打开https://ropsten.etherscan.io/address/0x39171828d0c6d072c19f5d32900e30343c296f38#code (注意，如果你要玩的合约地址，不一样的话，则可以吧address 后面的地址替换成你的...)

复制contract ABI 里面的内容...(这就是ABI)

如果打开没有的话，则说明这个合约没有开源...

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpup111sfj222k14uqja.jpg)

### 打开myetherwallet
- 打开 https://www.myetherwallet.com/#contracts

- 选择正确的网

可以看到，每个都有好几个，随便选择一个就行...(本次我们是ropsten，也就是只要前面是ropsten的，你随便选哪个都可以）


![](http://ww1.sinaimg.cn/large/cfc08357gy1fqput51107j20z80zkqa1.jpg)

- 复制上你合约地址 与 合约ABI ，然后点击Access

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpuwhj65ij225o0n2wk1.jpg)

- 选则你要调用的方法

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpuxrptpaj212810iq6n.jpg)

（本次我们选择 `batchTransfer`)
- 输入你的参数

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpvf9kw43j21p20taq79.jpg)

本次我们的参数 如上图所示...
不知道为啥 请看[一行代码蒸发了¥6,447,277,680 人民币！](https://mp.weixin.qq.com/s?__biz=MzU2OTAxNTcwMw==&mid=2247483863&idx=1&sn=5029734091080c37923f9bd666a6e1fa&chksm=fc846d2fcbf3e439e4f25ad1c7915c10ee8b375f791a260e0cd273d982aa521948d325f59121#rd)

- 连接到metamask（metamask 没有装的话，请百度.)

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpv39fzkuj223s0uqtg7.jpg)

- 点击write 

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpvh38jhmj21840rwad6.jpg)

注意，gaslimit 会自动出来...如果gas limit 那边为空的话，请确认你的参数...

- 点击生成交易

确认提交就可以了

![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpviza1z9j215u12awk3.jpg)

- 然后这笔交易会发送到metamask上，点击submit 就可以了.
![](http://ww1.sinaimg.cn/large/cfc08357gy1fqpvkhkfb8j20ke0qmgoh.jpg)

我本次提交成功后的 tx https://ropsten.etherscan.io/tx/0x8359cfe6c0ccbb9a8126531c1162e80fb0c6f0beecb10bdcd0843bc368848b33

