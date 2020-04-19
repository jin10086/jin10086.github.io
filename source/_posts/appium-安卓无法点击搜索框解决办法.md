---
title: appium 安卓无法点击搜索框解决办法
categories:
  - 爬虫
  - appium
date: 2020-04-19 15:51:22
tags:
---


最近在弄python控制app做一些自动化的事情

碰到很多地方需要点击搜索按钮,搜了一堆,最终找到了完美的解决办法


之前的
```python
def enter(self):
    # 参考 http://www.lemfix.com/topics/277
    # 切换成搜狗输入法
    os.system("adb shell ime set com.sohu.inputmethod.sogou/.SogouIME")
    sleep(5)
    self.driver.press_keycode(66)  # 按回车
    sleep(3)
    os.system("adb shell ime set io.appium.settings/.UnicodeIME")
    sleep(3)
    print("回车输入完毕.")
```

但是有时候也不好用。。。完全寄托于搜狗输入法

后面找到一种官方给出的解决办法


官方文档：https://appium.readthedocs.io/en/latest/en/writing-running-appium/android/android-ime/


基本上一劳永逸了,不过记得在 点击搜索按钮之前,记得先聚焦在 输入框。

```
#先聚焦在输入框
driver.find_element_by_id("com.tencent.mm:id/m7").click()
#点击搜索按钮
driver.execute_script('mobile: performEditorAction', {'action': 'search'})
```
