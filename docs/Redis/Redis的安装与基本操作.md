# Redis的安装与基本操作

## 什么是Redis

1. 基于键值对的NoSql数据库，支持stirng、hash、list、set、zset、bitmaps、HyperLogLog、GEO等数据结构极其算法。
2. 读写性能非常好。
3. 有将数据存到快照或者日志上的机制，便于数据恢复。
4. 提供键过期、发布订阅、事务、流水线、lua脚本等附加功能。

## Redis特性

1. 读写速度据统计可达10w/s。
2. 支持列表、哈希、集合、有序集合等数据结构的操作和算法。
3. 功能丰富，支持键值过期、发布订阅、lua脚本创造新的Redis命令、客户端支持流水线操作，将一系列命令传给redis，避免多次网络io。
4. 简单稳定
5. 支持多种语言的客户端。
6. 有RDB和AOF两种持久化策略。
7. 支持主从复制。
8. 支持高可用和分布式。

## Redis支持的场景

1. 缓存
2. 排行榜系统
3. 计数器应用
4. 社交网络点赞等功能
5. 消息队列(不常用)

## 不建议使用Redis的场景

1. 几亿用户行为的数据不建议使用redis进行维护管理。
2. 不经常被使用的冷数据不建议使用redis管理。

## redis安装

#### 安装C 语言的编译环境

```java
yum install centos-release-scl scl-utils-build
yum install -y devtoolset-8-toolchain
scl enable devtoolset-8 bash
```

#### 完成之后设置gcc版本

```java
gcc --version
```

#### 下载redis-6.2.1.tar.gz放/opt目录

#### 解压redis

```
tar -zxvf redis-6.2.1.tar.gz
```

#### 解压完成后进入目录：cd redis-6.2.1

#### 键入`make`

注意：2.2.2.6.如果没有准备好C语言编译环境，make 会报错—Jemalloc/jemalloc.h：没有那个文件，可以运行`make distclean`，再次运行`make`即可解决问题

#### 运行`make install`

#### 小结

自此，redis安装已经全部完成，redis会被默认安装在`/usr/local/bin`目录，所以为了方便后续各种操作，我们可以运行如下命令，创建一个redis配置目录方便后续各种实验操作

```java
## 创建配置文件实验文件夹
mkdir myredis
进入redis解压目录
cd /opt/redis-6.2.1/
复制配置文件到新文件夹
cp redis.conf /myredis/
## 进入redis命令目录
cd /usr/local/bin/
```

## 启动

#### 前台启动

一旦按ctrl+c进程直接结束

```java
redis-server /myredis/redis.conf
```

#### 后台启动(推荐)

###### 运行一下命令配置文件

```java
vim /myredis/redis.conf

```

按`/daemonize`找到`daemonize`，将此参数设置为yes，如下图所示



```java
## 启动redis
/usr/local/bin/redis-server /myredis/redis.conf
## 检查redis是否启动
 ps -ef|grep redis
```

#### 启动客户端

```java
/usr/local/bin/redis-cli
```

#### cli键入`ping`

若输出PONG，则说明redis客户端已经与服务端连通。

#### 关闭服务端

1. 客户端运行`shutdown`
2. `/usr/local/bin/redis-cli -p 6379 shutdown`

## Redis常用操作

#### 查看所有键值

```
127.0.0.1:6379> keys *
(empty list or set)

```

#### 添加或者删除键值

```
## 添加字符串
127.0.0.1:6379> set hello world
OK
127.0.0.1:6379> set java jedis
OK
127.0.0.1:6379> set python redis-py
OK

## 添加一个key名为mylist的键,存储一堆元素a b c d e f g
127.0.0.1:6379> RPUSH mylist a b c d e f g
(integer) 7

## 使用keys * ,查看我们刚刚添加的key
127.0.0.1:6379> KEYS *
1) "python"
2) "java"
3) "hello"
```

#### 查看当前键的数

```
127.0.0.1:6379> DBSIZE
(integer) 3

```

#### 查看key是否存在

```
## 存在返回1 不存在返回0
127.0.0.1:6379> EXISTS java
(integer) 1

```

#### 设置键过期

```
## 添加一个键hello 设置10秒过期
127.0.0.1:6379> set hello world
OK
## 查看是否存在
127.0.0.1:6379> EXPIRE hello 10
(integer) 1
## 我们也可以用tts判断是否存在,若过期则返回-2
127.0.0.1:6379> ttl  hello
(integer) -2


```

#### 查看键值对的数据类型

```
127.0.0.1:6379> type mylist
list

```

## 字符串操作

#### 操作指令

###### 设置值

赋值指令如下所示，`]`为可选项

```
set key value ex  value 秒级过期时间] px value 设置当前键值对的毫秒级过期时间]  nx 若键值存在才能赋值] xx 若键值存在才能赋值]
```

示例 设置一个key为str，value为hello的字符串

```
127.0.0.1:6379> set str hello
OK
127.0.0.1:6379>

```

设置一个10s过期的字符串str2，值为str2

```
127.0.0.1:6379> set str2 str2 ex 10
OK
## 10s内值还在
127.0.0.1:6379> get str2
"str2"

## 10s后键值对消失
127.0.0.1:6379> get str2
(nil)
127.0.0.1:6379>

```

###### setnx、setxx、setex

setnx和set的nx选项类似，值不存在时才能建立键值对

```
setnx key value
```

示例

```
## 判断hello是否存在
127.0.0.1:6379> EXISTS hello
(integer) 0
## 设置hello
127.0.0.1:6379> set hello world
OK
## 如果hello不存在 则设置一个key为hello value为h的键值对
127.0.0.1:6379> SETNX hello h
(integer) 0
## 发现值没变还是原本set指令的
127.0.0.1:6379> get hello
"world"
## h不存在
127.0.0.1:6379> EXISTS h
(integer) 0
## 使用setnx赋值，在使用get指令查看，发现存在
127.0.0.1:6379> SETNX h hello
(integer) 1
127.0.0.1:6379> get h
"hello"
127.0.0.1:6379>


```

setxx相对set指令的xx选项，这里就不多赘述了

setex相当于set指令的ex选项

```
## 设置一个10s过期的键为key 值为value的键值对
127.0.0.1:6379> SETEX key 10 value
OK
127.0.0.1:6379> get key
"value"
## 10s后过期
127.0.0.1:6379> get key
(nil)
```

###### 获取值

```
get key
```

###### 批量设置值和获取值

```
## 批量设置
mset key value key value] key value] key value]
## 批量获取
mget key1 key2 ....
```

示例

```
127.0.0.1:6379> MSET a 1 b 2 c 3
OK
127.0.0.1:6379> MGET a b c
1) "1"
2) "2"
3) "3"


```

注意:如果我们某个业务需要获取redis中大量的key值，建议使用mget，原因：

```
使用set获取1000个key: 1000个网络io时间+1000个指令执行时间
使用mget获取1000个key:1个网络io时间+1000个指令执行时间
```

get指令请求模型



mget指令请求模型



###### 计数

自增指令，若值不存在，则创建并初始值为1，若存在且为整数则自增，若存在且为字符文字则报错。 因为redis是单线程的，所以计数指令无需考虑线程安全问题，无需使用cas等手段来修改值而是顺序执行自增，所以性能相当优秀。

```
incr key
```

示例

```
127.0.0.1:6379> INCR k
(integer) 1
127.0.0.1:6379> INCR k
(integer) 2
127.0.0.1:6379> set str str
OK
127.0.0.1:6379> incr str
(error) ERR value is not an integer or out of range
127.0.0.1:6379>

```

其他计数指令

```
## 自减
decr key
## 自增自己指定的值
incrby key increment
## 自减指定的值
decrby key decrement
## 自增小数值
incrbyfloat key increment
```

###### 不常用指令

追加值

```
append key value
```

示例

```
## 对key为hello的值增加一个world字符串
127.0.0.1:6379> set hello hello
OK
127.0.0.1:6379> APPEND hello world
(integer) 10
127.0.0.1:6379> get hello
"helloworld"
127.0.0.1:6379>

```

获取字符串长度

```
strlen key
```

示例

```
127.0.0.1:6379> strlen hello
(integer) 10
127.0.0.1:6379>

```

设置并返回原先的值

```
getset key value
```

示例

```
127.0.0.1:6379> set hello world
OK
127.0.0.1:6379> GETSET hello redis
"world"
127.0.0.1:6379>

```

获取指定范围

语法

```
 GETRANGE key start  end
```

示例

```
127.0.0.1:6379> set str 0123456789
OK
127.0.0.1:6379> GETRANGE str 0  2
"012"

```



#### 不同长度的字符串的内部编码

```
## 8位数的长整型为int
127.0.0.1:6379> set str 111
OK
127.0.0.1:6379> object encoding str
"int"

## 小于39字节的字符串为embstr
127.0.0.1:6379> set str helloworld
OK
127.0.0.1:6379> object encoding str
"embstr"

## 大于39字节为raw
127.0.0.1:6379> set str abcdefghijklmnopqrstudksajdlksadklsdaskdjlkasdjasdjajdlksadadjl
OK
127.0.0.1:6379> object encoding str
"raw"
127.0.0.1:6379>

```

#### 使用场景

###### 用户信息缓存

如下所示，可将常见的数据库数据存到redis中提高访问数据，建议使用的key为`表名:对象名:id`,例如`userInfo:user:1`



伪代码示例

```
UserInfo getUserInfo(long id){
userRedisKey = "user:info:" + id
value = redis.get(userRedisKey);
UserInfo userInfo;
if (value != null) {
userInfo = deserialize(value);
} else {
userInfo = mysql.get(id);
if (userInfo != null)
redis.setex(userRedisKey, 3600, serialize(userInfo));
}
return userInfo;
}
```

###### 视频播放量计数

```
long incrVideoCounter(long id) {
key = "video:playCount:" + id;
return redis.incr(key);
}
```

###### 共享session

为了保证用户在集群场景下能够公用一个会话session，我们会另起一台服务器搭建redis服务保存会话session，避免用户因为负载均衡在各个服务器之间时重复登录。



###### 短信限速

避免单用户一分钟不能超过5次访问

```
phoneNum = "138xxxxxxxx";
key = "shortMsg:limit:" + phoneNum;
// SET key value EX 60 NX
isExists = redis.set(key,1,"EX 60","NX");
if(isExists != null || redis.incr(key) <=5){
//  通过
}else{
//  限速
}
```

## 哈希

#### 简介

存储键值对的数据结构，也叫映射，字典



#### 操作

###### 设置值和取值

语法

```
## 设置值
HSET key field value
## 获取值
HGET key field
```

示例

```
127.0.0.1:6379> HSET hashmap key1 value1 key2 value2
(integer) 2
127.0.0.1:6379> HGET hashmap key1
"value1"
127.0.0.1:6379>

```

###### 删除哈希一个键

语法

```
HDEL key field
```

格式

```
## 删除hashmap的key1
127.0.0.1:6379> HDEL hashmap key1
(integer) 1
127.0.0.1:6379>

```

###### 计算哈希的key的个数

语法

```
HLEN key
```

示例

```
127.0.0.1:6379> HLEN hashmap
(integer) 1
127.0.0.1:6379>

```

###### 批量设置哈希的值和批量获取哈希的值

语法

```
 HMSET key  field value field value] field value]
 HMGET key  field field] field] field]


```

示例

```
127.0.0.1:6379> HMSET user:1 name xiaoming age 18 city fujian
OK
127.0.0.1:6379> HMGET user:1 name age city
1) "xiaoming"
2) "18"
3) "fujian"
127.0.0.1:6379>

```

###### 判断键值对是否存在

```
127.0.0.1:6379> HEXISTS key field
```

示例

```
127.0.0.1:6379> HEXISTS user:1 name
(integer) 1
127.0.0.1:6379>

```

###### 获取所有key、获取所有value、获取所有的key-value

语法

```
## 获取所有key
HKEYS key

## 获取所有value
 HVALS  key

## 获取所有key-value
HGETALL key
```

示例

```
127.0.0.1:6379> HKEYS user:1
1) "name"
2) "age"
3) "city"
127.0.0.1:6379> HVALS user:1
1) "xiaoming"
2) "18"
3) "fujian"
127.0.0.1:6379> HGETALL user:1
1) "name"
2) "xiaoming"
3) "age"
4) "18"
5) "city"
6) "fujian"
127.0.0.1:6379>

```

建议:若哈希中存在多个键值对且我们需要一次性获取，建议使用hscan而不是hmget，避免造成redis阻塞

```
## 使用hscan从0位置获取所有键值对
127.0.0.1:6379> HSCAN user:1 0
1) "0"
2) 1) "name"
   2) "xiaoming"
   3) "age"
   4) "18"
   5) "city"
   6) "fujian"
127.0.0.1:6379>

```

###### hincrby hincrbyfloat

和incr类似，只不过增长的是field的值

```
hincrby key field
hincrbyfloat key field
```

###### 计算field的长度

语法

```
hstrlen key field
```

示例

```
获取user:1 的name的长度
127.0.0.1:6379> HSTRLEN user:1 name
(integer) 8
127.0.0.1:6379>

```
###### 内部编码

在键值对个数小于512且所有值都小于64字节时，哈希的内部编码为ziplist，当超过这些限制时使用的就是hashtable(超过限制后使用这种数据结构时间复杂度更低,查询效率为O(1))。

```
## 小于64字节为ziplist
127.0.0.1:6379> hset user:1 name xiaoming
(integer) 0
127.0.0.1:6379> object encoding user:1
"ziplist"
## 超过后为hashtable
127.0.0.1:6379> hset user:1 name djdjkhdjhdhdhwhquehqhdjksdhqjhdjkojhdlksadsahdjsalkhdjlksahdjoaehduioqwajwksdhjaksdhjsahdsajkdhjslkadhjlksahdjksahdjksahdjk
(integer) 0
127.0.0.1:6379> object encoding user:1
"hashtable"


```

#### 使用场景

如果我们要缓存某行用户信息，使用哈希非常合适不过



原因如下:

```
 1. 相较于字符串(占用过多的键)，哈希内聚更好更易于维护大量的用户信息
 2. 如果使用字符串进行序列化存储，就会造成网络io时序列化和反序列化的开销
 3. 操作简单，修改用户字段更加方便
```

需要注意:哈希存储相对二维表更加稀疏，如上图，二维表中null的数据，在哈希表中key是完全不存在的用户使用时需要考虑到这一点。

## 列表

#### 简介

线性结构，允许重复元素，可以充当队列和栈。

#### 操作

###### 添加

从右边插入，语法:

```
RPUSH key value value]
```

示例

```
## 右边一次插入a b c
127.0.0.1:6379> RPUSH list a b c
(integer) 3
## 查看list的元素
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "b"
3) "c"
127.0.0.1:6379>

```

从左边插入元素 lpush

```
LPUSH key value value...]
## 从左边依次插入
127.0.0.1:6379> LPUSH arr a b c
(integer) 3
## 查看最终的元素值
127.0.0.1:6379> LRANGE arr 0 -1
1) "c"
2) "b"
3) "a"
127.0.0.1:6379>

```

向元素前或者后添加元素

```
linsert key before|after pivot value
```

示例：向a后面添加一个元素a+

```
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "b"
3) "c"
127.0.0.1:6379> LINSERT list after a a+
(integer) 4
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "a+"
3) "b"
4) "c"
127.0.0.1:6379>

```

###### 查询

查找指定范围的元素

```
lrange key start end
```

示例

```
## 查看list的所有元素
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "a+"
3) "b"
4) "c"
##  查看一个不存在的key的元素
127.0.0.1:6379> LRANGE key 1 2
(empty array)
## 查看list 2-3的元素
127.0.0.1:6379> LRANGE list 1 2
1) "a+"
2) "b"
127.0.0.1:6379>

```

获取指定索引的元素

```
lindex key index
```

示例:查看key为list第0个元素

```
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "a+"
3) "b"
4) "c"
127.0.0.1:6379> LINDEX list 0
"a"
127.0.0.1:6379>

```

获取列表长度

```
llen key
```

示例

```
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "a+"
3) "b"
4) "c"
127.0.0.1:6379> LLEN list
(integer) 4
127.0.0.1:6379>

```

###### 删除

从列表左侧弹出元素

```
lpop key
```

示例

```
127.0.0.1:6379> LRANGE list 0 -1
1) "a"
2) "a+"
3) "b"
4) "c"
127.0.0.1:6379> LPOP list
"a"
127.0.0.1:6379> LRANGE list 0 -1
1) "a+"
2) "b"
3) "c"
127.0.0.1:6379>

```

同理右侧为rpop，不多赘述

删除元素

```
lrem key count value
```

count的大小有以下几种情况

```
1. 大于0，从左到右删除count个元素
2. 小于0，从右到左删除count个元素
3. =0 删除所有元素
```

示例:从左到右删除一个为a的元素

```
127.0.0.1:6379> LRANGE list 0 -1
1) "a+"
2) "b"
3) "c"
127.0.0.1:6379> LREM list 1 b
(integer) 1
127.0.0.1:6379> LRANGE list 0 -1
1) "a+"
2) "c"
127.0.0.1:6379>

```

修剪列表至指定索引范围

```
ltrim key start end
```

示例，将列表修剪为只有2 15索引范围内的元素

```
127.0.0.1:6379> LRANGE list 0 -1
 1) "a+"
 2) "z"
 3) "a"
 4) "b"
 5) "c"
 6) "d"
 7) "e"
 8) "f"
 9) "g"
10) "h"
11) "i"
12) "j"
13) "k"
14) "l"
15) "m"
16) "n"
127.0.0.1:6379> LTRIM list 2 15
OK
127.0.0.1:6379> LRANGE list 0 -1
 1) "a"
 2) "b"
 3) "c"
 4) "d"
 5) "e"
 6) "f"
 7) "g"
 8) "h"
 9) "i"
10) "j"
11) "k"
12) "l"
13) "m"
14) "n"
127.0.0.1:6379>

```

###### 修改

```
lset key index newValue
```

###### 阻塞操作

```
blpop key key ...] timeout
brpop key key ...] timeout
```

brpop 示例，当timeout大于0时，若有元素立即返回，若没有则等到对应时间为止 若timeout设置为0，则无限等待，如下所示，笔者使用另一个客户端push一个元素进来，这个阻塞就会立刻将这个元素弹出。

```
127.0.0.1:6379> BRPOP arr 3
1) "arr"
2) "a"
127.0.0.1:6379> BRPOP arr 3
1) "arr"
2) "b"
127.0.0.1:6379> BRPOP arr 3
1) "arr"
2) "c"
127.0.0.1:6379> BRPOP arr 3
(nil)
(3.04s)
127.0.0.1:6379> BRPOP arr 3
(nil)
(3.07s)
127.0.0.1:6379> BRPOP arr 0
1) "arr"
2) "a"
(43.69s)

```
###### 内部编码

当内部元素个数小于512，且每个元素小于64字节，列表默认使用ziplist，反之就会使用linklist

###### 使用场景

Redis的lpush+brpop命令组合即可实现阻塞队列，如下图，每个消费者只需要关注自己感兴趣的专题即可，作为生产者只需不断使lpush添加专题即可。



关于列表更多用法可以参见以下口诀

```
1. lpush+lpop=Stack（栈）
2. lpush+rpop=Queue（队列）
3. lpsh+ltrim=Capped Collection（有限集合）
4. lpush+brpop=Message Queue（消息队列）
```

## 集合

#### 特点

1. 最多可存储2^32-1个元素
2. 集合内部元素不重复

#### 命令

###### 添加元素

```
sadd key element element ...]
```

示例，可以看到第2次添加的元素并没有成功

```
127.0.0.1:6379> SADD set a b c
(integer) 3
127.0.0.1:6379> SADD set a b
(integer) 0
127.0.0.1:6379>

```

###### 删除元素

```
srem key element element ...]
```

###### 计算集合大小

注意，这个计算的时间复杂度为O(1)，因为获得的这个集合的大小并不是计算来的，而是通过redis维护的一个内部变量得来的。

```
scard key
```

###### 判断元素是否在集合中

```
sismember key element
```

示例

```
127.0.0.1:6379> SISMEMBER set a
(integer) 1
127.0.0.1:6379> SISMEMBER set ac
(integer) 0
127.0.0.1:6379>

```

###### 随机获取集合内的元素

```
srandmember key count]
```

示例

```
127.0.0.1:6379> SRANDMEMBER set 1
1) "a"
127.0.0.1:6379> SRANDMEMBER set 1
1) "c"
127.0.0.1:6379>

```

###### 随机弹出一个元素

与srandmember 差不多，只不过该操作会将元素输出并将集合中的这个元素删除

```
spop key
```

示例

```
127.0.0.1:6379> SPOP set
"c"
127.0.0.1:6379> SPOP set
"a"
127.0.0.1:6379> SPOP set
"b"
127.0.0.1:6379> SPOP set
(nil)
127.0.0.1:6379> SPOP set
(nil)
127.0.0.1:6379> SPOP set
(nil)
127.0.0.1:6379> SPOP set
(nil)
127.0.0.1:6379> SPOP set
```

###### 获取所有元素

```
smembers key
```

###### 获取两个集合之间的交集

语法

```
sinter key key ...]
```

示例，可以看出set1和set2的交集为a

```
127.0.0.1:6379> SADD set1 a b c d
(integer) 4
127.0.0.1:6379> SADD set2 a e f g h
(integer) 5
127.0.0.1:6379> SINTER set1 set2
1) "a"
127.0.0.1:6379>

```

###### 求并集

```
suinon key key ...]
```

###### 求差集

```
sdiff key key ...]
```

示例，注意这个差集指的是第一个集合有，其他集合没有的元素

```
127.0.0.1:6379> SDIFF set1 set2
1) "b"
2) "d"
3) "c"

```

###### 将交集、差集、并集结果保存

```
sinterstore destination key key ...]
suionstore destination key key ...]
sdiffstore destination key key ...]
```

示例:将并集的结果保存

```
127.0.0.1:6379> SADD set1 a b c d
(integer) 4
127.0.0.1:6379> SADD set2 a e f g h
(integer) 5
127.0.0.1:6379> SINTERstore set3 set1 set2
(integer) 1
127.0.0.1:6379> SMEMBERS set3
1) "a"
127.0.0.1:6379>

```

#### 内部编码

当元素为整数且大小小于512时会使用intset(节省内存)，反之就会转为hashtable提高效率。

#### 使用场景

1. sadd=Tagging（标签,例如交友网站个人标签）
2. spop/srandmember=Random item（生成随机数，比如抽奖）
3. sadd+sinter=Social Graph（社交需求，与附近的人爱好匹配）

## 有序集合

#### 简介

1. 相较于集合，增加一个score属性，使得整体有序。
2. 集合元素不可重复，但是score可以重复。



#### 指令

###### 添加成员

命令

```
zadd key score member score member ...]
```

示例

```
127.0.0.1:6379> zadd zset 1 tom 2 jack 3 lucy
(integer) 3
127.0.0.1:6379>

```

可选项

```
1. nx：member必须不存在，才可以设置成功，用于添加。
2. xx：member必须存在，才可以设置成功，用于更新。
3. ch：返回此次操作后，有序集合元素和分数发生变化的个数
4. incr：对score做增加，相当于后面介绍的zincrby。
```

示例:如果tom存在，给tom自增。

```
127.0.0.1:6379> zadd zset xx incr 1 tom
"2"
```

相比于集合，有序集合增加了排序的操作，添加成员的时间复杂度由原来的`O(1)`变为`O(logn)`

###### 计算有序集合的大小

于scard一样，时间复杂度也是`O(1)`

指令

```
zcard key
```

示例

```
127.0.0.1:6379> ZCARD zset
(integer) 3
127.0.0.1:6379>

```

###### 查看成员分数

指令

```
zscore key member
```

示例

```
127.0.0.1:6379> zscore zset tom
"3"
127.0.0.1:6379> zscore zset jack
"2"
127.0.0.1:6379> zscore zset xiaoming
(nil)
127.0.0.1:6379>

```

###### 计算成员排名

命令

```
## 升序排名
zrank key member
## 降序排名
zrevrank key member
```

示例

```
127.0.0.1:6379> ZRANK zset tom
(integer) 2
127.0.0.1:6379> ZrevRANK zset tom
(integer) 0
127.0.0.1:6379>

```

###### 删除成员

命令

```
zrem key member member ...]
```

示例

```
127.0.0.1:6379> ZREM zset tom jack
(integer) 2
127.0.0.1:6379>

```

###### 给成员增加分数

指令

```
zincrby key increment member
```

示例

```
127.0.0.1:6379> ZINCRBY zset 100 tom
"100"
127.0.0.1:6379> ZINCRBY zset 100 tom
"200"
127.0.0.1:6379>

```

###### 查看排名

指令

```
zrange key start end withscores]
zrevrange key start end withscores]
```

示例

```
127.0.0.1:6379> ZRANGE zset 0 -1 withscores
1) "lucy"
2) "3"
3) "tom"
4) "200"
127.0.0.1:6379>

```

###### 返回指定分数范围的成员

指令

```
zrangebyscore key min max withscores] limit offset count]
zrevrangebyscore key max min withscores] limit offset count]
```

示例

```
127.0.0.1:6379> ZRANGEBYSCORE zset 0 300 withscores
1) "lucy"
2) "3"
3) "tom"
4) "200"

```

获取10到无限大的成员

```
127.0.0.1:6379> ZRANGEBYSCORE zset (10 +inf withscores
1) "liu"
2) "11"
3) "tom"
4) "200"
127.0.0.1:6379>

```

###### 获取指定分数范围内的用户

指令

```
zcount key min max
```

示例

```
127.0.0.1:6379> ZCOUNT zset 0 10
(integer) 2
127.0.0.1:6379>

```

###### 删除指定排名内的用户

指令

```
zremrangebyrank key start end
```

示例:删除前3名成员

```
127.0.0.1:6379> ZREMRANGEBYRANK zset 0 2
(integer) 3
127.0.0.1:6379>

```

###### 删除指定分数范围内的用户

指令

```
zremrangebyscore key min max
```

示例

```
127.0.0.1:6379> ZREMRANGEBYSCORE zset (250 +inf
(integer) 1
127.0.0.1:6379>

```

#### 内部编码

当集合size小于512且每个字符串大小不超过64字节时，有序集合使用的时ziplist，反之就是使用调表。从设计的角度来看，使用平衡树或者红黑树也能解决问题，但是跳表的实现相较于前者更加简单。查询也差不多。

#### 使用场景

常用于点赞、播放量等排行榜

如下就模拟了点赞排行榜的操作

```
## 小明获得10个赞
127.0.0.1:6379> zadd user:ranking:20220810 10 xiaoming
(integer) 1
## 小王获得11个赞
127.0.0.1:6379> zadd user:ranking:20220810 11 xiaowang
(integer) 1
## 小刘获得8个赞
127.0.0.1:6379> zadd user:ranking:20220810 8 xiaoliu
(integer) 1
## 小刘的赞+1
127.0.0.1:6379> zincrby user:ranking:20220810  1  xiaoliu
"9"
## 查看排名前3
127.0.0.1:6379> zrevrange user:ranking:20220810 0 2
1) "xiaowang"
2) "xiaoming"
3) "xiaoliu"
## 小刘被取消一个赞
127.0.0.1:6379> zincrby user:ranking:20220810  -1  xiaoliu
"8"
```
