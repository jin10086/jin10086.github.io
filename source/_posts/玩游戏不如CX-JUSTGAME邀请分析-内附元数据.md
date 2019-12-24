---
title: '玩游戏不如CX,JUSTGAME邀请分析(内附元数据)'
categories:
  - 区块链
date: 2019-12-25 01:33:53
tags:
  - JUSTGAME
---

所有数据截止到2019-12-24:19:00:00(之后没有统计)

justgame估计🈹️了不少人, 对游戏盈利数据分析可以看看这个[DR深度这一次，孙宇晨真的被割了](https://mp.weixin.qq.com/s/WIy3DcauPIWxg1Vo3CO75Q),本文只看 邀请奖励


总游戏人数**4529**
```
In [13]: len(db.distinct('raw_data.contract.parameter.value.owner_address'))
Out[13]: 4259
```


拿到邀请奖励的:358(统计邀请奖励大于1trx的)
```
In [11]: db1.count_documents({'ref':{"$gt":1}})
Out[11]: 358
```
然后下面就是按照邀请金额排行的了

第一名603w
第二名310w
第一名181w
{% asset_img  ref1.png title %}

其他的数据懒得统计了

把元数据以及代码放到github了,有兴趣的自己分析把





