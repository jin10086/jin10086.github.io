---
title: 如何在conflux上部署合约
categories:
  - 区块链
date: 2019-12-03 14:35:15
tags:
  - conflux
---


## 编译合约

在 https://remix.ethereum.org/ 上面编写好合约

{% asset_img  remix.png remix编译合约截图 %}

编译好了就可以拿到ABI 以及 Bytecode了.(后面用)

## 创建conflux 地址

有好几种方式,因为conflux地址是与eth兼容的,所以你可以直接使用你的eth地址

当然也可以使用官方的js,或者在线钱包

1. 在线钱包 

打开https://wallet.confluxscan.io/wallet就可以创建了

## 本地js创建（推荐,因为后面部署合约也需要用到

### 先下载github repo并初始化
```
git clone https://github.com/jin10086/confluxBuildContract.git
cd confluxBuildContract
nmp install  //初始化环境
```
### 创建钱包

直接执行 `node createAccount.js` 就创建好了

```
(base) ➜  confluxBuildContract git:(master) ✗ node createAccount.js
pub_key: 0xa17b63007bd491822306b3b8c793311e7a21e8de 
 priv_key: 0x0ac9e33baa5cc302785a7fa1ef8912ff34b492ad0d52c7d518fe80975191bbaa
```
## 领取测试代币

因为新地址是没有代币的,所以需要先领取

直接浏览器打开 https://wallet.confluxscan.io/faucet/dev/ask?address=你的pub_key

就可以领取了

## 部署合约

1. 把 `deployContract.js`里面的`pub_key priv_key`改成刚才生成的公钥以及私钥
2. 把 `deployContract.js`里面的`abi bytecode`改成在remix生成的
3. 执行 `node deployContract.js` 就可以部署合约了

部署返回结果如下
```base
(base) ➜  confluxBuildContract git:(master) ✗ node deployContract.js       
contract deployed. address: 0x26f9269a3d09c5d7ca7066445fc30ca91b9aa3bc
```
可以在http://www.confluxscan.io/ 上查看刚刚部署成功的合约









