---
title: 30秒内查到ETH上所有类似的合约
categories:
  - 区块链
date: 2019-11-23 10:25:21
tags:
---


## 介绍

有时候需要查找ETH上面 与 某个合约类似的所有合约

本工具利用了 bigquery-public-data.ethereum_blockchain 公开数据

具体介绍 [ethereum-bigquery-public-dataset-smart-contract-analytics](https://cloud.google.com/blog/products/data-analytics/ethereum-bigquery-public-dataset-smart-contract-analytics)


## 使用

查询链接在：https://console.cloud.google.com/bigquery?sq=348440405491:dd7234a0a453433da1596f2e57b344e4

{% asset_img eth-contract-similarity-query.png  eth contract similarity query%}

只要把其他sql里面的 address换成你想要查找的就可以了。。。


## 源代码如下：

```sql
CREATE TEMPORARY FUNCTION
  jaccard (v1 ARRAY<STRING>,
    v2 ARRAY<STRING>)
  RETURNS FLOAT64
  LANGUAGE js AS """
  var u1 = {};
  var u2 = {};
  var uu = {};
  for (var i = 0 ; i < v1.length; i++) { u1[v1[i]] = 1; uu[v1[i]] = 1 }
  for (var i = 0 ; i < v2.length; i++) { u2[v2[i]] = 1; uu[v2[i]] = 1 }
  var numerator = 0.0;
  for (var k in uu) { if (u1[k] == u2[k]) { numerator++ } }
  var denominator = Object.keys(uu).length;
  return numerator/denominator;
""";
CREATE TEMPORARY FUNCTION
  Levenshtein (a STRING,
    b STRING)
  RETURNS FLOAT64
  LANGUAGE js AS """
  var n = a.length;
  var m = b.length;
  if ( n > m ) {
    // Make sure n <= m, to use O(min(n,m)) space
    var c = a; a = b; b = c;
    var o = n; n = m; m = o;
  }

  var cur = [...Array(n+1).keys()];
  var o1 = [...Array(m+1).keys()];
  o1.shift();

  for (k1 in o1) {
    var i = o1[k1];
    
    var prv = cur;
    cur = [i];
    for (i in [...Array(n).keys()]) { cur.push(0); }
    
    var o2 = [...Array(n+1).keys()];
    o2.shift();
    
    for (k2 in o2) {
      var j = o2[k2];

      var add = prv[j]+1;
      var del = cur[j-1]+1;

      var chg = prv[j-1];

      if ( a[j-1] != b[i-1] ) {
        chg = chg + 1;
      }

      cur[j] = add < del ? add : del;
      cur[j] = cur[j] < chg ? cur[j] : chg;
    }
  }
  return cur[n];
"""; /*
SELECT source_address,target_address,Levenshtein(a.bytecode,b.bytecode) AS distance
FROM
(SELECT address AS source_address,bytecode FROM `ethereum-etl-dev.ethereum_blockchain.contracts` WHERE address = '0xf97e0a5b616dffc913e72455fde9ea8bbe946a2b') AS a,
(SELECT address AS target_address,bytecode FROM `ethereum-etl-dev.ethereum_blockchain.contracts`) AS b

ORDER BY distance ASC
*/
SELECT
  DISTINCT *
FROM (
  SELECT
    address,
    block_timestamp,
    similarity,
    function_count
  FROM (
    SELECT
      address,
      block_timestamp,
      jaccard( (
        SELECT
          function_sighashes
        FROM
          `bigquery-public-data.ethereum_blockchain.contracts`
        WHERE
          address = '0x01eacc3ae59ee7fbbc191d63e8e1ccfdac11628c'),
        function_sighashes ) AS similarity,
      ARRAY_LENGTH(function_sighashes) AS function_count,
      sighash
    FROM
      `bigquery-public-data.ethereum_blockchain.contracts`
    JOIN
      UNNEST (function_sighashes) AS sighash ) AS distances
    --LEFT JOIN `ethereum_aux.4byte_directory` AS methods ON distances.sighash = methods.function_4byte
  WHERE
    distances.similarity > 0
  ORDER BY
    similarity DESC,
    address
    --, function_signature
  LIMIT
    500 )
```