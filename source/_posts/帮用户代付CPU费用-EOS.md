---
title: 帮用户代付CPU费用--EOS
categories:
  - 区块链
date: 2019-11-13 21:12:12
tags:
---

参考文档 https://github.com/EOSLaoMao/deploy-eosio-contracts-v1.7.0/blob/master/features/ONLY_BILL_FIRST_AUTHORIZER.md

## 主要功能

用户可以支付RMB,EOS 等来让我们帮他支付一次转账的费用

## 使用场景

主要是负责救急作用（用户账号动不了的时候)

## 流程

用户选择想要操作的合约，方法，以及参数等等

1. 前端生成如下的数据，此时用户不需要签名

```
{
  "expiration": "2019-10-15T06:02:59",
  "ref_block_num": 486,
  "ref_block_prefix": 2948179210,
  "max_net_usage_words": 0,
  "max_cpu_usage_ms": 0,
  "delay_sec": 0,
  "context_free_actions": [],
  "actions": [{
      "account": "eosio.token",
      "name": "transfer",
      "authorization": [{
          "actor": "USER",
          "permission": "active"
        }
      ],
      "data": "0000000084ab32dd0000000088ab32dd102700000000000004454f530000000000"
    }
  ],
  "transaction_extensions": [],
  "signatures": [],
  "context_free_data": []
}
```
2. 判断收费情况，等待用户付费
3. 付费成功后,修改expiration，ref_block_num和ref_block_prefix、，并且要代付费的actor添加为first authorization。
4. 对生成的交易进行签名
5. 返回给前端，让用户签名，整个流程完成


如果用户是用EOS支付的，则需要先把eosio.token transfer 给收费账号的放在第一位

否则是直接只有1个交易

## 需要注意的问题

### 签名后的交易能多次用吗？

不能

### 如何方便的接入rmb支付？

后续再弄,第一版只支持EOS付费

### 能否使用出active权限以外的其他权限代付?

不能,所以代付的这个账号只能里面不存任何钱,里面只有资源费用。


## api

前端post json格式的数据: `{username:"xxx",data:要过来签名的data,json dumps格式,timestamp:xxx,nonce:xxx}` 

nonce是类似于uuid的东西...是本次请求的一个标识

然后一直get {"nonce":"xxx"} 等待返回的数据

返回的数据格式

status为1 表示 成功,0表示错误

```
status:1,nonce:xxx,data:data
status:0,nonce:xxx,data:"错误信息"
```






