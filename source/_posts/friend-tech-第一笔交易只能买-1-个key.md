---
title: friend_tech 第一笔交易只能买 1 个key?
categories:
  - 
date: 2023-09-19 15:36:24
tags:
---

## 背景

群里有人说friend tech 第一笔交易只能自己购买1笔？

我当时就反驳了他,毕竟我也算看过 friend tech 合约代码的人,合约没有限制只能买 1 笔啊

## 废话少说，直接看代码

```JS
function buyShares(address sharesSubject, uint256 amount) public payable {
    uint256 supply = sharesSupply[sharesSubject];
    require(supply > 0 || sharesSubject == msg.sender, "Only the shares' subject can buy the first share");
    uint256 price = getPrice(supply, amount);
    uint256 protocolFee = price * protocolFeePercent / 1 ether;
    uint256 subjectFee = price * subjectFeePercent / 1 ether;
    require(msg.value >= price + protocolFee + subjectFee, "Insufficient payment");
    sharesBalance[sharesSubject][msg.sender] = sharesBalance[sharesSubject][msg.sender] + amount;
    sharesSupply[sharesSubject] = supply + amount;
    emit Trade(msg.sender, sharesSubject, true, amount, price, protocolFee, subjectFee, supply + amount);
    (bool success1,) = protocolFeeDestination.call{value: protocolFee}("");
    (bool success2,) = sharesSubject.call{value: subjectFee}("");
    require(success1 && success2, "Unable to send funds");
}
```

一看代码很简单，唯一限制的就这一句

`require(supply > 0 || sharesSubject == msg.sender, "Only the shares' subject can buy the first share");`

这句话的意思 新注册用户，只能自己买入第一笔. 也没有限制买多少key啊...

## 没那么简单

那别人为啥还言之凿凿说确实只能买 1 个key 呢？

严谨一点直接用forge模拟买买看就知道了.

```js
import {TestHarness} from "../../TestHarness.sol";

interface iFriendtech {
    function buyShares(address sharesSubject, uint256 amount) external payable;
}

contract fuck_friend_tech is TestHarness {
    iFriendtech friendtech = iFriendtech(0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4);

    function setUp() external {
        cheat.createSelectFork("base", 4_119_770);
        cheat.deal(address(this), 100 ether);
    }

    function test_attack() external {
        friendtech.buyShares{value: 100 ether}(address(this), 2);
    }

    receive() external payable {}
}

```

你别说,还真失败了...报错为 `[FAIL. Reason: Arithmetic over/underflow] test_attack() (gas: 3252)`

显示溢出报错.肯定是哪里做运算出错了

再回头看`buyShares`的代码，唯一有疑点的地方就是`getPrice`

```js
function getPrice(uint256 supply, uint256 amount) public view returns (uint256) {
    uint256 sum1 = supply == 0 ? 0 : (supply - 1) * (supply) * (2 * (supply - 1) + 1) / 6;
    uint256 sum2 = supply == 0 && amount == 1
        ? 0
        : (supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1) / 6;

    uint256 summation = sum2 - sum1;
    return summation * 1 ether / 16_000;
}
```

出现问题在sum2... supply-1+amount这边就出错了...毕竟 solidity 语言有点傻,0-1=-1就直接溢出了...

好吧,原来不能第一次买多个的原因是 团队写 bug 了...改正也很简单,先+后-就可以了,这也算 solidity 开发常见的问题了,**要先加后减，先乘后除**

`(supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1) / 6;`
`(supply + amount - 1) * (supply + amount) * (2 * (supply + amount - 1) + 1) / 6;`
{% asset_img  xxx.png title %}

## getPrice 分析

再回头看getPrice的代码.
估计第一眼看过去的都会比较迷糊，这到底是干啥了...当然数学大神一下就能看出来这是平方和公式

我们可以借助 ChatGPT

```
Q: (supply - 1) * (supply) * (2 * (supply - 1) + 1) / 6 这是什么公式？

A: 
这个公式是用来计算一个整数变量（通常表示为"supply"）的平方和平方和的一种表示方式。公式的具体步骤如下：

1. 先将"supply"的值减去1，即"(supply - 1)"。
2. 然后将该值与"supply"相乘，即"(supply - 1) * supply"。
3. 接下来，将2乘以"(supply - 1)"，即"2 * (supply - 1)"。
4. 将上一步骤的结果加1，即"2 * (supply - 1) + 1"。
5. 最后，将前三步骤的结果相乘，并将其除以6，即"(supply - 1) * supply * (2 * (supply - 1) + 1) / 6"。

这个公式可以用来计算一系列连续整数的平方和，其中"supply"代表整数的上限。这种形式的平方和通常在数学和统计学中有多种应用，比如计算方差、概率分布等。

```

知道这是平方求和公式就简单了,这段代码就很好理解了
`((supply-1+amount)的平方和 - (supply-1)的平方和) / 16000`
