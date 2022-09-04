

# Nginx的安装

## 1. gcc -v查看是否已经安装，若无则安装gcc编译器 

```bash
yum install gccCopy to clipboardErrorCopied
```

## 2. PCRE(Perl Compatible Regular Expressions)是一个 Perl 库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库。

```bash
  yum install pcre-develCopy to clipboardErrorCopied
```

**注**：笔者在某次安装时遇到了下面的问题，排查是repo配错了，所以后续配置需要留心自己仓库配置是否与自己centos版本一致

```
 ./configure: error: the HTTP rewrite module requires the PCRE library. You can either disable the module by using --without-http_rewrite_module option, or install the PCRE library into the system, or build the PCRE library statically from the source with nginx by using --with-pcre=<path> optionCopy to clipboardErrorCopied
```

## 3.zlib 库提供了很多种压缩和解压缩的方式，nginx 使用 zlib 对 http 包的内容进行 gzip，所以需要在 linux 上安装 zlib 库。                    

```bash
yum install zlib zlib-develCopy to clipboardErrorCopied
```

## 4. OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。nginx 不仅支持 http 协议，还支持 https（即在 ssl 协议上传输 http），所以需要在 linux安装 openssl 库。

```bash
 yum install openssl openssl-develCopy to clipboardErrorCopied
```

## 5.获取nginx资源

```bash
 wget http://learning.happymmall.com/nginx/linux-nginx-1.10.2.tar.gzCopy to clipboardErrorCopied
```

## 5.解压缩nginx资源

```java
  tar -zxvf linux-nginx-1.10.2.tar.gzCopy to clipboardErrorCopied
```

## 6. 使用 configure 命令创建一 makeFile 文件。

```bash
  cd nginx-1.10.2/
  ./configureCopy to clipboardErrorCopied
```

## 7. 编译

```bash
  makeCopy to clipboardErrorCopied
```

## 8. 安装

```bash
 make installCopy to clipboardErrorCopied
```

## 9. 开启服务并测试

```bash
 cd /usr/local/nginx/
  cd sbin/
 ./nginxCopy to clipboardErrorCopied
```

## 测试

因为nginx默认为80端口，所以在浏览器上输入对应ip地址即可访问

注意，若虚拟机里可以访问nginx的界面，而主机无法访问的话，有可能是80端口未开放的原因。若读者使用的系统是centos7可以使用如下命令开启80端口。

```java
firewall-cmd --zone=public --add-port=80/tcp --permanent  

# 命令含义：

--zone #作用域

--add-port=80/tcp  #添加端口，格式为：端口/通讯协议

--permanent   #永久生效，没有此参数重启后失效

# 重启防火墙

    systemctl stop firewalld.service  
    systemctl start firewalld.service  

# 查看端口是否开放
firewall-cmd --list-ports
Copy to clipboardErrorCopied
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200722112304360.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NoYXJrX2NoaWxpMzAwNw==,size_16,color_FFFFFF,t_70)