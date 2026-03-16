# FastJSON中“$ref”问题

## 问题复现：`$ref` 是如何产生的？

`$ref` 的出现通常源于两种情况：**对象重复引用** 或 **对象循环引用**。

#### 场景一：对象重复引用

假设我们有一个订单（Order），订单中包含了多个商品项（Item），而这些商品项恰好引用了同一个商品对象（Product）。

```java
// 实体类定义（为简洁省略 getter/setter）
class Product {
    public String id;
    public String name;
    public Product(String id, String name) {
        this.id = id;
        this.name = name;
    }
}

class Order {
    public String orderId;
    public List<Product> items = new ArrayList<>();
}

// 复现代码
public static void main(String[] args) {
    // 创建一个商品，并在订单中多次引用它
    Product sharedProduct = new Product("P-123", "高性能笔记本");

    Order order = new Order();
    order.orderId = "O-001";
    order.items.add(sharedProduct);
    order.items.add(sharedProduct); // 同一个 product 实例被再次添加

    String jsonString = JSON.toJSONString(order);
    System.out.println(jsonString);
}
```

**输出结果：**

```json
{
  "orderId": "O-001",
  "items": [
    {
      "id": "P-123",
      "name": "高性能笔记本"
    },
    {
      "$ref": "$.items[0]"
    }
  ]
}
```

第二个商品变成了一个指向第一个商品的引用 `{"$ref": "$.items[0]"}`。

#### 场景二：对象循环引用

这是一个更典型的情况，例如一个部门（Department）和员工（Employee）互相关联。

```java
// 实体类定义
class Department {
    public String name;
    public List<Employee> employees = new ArrayList<>();
}

class Employee {
    public String name;
    public Department department; // 指向所属部门
}

// 复现代码
public static void main(String[] args) {
    Department devDept = new Department();
    devDept.name = "研发部";

    Employee employee = new Employee();
    employee.name = "张三";

    // 建立双向引用关系
    devDept.employees.add(employee);
    employee.department = devDept;

    String jsonString = JSON.toJSONString(devDept);
    System.out.println(jsonString);
}
```

**输出结果：**

```json
{
  "name": "研发部",
  "employees": [
    {
      "name": "张三",
      "department": {
        "$ref": "$"
      }
    }
  ]
}
```

员工对象中的 `department` 属性被序列化为了 `{"$ref": "$"}`，`$` 代表根对象，即 `devDept` 本身，形成了一个闭环。

-----

## `$ref` 是否是正确的呢

Fastjson 默认开启了循环引用检测 (`SerializerFeature.CircularReferenceDetect`)。它的工作原理是：

1.  在序列化过程中，Fastjson 会记录下每一个被序列化的对象的路径。
2.  当再次遇到**同一个对象实例**时，为了避免无限递归（在循环引用场景下会导致 `StackOverflowError`）和减小 JSON 体积（在重复引用场景下），它不会再次序列化该对象。
3.  取而代之，它会输出一个 `$ref` 指针，指向该对象第一次出现时的路径。

所以，`$ref` 本质上是一个**保护机制**和**优化手段**。但在实际应用中，它带来的麻烦远大于好处，主要因为：

  * **跨语言/跨系统不兼容**：`$ref` 是 Fastjson 的一种“方言”，绝大部分前端 JavaScript 解析库（如 `JSON.parse`）或其他语言的 JSON 库（如 Python 的 `json` 模块）都不认识它，导致反序列化失败。
  * **反序列化不可靠**：即使消费方也是用 Fastjson，如果配置不当或场景复杂，反序列化也可能得不到预期的完整对象。

因此，在绝大多数，特别是需要对外提供 API 的场景下，我们都需要禁用或规避它。

-----

## 解决方案

#### 方案一：全局关闭循环引用检测

这是最简单直接的办法，通过在序列化时传入一个特性参数 `SerializerFeature.DisableCircularReferenceDetect` 来关闭这个功能。

```java
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

// ...接场景一的代码
String jsonString = JSON.toJSONString(order, SerializerFeature.DisableCircularReferenceDetect);
System.out.println(jsonString);
```

**新的输出结果：**

```json
{
  "orderId": "O-001",
  "items": [
    {
      "id": "P-123",
      "name": "高性能笔记本"
    },
    {
      "id": "P-123",
      "name": "高性能笔记本"
    }
  ]
}
```

现在 JSON 变得标准且通用了。

> 如果你的对象之间存在**真实的循环引用**（如场景二），使用此方案将直接导致 `StackOverflowError` 异常，因为序列化过程会陷入无限递归！**所以此方法只适用于重复引用，不适用于循环引用。**

#### 方案二：使用 `@JSONField` 注解切断循环（推荐用于循环引用）

对于循环引用的场景（如部门-员工），最佳实践是在数据模型层面切断这个循环链。通常，我们在序列化时，不希望子级对象再回头序列化父级对象。

我们可以使用 `@JSONField(serialize = false)` 注解来告诉 Fastjson，在序列化时忽略某个字段。

```java
import com.alibaba.fastjson.annotation.JSONField;

class Employee {
    public String name;

    @JSONField(serialize = false) // 在序列化时忽略此字段
    public Department department;
}

// ...接场景二的代码
// Department 类保持不变
String jsonString = JSON.toJSONString(devDept); // 无需加特性参数
System.out.println(jsonString);
```

**新的输出结果：**

```json
{
  "name": "研发部",
  "employees": [
    {
      "name": "张三"
    }
  ]
}
```

这样，我们既得到了标准的 JSON，又从根本上避免了无限递归的风险。这通常是设计 API 接口时更优雅、更合理的做法。

-----

## 总结与选型建议

| 解决方案 | 适用场景 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| `SerializerFeature.DisableCircularReferenceDetect` | **重复引用**，且对象关系是树状或有向无环图 | 简单快捷，一劳永逸 | **对真实循环引用会抛出 `StackOverflowError`**；JSON 体积可能更大 |
| `@JSONField(serialize = false)` | **循环引用**，如父子双向关联 | 从模型上解决问题，安全可靠，符合 DTO 设计理念 | 需要修改实体类代码，可能会丢失部分信息 |
| 默认行为（保留 `$ref`） | 仅限 Fastjson 内部系统间通信，且两端都清楚此机制 | 序列化安全，JSON 体积小 | **兼容性极差，极不推荐用于对外 API** |

**建议：**

1.  **对外提供 API 时**：强烈建议使用 **方案一** 或 **方案二**，生成标准的、无 `$ref` 的 JSON 字符串。
2.  **判断引用类型**：在解决问题前，先明确你的对象关系是“重复引用”还是“循环引用”。
3.  **优先重构模型**：对于“循环引用”，最佳选择是通过 **方案二** (`@JSONField`) 或设计专门的 DTO (Data Transfer Object) 来解除序列化时的循环，这是一种更健康的应用架构。