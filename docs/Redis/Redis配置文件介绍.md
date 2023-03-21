# Redis配置文件介绍

## Units单位

1. redis默认单位的度量为byte，而不是bit，这点我们需要注意一下
2. 计量单位对大小写不敏感

```
# Note on units: when memory size is needed, it is possible to specify
# it in the usual form of 1k 5GB 4M and so forth:
#
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.

```

## include

该配置可以将其他配置全部提取到该配置文件中以便统一管理。

```
# Include one or more other config files here.  This is useful if you
# have a standard template that goes to all Redis servers but also need
# to customize a few per-server settings.  Include files can include
# other files, so use this wisely.
#
# Note that option "include" won't be rewritten by command "CONFIG REWRITE"
# from admin or Redis Sentinel. Since Redis always uses the last processed
# line as value of a configuration directive, you'd better put includes
# at the beginning of this file to avoid overwriting config change at runtime.
#
# If instead you are interested in using includes to override configuration
# options, it is better to use include as the last line.
#
# include /path/to/local.conf
# include /path/to/other.conf

```

## 网络相关配置

### bind

1. 默认绑定127.0.0.1
2. 若`protected-mode yes`，且没有设置bind ip、没有设置密码的情况下，只有本机可以访问redis。

```
bind 127.0.0.1 -::1

# Protected mode is a layer of security protection, in order to avoid that
# Redis instances left open on the internet are accessed and exploited.
#
# When protected mode is on and if:
#
# 1) The server is not binding explicitly to a set of addresses using the
#    "bind" directive.
# 2) No password is configured.
#
# The server only accepts connections from clients connecting from the
# IPv4 and IPv6 loopback addresses 127.0.0.1 and ::1, and from Unix domain
# sockets.
#
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured, nor a specific set of interfaces
# are explicitly listed using the "bind" directive.
protected-mode yes
```

如下我们将bind注释，保护模式开启，使用远程连接工具时发现，redis-server拒绝访问了

![image-20220901033637212](http://rrmrwrjnu.hn-bkt.clouddn.com/image-20220901033637212.png)

```
#bind 127.0.0.1 -::1
protected-mode yes
```



### protected-mode

设置redis的保护模式，若设置为no，则其他服务器的redis客户端可以随便访问你的redis服务端。

```
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured, nor a specific set of interfaces
# are explicitly listed using the "bind" directive.
protected-mode yes

```

### port

指定redis服务端启用的端口号。

```
# Accept connections on the specified port, default is 6379 (IANA #815344).
# If port 0 is specified Redis will not listen on a TCP socket.
port 6379

```

### tcp-backlog

该参数=已经建立3次握手请求队列+未完成三次握手的请求队列。 注：当你设置这个值的时候必须考虑到Linux内核的这两个参数

```
1. net.core.somaxconn参数决定了端口监听队列的最大长度，存放的是已经处于ESTABLISHED而没有被用户程序（例如nginx）接管的TCP连接，默认是128，对于高并发的，或者瞬发大量连接，必须调高该值，否则会直接丢弃连接
2. net.ipv4.tcp_max_syn_backlog参数决定已经收到syn包，但是还没有来得及确认的连接队列，这是传输层的队列，在高并发的情况下，必须调整该值，提高承载能力。
# TCP listen() backlog.
#
# In high requests-per-second environments you need a high backlog in order
# to avoid slow clients connection issues. Note that the Linux kernel
# will silently truncate it to the value of /proc/sys/net/core/somaxconn so
# make sure to raise both the value of somaxconn and tcp_max_syn_backlog
# in order to get the desired effect.
tcp-backlog 511

```

而上述Linux内核参数，可使用vim命令修改下面配置文件生效

```
vim /etc/sysctl.conf

```

示例内容

```
vm.swappiness = 0
kernel.sysrq = 1

net.ipv4.neigh.default.gc_stale_time = 120

# see details in https://help.aliyun.com/knowledge_detail/39428.html
net.ipv4.conf.all.rp_filter = 0
net.ipv4.conf.default.rp_filter = 0
net.ipv4.conf.default.arp_announce = 2
net.ipv4.conf.lo.arp_announce = 2
net.ipv4.conf.all.arp_announce = 2

# see details in https://help.aliyun.com/knowledge_detail/41334.html
net.ipv4.tcp_max_tw_buckets = 262144
net.ipv4.tcp_syncookies = 1

# tcp_max_syn_backlog will only take effect when net.ipv4.tcp_syncookies == 0
# net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_slow_start_after_idle = 0

```

### timeout

表示一个空闲的redis客户端维持多久后关闭，若设置为0，表示永不关闭。

```
# Close the connection after a client is idle for N seconds (0 to disable)
timeout 0

```

### tcp-keepalive

该值表示对redis客户端心跳时长检测间隔，默认300s，建议设置成60

```
# A reasonable value for this option is 300 seconds, which is the new
# Redis default starting with Redis 3.2.1.
tcp-keepalive 300

```

## 通用设置

### daemonize

若设置为yes，则redis服务端会被设置为守护进程，会默认在后台启动

```
# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
# When Redis is supervised by upstart or systemd, this parameter has no impact.
daemonize yes
```

### pidfile

指定redis的pid文件的存放位置

```
# Note that on modern Linux systems "/run/redis.pid" is more conforming
# and should be used instead.
pidfile /var/run/redis_6379.pid

```

### loglevel

指定日志记录的级别，总共有`debug`、`verbose`、`notice`、`warning`四个级别，在生产环境，我们建议使用`notice`、`warning`

```
# Specify the server verbosity level.
# This can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)
loglevel notice

```

### logfile

设置redis服务器的日志名称

```
# Specify the log file name. Also the empty string can be used to force
# Redis to log on the standard output. Note that if you use standard
# output for logging but daemonize, logs will be sent to /dev/null
logfile ""

```

### databases

redis设置数据库的数量，默认为16

```
# Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT <dbid> where
# dbid is a number between 0 and 'databases'-1
databases 16

```

redis客户端可以用如下命令指定操作的redis数据库

```
SELECT <dbid>
```

示例

```
127.0.0.1:6379> SELECT 1
OK

```

## 安全

### requirepass

解开注释配置这个参数之后，redis客户端连接需要使用密码

```
# The requirepass is not compatable with aclfile option and the ACL LOAD
# command, these will cause requirepass to be ignored.
#
# requirepass foobared

```

示例

```
 requirepass 123
```

可以看到设置完requirepass之后，操作redis服务端就需要使用auth进行认证了

```
127.0.0.1:6379> ping
(error) NOAUTH Authentication required.
127.0.0.1:6379> auth 123
OK
127.0.0.1:6379> ping
PONG
127.0.0.1:6379>

```

## 限制

### maxclients

redis允许接入的最大客户端连接数，默认为1000

```
# IMPORTANT: When Redis Cluster is used, the max number of connections is also
# shared with the cluster bus: every node in the cluster will use two
# connections, one incoming and another outgoing. It is important to size the
# limit accordingly in case of very large clusters.
#
# maxclients 10000
```

笔者尝试将这个值改为1之后，开始第2个客户端尝试连接报出了`ERR max number of clients reached`的错误

```
root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# cd /usr/sbin/
root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379> ping
Error: Broken pipe
127.0.0.1:6379> auth 123
(error) ERR max number of clients reached
127.0.0.1:6379>

```

### maxmemory

设置内存的使用上限，一旦redis使用上限达到配置值时，就会根据内存`maxmemory-policy`配置的测卢克进行缓存置换。 当然若未设置该策略或者无法根据规则移除key的话，你只能对redis进行读操作，写操作一律报错。

```
# In short... if you have replicas attached it is suggested that you set a lower
# limit for maxmemory so that there is some free RAM on the system for replica
# output buffers (but this is not needed if the policy is 'noeviction').
#
# maxmemory <bytes>

```

### maxmemory-policy

1. **volatile-lru**：使用LRU算法移除key，只对设置了过期时间的键(最近最少使用的key);
2. **allkeys-lru**：在所有集合key中，使用LRU算法移除key。
3. **volatile-random**：在过期集合中移除随机的key，只对设置了过期时间的键
4. **allkeys-random**：在所有集合key中，移除随机的key
5. **volatile-ttl**：移除那些TTL值最小的key，即那些最近要过期的key
6. **noeviction**：不进行移除。针对写操作，只是返回错误信息(redis的默认配置)

```
# Note: with any of the above policies, when there are no suitable keys for
# eviction, Redis will return an error on write operations that require
# more memory. These are usually commands that create new keys, add data or
# modify existing keys. A few examples are: SET, INCR, HSET, LPUSH, SUNIONSTORE,
# SORT (due to the STORE argument), and EXEC (if the transaction includes any
# command that requires memory).
#
# The default is:
#
# maxmemory-policy noeviction

```

### maxmemory-samples

在使用LRU或者TTL算法进行内存置换时都无法进行精确计算，所以我们可以设置一定量的样本确保估算值的准确性。 此时我们就可以使用`maxmemory-samples`达到目的，建议设置在3-7范围以内，这个值越大估算的值越准确，但是性能消耗也会随之变高。

配置如下所示，redis默认配置为5

```
# The default of 5 produces good enough results. 10 Approximates very closely
# true LRU but costs more CPU. 3 is faster but not very accurate.
#
# maxmemory-samples 5
```