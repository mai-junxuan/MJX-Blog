# Explain语句

## EXPLAIN使用

explain可用来分析SQL的执行计划。格式如下：

```
{EXPLAIN | DESCRIBE | DESC}
    tbl_name [col_name | wild]

{EXPLAIN | DESCRIBE | DESC}
    [explain_type]
    {explainable_stmt | FOR CONNECTION connection_id}

{EXPLAIN | DESCRIBE | DESC} ANALYZE select_statement    

explain_type: {
    FORMAT = format_name
}

format_name: {
    TRADITIONAL
  | JSON
  | TREE
}

explainable_stmt: {
    SELECT statement
  | TABLE statement
  | DELETE statement
  | INSERT statement
  | REPLACE statement
  | UPDATE statement
}
```

结果输出展示：

| 字段              | format=json时的名称 | 含义                         |
| :---------------- | :------------------ | :--------------------------- |
| id                | select_id           | 该语句的唯一标识             |
| select_type       | 无                  | 查询类型                     |
| table             | table_name          | 表名                         |
| partitions        | partitions          | 匹配的分区                   |
| **type**          | access_type         | 联接类型                     |
| **possible_keys** | possible_keys       | 可能的索引选择               |
| **key**           | key                 | 实际选择的索引               |
| **key_len**       | key_length          | 索引的长度                   |
| ref               | ref                 | 索引的哪一列被引用了         |
| **rows**          | rows                | 估计要扫描的行               |
| **filtered**      | filtered            | 表示符合查询条件的数据百分比 |
| **Extra**         | 没有                | 附加信息                     |

## 结果解读

### id

该语句的唯一标识。如果explain的结果包括多个id值，则数字越大越先执行；而对于相同id的行，则表示从上往下依次执行。

### select_type

查询类型，有如下几种取值：

| 查询类型             | 作用                                                         |
| :------------------- | :----------------------------------------------------------- |
| SIMPLE               | 简单查询（未使用UNION或子查询）                              |
| PRIMARY              | 最外层的查询                                                 |
| UNION                | 在UNION中的第二个和随后的SELECT被标记为UNION。如果UNION被FROM子句中的子查询包含，那么它的第一个SELECT会被标记为DERIVED。 |
| DEPENDENT UNION      | UNION中的第二个或后面的查询，依赖了外面的查询                |
| UNION RESULT         | UNION的结果                                                  |
| SUBQUERY             | 子查询中的第一个 SELECT                                      |
| DEPENDENT SUBQUERY   | 子查询中的第一个 SELECT，依赖了外面的查询                    |
| DERIVED              | 用来表示包含在FROM子句的子查询中的SELECT，MySQL会递归执行并将结果放到一个临时表中。MySQL内部将其称为是Derived table（派生表），因为该临时表是从子查询派生出来的 |
| DEPENDENT DERIVED    | 派生表，依赖了其他的表                                       |
| MATERIALIZED         | 物化子查询                                                   |
| UNCACHEABLE SUBQUERY | 子查询，结果无法缓存，必须针对外部查询的每一行重新评估       |
| UNCACHEABLE UNION    | UNION属于UNCACHEABLE SUBQUERY的第二个或后面的查询            |

### table

表示当前这一行正在访问哪张表，如果SQL定义了别名，则展示表的别名

### partitions

当前查询匹配记录的分区。对于未分区的表，返回null

### type

连接类型，有如下几种取值，**性能从好到坏排序** 如下：

- system：该表只有一行（相当于系统表），system是const类型的特例

- const：针对主键或唯一索引的等值查询扫描, 最多只返回一行数据. const 查询速度非常快, 因为它仅仅读取一次即可

- eq_ref：当使用了索引的全部组成部分，并且索引是PRIMARY KEY或UNIQUE NOT NULL 才会使用该类型，性能仅次于system及const。

  ```
  -- 多表关联查询，单行匹配
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;
  
  -- 多表关联查询，联合索引，多行匹配
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

- ref：当满足索引的最左前缀规则，或者索引不是主键也不是唯一索引时才会发生。如果使用的索引只会匹配到少量的行，性能也是不错的。

  ```
  -- 根据索引（非主键，非唯一索引），匹配到多行
  SELECT * FROM ref_table WHERE key_column=expr;
  
  -- 多表关联查询，单个索引，多行匹配
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;
  
  -- 多表关联查询，联合索引，多行匹配
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

  > **TIPS**
  >
  > 最左前缀原则，指的是索引按照最左优先的方式匹配索引。比如创建了一个组合索引(column1, column2, column3)，那么，如果查询条件是：
  >
  > - WHERE column1 = 1、WHERE column1= 1 AND column2 = 2、WHERE column1= 1 AND column2 = 2 AND column3 = 3 都可以使用该索引；
  > - WHERE column1 = 2、WHERE column1 = 1 AND column3 = 3就无法匹配该索引。

- fulltext：全文索引

- ref_or_null：该类型类似于ref，但是MySQL会额外搜索哪些行包含了NULL。这种类型常见于解析子查询

  ```
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```

- index_merge：此类型表示使用了索引合并优化，表示一个查询里面用到了多个索引

- unique_subquery：该类型和eq_ref类似，但是使用了IN查询，且子查询是主键或者唯一索引。例如：

  ```
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```

- index_subquery：和unique_subquery类似，只是子查询使用的是非唯一索引

  ```
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```

- range：范围扫描，表示检索了指定范围的行，主要用于有限制的索引扫描。比较常见的范围扫描是带有BETWEEN子句或WHERE子句里有>、>=、<、<=、IS NULL、<=>、BETWEEN、LIKE、IN()等操作符。

  ```
  SELECT * FROM tbl_name
    WHERE key_column BETWEEN 10 and 20;
  
  SELECT * FROM tbl_name
    WHERE key_column IN (10,20,30);
  ```

- index：全索引扫描，和ALL类似，只不过index是全盘扫描了索引的数据。当查询仅使用索引中的一部分列时，可使用此类型。有两种场景会触发：

  - 如果索引是查询的覆盖索引，并且索引查询的数据就可以满足查询中所需的所有数据，则只扫描索引树。此时，explain的Extra 列的结果是Using index。index通常比ALL快，因为索引的大小通常小于表数据。
  - 按索引的顺序来查找数据行，执行了全表扫描。此时，explain的Extra列的结果不会出现Uses index。

- ALL：全表扫描，性能最差。

### possible_keys

展示当前查询可以使用哪些索引，这一列的数据是在优化过程的早期创建的，因此有些索引可能对于后续优化过程是没用的。

### key

表示MySQL实际选择的索引

### key_len

索引使用的字节数。由于存储格式，当字段允许为NULL时，key_len比不允许为空时大1字节。

### ref

表示将哪个字段或常量和key列所使用的字段进行比较。

如果ref是一个函数，则使用的值是函数的结果。要想查看是哪个函数，可在EXPLAIN语句之后紧跟一个SHOW WARNING语句。

### rows

MySQL估算会扫描的行数，数值越小越好。

### filtered

表示符合查询条件的数据百分比，最大100。用rows × filtered可获得和下一张表连接的行数。例如rows = 1000，filtered = 50%，则和下一张表连接的行数是500。

### Extra

展示有关本次查询的附加信息，取值如下：

- **Using **filesort****

  当Query 中包含 ORDER BY 操作，而且无法利用索引完成排序操作的时候，MySQL Query Optimizer 不得不选择相应的排序算法来实现。数据较少时从内存排序，否则从磁盘排序。Explain不会显示的告诉客户端用哪种排序。官方解释：“MySQL需要额外的一次传递，以找出如何按排序顺序检索行。通过根据联接类型浏览所有行并为所有匹配WHERE子句的行保存排序关键字和行的指针来完成排序。然后关键字被排序，并按排序顺序检索行”

- Using index

  仅使用索引树中的信息从表中检索列信息，而不必进行其他查找以读取实际行。当查询仅使用属于单个索引的列时，可以使用此策略。例如：

  ```
  explain SELECT id FROM t
  ```

- Using temporary

  为了解决该查询，MySQL需要创建一个临时表来保存结果。如果查询包含不同列的GROUP BY和 ORDER BY子句，通常会发生这种情况。

  ```
  -- name无索引
  explain SELECT name FROM t1 group by name
  ```

- Using where

  如果我们不是读取表的所有数据，或者不是仅仅通过索引就可以获取所有需要的数据，则会出现using where信息

  ```
  explain SELECT * FROM t1 where id > 5
  ```