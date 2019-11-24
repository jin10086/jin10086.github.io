---
title: EOS 1.8 bidname的漏洞分析
categories:
  - 区块链
date: 2019-11-24 11:49:12
tags:
  - EOS
---

## 背景


因为最近EIDOS挖矿很火,所以会特别关注EOS CPU的使用情况

一觉醒来看到 eosio的cpu的使用率变高,这肯定不正常,应该是有人利用eosio的cpu来挖EIDOS

{% asset_img  cpu异常情况.jpeg EOS CPU异常使用率 %}

## bidname 源代码分析

bidname的逻辑大概说一下

就是a先竞拍某个名字,b如果也想要这个名字的话,需要出大于a价格的10%

然后系统会把a的钱退给他

源码在: https://github.com/EOSIO/eosio.contracts/blob/v1.8.0/contracts/eosio.system/src/name_bidding.cpp#L53

### 竞拍成功后的给上一个人退钱

```c++
 eosio::transaction t;
         t.actions.emplace_back( permission_level{get_self(), active_permission},
                                 get_self(), "bidrefund"_n,
                                 std::make_tuple( current->high_bidder, newname )
         );
         t.delay_sec = 0;
         uint128_t deferred_id = (uint128_t(newname.value) << 64) | current->high_bidder.value;
         eosio::cancel_deferred( deferred_id );
         t.send( deferred_id, bidder );

         bids.modify( current, bidder, [&]( auto& b ) {
            b.high_bidder = bidder;
            b.high_bid = bid.amount;
            b.last_bid_time = current_time_point();
         });
      }
```

可以看到当竞拍成功后,会发起一个延时交易,调用自己的bidrefund方法, bidrefund是给上一个人退钱

注意这边的的发起人是 `get_self()`,也就是eosio自己,所以这个延时交易的cpu 由eosio这个账号付

科普一下: **延时交易的cpu由谁付,主要看签名的人是谁**

### bidrefund 方法
```c++
   void system_contract::bidrefund( const name& bidder, const name& newname ) {
      bid_refund_table refunds_table(get_self(), newname.value);
      auto it = refunds_table.find( bidder.value );
      check( it != refunds_table.end(), "refund not found" );

      token::transfer_action transfer_act{ token_account, { {names_account, active_permission}, {bidder, active_permission} } };
      transfer_act.send( names_account, bidder, asset(it->amount), std::string("refund bid on name ")+(name{newname}).to_string() );
      refunds_table.erase( it );
   }
```

bidrefund 方法就是给上一个人打EOS

发起人是 eosio.names,接收人是上一个参与拍卖的人 

## 如何利用漏洞

因为上面有给前一个参与拍卖的人打EOS,其实是可以挂一个钩子

就是我可以写一个方法,接收某个人给我打代币的通知,然后我做某些事情

### 代码示例

官方文档关于on_notify在[eosioon_notifyvalid-eosio-account-namevalid-eosio-action-name](https://eosio.github.io/eosio.cdt/latest/guides/generator-attributes/#eosioon_notifyvalid-eosio-account-namevalid-eosio-action-name)

```c++
//监听eosio.token转账的消息，也就是说如果有人给我打eos，就会触发我下面的方法
[[eosio::on_notify("eosio.token::transfer")]] 
void run(name from, name to, asset quantity, std::string memo)
{
  if (from == name("eosio.names"))
  {
    //挖EIDOS
  }
}
```
### 利用漏洞的整个流程

所以整个逻辑是这样

eosio 发起 bidrefund -> 向前一个人转账 -> 接收通知后挖矿

由于 “向前一个人转账、接收通知后挖矿” 都是内部交易,所以整个cpu都是由 执行bidrefund 方法的人买单,也就是eosio买单

那么只要 我弄两个号,一起去拍某个名字,这样就可以一直挖矿了


## 如何更高效的利用漏洞

### 成本分析

1. 拍一个新的名字,ram由发起人付
2. 因为每次拍卖的费用需要最少比上次多10%,所以两个人一直互相拍的话,最后停止的时候会损耗10%的EOS

ram费用和收入相比,基本上可以忽略不计

最后损耗10%的话,只要我控制上限就好了...(也就是每次从0.0001 EOS开始，到0.01 EOS我就换一个名字继续拍)

### 让程序永远的跑下去

有两种方法

1. 线下版

两个合约都设置好上限,然后线下新增名字拍卖

2. 合约版

生成新的名字也在合约内

## 合约完全自动执行（一次触发


整个逻辑如下图

{% asset_img  bidname逻辑.png EOS bidname漏洞利用无限跑 %}

当A收到eosio.names发来的eos,先执行挖矿

再判断是否大于0.01EOS

不大于的话，直接金额加10%拍卖一次（这样，另一个合约就会收到eosio.names的转账通知）

大于的话，先生成新的可用的name

然后先本合约参与拍卖0.0001EOS的，并让另一个合约拍卖0.0002EOS的

这样整个流程就完成了

只要先线下一次性拍100个，那就相当于100并发

会永远的执行拍卖下去，而且CPU只要刚开始触发的100次。。。

### 自动生成可用的name

1. 需要名字没有被注册过

is_account 就可以做到

```c++
if (!is_account(name(newname))){

}
```

2. 名字没有被拍卖过

```c++
 name_bid_table bids("eosio"_n, "eosio"_n.value);
  auto current = bids.find(name(newname).value);
  if (current == bids.end())
  {
      return newname;
  }
```

## 漏洞修复

{% asset_img WX20191124-130920@2x.png EOS1.81版本bidname %}

可以看到cpu由之前的`get_self()` 改成了 `current->high_bidder`

也就是由之前的eosio 改成了上一个人参与拍卖的人。。。

所以后面就无法继续利用了
