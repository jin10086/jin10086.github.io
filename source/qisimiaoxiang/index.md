---
title: 奇思妙想
date: 2019-12-10 19:06:51
---

记录一些自己乱七八糟的想法

有的可能完成了，有的可能鸽了，有点可能还没有行动

---

##  [人人参与的送书活动](/2018/09/24/%E4%BA%BA%E4%BA%BA%E5%8F%82%E4%B8%8E%E7%9A%84%E9%80%81%E4%B9%A6%E6%B4%BB%E5%8A%A8/)

##  [老玩家检测器](/lab/%E8%80%81%E7%8E%A9%E5%AE%B6%E6%A3%80%E6%B5%8B%E5%99%A8.html)

##  [怎么找到喜欢程序员的妹子做女友](/lab/怎么找到喜欢程序员的妹子做女友.html)

   还有这个 [xunta](https://igaojin.me/2019/11/30/%E7%A8%8B%E5%BA%8F%E5%91%98%E6%89%BE%E5%AF%B9%E8%B1%A1%E8%81%9A%E5%90%88%E5%B9%B3%E5%8F%B0-xunta-today/)

##  [看图插件](/2018/03/06/%E7%9F%A5%E4%B9%8E%E7%9C%8B%E5%9B%BE%E6%8F%92%E4%BB%B6/)

##  [区块链游戏设计](/2019/09/06/%E5%8C%BA%E5%9D%97%E9%93%BE%E6%B8%B8%E6%88%8F%E8%AE%BE%E8%AE%A1/)

##  [我的审判](/2018/07/25/%E6%88%91%E7%9A%84%E5%AE%A1%E5%88%A4/) 

##  [一个真新闻的平台](https://hackmd.io/@mqBNo8W3SC-Si7bALBIM8w/rkRq4eJgr) 

##  [为什么说投机是人类的本能](https://hackmd.io/@mqBNo8W3SC-Si7bALBIM8w/SJZYztexS/edit)

##  sbqiandao（傻逼签到

主要是为了嘲讽李笑来老师的mixin签到

和李笑来老师的套路一样,需要邀请、答题解锁，大于多少eos才能提现. 

##  hackerdao

假如写一个合约，每个人都可以往里面存mkr，当达到可攻击的额度后，自动攻击…然后按照占比分钱…
当然这个mkr你也可以随时提取

[MakerDAO 治理风险可致 3.4 亿美元资产清空，官方已着手修复该问题](https://www.theblockbeats.com/news/6369?from=timeline&isappinstalled=0)

##  广告牌

做一个通用的广告牌,任何用户可以创建新的广告排

然后提供一个api给开发商,可以根据这个修改自己首页的广告。。。

##  微信广告分赃实验

微信文章留言,点击广告 获得对应的积分

最后月底按照积分来分 微信广告给的钱

[付费阅读？阅读赚钱！](https://mp.weixin.qq.com/s?__biz=MzU2OTAxNTcwMw==&mid=2247484081&idx=1&sn=688544e654a7a903e42a3d1623571496&chksm=fc846e49cbf3e75fc19fd8cb4776ee75c5edfd9e751bd4ff5317d363489ce362857dcf864363&token=932787837&lang=zh_CN#rd)

## 去中心化前端

前段时间uni因为监管原因,前端屏蔽了存在监管风险的代币. [去中心化金融成为监管重地，如何将 DeFi 前端去中心化？](https://www.chainnews.com/articles/067784546025.htm)

所以我在想如何能解决这种问题。

其实uniswap的前端一直是开源的[uniswap-interface](https://github.com/Uniswap/uniswap-interface),有蛮多团队以及钱包方现在都有提供自己的版本，方便用户使用。比如TP，Math等

但是最关键的问题其实 是如何验证第三方部署的前端没有作恶.

最简单也容易想到的问题 就是对 uniswap官方的前端每个文件生成md5,并把这个md5.json加入到uniswap官方前端库内.

这样每次uniswap更新后，相对应的md5也会自动更新。

再创建一个chrome插件. md5.json来源可以选择uniswap官方提供的,然后当你打开一个第三方提供的前端时候，chrome插件会自动对网页内加载的所有文件进行md5生成，然后再与uniswap官方提供的md5进行对比。
这样就很方便的验证 第三方是否有作恶了.
