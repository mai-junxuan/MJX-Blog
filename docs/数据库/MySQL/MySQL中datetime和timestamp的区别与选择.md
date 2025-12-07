## MySQL 中 datetime 和 timestamp 的区别与选择

### 1 区别

#### 1.1 占用空间

| 类型      | 占据字节 | 表示形式            |
| --------- | -------- | ------------------- |
| datetime  | 8 字节   | yyyy-mm-dd hh:mm:ss |
| timestamp | 4 字节   | yyyy-mm-dd hh:mm:ss |

#### 1.2 表示范围

| 类型      | 表示范围                                                    |
| --------- | ----------------------------------------------------------- |
| datetime  | '1000-01-01 00:00:00.000000' ~ '9999-12-31 23:59:59.999999' |
| timestamp | '1970-01-01 00:00:01.000000' ~ '2038-01-19 03:14:07.999999' |

`timestamp`翻译为汉语即"时间戳"，它是当前时间到 Unix元年(1970 年 1 月 1 日 0 时 0 分 0 秒)的秒数。对于某些时间的计算，如果是以 `datetime` 的形式会比较困难，假如我是 `1994-1-20 06:06:06` 出生，现在的时间是 `2016-10-1 20:04:50` ，那么要计算我活了多少秒钟用 `datetime` 还需要函数进行转换，但是 `timestamp` 直接相减就行。

#### 1.3 时区

`timestamp` 只占 4 个字节，而且是以`utc`的格式储存， 它会自动检索当前时区并进行转换。

`datetime`以 8 个字节储存，不会进行时区的检索。

也就是说，对于`timestamp`来说，如果储存时的时区和检索时的时区不一样，那么拿出来的数据也不一样。对于`datetime`来说，存什么拿到的就是什么。

还有一个区别就是如果存进去的是`NULL`，`timestamp`会自动储存当前时间，而 `datetime`会储存 `NULL`。

### 2 实验

##### **1、查看当前时区，并创建表test_date,一个是timestamp列，一个是datetime列**

![image-20220715205303324](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202207152053364.png)

查看当前时区可以看到是跟随系统时区，接着我们去设置里查看系统时区

![image-20220715205321817](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202207152053850.png)

创建表

![image-20220715205540516](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202207152055552.png)

##### 2、插入数据

![image-20220715205904674](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202207152059706.png)

![image-20220715205936281](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202207152059320.png)

##### 3.修改时区发现会时间变化了

![image-20220715131103783](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202207152111817.png)

