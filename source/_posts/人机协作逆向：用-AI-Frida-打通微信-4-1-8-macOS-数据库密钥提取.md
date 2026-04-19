---
title: 人机协作逆向：用 AI + Frida 打通微信 4.1.8 macOS 数据库密钥提取
categories:
  - 编程与工具
date: 2026-04-18T22:37:45.000Z
tags:
  - macOS
  - 逆向
  - AI
---
> 当内存特征扫描失效、标准 Hook 无功而返时，一个开发者与 AI 如何通过多轮迭代，最终找到微信 4.1.8 的密钥派生入口。

---

## 一、背景：旧方案突然失效

`chatlog` 项目长期依赖一套相对稳定的 macOS 密钥提取逻辑：

```
vmmap 定位内存区域 → lldb dump 内存 → 搜索 fts5(% 特征字节 → 固定偏移取 32B Key → DB 验证
```

但在用户升级到 **微信 4.1.8** 后，这条链路彻底断裂。运行 `./bin/chatlog key --debug` 时，程序能正常读完 94 个内存区域，然后陷入漫长的静默，最终超时退出——**Key 一个都没找到**。

---

## 二、第一回合：AI 做诊断，人类给环境

用户把问题抛给 AI：

> "我发现现在微信版本升级了，无法获取到 key。"

AI 的第一反应是排查代码路径。通过阅读 `chatlog` 源码，AI 迅速定位到 V4 Extractor 的两个 Pattern：

- Pattern 1: ` fts5(%`（`20 66 74 73 35 28 25 00`）
- Pattern 2: 16 个零字节（`00 00 ...`）

AI 列出可能的故障点，但用户没有手动去贴日志，而是直接说：

> **"你直接运行看看吧。"**

AI 执行 `./bin/chatlog key --debug`，观察到内存读取正常、但匹配全部失败。接着 AI 检查微信二进制：

```bash
strings /Applications/WeChat.app/Contents/MacOS/WeChat | grep -c "fts5"
# 输出: 0
```

**关键发现：`fts5` 在微信 4.1.8 里完全消失了。** 这是旧方案失效的根因。

---

## 三、第二回合：人类抛出新线索，AI 转换思路

AI 解释了问题的本质：内存布局变了，需要找新的 Pattern 或换更稳定的 Hook 思路。此时用户提供了一个关键的外部信息：

> **"wx_key 你参考看看这个项目是 windows 的，但是你看看他是怎么找 key 的"**

AI 读取 `wx_key` 的源码后，核心思路被点亮：

> **Windows 版不扫描数据，而是 Hook 函数。** 它在 `Weixin.dll` 代码段里搜索机器码 pattern，定位到处理 Key 的函数，安装 Inline Hook，等微信调用时直接拦截参数。

这是一个比内存扫描稳定得多的方案。用户接着问：

> **"frida hook 你能做吗"**

AI 回答：能。于是进入下一轮技术攻坚。

---

## 四、第三回合：AI 搭建 Frida 环境，踩坑与修正

AI 开始动手：

1. **安装 Frida**：`pip3 install frida-tools`
2. **寻找目标函数**：先尝试 Hook `libsqlite3.dylib` 的 `sqlite3_key` / `sqlite3_key_v2`

### 坑 1：Frida 17 API 变更

写脚本时踩了第一个坑——旧教程里的 `Module.findExportByName` 在 Frida 17 中报错：

```
TypeError: not a function
```

AI 通过快速测试定位到新 API：

```javascript
// 正确写法
Process.getModuleByName("libsqlite3.dylib").findExportByName("sqlite3_key")
// 或
Module.getGlobalExportByName("sqlite3_key")
```

### 坑 2：sqlite3_key 根本没被调用

修正 API 后，Hook 安装成功。AI 让用户关闭微信，用 `frida.spawn` 重新启动并注入脚本。用户登录微信，AI 监控输出——**60 秒内一个 Key 都没捕获到**。

这说明 **微信 4.1.8 macOS 并未使用标准 SQLCipher 的 `sqlite3_key` 接口**。加密逻辑完全内嵌在 140MB 的 `wechat.dylib` 中，自己管理密钥派生和 VFS 层加解密。

---

## 五、第四回合：转移战场到 PBKDF2

既然 `chatlog` 的解密代码明确告诉我们：

- **算法**：PBKDF2-HMAC-SHA512
- **迭代次数**：256000
- **输出长度**：32 字节

那么微信启动数据库时，**一定会在某个时刻做密钥派生**。macOS 上最可能的系统入口是 `CommonCrypto` 中的 `CCKeyDerivationPBKDF`。

AI 更新 Frida 脚本，新增对 `CCKeyDerivationPBKDF` 的 Hook，并加上过滤条件：

```javascript
var pbkdf2 = Module.getGlobalExportByName("CCKeyDerivationPBKDF");

Interceptor.attach(pbkdf2, {
    onEnter: function(args) {
        var algo   = args[0].toInt32();   // 2 = kCCPBKDF2
        var prf    = args[5].toInt32();   // 5 = kCCPRFHmacAlgSHA512
        var rounds = args[6].toInt32();
        var pwdLen = args[2].toInt32();

        if (algo === 2 && prf === 5 && rounds > 1000) {
            var hex = toHex(args[1], pwdLen);
            send({type: "key", key: hex, rounds: rounds, len: pwdLen});
        }
    }
});
```

---

## 六、第五回合：捕获成功，人类验证

脚本就绪后，用户让AI 关闭微信，运行脚本

几秒钟后，终端输出：

```
[KEY] via CCKeyDerivationPBKDF  len=32  rounds=256000 dkLen=32
      24f52f003edd470e97e73fc63f4b89bb0cb9efa09b8a40d685c75c47df21fc11
```

**Key 捕获成功。**

但还没完。用户紧接着提出验证要求：

> **"你根据这个 key 测试一下是否能 chatlog decrypt"**

AI 立刻用捕获到的 Key 执行解密：

```bash
./bin/chatlog decrypt \
  --data-dir ~/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/... \
  --data-key 24f52f003edd470e97e73fc63f4b89bb0cb9efa09b8a40d685c75c47df21fc11 \
  --work-dir /tmp/chatlog_test
```

输出：

```
decrypt success
```

**Key 有效，数据库成功解密。**

---

## 七、核心方法论：人机协作的分工

回顾整个过程，人类与 AI 的分工非常清晰：

| 角色 | 贡献 |
|------|------|
| **人类** | 提供运行环境、触发问题、给出关键外部线索（`wx_key`）、决定尝试 Frida、执行微信登录操作、提出最终验证需求 |
| **AI** | 快速阅读大量源码做根因分析、搭建 Frida 环境、编写/调试 Hook 脚本、处理 API 兼容性问题、执行最终验证 |

如果没有人类抛出的 `wx_key` 项目，AI 可能会继续在内存扫描或 sqlite3 Hook 的思路上打转；如果没有 AI 的快速代码阅读和脚本编写能力，从诊断到验证可能需要数小时甚至数天。

---

## 八、关键踩坑清单

### 1. 特征字节依赖生命周期极短
微信 4.1.8 直接从二进制中移除了 `fts5` 字符串，导致基于内存布局的扫描方案瞬间破产。

### 2. 标准 SQLCipher API 是个假目标
macOS 系统库里有 `sqlite3_key`，但微信根本不调用。Hook 之前必须做实际验证，不能凭假设行事。

### 3. Frida 版本陷阱
Frida 17 废弃了 `Module.findExportByName`，大量网络教程已过时。实际动手测试才能发现。

### 4. 必须在 `spawn` 模式下拦截
attach 到已运行的微信会错过所有启动时的密钥派生。先 `pkill WeChat`，再用 `frida.spawn()` 启动，是捕获 Key 的必要条件。

---

## 九、完整可用脚本

以下脚本已保存至项目根目录 `wechat_key_hook.py`，可直接使用：

```python
#!/usr/bin/env python3
import frida
import sys
import time

JS = r"""
function toHex(ptr, len) {
    try {
        var arr = new Uint8Array(ptr.readByteArray(len));
        return arr.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch(e) { return null; }
}

var pbkdf2 = Module.getGlobalExportByName("CCKeyDerivationPBKDF");
if (pbkdf2) {
    Interceptor.attach(pbkdf2, {
        onEnter: function(args) {
            var algo   = args[0].toInt32();
            var prf    = args[5].toInt32();
            var rounds = args[6].toInt32();
            var pwdLen = args[2].toInt32();
            if (algo === 2 && prf === 5 && rounds > 1000) {
                var hex = toHex(args[1], pwdLen);
                if (hex) send({type:"key", key:hex, rounds:rounds, len:pwdLen});
            }
        }
    });
    send("[+] CCKeyDerivationPBKDF hooked @ " + pbkdf2);
}
"""

print("[*] Spawning WeChat...")
pid = frida.spawn("/Applications/WeChat.app/Contents/MacOS/WeChat")
session = frida.attach(pid)
script = session.create_script(JS)

def on_msg(message, data):
    if message['type'] == 'send':
        payload = message['payload']
        if isinstance(payload, dict) and payload.get('type') == 'key':
            print(f"\n[!!!] KEY CAPTURED: {payload['key']}")
        else:
            print(payload)

script.on('message', on_msg)
script.load()
frida.resume(pid)

time.sleep(60)
session.detach()
```

---

## 十、后续展望

这次实践验证了 **Hook 加密算法入口** 比 **内存特征扫描** 更稳定、更跨版本。下一步可以将 Frida Hook 封装为 `chatlog key` 的新后端（例如 `--frida` 模式），让 macOS 用户不再需要关闭 SIP 或依赖 `lldb`，大幅降低使用门槛。

> **一个人类开发者 + 一个能读代码、写脚本、跑验证的 AI，可以在一个小时内完成传统上需要数天的逆向工程闭环。**
