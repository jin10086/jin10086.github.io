---
title: EOS合约编译无法生成ABI的解决办法
categories:
  - 区块链
date: 2019-11-06 23:40:58
tags:
---

最近在写EOS上面ram的代币化合约

但是发现,怎么部署合约 都无法生成abi文件

abi里面一直是空白的

无论是在https://app.eosstudio.io/ 在线编译器 

还是本地 使用eosio-cpp编译都是一样

最后才发现是 因为合约名字和 .cpp文件的名字不一样导致的。。。（真无法

{% asset_img 一杯茶一根烟一个bug改一天.jpg  一杯茶一根烟一个bug改一天 %}

所以解决方法就是

---

假如你的build 代码是 `eosio-cpp -o learn/learn.wasm learn/src/learn.cpp --abigen`

那么你需要确保 `learn.cpp` 里面的 contract name 也是 **learn**

如下所示：

 `CONTRACT learn : public contract`

 如果不是,那么就怎么也无法生成abi了。。。


