---
title: EOS hackathon 香港总结
categories:
  - hackathon
date: 2018-06-14 00:29:03
tags:
---

## 背景

上周末去参加了EOS在香港举行的黑客松...

第一次去香港,发现香港住的地方真小...物价好贵...麦当劳都吃不起...

## 选题

因为本次黑客松是自己选题的，所以很早就一直在想要做什么...

个人参加过很多次黑客松的经验来看，觉得一个好的想法,就成功了一半呢!

### 想法的由来
在飞机上 看书的时候[增长黑客],有看到 关于定位的，大概是一个利用定于做的小游戏，就突然想到...本次黑客松我们也可以基于定位来做，可以说叫做 线上与线下的结合，让区块链结合现实来做一些东西，感觉还是蛮好玩的...

### 确定项目
吧项目和小岛说了后，觉得还可以...刚好上周在薅星云的羊毛，然后发现了一款星云上面的红包dapp，用的人还是蛮多的。就准备做基于 LBS的红包

当然（我们还有另外几个选题，大家讨论后被reject了...)

### 产品功能
确定做后，我们大概整理了下需要实现的功能
1. 最基础的版本 >>> 发红包后，生成指定链接，然后点开链接就能抢
2. 在1上面扩展，可以指定坐标，必须要在坐标多少米内，才能领取这个红包
3. 在2上面扩展，可以指定红包开始抢的时间（必须要在指定时间后才可以抢）
4. 附加功能，可以指定白名单内的用户才能抢

### 产品的使用场景
1. 普通红包就不用说了
2. 2+4 可以诱导某人必须出去活动，比如说 我想要让我儿子不那么宅，我就可以给他发一个白名单红包，并且把地点设置在某个地方（如中山公园），那么他想要抢到这个红包，必须到中山公园去...
3. 2+3+4 可以做为广告来用，如 我肯德基可以做一个预售，明天10点，在我店附近可以领到我们发的红包...

## coding

因为我是c++（基本上不会）
所以，所有的代码都是小岛写的
我就负责测试环境这类的(打杂)

coding中发现的一些问题

一个最大的坑是

假如合约要给你打钱，也就是送币...
发现一直赠送不成功，显示没有授权...
查文档搜索都没有找到怎么做...

然后问了现场的人指导老师，终于才搞定了...（原来这个代码刚改的，文档还没有写，所以找不到！！！

解法是，需要你授权给我合约...（很奇怪的逻辑...我给你送钱，还需要你授权给我合约，这样我才能送钱给你。。。）

但是我们试了下还是有点问题...弄了半天，当时都快要崩溃了...最后试出来了...

解法是 **合约给合约自己授权** 感觉很无语...（感觉来黑客松就是给EOS做测试来的...

## 最终结果

最后，我们实现了上面我们列出的功能，然后竟然前10都没有进...

反正很不开心,毕竟努力了...

## 总结

失败了，总需要想想为啥会失败，后续才会做的更好...

我认为我们的dapp还是挺好玩的,应该能吸引到人。不过老外没有发红包的习惯，所以会不会他觉得是很好玩，但是感觉没什么用。。。（文化差异...

进前10 的很多产品基本上 和EOS的生态有关，所以 参加的时候，应该想想**主办方为啥想组织这个活动**

{% asset_img 0.jpg 上一张合照 %}


