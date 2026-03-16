
# 踩坑记录：MySQL 5.7 与 8.0 中 JSON 查询的微妙差异

## 问题复现：两副面孔的 JSON 查询

假设我们有一个用户信息表 `user_info`，其中有个 `profile` 字段，类型为 `JSON`，存储着用户的扩展信息，例如：

```json
{
  "city_id": "310100",
  "member_level": "VIP",
  "register_channel": "app"
}
```

现在，我们需要根据用户所在城市和会员等级筛选出一批特定的用户。

#### 在 MySQL 5.7 环境

我们发现，下面这条 SQL 可以成功查询到数据。请注意 `IN` 子句中的值，它们被 **双重引号** 包裹着 (`'"..."'`)。

```sql
-- 在 MySQL 5.7 中正常工作
SELECT *
FROM user_info
WHERE
  JSON_EXTRACT(profile, '$.city_id') IN ('"310100"', '"110100"')
  AND JSON_EXTRACT(profile, '$.member_level') IN ('"VIP"', '"SVIP"');
```

如果去掉那层额外的引号，查询就会失败。

#### 在 MySQL 8.0 环境

然而，当我们将同样的逻辑放到 MySQL 8.0 环境中时，怪事发生了。上面那条 SQL 查不出任何结果，我们必须去掉那层多余的引号，改成下面这样才能成功：

```sql
-- 在 MySQL 8.0 中正常工作
SELECT *
FROM user_info
WHERE
  JSON_EXTRACT(profile, '$.city_id') IN ('310100', '110100')
  AND JSON_EXTRACT(profile, '$.member_level') IN ('VIP', 'SVIP');
```

为什么会这样？答案就在于 `JSON_EXTRACT` 函数在两个版本间的行为演变。

-----

## 根源探究：`JSON_EXTRACT` 的“变心”

`JSON_EXTRACT` 函数用于从 JSON 文档中提取数据。其核心差异在于，当提取的值是字符串时，返回值的格式有所不同。

  * **在 MySQL 5.7 中**：`JSON_EXTRACT` 的返回值是一个 **包含引号的 JSON 字符串字面量**。

      * 对于 JSON 中的 `"1000003003"`，`JSON_EXTRACT` 返回的是 SQL 字符串 `'\"1000003003\"'`。
      * 因此，在 `WHERE` 子句中，你需要用一个同样包含引号的字符串 `'"1000003003"'` 去和它匹配。

  * **在 MySQL 8.0 中**：MySQL 对 JSON 函数进行了诸多优化和规范。在很多比较场景下，`JSON_EXTRACT` 的行为被调整为 **自动“解包”（Unquoting）**。

      * 对于 JSON 中的 `"1000003003"`，`JSON_EXTRACT` 在 `WHERE` 子句的比较中，返回的是 **不包含引号的纯文本字符串** `'1000003003'`。
      * 所以，你直接用普通的字符串 `'1000003003'` 去匹配即可。

这个看似微小的改动，却成了跨版本兼容性的一个巨大障碍。

-----

## 最佳实践：使用 `JSON_UNQUOTE` 抹平差异

那么，如何编写一段能同时兼容 MySQL 5.7 和 8.0 的 JSON 查询 SQL 呢？答案是明确地告诉数据库你的意图：**我想要的是去除引号后的纯文本值**。

这时候，`JSON_UNQUOTE()` 函数就派上用场了。

`JSON_UNQUOTE()` 函数的功能就是提取 JSON 值并去除其最外层的引号。它在两个版本中的行为是一致的。MySQL 中还有一个更简洁的内联操作符 `->>`，它等价于 `JSON_UNQUOTE(JSON_EXTRACT(...))`。

#### 终极兼容方案

使用 `JSON_UNQUOTE()` 或 `->>` 操作符，我们可以将查询改写成如下形式，确保全环境通用：

```sql
-- 方案一：使用 JSON_UNQUOTE() 函数
SELECT *
FROM user_info
WHERE
  JSON_UNQUOTE(JSON_EXTRACT(profile, '$.city_id')) IN ('310100', '110100')
  AND JSON_UNQUOTE(JSON_EXTRACT(profile, '$.member_level')) IN ('VIP', 'SVIP');

-- 方案二：使用 ->> 操作符（更推荐，更简洁）
SELECT *
FROM user_info
WHERE
  profile ->> '$.city_id' IN ('310100', '110100')
  AND profile ->> '$.member_level' IN ('VIP', 'SVIP');
```

这两条 SQL 无论是在 MySQL 5.7 还是 8.0 中，都能得到完全一致且正确的结果。它们的核心思想是，**在比较之前，始终显式地将 JSON 字符串字面量转换为常规的 SQL 字符串**，从而消除了版本间的隐式行为差异。

-----

## 延伸思考：JSON 查询的性能与优化

虽然我们解决了兼容性问题，但还需要注意，直接在 `WHERE` 子句中对 JSON 字段使用函数通常无法利用传统索引，当数据量巨大时可能会导致性能瓶颈。

为了优化这类查询，可以考虑使用 **生成列（Generated Columns）** 来为特定的 JSON 属性创建索引（MySQL 5.7.8+ 支持）。

```sql
-- 1. 为 city_id 创建一个生成列
ALTER TABLE user_info
ADD COLUMN city_id_generated VARCHAR(255)
AS (profile ->> '$.city_id') STORED;

-- 2. 在这个新列上创建索引
CREATE INDEX idx_city_id ON user_info(city_id_generated);
```

完成上述操作后，你就可以直接查询这个带有索引的新列，查询效率将得到极大的提升：

```sql
-- 查询性能大大提升
SELECT *
FROM user_info
WHERE
  city_id_generated IN ('310100', '110100');
```

-----

## 总结

数据库版本升级带来的不仅仅是新功能，也可能伴随着一些行为上的变更。

  * **核心差异**：MySQL 5.7 的 `JSON_EXTRACT` 返回带引号的 JSON 字面量，而 MySQL 8.0 在比较时会倾向于返回不带引号的纯文本。
  * **兼容方案**：始终使用 `JSON_UNQUOTE()` 函数或更简洁的 `->>` 操作符来提取并比较 JSON 中的字符串值，以确保 SQL 在不同版本间行为一致。
  * **性能优化**：对于频繁查询的 JSON 字段，考虑使用生成列（Generated Columns）并为其建立索引，以避免全表扫描。

下次再遇到“跨环境”失灵的 SQL 时，不妨先检查一下，是不是又掉进了这类版本差异的“温柔陷阱”里。🧐
