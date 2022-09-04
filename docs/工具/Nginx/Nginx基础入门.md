# nginx基础入门

## nginx常用命令

```java
# 进入nginx目录
cd /usr/local/nginx/sbin
# 查看nginx版本号
./nginx -v

# 启动nginx
./nginx

# 停止nginx
./nginx -s stop

# 重新加载nginx
./nginx -s reload
```

## nginx配置文件简介

```java
# 查看tomcat配置
cat /usr/local/nginx/conf/nginx.conf
全局配置

#user nobody；                         #运行用户

Worker_processes 1 ;               #工作进程数量

#error_log  log/error.log           #错误日志文件的位置

#pid     log/nginx.pid                 #PID文件的位置



I/O事件配置

events{

use  epoll;                              #使用epoll模型

worker_connections 4096     #每进程处理4096个连接

}

HTTP配置

http {

.................

include mine.types;                                              #nginx支持的媒体类型库文件

#include  benet/www.conf     #配置多个虚拟机主机，把server{}内的内容复制到外面新建的www.conf后包含进去     

default_type        application/octet-stranm; #默认的媒体类型

access_log   log/access.log     main;   #访问日志位置

sendfile       on ;    #开启高效传输模式(支持文件发送下载)

keepalive_timeout 65;     #连接保持超时



server {                                                               #可配置对三个基于域名的虚拟主机

listen    80;       #web服务的监听配置

server_name   www.benet.com   #网站名称（FQDN），别名就是在后面再添加网址

charset  utf-8               #网页的默认字符集

location / {

      root   html;           #网站根目录的位置

     error_page    500 502 503 504 /50x.html;    #出现对应的http状态码时，使50x.html回应客户

    location = /50x.html {

            root     html;        #指定对应的站点目录为html

}

         index index.html index.php      #默认首页    

         }

} 
```

## nginx反向代理

### 简介

网站建立后，用户希望只需通过一个url即可访问网站。但是网站所使的服务器可能远不止一台(考虑到用户的访问量在多台服务器上配置tomcat)，所以如何访问通过一个url且还能保证服务器负载均衡的情况下完成用户访问我们的网站呢？nginx的反向代理就是最好的解决方案。 如下图所示，用户通过`www.xxx.com`交由dns解析到而访问到nginx，此时nginx就是一个反向代理的角色，nginx这时候就会工具服务器详情动态的决定访问哪台服务器。

![image-20220903002420204](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030024451.png)

### 反向代理示例1

#### 需求描述

打开浏览器，在浏览器地址栏输入地址 [www.test.com](http://www.test.com/) ，跳转到 linux系统 tomcat 主页中

#### 前置步骤

安装tomcat服务器，具体步骤可参考笔者之前写过的这篇文章 [Linux下tomcat的部署](https://blog.csdn.net/shark_chili3007/article/details/107473612)

设置域名重定向

由于本次实验需要通过域名访问nginx然后通过nginx请求tomcat主页并返回，所以为避免dns无法解析我们模拟的域名地址，可以在本机Windows下配置域名解析，具体步骤如下

1. 进入如下目录编辑hosts文件

```java
C:\Windows\System32\drivers\etc
```

1. 编辑该配置文件，内容如下，这里的ip地址是和本机桥接的虚拟机ip地址 
1. ![image-20220903002442301](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030024240.png)

#### nginx配置步骤

配置nginx请求转发 如下图所示，编辑`/usr/local/nginx/conf/nginx.conf`将内容改为如下所示 

![image-20220903002502384](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030025806.png)

重启nginx

```java
#进入sbin目录输入
./nginx -s reload
```

查看结果 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030025517.png)

### 反向代理示例2

#### 需求

使用 nginx 反向代理，根据访问的路径跳转到不同端口的服务中，nginx 监听端口为 9001。即访问`192.168.1.29:9001/test1/index.html`和`192.168.1.29:9001/test2/index.html`访问结果是不同的

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030025867.png)

#### 步骤

1. 增加一台tomcat，如之前所示，注意修改相关端口与之区分，修改的端口如下所示： 

![image-20220903002548213](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030026552.png)

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030025267.png))![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030026920.png)

1. 启动tomcat
2. 为两个tomcat配置不同的页面,即在分别在两台tomcat服务器下`webapp`下,第一台tomcat参见test1目录并添加index网页，第二台tomcat服务器参见test2目录添加index网页。
3. 测试两台tomcat

![image-20220903002636221](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030026407.png)

![image-20220903002653947](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030026433.png)

1. 进行反向代理配置 进入nginx.conf进行如下配置

```java
  server {
        listen       9001;
        server_name  192.168.1.29;

        location ~ /test1/ {
          proxy_pass   http://127.0.0.1:8080;

        }

    location ~ /test2/ {
          proxy_pass   http://127.0.0.1:8081;

        }
    }

```

2. 开放9001端口

```java
 firewall-cmd --zone=public --add-port=9001/tcp --permanent
systemctl stop firewalld.service
systemctl start firewalld.service

```

3. 测试 

![image-20220903002810057](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030028159.png)

![image-20220903002825015](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030028558.png)

## 负载均衡

### 需求

浏览器地址栏输入地址 `http://192.168.1.29/study/index.html` 请求web页面，nginx会将多个http请求分配到8080或者8081服务器中。

### 步骤

1. 准备两台tomcat服务器，并在webapp目录下创建study文件夹，并在文件夹中都创建一个index.html内容随意

2. 开启tomcat测试是否可达

   ![image-20220903002900385](C:\Users\MJX\AppData\Roaming\Typora\typora-user-images\image-20220903002900385.png)

   ![image-20220903002909832](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030029388.png)

3. 配置nginx负载均衡配置 如下所示，`upstream` 即负载服务器，下文将`upstream`起名为myserver，然后在server中配置负载服务器名myserver即可完成负载均衡配置。

```java
 upstream myserver{
        server 192.168.1.29:8080;
        server 192.168.1.29:8081;
   }

    server {
        listen       80;
        server_name  192.168.1.29;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            proxy_pass http://myserver;
            index  index.html index.htm;
        }
    }

```

1. 测试

   ![image-20220903001416365](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030029013.png)

   ### nginx 分配服务器策略

   #### 第一种 轮询（默认）

   每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉,则自动剔除。

   #### 第二种 weight

   weight 代表权重默认为 1, 权重越高被分配的客户端越多

   #### 第三种 ip_hash

   每个请求按访问 ip 的 的 hash 结果分配，这样每个访客固定访问一个后端服务器

   #### 第四种 fair （第三方）

   按后端服务器的响应时间来分配请求，响应时间短的优先分配。

## 动静分离

我们都知道请求一个web页面过程中，需要加载动态数据或者静态数据。动态数据变化多端，而静态数据基本不变。动静分离以后我们可以对静态文件进行缓存、或者压缩提高网站性能。

### 模拟实验

为了模仿动态文件和静态文件的场景，笔者在/data目录下创建www作为动态文件夹，img为静态文件夹。通过同一个http请求+文件路径模仿动态文件和静态文件的访问过程。

### 配置步骤

1. data文件夹下创建动态文件和静态文件目录并添加文件
2. nginx添加如下配置

![image-20220903002941796](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030029668.png)

3. 测试

   ![image-20220903003003145](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030030900.png)

![image-20220903003017327](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030030572.png)

## 高可用配置

### 介绍

如下图，若只有一台nginx时，常规情况下发起http请求由nginx代理是正常的。当这台nginx服务器出现故障宕机了怎么办呢？ ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030030100.png) 面对这种情况，我们预想的最好解决方案就是增加一台nginx服务器作为备用代理服务器，从而做到高可用配置。 如下图所示，用户使用192.168.1.50发起请求，若master主服务器正常则会交由主服务器代理http请求，若主服务器出现故障则由备用服务器进行http代理请求

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030030539.png)

### 配置

1. 增加一台虚拟机安装nginx服务器
2. 两台虚拟机都安装keepalived

```java
yum install keepalived –y

```

1. 配置keepalived

```java
配置keepalived检查主机存货状态脚本
vim /usr/local/src/nginx_check.sh 

# 粘贴下方内容
#!/bin/bash
A=`ps -C nginx –no-header |wc -l`
if [ $A -eq 0 ];then
    /usr/local/nginx/sbin/nginx
    sleep 2
    if [ `ps -C nginx --no-header |wc -l` -eq 0 ];then
        killall keepalived
    fi
fi
vim cd /etc/keepalived/keepalived.conf #编辑keepalived的配置文件

# 直接将内容覆盖成如下配置 配置详情可见注释
global_defs {
notification_email {
acassen@firewall.loc
failover@firewall.loc
sysadmin@firewall.loc
}
notification_email_from Alexandre.Cassen@firewall.loc
smtp_server 192.168.1.150 #本机ip地址
smtp_connect_timeout 30
router_id LVS_DEVEL # 本机设备名称，可使用命令 vim /etc/hosts 添加一行 127.0.0.1 LVS_DEVEL 完成主机id配置
}

# 下方为vrrp协议具体内容可参见百度
vrrp_script chk_http_port {
script "/usr/local/src/nginx_check.sh" # 检查当前服务器是否存货的脚本路径
interval 2 #（检测脚本执行的间隔） 
weight 2
}
vrrp_instance VI_1 {
state MASTER # 备份服务器上将 MASTER 改为 BACKUP
interface ens33 //网卡
virtual_router_id 51 # 主、备机的 virtual_router_id 必须相同
priority 100
advert_int 1
authentication {
auth_type PASS
auth_pass 1111
}
virtual_ipaddress {
192.168.1.50 // VRRP H 虚拟地址
}
}

```

1. 开启nginx
2. 开启keepalive

```java
systemctl start keepalived.service
```

1. 测试 使用192.168.1.50访问，若可以访问将master主机keepalived以及nginx关闭，再进行访问，关闭命令如下

```java
systemctl stop keepalived.service
/usr/local/nginx/sbin/nginx -s stop

```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030030238.png)

## nginx原理解析

我们可以使用以下命令可以看到nginx的进程数

```java
ps -ef |grep nginx

```

![image-20220903003104104](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030031746.png)

可以看出nginx占用了两个进程，一个是master，一个是worker，在我们发起请求到nginx时，nginx的master会收到该请求，并将请求发送给每个worker，所有worker会参与争抢。某个worker得到该请求后，若该请求是个代理请求，worker则会转发该请求到目标服务器。如下图所示： ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209030031942.png) 那么问题来了，一个master搭配多个worker的好处有哪些呢？

1. 热部署时，刷新配置不影响正在工作的worker。比如，我们当前这台nginx正在工作。某个worker正在担任某个服务器代理。此时，我们在nginx配置中添加一个新的代理工作。使用 `./nginx -s reload`完成nginx重新加载，这时候就会又新的worker争抢这份工作。而之前已有工作的worker却不会收到影响。
2. 每个worker是独立的进程。当某个worker出现问题时，其他worker不会收到影响。

由此我们又会问，那么设置几个worker数为宜呢？ 与cpu数相等即可。比如八核就设置八个。

## 杀死nginx所有进程

```
kill -9 $(ps aux | grep 'nginx' | grep -v grep | tr -s ' '| cut -d ' ' -f 2)
```

## nginx其他问题

(1) 发送一个请求时，master会占用worker几个连接数。

当只是请求静态资源时，只有`请求结果，返回结果`这样一趟也就是两个请求。若作为代理，则是`master->worker->目标服务器`+`目标服务器->worker->master`计算箭头数则是4个请求。

(2)假设nginx有一个master，和四个worker ，每个worker支持最大连接数为1024，支持的最大并发数为多少？ 普通静态访问为：`4*1024/2`(除2原因是因为一个静态请求有一趟往返，有一半的连接数处理返回结果了) 反向代理则是 `4*1024/4`(与上同理)

## 常见问题

### nginx配置不生效

#### 问题简述

笔者在这段时间进行nginx配置时，进行正确的配置却发现配置没有生效，不断查看配置和reload没有发现问题所在。

#### 解决方案

经过大佬排查很可能是nginx配置没有生效，将nginx所有进程杀死并重启nginx后配置就生效了，所以面对这类这类问题，在一切配置和部署方式都是正确的情况下，我们排查方向要从是否正确运行的方向进行思考。