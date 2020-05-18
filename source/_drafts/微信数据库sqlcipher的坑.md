---
title: 微信数据库sqlcipher的坑
tags:
---

因为sqlcipher版本有改动,所以最新版的默认配置有变。。。微信加密的是版本1的，所以如果不设置为默认1版本的，会打不开。。。

参考文档:https://discuss.zetetic.net/t/upgrading-to-sqlcipher-4/3283

```sql
sqlcipher EnMicroMsg.db
SQLCipher version 3.30.1 2019-10-10 20:19:45
Enter ".help" for usage hints.
sqlite> PRAGMA key='yourpassword';
ok
sqlite> PRAGMA cipher_page_size = 1024;
sqlite> PRAGMA kdf_iter = 4000;
sqlite> PRAGMA cipher_hmac_algorithm = HMAC_SHA1;
sqlite> PRAGMA cipher_kdf_algorithm = PBKDF2_HMAC_SHA1;
sqlite> PRAGMA cipher_use_hmac = OFF;
sqlite> SELECT tbl_name FROM sqlite_master WHERE type = 'table';
```