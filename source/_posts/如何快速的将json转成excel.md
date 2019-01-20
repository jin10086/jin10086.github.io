---
title: 如何快速的将json转成excel
categories:
  - python
date: 2019-01-20 13:18:49
tags:
---


首先安装 pandas 

`pip install pandas`

然后就很简单了...

```
import pandas as pd

df = pd.read_json('a.json')
df.to_excel("a.xlsx")
```

