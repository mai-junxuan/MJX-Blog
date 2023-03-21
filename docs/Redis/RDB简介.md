# RDB简介

RDB持久化机制是将**内存**中的数据生成**快照**并持久化到**磁盘**的过程，RDB可以通过**手动**或者**自动**的方式实现持久化。

## RDB触发流程

### 手动触发

#### save

save会指令会直接阻塞当前redis服务器，知道RDB完成了为止，对于线上生产环境数据的备份，我们非常不建议使用这种方式。

```
127.0.0.1:6379> save
OK

```

#### bgsave

bgsave则是主进程fork一个子进程，由子进程完成持久化操作，而主进程继续处理客户端的读写请求，如果我们需要手动实现持久化，非常推荐使用这种方式。

```
# 从输出我们就可以看出这种方式会将持久化的操作放在后台执行
127.0.0.1:6379> bgsave
Background saving started

```

bgsave的工作流程如下图所示，整体可以简述为:

```
1. 主进程fork出一个子进程，这时候主进程会被阻塞
2. 子进程创建完成后，redis客户端会输出Background saving started，这就意味子进程开始进行持久化操作了
3. 子进程持久化完成后，会生成一个rdb文件，将本次的rdb文件通过原子替换的方式将上一次备份的rdb覆盖。
4. 子进程发送信号通知父进程本次任务完成
```

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209022044305.png)

#### 自动触发

自动触发我们可以通过配置实现redis.conf的save参数实现，如下所示，假如我们希望用户20s内写入3次就进行持久化，只需在配置中加一条`save 20 3`即可。

```
# Unless specified otherwise, by default Redis will save the DB:
#   * After 3600 seconds (an hour) if at least 1 key changed
#   * After 300 seconds (5 minutes) if at least 100 keys changed
#   * After 60 seconds if at least 10000 keys changed
#
# You can set these explicitly by uncommenting the three following lines.
#
# save 3600 1
# save 300 100
# save 60 10000
save 20 3

```

需要注意的是`save 20 3`的20s是以redis的时间间隔为主，并不是用户第1次写入后的20s内再写入两次进行持久化。

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209022045621.png)

## RDB配置参数详解

### 指定rdb持久化文件名

如下所示，我们可以通过配置dbfilename来指定，默认为dump.rdb

```
# The filename where to dump the DB
dbfilename dump.rdb

```

### 文件持久化位置

通过dir来指定，如下默认配置就意味着持久化文件位置和redis服务端位置一致。

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

### stop-writes-on-bgsave-error

当reids无法将文件写入磁盘，直接关掉redis的写操作，默认为yes

```
# However if you have setup your proper monitoring of the Redis server
# and persistence, you may want to disable this feature so that Redis will
# continue to work as usual even if there are problems with disk,
# permissions, and so forth.
stop-writes-on-bgsave-error yes

```

### rdbcompression

redis默认会通过LZF算法压缩rdb文件。这种方式会消耗CPU，但是压缩后的大小远远小于内存，但是带来的收益却远远大于这点开销，通过压缩的文件无论是通过网络发送到从节点还是存储到硬盘的空间都是非常可观的。

```
# Compress string objects using LZF when dump .rdb databases?
# By default compression is enabled as it's almost always a win.
# If you want to save some CPU in the saving child set it to 'no' but
# the dataset will likely be bigger if you have compressible values or keys.
rdbcompression yes

```

### rdbchecksum

在存储快照后，还可以让redis使用**CRC64**算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能。

```
# RDB files created with checksum disabled have a checksum of zero that will
# tell the loading code to skip the check.
rdbchecksum yes

```

## RDB持久化示例

### 模拟断电备份

上文中我们已经配置了20s内3次写入即可触发rdb，所以我们使用redis客户端进行3次写入

```
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379> set k3 v3
OK
```

完成后查看是否生成rdb文件，确认无误后，我们将这个文件备份，并强制关闭redis服务端，模拟断电的场景

```
# 强制关闭redis服务端
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ll dump.rdb
-rw-r--r-- 1 root root 118 Aug 24 23:20 dump.rdb
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ps -ef |grep redis
root      7773     1  0 22:59 ?        00:00:01 redis-server 127.0.0.1:6379
root      8884  7103  0 23:21 pts/0    00:00:00 grep --color=auto redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# kill -9 7773

# 重命名rdb文件
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv dump.rdb dump.rdb.bak
```

此时我们再启动redis就会发现数据为空

```
127.0.0.1:6379> keys *
(empty array)
```

我们将rdb文件还原，并重启redis，可以发现备份数据还原了

```
# 强制关闭redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ps -ef |grep redis |grep -v grep
root      8956     1  0 23:22 ?        00:00:00 redis-server 127.0.0.1:6379
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# kill -9 8956

# 还原rdb，并启动redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv dump.rdb.bak dump.rdb
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379> auth 123
OK

# 可以看到之前设置的数据都回来了
127.0.0.1:6379> keys *
1) "k3"
2) "k2"
3) "k1"
```

**注**:当我们使用**shutdown**指令也会自动触发**bgsave**，读者可以自行测试

## RDB优缺点

### 优点

1. rdb是紧凑压缩的二进制文件，非常实用与备份或者全景复制等场景。
2. rdb恢复数据效率远远高于aof

### 缺点

1. 无法做到毫秒级别的实时性持久化，尽管我们可以通过设置紧凑的save完成持久化，但是频繁的fork子进程进行持久化，很可能造成redis主进行长期阻塞。
2. 存储的文件是二进制，不够直观。

## RDB更深入的理解

1. 生产环境大内存的redis数据如何在持久化的时候保持数据一致性呢？

> redis的rdb持久化是基于cow(写时复制思想)，redis会fork一个子进程完成数据持久化，再次期间发生的原数据修改或者写入的新数据都会生成一个数据副本，被fork的bgsave子进程写入到快照文件中。

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209022044035.png)

1. 在进行快照操作的这段时间，如果发生服务崩溃怎么办？

> 服务恢复的数据只会是上一次备份的rdb文件数据，因为bgsave子进程只会将操作成功的文件生成rdb文件覆盖上一次备份的文件。

1. 可以每秒做一次快照吗？

> 可以，但是开销很大,原因有两点 1.频繁写入内存数据会给磁盘带来很大的压力，多个fork子进程抢占优先的磁盘带宽，前一个子进程没写完，后一个子进程又来写入。 2. rdb持久化每次fork子进程都会阻塞主进程，频繁fork很可能导致主进程长期处于阻塞状态。

## RDB相关面试题

1. 什么是 RDB 持久化？

> Redis可以通过指定时间或者手动的方式将数据以rdb格式的文件持久化到磁盘中，完成数据备份，或者将数据备份到其他的从节点中。还可以用这个rdb文件作为备份文件，在redis数据丢失的时候可以通过rdb文件时间数据还原。