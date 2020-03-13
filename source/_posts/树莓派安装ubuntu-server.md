---
title: 树莓派安装ubuntu server
categories:
  
date: 2020-03-13 16:33:14
tags:
---


### 下载镜像

 [下载链接](https://ubuntu.com/download/raspberry-pi) 

 我选择的是 Raspberry Pi 3 + ubuntu18.04.4+ 64位,记得可以把下载链接丢到迅雷里面加快速度

 后面就是 格式化sd卡,以及加载镜像到sd卡了

## 开始配置

### 修改密码

直接连跟网线到树莓派上,然后 `ssh ubuntu@ip` 进去,密码也是ubuntu

第一次会提示你修改密码,修改完密码记得**断电重启一下**,要不然一直提示你修改密码...

### 配置源

不配置的话,更新速度简直慢死...

把 /etc/apt/sources.list 改成下面的内容

记得先备份一下...修改可以用vim 

```
## Note, this file is written by cloud-init on first boot of an instance
## modifications made here will not survive a re-bundle.
## if you wish to make changes you can:
## a.) add 'apt_preserve_sources_list: true' to /etc/cloud/cloud.cfg
## or do the same in user-data
## b.) add sources in /etc/apt/sources.list.d
## c.) make changes to template file /etc/cloud/templates/sources.list.tmpl

# See http://help.ubuntu.com/community/UpgradeNotes for how to upgrade to
# newer versions of the distribution.
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic main restricted
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic main restricted

## Major bug fix updates produced after the final release of the
## distribution.
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-updates main restricted
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-updates main restricted

## N.B. software from this repository is ENTIRELY UNSUPPORTED by the Ubuntu
## team. Also, please note that software in universe WILL NOT receive any
## review or updates from the Ubuntu security team.
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic universe
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic universe
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-updates universe
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-updates universe

## N.B. software from this repository is ENTIRELY UNSUPPORTED by the Ubuntu
## team, and may not be under a free licence. Please satisfy yourself as to
## your rights to use the software. Also, please note that software in
## multiverse WILL NOT receive any review or updates from the Ubuntu
## security team.
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-updates multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-updates multiverse

## N.B. software from this repository may not have been tested as
## extensively as that contained in the main release, although it includes
## newer versions of some applications which may provide useful features.
## Also, please note that software in backports WILL NOT receive any review
## or updates from the Ubuntu security team.
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-backports main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-backports main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-security main restricted
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-security main restricted
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-security universe
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-security universe
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-security multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports bionic-security multiverse

## Uncomment the following two lines to add software from Canonical's
## 'partner' repository.
## This software is not part of Ubuntu, but is offered by Canonical and the
## respective vendors as a service to Ubuntu users.
# deb http://archive.canonical.com/ubuntu bionic partner
# deb-src http://archive.canonical.com/ubuntu bionic partner
```

然后执行
```
sudo apt update
sudo apt upgrade
```

### 配置Wi-Fi 连接

总不可能一直插着网线把...连接Wi-Fi后丢在某个角落多好...

先安装 

```
sudo apt install network-manager
sudo apt install wpasupplicant
```
然后用 `nmcli d wifi list`
看看你要连的Wi-Fi能不能找到...

如果找不到 可能是信道的原因（默认是美国的信道。。。

我因为这个问题折腾了好久。。。

我的解决方法是 把路由器的信道切到美国了。。。

当然你如果找到了你要连接的名字 那么直接下一步

还可以先手动连接测试一下 (349是wifi名字,yourpassword是密码)
`nmcli d wifi connect 349 password yourpassword`


1. 找到无线网卡的名字

可以看到我的网卡名字是 `wlan0`
```
➜  ~ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether b8:27:eb:69:b0:77 brd ff:ff:ff:ff:ff:ff
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether b8:27:eb:3c:e5:22 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.8/24 brd 192.168.1.255 scope global dynamic noprefixroute wlan0
       valid_lft 587302sec preferred_lft 587302sec
    inet6 fe80::f10a:153d:dd4f:c62f/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

2. 修改 /etc/netplan/ 下面的.yaml文件 

下面是我的配置 
349是我的wifi名字,这边修改成你的,密码也改成你的

wlan0 是上面查到我的网卡名字,也修改成你的

特别要记住的是 renderer需要改成NetworkManager

改好然后重启就可以了

```
➜  ~ cat /etc/netplan/50-cloud-init.yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    eth0:
      optional: true
      dhcp4: true
  wifis:
    wlan0:
      optional: true
      access-points:
        "349":
          password: "yourwifipassword"
      dhcp4: true
```