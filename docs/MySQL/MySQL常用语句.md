# MySQL常用语句

登陆时输入`mysql -u root -p`(不输入密码)，回车输入密码即可进入数据库。

## 一 、常用操作数据库的命令

```sql
show databases; 查看所有的数据库
create database test; 创建一个叫test的数据库
drop database test;删除一个叫test的数据库
use test;选中库 ,在建表之前必须要选择数据库
show tables; 在选中的数据库之中查看所有的表

create table 表名 (字段1 类型, 字段2 类型);
例如：CREATE TABLE tbl(
        id INT NOT NULL AUTO_INCREMENT, 
        title VARCHAR(100) NOT NULL, 
        author VARCHAR(40) NOT NULL, 
        date DATE, 
        PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; 
        
desc 表名;查看所在的表的字段
drop table 表名; 删除表
show create databases 库名;查看创建库的详细信息
show create table 表名; 查看创建表的详细信息
```

## 二、修改表的命令

```sql
修改字段类型 alter table 表名 modify 字段 字段类型;
添加新的字段 alter table 表名 add 字段 字段类型
添加字段并指定位置  alter table 表名 add 字段 字段类型   after 字段;
删除表字段  alter table 表名 drop 字段名;
修改指定的字段  alter table 表名 change 原字段名字  新的字段名字 字段类型
```

## 三、对数据的操作

1.增加数据(insert)3种方式

```sql
insert into 表名 values(值1，值2，...)(很少用)

insert into 表名(字段1，字段2...) values(值1，值2，....);（较常用）
例如：INSERT INTO tbl 
    (title, author, date)
    VALUES
    ("学习 PHP", "菜鸟", NOW());
    
insert into 表名(字段1，字段2...) values(值1，值2，....)，(值1，值2，....)，(值1，值2，....);
```

2.删除数据

```sql
(delete) delete from 表名 where 条件 注意：where 条件必须加，否则数据会被全部删除
```

3.更新数据(update)

```sql
update 表名 set字段1 = 值1, 字段2 = 值2 where 条件
```

4.查询数据(select)

```csharp
 查询表中的所有数据   select * from 表名
 指定数据查询    select 字段 from 表名 
 根据条件查询出来的数据  select 字段 from 表名 where 条件 (最常用的)
```

 where 条件后面跟的条件
​ 关系：>,<,>=,<=,!=
​ 逻辑：or, and
​ 区间：id between 4 and 6 ;闭区间，包含边界
5.排序

```sql
select 字段 from 表 order by 字段  排序关键词(desc | asc)
```

排序关键词 desc 降序 asc 升序(默认)
5.1 通过字段来排序

```sql
select * from star order by money desc, age asc
```

 5.2 多字段排序

```sql
select 字段 from 表 order by 字段1  desc |asc,...字段n desc| asc;
```

 6.常用的统计函数 sum，avg，count，max,min

```csharp
只分组:select * from 表 group by 字段
例子: select count(sex) as re,sex from star group by sex having re > 3;
分组统计: select count(sex) from star group by sex;
```

7.分组

7.1 使用 GROUP BY

```vbnet
SELECT column_name, function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name;
```

例如

```sql
mysql> SELECT * FROM employee_tbl;
+----+--------+---------------------+--------+
| id | name   | date                | singin |
+----+--------+---------------------+--------+
|  1 | 小明 | 2016-04-22 15:25:33 |      1 |
|  2 | 小王 | 2016-04-20 15:25:47 |      3 |
|  3 | 小丽 | 2016-04-19 15:26:02 |      2 |
|  4 | 小王 | 2016-04-07 15:26:14 |      4 |
|  5 | 小明 | 2016-04-11 15:26:40 |      4 |
|  6 | 小明 | 2016-04-04 15:26:54 |      2 |
+----+--------+---------------------+--------+
6 rows in set (0.00 sec)

mysql> SELECT name, COUNT(*) FROM employee_tbl GROUP BY name;
+--------+----------+
| name   | COUNT(*) |
+--------+----------+
| 小丽 |        1 |
| 小明 |        3 |
| 小王 |        2 |
+--------+----------+
3 rows in set (0.01 sec)
```

7.2 使用 WITH ROLLUP

WITH ROLLUP 可以实现在分组统计数据基础上再进行相同的统计（SUM,AVG,COUNT…）。

```sql
mysql> SELECT coalesce(name, '总数'), SUM(singin) as singin_count FROM employee_tbl GROUP BY name WITH ROLLUP;
+--------------------------+--------------+
| coalesce(name, '总数') | singin_count |
+--------------------------+--------------+
| 小丽                   |            2 |
| 小明                   |            7 |
| 小王                   |            7 |
| 总数                   |           16 |
+--------------------------+--------------+
4 rows in set (0.01 sec)
```

8 限制查询结果的记录数

```csharp
select * from 表名  limit 偏移量,数量
```

 说明:
​ 8.1.不写偏移量的话就是默认的为0
​ 8.2.实现分页的时候必须写偏移量
​ 偏移量怎么计算？:
​ limit (n-1)*数量 ,数量

9 组合

MySQL `UNION` 操作符用于连接两个以上的 SELECT 语句的结果组合到一个结果集合中。多个 SELECT 语句会删除重复的数据。

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

例如：

下面是选自 "Websites" 表的数据：

```bash
mysql> SELECT * FROM Websites;
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+
```

下面是 "apps" APP 的数据：

```sql
mysql> SELECT * FROM apps;
+----+------------+-------------------------+---------+
| id | app_name   | url                     | country |
+----+------------+-------------------------+---------+
|  1 | QQ APP     | http://im.qq.com/       | CN      |
|  2 | 微博 APP | http://weibo.com/       | CN      |
|  3 | 淘宝 APP | https://www.taobao.com/ | CN      |
+----+------------+-------------------------+---------+
3 rows in set (0.00 sec)
```

下面的 SQL 语句从 "Websites" 和 "apps" 表中选取所有**不同的**country:

```sql
SELECT country FROM Websites
UNION
SELECT country FROM apps
ORDER BY country;
+----+
| country | 
+----+-
|  CN  | 
|  IND | 
|  USA | 
+----+
```

下面的 SQL 语句使用 `UNION ALL` 从 "Websites" 和 "apps" 表中选取**所有的**country

```sql
SELECT country FROM Websites
UNION ALL
SELECT country FROM apps
ORDER BY country;
+----+
| country | 
+----+-
|  CN  | 
|  CN  | 
|  CN  | 
|  CN  | 
|  CN  | 
|  IND | 
|  USA | 
|  USA | 
|  USA | 
+----+
```

原文出处：https://www.runoob.com/mysql/mysql-join.html

## 四、多表联合查询

在RUNOOB数据库中有两张表 tcount_tbl 和 runoob_tbl。两张数据表数据如下：

```sql
mysql> use RUNOOB;
Database changed
mysql> SELECT * FROM tcount_tbl;
+---------------+--------------+
| runoob_author | runoob_count |
+---------------+--------------+
| 菜鸟教程  | 10           |
| RUNOOB.COM    | 20           |
| Google        | 22           |
+---------------+--------------+
3 rows in set (0.01 sec)
 
mysql> SELECT * from runoob_tbl;
+-----------+---------------+---------------+-----------------+
| runoob_id | runoob_title  | runoob_author | submission_date |
+-----------+---------------+---------------+-----------------+
| 1         | 学习 PHP    | 菜鸟教程  | 2017-04-12      |
| 2         | 学习 MySQL  | 菜鸟教程  | 2017-04-12      |
| 3         | 学习 Java   | RUNOOB.COM    | 2015-05-01      |
| 4         | 学习 Python | RUNOOB.COM    | 2016-03-06      |
| 5         | 学习 C      | FK            | 2017-04-05      |
+-----------+---------------+---------------+-----------------+
5 rows in set (0.01 sec)
```

4.1 INNER JOIN（内连接,或等值连接）
![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209060153100.gif)

```sql
mysql> SELECT a.runoob_id, a.runoob_author, b.runoob_count FROM runoob_tbl a INNER JOIN tcount_tbl b ON a.runoob_author = b.runoob_author;
+-------------+-----------------+----------------+
| a.runoob_id | a.runoob_author | b.runoob_count |
+-------------+-----------------+----------------+
| 1           | 菜鸟教程    | 10             |
| 2           | 菜鸟教程    | 10             |
| 3           | RUNOOB.COM      | 20             |
| 4           | RUNOOB.COM      | 20             |
+-------------+-----------------+----------------+
4 rows in set (0.00 sec)
```

4.2 LEFT JOIN（左连接）
![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209060153798.gif)

```sql
mysql> SELECT a.runoob_id, a.runoob_author, b.runoob_count FROM runoob_tbl a LEFT JOIN tcount_tbl b ON a.runoob_author = b.runoob_author;
+-------------+-----------------+----------------+
| a.runoob_id | a.runoob_author | b.runoob_count |
+-------------+-----------------+----------------+
| 1           | 菜鸟教程    | 10             |
| 2           | 菜鸟教程    | 10             |
| 3           | RUNOOB.COM      | 20             |
| 4           | RUNOOB.COM      | 20             |
| 5           | FK              | NULL           |
+-------------+-----------------+----------------+
5 rows in set (0.01 sec)
```

4.3 RIGHT JOIN（右连接）
![img](https://img2018.cnblogs.com/blog/1196462/201912/1196462-20191225004509099-1149596663.gif)

```sql
mysql> SELECT a.runoob_id, a.runoob_author, b.runoob_count FROM runoob_tbl a RIGHT JOIN tcount_tbl b ON a.runoob_author = b.runoob_author;
+-------------+-----------------+----------------+
| a.runoob_id | a.runoob_author | b.runoob_count |
+-------------+-----------------+----------------+
| 1           | 菜鸟教程    | 10             |
| 2           | 菜鸟教程    | 10             |
| 3           | RUNOOB.COM      | 20             |
| 4           | RUNOOB.COM      | 20             |
| NULL        | NULL            | 22             |
+-------------+-----------------+----------------+
5 rows in set (0.01 sec)
```

## 五、 事务

**MYSQL 事务处理主要有两种方法：**

1、用 BEGIN, ROLLBACK, COMMIT来实现

- **BEGIN** 开始一个事务
- **ROLLBACK** 事务回滚
- **COMMIT** 事务确认

2、直接用 SET 来改变 MySQL 的自动提交模式:

- **SET AUTOCOMMIT=0** 禁止自动提交
- **SET AUTOCOMMIT=1** 开启自动提交

```sql
mysql> use RUNOOB;
Database changed
mysql> CREATE TABLE runoob_transaction_test( id int(5)) engine=innodb;  # 创建数据表
Query OK, 0 rows affected (0.04 sec)
 
mysql> select * from runoob_transaction_test;
Empty set (0.01 sec)
 
mysql> begin;  # 开始事务
Query OK, 0 rows affected (0.00 sec)
 
mysql> insert into runoob_transaction_test value(5);
Query OK, 1 rows affected (0.01 sec)
 
mysql> insert into runoob_transaction_test value(6);
Query OK, 1 rows affected (0.00 sec)
 
mysql> commit; # 提交事务
Query OK, 0 rows affected (0.01 sec)
 
mysql>  select * from runoob_transaction_test;
+------+
| id   |
+------+
| 5    |
| 6    |
+------+
2 rows in set (0.01 sec)
 
mysql> begin;    # 开始事务
Query OK, 0 rows affected (0.00 sec)
 
mysql>  insert into runoob_transaction_test values(7);
Query OK, 1 rows affected (0.00 sec)
 
mysql> rollback;   # 回滚
Query OK, 0 rows affected (0.00 sec)
 
mysql>   select * from runoob_transaction_test;   # 因为回滚所以数据没有插入
+------+
| id   |
+------+
| 5    |
| 6    |
+------+
2 rows in set (0.01 sec)
```

## 六、索引

6.1 普通索引

**创建索引**

这是最基本的索引，它没有任何限制。它有以下几种创建方式：

```scss
CREATE INDEX indexName ON mytable(username(length)); 
```

如果是CHAR，VARCHAR类型，length可以小于字段实际长度；如果是BLOB和TEXT类型，必须指定 length。

**修改表结构(添加索引)**

```sql
ALTER table tableName ADD INDEX indexName(columnName)
```

**创建表的时候直接指定**

```sql
CREATE TABLE mytable(  
 
ID INT NOT NULL,   
 
username VARCHAR(16) NOT NULL,  
 
INDEX [indexName] (username(length))  
 
);  
```

**删除索引的语法**

```delphi
DROP INDEX [indexName] ON mytable; 
```

6.2 唯一索引

它与前面的普通索引类似，不同的就是：索引列的值必须唯一，但允许有空值。如果是组合索引，则列值的组合必须唯一。它有以下几种创建方式：

**创建索引**

```scss
CREATE UNIQUE INDEX indexName ON mytable(username(length)) 
```

**修改表结构**

```sql
ALTER table mytable ADD UNIQUE [indexName] (username(length))
```

**创建表的时候直接指定**

```sql
CREATE TABLE mytable(  
 
ID INT NOT NULL,   
 
username VARCHAR(16) NOT NULL,  
 
UNIQUE [indexName] (username(length))  
 
);  
```

6.3 使用ALTER 命令添加和删除索引

有四种方式来添加数据表的索引：

- **ALTER TABLE tbl_name ADD PRIMARY KEY (column_list):**该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL。
- **ALTER TABLE tbl_name ADD UNIQUE index_name (column_list):** 这条语句创建索引的值必须是唯一的（除了NULL外，NULL可能会出现多次）。
- **ALTER TABLE tbl_name ADD INDEX index_name (column_list):** 添加普通索引，索引值可出现多次。
- **ALTER TABLE tbl_name ADD FULLTEXT index_name (column_list):**该语句指定了索引为 FULLTEXT ，用于全文索引。

以下实例为在表中添加索引。

```sql
mysql> ALTER TABLE testalter_tbl ADD INDEX (c);
```

你还可以在 ALTER 命令中使用 DROP 子句来删除索引。尝试以下实例删除索引:

```sql
mysql> ALTER TABLE testalter_tbl DROP INDEX c;
```

## 七、临时表、复制表、导出导入数据

**7.1 临时表**`TEMPORARY`

以下展示了使用MySQL 临时表的简单实例

```sql
mysql> CREATE TEMPORARY TABLE SalesSummary (
    -> product_name VARCHAR(50) NOT NULL
    -> , total_sales DECIMAL(12,2) NOT NULL DEFAULT 0.00
    -> , avg_unit_price DECIMAL(7,2) NOT NULL DEFAULT 0.00
    -> , total_units_sold INT UNSIGNED NOT NULL DEFAULT 0
);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO SalesSummary
    -> (product_name, total_sales, avg_unit_price, total_units_sold)
    -> VALUES
    -> ('cucumber', 100.25, 90, 2);

mysql> SELECT * FROM SalesSummary;
+--------------+-------------+----------------+------------------+
| product_name | total_sales | avg_unit_price | total_units_sold |
+--------------+-------------+----------------+------------------+
| cucumber     |      100.25 |          90.00 |                2 |
+--------------+-------------+----------------+------------------+
1 row in set (0.00 sec)
```

当你使用 `SHOW TABLES`命令显示数据表列表时，你将无法看到 SalesSummary表。

如果你退出当前MySQL会话，再使用 `SELECT`命令来读取原先创建的临时表数据，那你会发现数据库中没有该表的存在，因为在你退出时该临时表已经被销毁了。

**7.2 复制表**

可以使用 `INSERT INTO ... SELECT`语句来实现。

```rust
mysql> INSERT INTO clone_tbl (runoob_id,
    ->                        runoob_title,
    ->                        runoob_author,
    ->                        submission_date)
    -> SELECT runoob_id,runoob_title,
    ->        runoob_author,submission_date
    -> FROM runoob_tbl;
Query OK, 3 rows affected (0.07 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

**7.3 导出导入数据**

**导出**---------

**1 使用`SELECT ... INTO OUTFILE` 语句导出数据**

以下实例中我们将数据表 runoob_tbl 数据导出到 /tmp/runoob.txt 文件中:

```sql
mysql> SELECT * FROM runoob_tbl 
    -> INTO OUTFILE '/tmp/runoob.txt';
```

你可以通过命令选项来设置数据输出的指定格式，以下实例为导出 CSV 格式：

```vbnet
mysql> SELECT * FROM passwd INTO OUTFILE '/tmp/runoob.txt'
    -> FIELDS TERMINATED BY ',' ENCLOSED BY '"'
    -> LINES TERMINATED BY '\r\n';
```

在下面的例子中，生成一个文件，各值用逗号隔开。这种格式可以被许多程序使用。

```vbnet
SELECT a,b,a+b INTO OUTFILE '/tmp/result.text'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM test_table;
```

**2 将数据表及数据库拷贝至其他主机**

如果你需要将数据拷贝至其他的 MySQL 服务器上, 你可以在 mysqldump 命令中指定数据库名及数据表。

在源主机上执行以下命令，将数据备份至 dump.txt 文件中:

```lua
$ mysqldump -u root -p database_name table_name > dump.txt
password *****
```

**导入**---------

**1 mysql 命令导入**

使用 `mysql`命令导入语法格式为：

```css
mysql -u用户名    -p密码    <  要导入的数据库数据(runoob.sql)
```

实例：

```bash
# mysql -uroot -p123456 < runoob.sql
```

**2 source 命令导入**

`source` 命令导入数据库需要先登录到数库终端：

```shell
mysql> create database abc;      # 创建数据库
mysql> use abc;                  # 使用已创建的数据库 
mysql> set names utf8;           # 设置编码
mysql> source /home/abc/abc.sql  # 导入备份数据库
```

**3 使用 LOAD DATA 导入数据**

MySQL 中提供了LOAD DATA INFILE语句来插入数据。 以下实例中将从当前目录中读取文件 dump.txt ，将该文件中的数据插入到当前数据库的 mytbl 表中。

```sql
mysql> LOAD DATA LOCAL INFILE 'dump.txt' INTO TABLE mytbl;
```

**4 使用 mysqlimport 导入数据**

mysqlimport 客户端提供了 LOAD DATA INFILEQL 语句的一个命令行接口。mysqlimport 的大多数选项直接对应 LOAD DATA INFILE 子句。

从文件 dump.txt 中将数据导入到 mytbl 数据表中, 可以使用以下命令：

```shell
$ mysqlimport -u root -p --local mytbl dump.txt
password *****
```

## 八、DCL 数据控制语言

1.创建用户:

```python
create user'xiaoming'@'localhost' identified by '666666';
```

2.授权用户:

```vhdl
grant all on test.to'xiaoming'@'localhost';
```

3.刷新权限:

```lua
flush privileges;
```

4.取消授权:

```sql
revoke all on test.* from 'xiaoming'@'localhost';
```

5.删除用户:

```sql
drop user'xiaoming'@'localhost';
```
