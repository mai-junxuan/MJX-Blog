# 问题描述

使用翻译插件翻译源码注释时，idea插件translation经过长时间等待后抛出一个`更新 TKK 失败，请检查网络连接`。无论重启还是科学上网都无法解决问题。

# 原因

经过查阅网上资料得知，是谷歌翻译网站抽风了，读者可以使用下面这段命令确定一下自己的网络能否访问该网站

```bash
ping translate.googleapis.com
```

# 解决方案

## 获取谷歌翻译ip地址

```bash
ping translate.google.cn
```

## 编辑hosts文件，使用谷歌翻译地址绑定translate.googleapis.com的地址

以笔者为例，`ping translate.google.cn`得到得到的ip为`114.250.66.34`，所以我们就通过在hosts配置下面这段配置避免idea更新ttk时通过dns解析`translate.googleapis.com`

```bash
114.250.66.34   translate.googleapis.com
```

## 测试

可以看到问题得以解决

![在这里插入图片描述](https://s2.loli.net/2023/06/14/Ym2LzgKuUovqiBf.png)