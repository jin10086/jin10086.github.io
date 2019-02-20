---
title: 1080TI 不支持OPENCL解决办法
categories:
  - 奇怪的BUG
date: 2019-02-21 00:41:20
tags:
  - opencl
---


最近买了一块1080TI,准备用来跑跑机器学习（顺带打打游戏...)

然后发现装好驱动,cuda后

使用pyopencl的时候，竟然找不到GPU

然后使用 GPU-Z 测试的时候，发现果然不支持 OPENCL

![](http://ww1.sinaimg.cn/large/cfc08357gy1g0ddcag2rrj20u01svqv7.jpg)

开始以为是自己的板子有问题...

后面将显卡驱动降级为 471.22这个版本就好了(2018-11-29发布的)

结合网上看到的一些信息，猜测是 NVIDIA 自己弄了一个 pycuda,可以替换pyopencl的东西...

所以后续的驱动就不支持pyopencl了...

