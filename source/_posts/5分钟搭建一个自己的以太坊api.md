---
title: 5分钟搭建一个自己的以太坊api
categories:
  - 区块链
date: 2019-02-13 23:54:58
tags:
  - 以太坊
  - parity轻节点
---

## 背景

![](http://ww1.sinaimg.cn/large/cfc08357gy1g058xe371bj20yi0oy0x5.jpg)

这是很早之前吐槽infura api的一个朋友圈

当时应该是为了薅羊毛,然后卡在了infura这个api上面...

infura api 有个神奇的限制...

假如某个账号，向其他账号批量发起转账...(你写个程序跑一下很快就好了)

但是 infura 每次只会给你广播1笔交易...（1笔成交后，下一笔才会广播出去

也就是说,假如批量发起100笔转账的话，最少也需要100个区块才会成交...

当然 假如不敢时间的话，慢慢来也是无所谓的...

敢时间的话，你估计就骂人了...

不过目前 市面上能用的 公开的api节点好像就 infura有提供服务...

其他的 myetherwallet,imtoken,等等肯定有自己的（可以抓包知道他的api地址...) 不过这种用的人多，自然不是很快...

所以自己搭建节点是有必要的

## 搭建轻节点

搭建全节点的话，如果就偶尔用一下，就很不实际了.

1. 如果用的时候 再同步，肯定来不及
2. 如果一直放一台服务器同步，这个成本也不少

一番搜索，找到了解决办法...parity的轻节点

## 如何搭建parity轻节点

1. [根据自己平台下载parity](https://github.com/paritytech/parity-ethereum/releases)
2. `parity --light` 在cmd输入下面的命令（开启parity 轻节点)  [文档地址](https://wiki.parity.io/Light-Client)

大概5分钟就能同步好

然后就可以连接本地的 **http://127.0.0.1:8545** 使用了

如果要改默认的端口以及监听的host，可以看 https://wiki.parity.io/Configuring-Parity-Ethereum

## python 使用示例

```
from web3 import Web3, HTTPProvider

RPCAddress = "http://127.0.0.1:8545"

w3 = Web3(HTTPProvider(RPCAddress))

balance = w3.eth.getBalance('0xAD5723C4f7B4C478E09688f96a7A477B0D1196fd')
```