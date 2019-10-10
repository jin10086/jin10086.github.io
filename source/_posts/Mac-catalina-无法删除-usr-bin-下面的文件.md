---
title: Mac catalina 无法删除/usr/bin/下面的文件
categories:
  - 问题
date: 2019-10-10 20:12:17
tags:
---

`rm: /usr/bin/python: Operation not permitted`

就算用了sudo 也是一样.

发现是SIP的问题 具体可以见 [Mac OS X 10.11+ Rootless 介绍](https://www.jianshu.com/p/82e43aff03fd)

>尝试关闭 Rootless。重启电脑一直按住 Command+R，直到进入恢复模式，打开Terminal。
>输入 `csrutil disable`
>重启即可。这样就关掉了Sip 如果要恢复默认，那么只要输入 `csrutil enable`

发现继续报错

`Read-only file system`

然后 需要先执行

`sudo mount -uw /`

再操作就可以了

记得操作完把 sip重新打开

## 总结

所以 最后步骤是 先关掉sip,然后`sudo mount -uw /` 就可以啦
