---
title: 如何快速的将json转成excel
categories:
  - 编程与工具
date: 2019-01-20T13:18:49.000Z
tags:
  - 数据处理
---
首先安装 pandas 

`pip install pandas`

然后就很简单了...

```
import pandas as pd

df = pd.read_json('a.json')
df.to_excel("a.xlsx")
```

