---
title: 一行代码损失了？？？RMB
categories:
  - 区块链
date: 2018-05-24 14:50:38
tags:
---

## 背景

又发现一个ERC20 超级大的漏洞

这个漏洞严重到什么情况呢？

**你的钱不再是你的钱，任何人都可以把你的钱转走，你也可以转走任何人的钱**

那笔操作记录是 [0x9a6a0ba68214db82ec6fd12ee3a6b4cf1143ec963974d7a5edf97e08b6c482ca](https://etherscan.io/tx/0x9a6a0ba68214db82ec6fd12ee3a6b4cf1143ec963974d7a5edf97e08b6c482ca)

{% asset_img 0.png CW30Qf.png %}
下面我来带大家看看，黑客是如何实现的！

我们可以看到执行的方法是 `transferFrom`

那这个方法是干嘛的呢？（从某个人 转钱到 另外一个人 ）

这个方法有一个配套的方法`approve`，你授权某个人用多少你的钱。。。

所以，这两个方法的使用场景是，

举个例子：

我授权我儿子使用我的100块钱，那我先调用`approve`
然后 我儿子要用钱的时候，调用`transferFrom `来用我的钱，当然用一次少一次（而且每次用的钱不能超过我授权的钱）



## 代码解释


```
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    /// same as above
    require(_to != 0x0);
    require(balances[_from] >= _value);
    require(balances[_to] + _value > balances[_to]);

    uint previousBalances = balances[_from] + balances[_to];
    balances[_from] -= _value;
    balances[_to] += _value;
    allowed[_from][msg.sender] -= _value;
    Transfer(_from, _to, _value);
    assert(balances[_from] + balances[_to] == previousBalances);

    return true;
}
```
这个方法会传入三个参数


1. _from :在用谁的钱
2. _to : 把钱给谁
3. _value : 准备用多少钱


```
require(_to != 0x0);
require(balances[_from] >= _value);
require(balances[_to] + _value > balances[_to]);
```
这三行是一些强制要求

1. 你不能把钱转给0x0,也就是空地址
2. 你在用谁的钱（那么这个人的余额一定要大于 你要用的钱）
3. 你转给的那个人钱，那么那个人的余额一定要大于 之前的余额（也就是不能转个-1之类的，导致他余额反而变少了）

```
uint previousBalances = balances[_from] + balances[_to];
balances[_from] -= _value;
balances[_to] += _value;
```
这三行

1. 算出两个人余额的总数
2. from 那个人的余额 - value
3. to 那个人的余额 + value

`
allowed[_from][msg.sender] -= _value;
`

这一行我们分解下
`allowed[_from][msg.sender]` 是 当前方法调用的人（msg.sender）可以使用(_from) 多少钱

也就是假如 我授权了我儿子100块，那么 

allowed[我的地址][msg.sender] = 100(这边的msg.sender 需要是我儿子的地址，如果是别人的话，我没有授权给他，则是0 

所以这一行原本的意思是 (我儿子用了多少授权的金额，那么总授权金额需要 减掉 被用掉的）

但是呢。。。因为没用用safemath...导致任何人都能通过这一行（也就是 0- value)

0-value是不会报错的（当然如果用safemath的话，是会报错的。。。）

所以呢，只要你找到一个有钱人的地址，，，然后就可以吧他的钱全部转给任何账户。。。

下面的代码就没有意义了，不需要解释了。。。

而且他这个合约 没有暂停的方法。。。

导致现在任何人都可以调用这个合约。。。




## 合约的问题
1. 当然是做加减乘除的时候没有用safemath
2. 逻辑还有一个问题

正常来说，应该需要加一个 判断，被授权的金额 不能大于 要发送的金额。。。

`require(allowed[_from][msg.sender] >= _value);
`

这样的话 后面也就不会有这些事情了。。。

## 总结
我发现了 攻击这个合约的人 已经攻击了很多合约了！！！
{% asset_img 1.png CW3By8.png %}
这一些币大家就别抄底了!















