# AOF简介

## 什么是AOF

AOF 持久化就是在客户端执行完成操作指令后将该指定先记录到内存中，在根据持久化机制将这些指令持久化到硬盘的一种机制**(写后再日志记录)**。注意，这种持久化机制会将指令以文本的形式存储。

## AOF为什么采用写后日志

### 优势

综合考量，redis写后再日志有以下两点好处:

```
1. 客户端操作的指令可能会出错，采用写后再日志的形式可以避免很多没必要的日志记录，节约磁盘空间
2. 写日志需要进行磁盘IO，可能会产生阻塞，所以采用先写入再日志，可以避免写时阻塞
```

### 劣势

当然在生产环境，这种持久化机制很可能产生两种问题:

```
1. 有可能在写操作之后，日志记录之前服务器出现宕机，可能会造成数据丢失
2. 主线程磁盘压力过大，导致写入磁盘慢，进而造成后续操作阻塞。
```

## 配置参数详解

### appendonly

#### 参数详解

若将该参数设置为yes，则开启aof持久化机制，此时redis持久化机制就以aof为主，而非rdb

```
############################## APPEND ONLY MODE ###############################

# By default Redis asynchronously dumps the dataset on disk. This mode is
# good enough in many applications, but an issue with the Redis process or
# a power outage may result into a few minutes of writes lost (depending on
# the configured save points).
#
# The Append Only File is an alternative persistence mode that provides
# much better durability. For instance using the default data fsync policy
# (see later in the config file) Redis can lose just one second of writes in a
# dramatic event like a server power outage, or a single write if something
# wrong with the Redis process itself happens, but the operating system is
# still running correctly.
#
# AOF and RDB persistence can be enabled at the same time without problems.
# If the AOF is enabled on startup Redis will load the AOF, that is the file
# with the better durability guarantees.
#
# Please check https://redis.io/topics/persistence for more information.

appendonly yes

```

#### 使用示例

我们将该参数配置为yes后重启redis服务端，使用客户端完成如下操作

```
# 设置三个key
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379> set k3 v3
OK
127.0.0.1:6379>


# 全局搜索发现已生成aof文件，大小为110

[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# find / -name appendonly.aof
/usr/sbin/appendonly.aof
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# find / -name appendonly
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# find / -name appendonly.aof
/usr/sbin/appendonly.aof
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ll appendonly.aof
-rw-r--r-- 1 root root 110 Aug 26 00:09 appendonly.aof




# 再次使用redis客户端写入指令
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379> set test vv
(error) NOAUTH Authentication required.
127.0.0.1:6379> auth 123
OK
127.0.0.1:6379> set k4 v4
OK
127.0.0.1:6379>


# 再次查看aof文件大小，变为139，说明aof配置生效
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ll appendonly.aof
-rw-r--r-- 1 root root 139 Aug 26 00:10 appendonly.aof
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]#
```

### appendfilename

该参数决定aof持久化文件的名字

```
# The name of the append only file (default: "appendonly.aof")

appendfilename "appendonly.aof"

```

### dir

该参数决定aof文件持久化位置，默认为redis-server的位置

```
# The working directory.
#
# The DB will be written inside this directory, with the filename specified
# above using the 'dbfilename' configuration directive.
#
# The Append Only File will also be created inside this directory.
#
# Note that you must specify a directory here, not a file name.
dir ./

```

### appendfsync

在介绍appendfsync，我们必须介绍一下操作系统提供的两个函数

```
1. write:write操作会触发操作系统延迟写机制，即将需要被写入磁盘的数据先写入页缓冲区，写入完成后立刻返回。同步到硬盘操作由操作系统决定，有可能会因为页缓冲区满了或者特定周期时间点到了，页缓冲区的数据就会被写到磁盘中。所以在文件同步前，如果服务器宕机了，就很可能造成数据丢失。
2. fsync:该调用会强制将缓存写入磁盘中，写入完成后才会结束阻塞，从而保证数据持久化。
```

appendfsync 参数决定aof的同步策略，参数有如下三种:

```
1. always:该选项会使得命令一旦写入aof_buf后，就会调用操作系统的fsync将指令写到aof物理文件中，完成操作后线程返回
2. everysec:该选项会在命令写入aof_buf后调用操作系统的wirte，完成write后线程返回。fsync会由专门的线程美标调用一次
3. no:该选项会在命令写入aof_buf后调用操作系统的write，完成write后线程返回，不调用fsync，同步操作由操作系统执行，最长周期为30s。
 appendfsync always
# appendfsync everysec
# appendfsync no

```

所以配置时，我们建议采用默认的写入策略everysec，他不会像always造成线程阻塞亦或者像no一样不可控。

### no-appendfsync-on-rewrite

redis为了保证持久化aof文件时调用fsync时不会出现长时间的卡顿，增加了该参数，若设置为yes，则加redis调用fsync时不会将这段时间客户端写入的指令存放到页缓存(Page Cache)中(但是redis服务端仍然在接收客户端的各种指令)。

```
# When the AOF fsync policy is set to always or everysec, and a background
# saving process (a background save or AOF log background rewriting) is
# performing a lot of I/O against the disk, in some Linux configurations
# Redis may block too long on the fsync() call. Note that there is no fix for
# this currently, as even performing fsync in a different thread will block
# our synchronous write(2) call.
#
# In order to mitigate this problem it's possible to use the following option
# that will prevent fsync() from being called in the main process while a
# BGSAVE or BGREWRITEAOF is in progress.
#
# This means that while another child is saving, the durability of Redis is
# the same as "appendfsync none". In practical terms, this means that it is
# possible to lose up to 30 seconds of log in the worst scenario (with the
# default Linux settings).
#
# If you have latency problems turn this to "yes". Otherwise leave it as
# "no" that is the safest pick from the point of view of durability.

no-appendfsync-on-rewrite no

```

auto-aof-rewrite-percentage和auto-aof-rewrite-min-size

这两个参数决定redis合适进行重写，如下所示，这两个参数分别为100和64mb，意味当本次aof文件超过`64+64*100%`就触发redis自动重写。

```
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

```

### aof-load-truncated

若设置为yes时在redis加载aof文件出错后会发送日志通知用户，反之则不做任何处理也不会启动redis，用户可以使用`redis-check-aof`指令完成数据修复。 这个参数笔者会在后文演示。

```
# If aof-load-truncated is set to yes, a truncated AOF file is loaded and
# the Redis server starts emitting a log to inform the user of the event.
# Otherwise if the option is set to no, the server aborts with an error
# and refuses to start. When the option is set to no, the user requires
# to fix the AOF file using the "redis-check-aof" utility before to restart
# the server.
#
# Note that if the AOF file will be found to be corrupted in the middle
# the server will still exit with an error. This option only applies when
# Redis will try to read more data from the AOF file but not enough bytes
# will be found.
aof-load-truncated yes

```

### aof-rewrite-incremental-fsync

开启该参数后，子进程在进行aof重写时，每32m就会将数据写到的新的aof文件中，从而避免单刷造成的线程阻塞。

```
# When a child rewrites the AOF file, if the following option is enabled
# the file will be fsync-ed every 32 MB of data generated. This is useful
# in order to commit the file to the disk more incrementally and avoid
# big latency spikes.
aof-rewrite-incremental-fsync yes

```

### aof-use-rdb-preamble

redis 4.0之后支持同时开启rdb和aof，具体后文会详述

```
# When rewriting the AOF file, Redis is able to use an RDB preamble in the
# AOF file for faster rewrites and recoveries. When this option is turned
# on the rewritten AOF file is composed of two different stanzas:
#
#   [RDB file][AOF tail]
#
# When loading, Redis recognizes that the AOF file starts with the "REDIS"
# string and loads the prefixed RDB file, then continues loading the AOF
# tail.
aof-use-rdb-preamble yes

```

## AOF实践

介绍aof相关参数后，我们就来演示一下aof使用

### 模拟断电数据丢失恢复

我们在之前的aof文件重命名，模拟断电后数据丢失

```
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv appendonly.aof appendonly.aof.bak


# 重启redis服务端，打开客户端查看数据都丢失了
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379> auth 123
OK
127.0.0.1:6379> keys *
(empty array)


# 将aof文件还原，并重启redis

[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv appendonly.aof.bak appendonly.aof
mv: overwrite ‘appendonly.aof’? y
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf


# 再次使用redis查看，丢失的数据都回来了
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379> auth 123
OK
127.0.0.1:6379> keys *
1) "k4"
2) "k3"
3) "k2"
4) "k1"
127.0.0.1:6379>
```

## 重写机制

### 重写如何压缩文件体积

上文已经阐述了redis重写的时机，随着时间的推移，aof文件大小会不断扩大，所以我们需要进行重写完成对aof文件体积的压缩，重写压缩的方式如下，而redis之所以可以实现文件压缩原因有如下:

```
        1. redis重写会根据进程内的数据将过期的指令移除，如下所示列表里面A B C等都被pop掉了，所以重写时就不会记录这些指令的push操作
        2. 如下图所示，最终列表u:list只会剩下D C N三个值，重写会将这些值使用一条指令完成
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022043777.png)

### 重写是否会阻塞线程

会，只不过是fork出bgrewriteaof子进程时阻塞。其重写工作流程如下图所示，整体步骤为:

```
1. fork一个子进程完成负责将原有的aof文件进行重写，此时的客户端新写的数据都会存放到aof缓冲中
2. 子进程完成重写后通知父进程，父进程会将新写的数据追加到aof日志缓冲区，但是在高并发情况下，这极可能造成缓冲区过大，造成追加数据阻塞，所以redis后来通过Linux管道技术实现重写期间就能将缓冲区的数据进行存放到新的aof日志中，这样重写结束后，也只需追加最新的aof缓冲数据即可
3. 重写aof新文件的名字，原子覆盖旧的aof文件
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022044090.png)

### 重启加载

由于redis持久化机制存在两种情况，所以重启redis加载磁盘数据文件就会先判断是否存在aof，若有aof优先加载aof文件，若没有才加载rdb文件。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022044237.png)

### 文件校验

上文说过，aof机制很可能出现写入一半服务器宕机造成aof文件存在错误数据，以下这个示例就是实现如何修复错误数据

```
# 追加一个错误数据到aof文件末行并杀死redis 模拟服务器宕机
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# vim appendonly.aof


# 再次启动redis，操作数据时发现登录失败
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
Could not connect to Redis at 127.0.0.1:6379: Connection refused
not connected>


#  使用 redis-check-aof --fix aof文件 修复文件
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-check-aof --fix appendonly.aof
0x              8b: Expected prefix '*', got: 's'
AOF analyzed: size=151, ok_up_to=139, ok_up_to_line=34, diff=12
This will shrink the AOF from 151 bytes, with 12 bytes, to 139 bytes
# 这里选择y
Continue? [y/N]: y
Successfully truncated AOF

# 重启redis，使用客户端连接发现启动成功且数据都还在
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379> auth 123
OK
OK
127.0.0.1:6379> keys *
1) "k4"
2) "k3"
3) "k2"
4) "k1"
```

## 小结

### 使用优势和劣势

优势:

```
    1. 备份机制更稳健，丢失数据几率低
    2. 日志可读，可以处理误操作
```

劣势:

```
1. 比RDB更占磁盘空间
2. 每次AOF都进行fsync的话，性能开销大
3. 恢复和备份速度较慢
```

### 使用建议

`Redis4.0`实现了RDB和AOF混合方式，即可在两次RDB之间使用AOF记录操作，RDB持久化数据之后清空两次rdb之间的aof文件记录。从而用到RDB快照恢复以及AOF简单记录的优势。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022044226.png)

## 相关面试题

1. 什么是 AOF 持久化？

> 与RDB相对的持久化机制，实时性更好，记录的是用户成功操作后的指令，缺点是数据备份和恢复略慢与RDB。

1. AOF 重写了解吗？

> 上文给出两条配置会触发redis重写机制，重写会fork一个子进程完成旧aof文件压缩重写，在此期间新写入数据都会在aof_buf中，redis通过Linux管道技术支持将aof缓冲数据直接写道新的aof文件。重写完成后会通过修改新的aof文件名实现原子替换。

1. Redis 4.0 对于持久化机制做了什么优化？

> 开启aof-use-rdb-preamble，支持两次rdb之间使用aof记录数据，每次RDB结束后将AOF文件数据清空。完美利用RDB持久化快照恢复和AOF数据实时记录的优势。