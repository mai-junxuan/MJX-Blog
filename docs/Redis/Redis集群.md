# Redis集群

## Redis集群的作用

1. 解决因服务器容量不足以容纳用户大量的写请求
2. 高并发写导致单台服务器阻塞，进而导致性能瓶颈问题

redis集群还需要特别注意的问题 3. 由于为了保证高可用，我们的集群可能还采取了主从复制的方案，所以因为主节点宕机导致ip地址发生变化，使得应用程序必须通过修改主机地址等方式连接新主节点，虽然我们可以通过代理的方式解决问题，如下图

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022042732.png)

于是，问题又来了，代理挂了怎么办？我们是不是有需要再去考虑一下代理的高可用呢?所以redis集群采用的无中心化配置解决集群高可用问题，如下三个主从复制，彼此量量相连，客户端可以通过任意一个节点找到目标节点获取数据，而且就尽可能的实现了高可用

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022043104.png)

## Redis集群的概念

即将Redis进行水平扩容，说的直白一点，就是将写数据按照一定的算法分散不同的Redis服务器中。从而解决高并发写打爆单台Redis服务器，或者因为单点故障导致大量请求无法响应。

## 集群配置基础示例

### 架构图

如下图笔者为了方便演示，就是用不同的端口号模拟不同服务器上的master和slave构成一个集群。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209022043505.png)

### 创建多个redis配置文件

由上图可知我们要创建6个配置文件，就以6379端口的为例，配置如下:

```
include /root/redis/redis.conf
port 6379

pidfile "/var/run/redis_6379.pid"
dbfilename "dump6379.rdb"
# 集群相关文件存储文职
dir "/home/bigdata/redis_cluster"
logfile "/home/bigdata/redis_cluster/redis_err_6379.log"
# 开启集群模式
cluster-enabled yes
# 设置节点配置名称
cluster-config-file nodes-6379.conf
# 设定节点失联时间，主节点失联时间超过该配置，则从节点自动进行主从切换。或者本节点在该时间与大多数从节点不可进行通信，则认为主机有问题，则此节点将停止接收任何请求
cluster-node-timeout 15000

```

### 启动

```
# 首先创建刚刚配置的集群文件存放位置
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mkdir -p /home/bigdata/redis_cluster

# 一口气启动6个redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/conf/redis6379.conf;redis-server /root/redis/conf/redis6380.conf;redis-server /root/redis/conf/r edis6381.conf;redis-server /root/redis/conf/redis6389.conf;redis-server /root/redis/conf/redis6390.conf;redis-server /root/redis/conf/redis6391.conf;


# ps命令验证一下是否成功
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ps -ef |grep redis
root     18678     1  0 00:07 ?        00:00:00 redis-server 127.0.0.1:6379 [cluster]
root     18680     1  0 00:07 ?        00:00:00 redis-server 127.0.0.1:6380 [cluster]
root     18686     1  0 00:07 ?        00:00:00 redis-server 127.0.0.1:6381 [cluster]
root     18692     1  0 00:07 ?        00:00:00 redis-server 127.0.0.1:6389 [cluster]
root     18698     1  0 00:07 ?        00:00:00 redis-server 127.0.0.1:6390 [cluster]
root     18704     1  0 00:07 ?        00:00:00 redis-server 127.0.0.1:6391 [cluster]
```

### 将6个节点合成一个集群

```
# 键入以下指令合成一个集群，--cluster-replicas 1表明一个主节点只需要一个从节点
[root@iZ8vb7bhe4b8nhhhpavhwpZ src]# redis-cli --cluster create --cluster-replicas 1 127.0.0.1:6379 127.0.0.1:6380 127.0.0.1:6381 127.0.0.1:6389 127.0.0.1:6390  127.0.0.1:6391



# 可以看到79 80 81端口称为master，其余都是slave

>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 127.0.0.1:6390 to 127.0.0.1:6379
Adding replica 127.0.0.1:6391 to 127.0.0.1:6380
Adding replica 127.0.0.1:6389 to 127.0.0.1:6381
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: 7575e0aad00de4762ccc726f7a4e80efec4b9eba 127.0.0.1:6379
   slots:[0-5460] (5461 slots) master
M: b03e017a6049d7c84b8f9383adf7568abeda1a54 127.0.0.1:6380
   slots:[5461-10922] (5462 slots) master
M: 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 127.0.0.1:6381
   slots:[10923-16383] (5461 slots) master
S: 9d005710e06d0b35e6d99aa24168945812505eaf 127.0.0.1:6389
   replicates 7575e0aad00de4762ccc726f7a4e80efec4b9eba
S: b28fb8a9cd636cd912d32a216716b6c42c2a8d22 127.0.0.1:6390
   replicates b03e017a6049d7c84b8f9383adf7568abeda1a54
S: 5c62cbadb36edf97e560435cfe1fc4985a79da13 127.0.0.1:6391
   replicates 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join

>>> Performing Cluster Check (using node 127.0.0.1:6379)
M: 7575e0aad00de4762ccc726f7a4e80efec4b9eba 127.0.0.1:6379
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: b28fb8a9cd636cd912d32a216716b6c42c2a8d22 127.0.0.1:6390
   slots: (0 slots) slave
   replicates b03e017a6049d7c84b8f9383adf7568abeda1a54
M: b03e017a6049d7c84b8f9383adf7568abeda1a54 127.0.0.1:6380
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 9d005710e06d0b35e6d99aa24168945812505eaf 127.0.0.1:6389
   slots: (0 slots) slave
   replicates 7575e0aad00de4762ccc726f7a4e80efec4b9eba
M: 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 127.0.0.1:6381
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: 5c62cbadb36edf97e560435cfe1fc4985a79da13 127.0.0.1:6391
   slots: (0 slots) slave
   replicates 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.

```

### 使用集群方式连接6379

```
[root@iZ8vb7bhe4b8nhhhpavhwpZ src]# cd /usr/sbin/
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli -c -p 6379

# 可以看到当前集群中的节点信息
127.0.0.1:6379> CLUSTER NODES
b28fb8a9cd636cd912d32a216716b6c42c2a8d22 127.0.0.1:6390@16390 slave b03e017a6049d7c84b8f9383adf7568abeda1a54 0 1661875974000 2 connected
b03e017a6049d7c84b8f9383adf7568abeda1a54 127.0.0.1:6380@16380 master - 0 1661875975132 2 connected 5461-10922
9d005710e06d0b35e6d99aa24168945812505eaf 127.0.0.1:6389@16389 slave 7575e0aad00de4762ccc726f7a4e80efec4b9eba 0 1661875972000 1 connected
7575e0aad00de4762ccc726f7a4e80efec4b9eba 127.0.0.1:6379@16379 myself,master - 0 1661875974000 1 connected 0-5460
5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 127.0.0.1:6381@16381 master - 0 1661875974128 3 connected 10923-16383
5c62cbadb36edf97e560435cfe1fc4985a79da13 127.0.0.1:6391@16391 slave 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 0 1661875973000 3 connected
```

尝试set值，会返回这个值被存放到那台redis上，以及slot值

```
127.0.0.1:6379> set k1 v1
-> Redirected to slot [12706] located at 127.0.0.1:6381
OK
127.0.0.1:6381>
```

注意一次性设置多值时我们需要，指明这几个值所属组，否则会设置失败

```
127.0.0.1:6381> mset a1 v1 a2 v2
(error) CROSSSLOT Keys in request don't hash to the same slot
127.0.0.1:6381> mset a1{cust} v1 a2{cust} v2
-> Redirected to slot [4847] located at 127.0.0.1:6379
OK
127.0.0.1:6379>
```

我们也可以根据slot值找到对应count个数据

```
127.0.0.1:6379> CLUSTER GETKEYSINSLOT 4847 10
1) "a1{cust}"
2) "a2{cust}"
127.0.0.1:6379>
```

### 测试

我们尝试让79主节点挂掉，看看集群中会发生什么变化

```
# 将79节点挂掉
127.0.0.1:6379> SHUTDOWN
not connected>


# 通过80操作集群
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli -c -p 6380


# 15内79还是主节点
127.0.0.1:6380> CLUSTER NODES
b28fb8a9cd636cd912d32a216716b6c42c2a8d22 127.0.0.1:6390@16390 slave b03e017a6049d7c84b8f9383adf7568abeda1a54 0 1661877505187 2 connected
5c62cbadb36edf97e560435cfe1fc4985a79da13 127.0.0.1:6391@16391 slave 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 0 1661877503000 3 connected
9d005710e06d0b35e6d99aa24168945812505eaf 127.0.0.1:6389@16389 slave 7575e0aad00de4762ccc726f7a4e80efec4b9eba 0 1661877503000 1 connected
7575e0aad00de4762ccc726f7a4e80efec4b9eba 127.0.0.1:6379@16379 master - 1661877497151 1661877495143 1 disconnected 0-5460
5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 127.0.0.1:6381@16381 master - 0 1661877504183 3 connected 10923-16383
b03e017a6049d7c84b8f9383adf7568abeda1a54 127.0.0.1:6380@16380 myself,master - 0 1661877504000 2 connected 5461-10922


# 15s后其从节点6389称为master
127.0.0.1:6380> CLUSTER NODES
b28fb8a9cd636cd912d32a216716b6c42c2a8d22 127.0.0.1:6390@16390 slave b03e017a6049d7c84b8f9383adf7568abeda1a54 0 1661877516000 2 connected
5c62cbadb36edf97e560435cfe1fc4985a79da13 127.0.0.1:6391@16391 slave 5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 0 1661877518250 3 connected
9d005710e06d0b35e6d99aa24168945812505eaf 127.0.0.1:6389@16389 master - 0 1661877517000 7 connected 0-5460
7575e0aad00de4762ccc726f7a4e80efec4b9eba 127.0.0.1:6379@16379 master,fail - 1661877497151 1661877495143 1 disconnected
5a8a36c7d85ba26fc762f3f83a1fe2c26e493e74 127.0.0.1:6381@16381 master - 0 1661877517247 3 connected 10923-16383
b03e017a6049d7c84b8f9383adf7568abeda1a54 127.0.0.1:6380@16380 myself,master - 0 1661877518000 2 connected 5461-10922
127.0.0.1:6380>
```

## 集群详解

### 什么是slots

集群有16384个插槽，客户端写入数据时都会通过`CRC16(key) % 16384`计算该节点最终会落到哪个slot中。以上文为例,集群会根据slot的值将其存放到对应的redis上

```
    1. 节点 A(6379) 负责处理 0 号至 5460 号插槽。
    2. 节点 B(6380)  负责处理 5461 号至 10922 号插槽。
    3. 节点 C(6381)  负责处理 10923 号至 16383 号插槽。
```

### 集群的优缺点

#### 优点

1. 实现扩容，增加可存储数据量
2. 避免高并发写导致单台redis性能瓶颈
3. 无中心化配置实现简单且高可用

#### 缺点

1. 多键操作需要基于组，实现不方便
2. 不支持事务，lua脚本不支持
3. 由于集群方案出现较晚，很多公司已经采用了其他的集群方案，而代理或者客户端分片的方案想要迁移至redis cluster，需要整体迁移而不是逐步过渡，复杂度较大。

## 面试题

1. 如何保证Redis高可用?

> 1. 首先使用主从复制，提高读写性能以及确保高可用
> 2. 配合哨兵提高高可用
> 3. 使用集群避免高并发写导致性能瓶颈以及扩容进一步提高高可用

1. 哨兵有什么作用?

> 1. 监控:监控当前所有redis主从节点
> 2. 故障转移:一旦redis主节点挂了，哨兵就会选一个leader在众多从节点中出来挑一个新的主节点上位(主从切换)
> 3. 通知:可通过指令通知其他客户端或者应用程序当前xxx节点挂了

1. 哨兵选举leader如何达成公式?

> 哨兵大于等于quorum 配合Raft算法进行选举(选举的票数大于等于num(sentinels)/2+1时，将成为领导者)

1. Raft算法有什么作用?

> https://www.pdai.tech/md/algorithm/alg-domain-distribute-x-raft.html

1. Redis缓存的数据量太大怎么办?

> Redis切片集群

1. Redis cluster虚拟槽分区有什么优点?

> 解耦了数据与节点之间的关联，提升数据横向扩展和容错性。

1. Gossip协议有什么作用?

> 该协议使得每个节点都维护了集群中某一部分的节点的信息，在指定时间内大家达成数据一致。大家像病毒一样互相将数据如同"传染"传播出去。例如某个节点挂了，每个节点都会像和自己有联系的节点发送这个小心，当一个节点收到半数以上的消息就判定这个节点挂了，于是再将消息散播出去。