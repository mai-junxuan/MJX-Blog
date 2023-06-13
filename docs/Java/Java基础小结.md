# 标识符

## 标识符和关键字的区别是什么？

标识符就是我们使用的对象或者变量的名字，关键字就是被Java作为特殊标识的单词。

## Java语言的关键字

### 访问控制

```
1. private:仅本类可以访问    
2. protected:对本包或者子类都可见
3. public:所有类可见
4. default:不修饰访问级别就是default，访问级别仅仅是本包的成员可以访问
```

### 类，方法和变量修饰符

#### 关键字

```
1. abstract    
2. class    
3. extends    
4. final    
5. implements    
6. interface    
7. native:该修饰符修饰的方法说明该方法不一定是Java实现的而是一个原生态的方法，是用其他的语言实现的，Java仅仅是通过JNI接口调用而已。
8. new    
9. static    
10. strictfp    
11. synchronized    
12. transient    
13. volatile    
14. enum
```

#### final

这几个关键字中我们还需要注意的是，final关键字修饰的变量是不可变的，但是对于引用类型来说，他代表的意思是引用的指向不变，但是引用指向的对象的值是可变的，参见以下代码

```java
/**
 * final对于引用来说代表仅代表引用指向不可变，不代表指向的对象不可变
 */
public class Employee {

    private final StringBuilder evaluations;

    public Employee(StringBuilder evaluations) {
        this.evaluations = evaluations;
    }

    public void giveGoldStar() {
        evaluations.append(LocalDate.now() + "：Gold star");
    }


}
```

#### transient

transient使得我们的关键字不会被序列化

```java
/**
 * transient关键字防止序列化 注意该类需要实现Serializable 否则会报错
 */
public class User implements Serializable {
    private String name;
    private transient String password;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public static void main(String[] args) {

        User user = new User();
        user.setName("Jackson");
        user.setPassword("password123");

        System.out.println("User: " + user.toString());

        //begin serializing
        try {
            ObjectOutputStream fos = new ObjectOutputStream(new FileOutputStream("bean.txt"));
            fos.writeObject(user);
            fos.flush();
            fos.close();
            System.out.println("local serialized done");
        } catch (Exception e) {
        }

        System.out.println("de-serialzing...");
        try {
            ObjectInputStream fis = new ObjectInputStream(new FileInputStream("bean.txt"));
            user = (User) fis.readObject();
            fis.close();
            System.out.println("User name: " + user.getName() + "  password:" + user.getPassword());
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

#### new关键字使用注意事项(使用clone提高创建速度)

Java的new关键字对轻量级对象非常支持，可以非常光速的new一个对象。但是对于那些重量级对象，构造函数存在大量的对象创建可能就非常耗时，所有我们建议使用clone方法。

如下所示，new 关键字对调用无参构造方法，需要3秒，对此我们可以使用clone方法绕过构造方法创建一个对象，但是clone出来的对象存在一个浅拷贝的问题，所以我们需要自行解决一下。

```java
package com.zsy.javatuning.tech;

import java.util.Vector;

public class Student implements Cloneable {
    private String id;
    private String name;
    private Vector<String> vector;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Vector<String> getVector() {
        return vector;
    }

    public void setVector(Vector<String> vector) {
        this.vector = vector;
    }


    public Student() {
        try {
            System.out.println("创建对象需要三秒......");
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    public Student newInstance() {
        try {
            return (Student) this.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Student clone = (Student) super.clone();

        //避免clone导致浅拷贝问题
        Vector<String> srcVector = this.getVector();

        Vector<String> dstVector = new Vector<>();
        for (String v : srcVector) {
            dstVector.add(v);
        }

        clone.setVector(dstVector);

        return clone;

    }
}

```

测试代码

```
 @Test
    public void cloneTest() throws CloneNotSupportedException {

        long start,end;
        start=System.currentTimeMillis();
        Student student=new Student();
        end=System.currentTimeMillis();
        System.out.println("学生1创建时间长 "+(end-start));


        student.setId("1");
        student.setName("小明");
        Vector<String> v = new Vector<>();
        v.add("000000");
        v.add("000001");
        student.setVector(v);

        start=System.currentTimeMillis();
        Student student2= student.newInstance();
        end=System.currentTimeMillis();
        System.out.println("学生2创建时间长 "+(end-start));


        for (String s : student2.getVector()) {
            System.out.println(s);
        }
//        false则说明深拷贝成功
        System.out.println(student.getVector()==student2.getVector());
    }
```

输出结果

```
创建对象需要三秒......
学生1创建时间长 3013
学生2创建时间长 0
000000
000001
false
```

### 程序控制

```
1. break    
2. continue    
3. return    
4. do    
5. while    
6. if    
7. else
8. for    
9. instanceof:在 Java 中可以使用 instanceof 关键字判断一个对象是否为一个类（或接口、抽象类、父类）的实例
10. switch    
11. case    
12. default    
13. assert
```

### 错误处理

```
1. try    
2. catch    
3. throw    
4. throws    
5. finally
```

### 包相关

```
1. import    
2. package
```

### 基本类型

```
1. boolean    
2. byte    
3. char    
4. double    
5. float    
6. int    
7. long
8. short
```

### 变量引用

```
1. super    
2. this    
3. void    
```

### 保留字

```
1. goto    
2. const
```

# Java注释有哪几种形式

1. 单行注释 格式：

```
 //注释文字
```

1. 多行注释 格式：

```bash
 /* 
 注释文字
*/
```

1. 文档注释 格式

```bash
/** 
注释文字 
*/
```

例：

```bash
/**
这是我的Hello World程序。
@author 开发者名字
*/
class Demo
{
/*
这是主函数，是程序的入口
它的出现可以保证程序的独立运行，
*/
public static void main(String[] args)
{
//这是输出语句用于将括号内的数据打印到控制台。
System.out.println("Hello World");
}
}
```

# 进制数

## 概念

在计算机中数据都是以2进制存储的，但为了更方便的表述数据，又出现了八进制、十六进制。

## 进制间的转换

### 十进制转二进制

如下图二进制转为十进制的结果

![在这里插入图片描述](https://s2.loli.net/2023/06/14/iwfF56St18QRBx2.png)

### 二进制转十进制

如下图将二进制转为十进制

![在这里插入图片描述](https://s2.loli.net/2023/06/14/FtW746kQlPvBfYZ.png)

### 其他进制间的转换

二进制转十六进制，如下图二进制的4个位相当于一个十六进制，所以我们可以4个位置先换算成十进制再转为十六进制即可。八进制同理不多赘述。

![在这里插入图片描述](https://s2.loli.net/2023/06/14/NcFYQ5V8gTeGKxz.png)

### 负数的二进制表现形式

**规律**：正数的最高位为0，负数则为1

![在这里插入图片描述](https://s2.loli.net/2023/06/14/elH6ADIzM45Epgq.png)

# 变量

## 变量的概念

1. 内存中的一个存储区域
2. 该区域有自己的名称（变量名）和类型（数据类型）
3. 该区域的数据可以在同一类型范围内不断变化

## 类型

java是一门**强类型语言**，所有对数据类型区分的很明显

## 种类

### 数值型(常量整数默认为int)

1. byte：1个字节，-128~128 (-2 ^ 7 ~ 2^7)
2. short: 2个字节， -32768 ~ 32767 (-2 ^ 15 ~ 2^15)
3. int : 4个字节，用高位表示符号，( - 2 ^ 32 ~ 2^32)
4. long:8个字节

### 浮点型

1. float(单精度浮点型)：`float f=2.3f //不加f编译会认为可能会出现精度丢失，而编译不通过`
2. double(双精度浮点型)

### 字符集

char： 1个字节，0 ~ 65535

### 布尔型

boolean:1个字节，true或false

## 精度丢失问题

![在这里插入图片描述](https://s2.loli.net/2023/06/14/2SnpYjVkmcqUP3g.png)

![在这里插入图片描述](https://s2.loli.net/2023/06/14/WcDXsPeq7Jyx8GR.png)

那为何byte b=3可以通过呢？

```
答：在赋值时编译器会检查赋的值的取值范围是否在数据类型以内，题目中值的范围符合要求。
```

解决方案

```bash
byte b=(byte)(b+2);
```

## 成员变量和局部变量的区别

### 语法上

成员变量：可被访问修饰符以及static修饰 局部变量:不可被访问修饰符以及static等修饰

### 存储

成员变量在堆内存 局部变量是在栈内存

### 生存时间

成员变量若为static则随着类存在而存在，若无static则随着对象存在而存在 局部变量则随着方法调用结束

### 默认值

成员变量有默认值

## 静态变量有什么作用

可被多个类共享，无论创建多少个类，使用static修饰的变量永远只有这一个 若static再加一个final，这个变量就相当于一个常量

## 字符型常量和字符串常量的区别

1. 字符串在Java中占用两个字节，字符串若干个字节
2. 字符用单引号，字符串用双引号

## 变量调优技巧

### 将常用变量局部化，可提升代码执行性能

```
package com.optimize.java;

import org.junit.Test;

//使用局部变量优化程序性能

/**
 * testLocalVar:1
 * testStaticVar:10
 * testInstanceVar:10
 */
public class Var {

    /**
     * 使用本地变量耗时
     */
    @Test
    public void testLocalVar() {
        int a = 0;
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            a++;
        }
        long end = System.currentTimeMillis();
        System.out.println("testLocalVar:" + (end - start));
    }



    private static int ta=0;
    /**
     * 使用静态变量耗时
     */
    @Test
    public void testStaticVar() {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            ta++;
        }
        long end = System.currentTimeMillis();
        System.out.println("testStaticVar:" + (end - start));
    }


    private int instanceA=0;

    /**
     * 使用示例变量耗时
     */
    @Test
    public void testInstanceVar() {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            instanceA++;
        }
        long end = System.currentTimeMillis();
        System.out.println("testInstanceVar:" + (end - start));
    }

}

```

### 数组拷贝使用arrayCopy

在容量极大的情况下，使用native暴露的api可提升执行效率

```java
package com.optimize.java;

import org.junit.Test;

/**
 * 1000大小的数组
 * testArrayCopyNormal;17
 * testArrayCopySystem;40
 *
 * 100w
 *
 * testArrayCopyNormal;17005
 * testArrayCopySystem;15705
 */

public class ArrayCopy {
    @Test
    public void testArrayCopyNormal() {
        int size=1000000;
        int[] srcArr = new int[size];
        int[] dstArr = new int[size];
        for (int i = 0; i < size; i++) {
            srcArr[i] = i;
        }

        long start = System.currentTimeMillis();
        for (int k = 0; k < 10000; k++) {
            for (int i = 0; i < size; i++) {
                dstArr[i] = srcArr[i];
            }
        }
        long end = System.currentTimeMillis();
        System.out.println("testArrayCopyNormal;" + (end - start));
    }

    @Test
    public void testArrayCopySystem() {
        int size=1000000;
        int[] srcArr = new int[size];
        int[] dstArr = new int[size];
        for (int i = 0; i < size; i++) {
            srcArr[i] = i;
        }

        long start = System.currentTimeMillis();
        for (int k = 0; k < 10000; k++) {
            System.arraycopy(srcArr, 0, dstArr, 0, size);
        }

        long end = System.currentTimeMillis();
        System.out.println("testArrayCopySystem;" + (end - start));
    }
}

```

# 包装类

## 基本类型和包装类型的区别

1. 包装类型成员变量默认为null，成员变量默认为该类型默认值，例如int成员变量默认为0
2. 基本类型的局部变量会被存放在虚拟机栈的局部变量表中，而非static的借本类型成员变量都是存放在堆中。而包装类型在HotSpot 逃逸分析发现并没有逃逸的外部时会避免分配在堆上，其他情况都会分配上堆区。
3. 包装类型可以作为泛型，基本类型不可

## 包装类型的缓存机制

### 简介

Java会对4种基本整数类型(short int long byte)设置缓存数据，如下源码所示

```java
 public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high)
            return IntegerCache.cache[i + (-IntegerCache.low)];
        return new Integer(i);
    }
```

注意byte的缓存范围是0-127

### float和double没有实现缓存机制

```java
 @Test
    public void doubleTest() {
        //        float double 没有实现缓存机制
        Double d = 1.2;
        Double d2 = 1.2;
        System.out.println(d == d2);
    }
```

### 包装类使用注意事项

正是因为这种范围机制，在缓存范围内的对象比较结果都是true，反之使用false，这正是为什么在对包装类比较时，我们都需要使用`equals`

```java
@Test
    public void integerValueTest() {
        /**
         * public static Integer valueOf(int i) {
         *         if (i >= IntegerCache.low && i <= IntegerCache.high)
         *             return IntegerCache.cache[i + (-IntegerCache.low)];
         *         return new Integer(i);
         *     }
         */
        Integer i = 123;
        Integer i2 = 123;
        System.out.println(i == i2);//true

        Integer integer = 129;
        Integer integer2 = 129;
        System.out.println(integer==integer2);//false
    }
```

## 自动装箱和自动拆箱

### 简介

如下所示，将基本类型赋值给包装类型会触发自动装箱，调用valueOf返回一个对象实例。而自动拆箱则是调用xxxValue将包装类的值取出赋值给基本类型

```java
@Test
    public void baseTest() {

        /**
         * 装箱字节码查看
         * 装箱操作，相当于调用valueOf从返回一个对象实例
         * 字节码核心代码:INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;
         */
        Integer i = 10;
        /**
         * 自动拆箱
         * 查看字节码相当于调用了intValue
         *  INVOKEVIRTUAL java/lang/Integer.intValue ()I
         */
        int i2 = i;
    }
```

### 包装类的比较

如下代码i是通过装箱通过valueOf从缓存中取得，而i2则是自己从堆区创建的一个对象，所以两者返回false，要想比较数值必须使用equals

```java
@Test
    public void integerQuestion() {
        Integer i = 10;//相当于Integer.valueOf(10) 从缓存中拿值
        Integer i2 = new Integer(10); // 创建一个新的对象，所以两者值不相等
        System.out.println(i == i2);//false
        System.out.println(i.equals(i2));//true
    }
```

这个比较器也是同理，因为new Integer做的是在堆区创建一个对象，==比较的是两个引用的地址，所以返回1

```java
 @Test
    public void BoxedCompareTest() {
        Comparator<Integer> naturalOrder = (i, j) -> (i < j) ? -1 : (i == j ? 0 : 1);
        int compare = naturalOrder.compare(new Integer(12), new Integer(12));
        System.out.println(compare);//返回1 因为integer new出来的对象比较的是地址值
    }
```

正确做法是将传入的Integer对象进行拆箱进行比较

```java
 /**
     * 正确比较包装对象做法是进行手动拆箱
     */
    @Test
    public void BoxedCompareTest2() {
        Comparator<Integer> naturalOrder = (i, j) -> {
            int compaer1 = Integer.valueOf(i);
            int compaer2 = Integer.valueOf(j);
            return (compaer1 < compaer2) ? -1 : (compaer1 == compaer2 ? 0 : 1);
        };
        int compare = naturalOrder.compare(new Integer(12), new Integer(12));
        System.out.println(compare);//返回1 因为integer new出来的对象比较的是地址值
    }
```

### 性能问题

使用包装类和基本类型运算会会导致频繁拆装箱，通过查看字节码，我们可以看到第一段 `sum += i;`实际上会进行`INVOKESTATIC java/lang/Long.valueOf (J)Ljava/lang/Long;`进行装箱操作。所以我们应该避免这种情况，在进行大量的数值计算时尽量使用基本类型

```java
/**
     * 频繁拆装箱会导致性能问题
     */
    @Test
    public void boxedSum() {
        long start = System.currentTimeMillis();
        Long sum = 0l;
        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            //会导致频繁装箱
//            INVOKESTATIC java/lang/Long.valueOf (J)Ljava/lang/Long;
            sum += i;
        }
        long end = System.currentTimeMillis();
        System.out.println(end - start);//4723

        long sum1 = 0l;
        start = System.currentTimeMillis();
        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            sum1 += i;
        }
        end = System.currentTimeMillis();
        System.out.println(end - start);//519
    }
```

### 空指针问题

由于自动拆装箱机制，下面这段代码会进行自动拆箱，进而导致空指针异常

```java
public class Unbelievable {
    static Integer unbelievable;

    public static void main(String[] args) {
//        包装类型会进行自动拆箱 调用valueOf
        // INVOKEVIRTUAL java/lang/Integer.intValue ()I
//  所以很可能导致空指针
        if (unbelievable == 12) {
            System.out.println("Unbelievable");
        }
    }

}
```

# 精度高要求的运算

## 浮点数运算错误

如下代码所示，计算机使用二进制表示小数时可能会出现计算循环，由于精度截断很可能导致计算结果错误

```java
 @Test
    public void bug() {
        /**
         * 小数精度丢失原因
         *  0.2 转换为二进制数的过程为，不断乘以 2，直到不存在小数为止，
         * 在这个计算过程中，得到的整数部分从上到下排列就是二进制的结果。
         * 0.2 * 2 = 0.4 -> 0
         * 0.4 * 2 = 0.8 -> 0
         * 0.8 * 2 = 1.6 -> 1
         * 0.6 * 2 = 1.2 -> 1
         * 0.2 * 2 = 0.4 -> 0（发生循环）
         * ...
         */
        float result1 = 3.0f - 2.9f;
        float result2 = 2.9f - 2.8f;
        System.out.println(result1);
        System.out.println(result2);
        System.out.println(result1 == result2);
    }
```

## 如何解决浮点数精度丢失问题

```java
@Test
    public void accurateCacl() {
        BigDecimal num1 = new BigDecimal("3.0");
        BigDecimal num2 = new BigDecimal("2.9");
        BigDecimal num3 = new BigDecimal("2.8");
        BigDecimal result1 = num1.subtract(num2);
        BigDecimal result2 = num2.subtract(num3);
        System.out.println(result1);//0.1
        System.out.println(result2);//0.1
        System.out.println(result1.equals(result2));//true
    }
```

## 超过long类型的整数如何标识

如下所示，使用常规类型计算超过long的值会造成计算错误，所以我们可以使用bigInteger解决问题

```java
 @Test
    public void maxLong() {
        long maxVal = Long.MAX_VALUE;
        System.out.println(maxVal);

        /**
         * 加1后高位变1成为负数
         */
        long maxValAdd = maxVal + 1;
        System.out.println(maxValAdd);
        System.out.println(maxValAdd == Long.MIN_VALUE);

        //超过long类型的计算方式
        BigInteger bigInteger = new BigInteger("9223372036854775807");
        System.out.println(bigInteger.add(new BigInteger("1")));


    }
```

## 高性能精度运算技巧

我们来看一个例子，代码如下所示，我们想看看一块钱可以把多少块糖果，注意糖果每次循环结果会涨0.1元

### 代码段1

```java
@Test
    public void bugBuySugar() {
        double funds = 1.00;
        int itemCount = 0;
        for (double price = 0.10; funds >= price; price += 0.10) {
            System.out.println("funds:" + funds + "     price:" + price);
            funds -= price;
            itemCount++;
            System.out.println("remain:" + funds + "   itemCount:" + itemCount);

        }
    }
```

输出结果，可以看到精度计算异常了

```
funds:1.0     price:0.1
remain:0.9   itemCount:1
funds:0.9     price:0.2
remain:0.7   itemCount:2
funds:0.7     price:0.30000000000000004
remain:0.3999999999999999   itemCount:3

```

### 代码段2

使用BigDecimal 可以解决问题，但是性能差、操作不便

```java
/**
     * 缺点
     * 1. 不方便
     * 2. 处理速度较慢
     */
    @Test
    public void BuySugar() {
        final BigDecimal TEN_CENT = new BigDecimal("0.10");
        BigDecimal funds = new BigDecimal("1.00");
        int itemCount = 0;
        for (BigDecimal price = TEN_CENT;
             funds.compareTo(price) >= 0;
             price = price.add(new BigDecimal("0.10"))) {
            System.out.println("funds:" + funds + "     price:" + price);
            funds = funds.subtract(price);
            itemCount++;
            System.out.println("remain:" + funds + "   itemCount:" + itemCount);

        }
    }
```

### 代码段3

代码如下所示，我们完全可以结合业务场景决定将这段代码转为整数完成计算，从而避免BigDecimal 运算的开销

```java
 /**
     * 最佳解决方案 *100
     */
    @Test
    public void bestBuySugar() {
        int funds = 100;
        int itemCount = 0;
        for (double price = 10; funds >= price; price += 10) {
            System.out.println("funds:" + funds + "     price:" + price);
            funds -= price;
            itemCount++;
            System.out.println("remain:" + funds + "   itemCount:" + itemCount);

        }
    }
```

# 运算符

## 算术运算符

### 算数运算符种类

![在这里插入图片描述](https://s2.loli.net/2023/06/14/MaN1JgwVFD6xjmS.png)

### 算数运算符使用技巧

常用表达式提取可提高代码执行效率

```
package com.optimize.java;

import org.junit.Test;

/**
 * 提取公共表达式提升性能
 * withExpression:3
 * withoutExpression:4
 */
public class ExtractExpression {

    @Test
    public void withoutExpression() {
        double d = Math.random();
        double a = Math.random();
        double b = Math.random();
        double e = Math.random();
        double x, y;
        long start = System.currentTimeMillis();
        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            x = d * a * b / 3 * 4 * a;
            y = e * a * b / 3 * 4 * a;
        }
        long end = System.currentTimeMillis();
        System.out.println("withoutExpression:" + (end - start));
    }


    @Test
    public void withExpression() {
        double d = Math.random();
        double a = Math.random();
        double b = Math.random();
        double e = Math.random();
        double x, y;
        double t = a * b / 3 * 4 * a;
        long start = System.currentTimeMillis();
        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            x = d * t;
            y = e * t;
        }
        long end = System.currentTimeMillis();
        System.out.println("withExpression:" + (end - start));
    }
}

```

## 算数运算符面试题

1. 以下两个代码的输出结果

```bash
System.out.println("5+5="+5+5);//5+5=55
System.out.println("5+5="+(5+5));//5+5=10
```

1. 以下两个输出结果

   ```bash
   System.out.println(1%-5);
   System.out.println(-1%5);
   ```

答:

```
取模运算的符号以左边符号为主，所以输出结果为
1
-1
```

1. 转义字符的注意点

```
Linux回车符：\n
Windows回车符：\r\n
```

1. char c='你' 报错的原因

```
汉字占两个字节
```

# 赋值运算符

## 种类

= , +=, -=, *=, /=, %=

## 含义

s+=2 => s=s+2

## 面试题

short s=4; s=s+5;//会报错 s+=5;//不报错

原因：s+=5做完计算会做自动类型转换，原理和赋值运算一样

# 比较运算符

![在这里插入图片描述](https://s2.loli.net/2023/06/14/leDd9RZB7y3xTwI.png)

# 逻辑运算符

![在这里插入图片描述](https://s2.loli.net/2023/06/14/br9IyBUS5iPxZcA.png)

注意事项

1. 逻辑运算符用于连接boolean类型的表达式

2. & : 只要两边的boolean表达式结果，有一个为false。那么结果就是false。只有两边都为true，结果为true。

3. | : 两边只要有一个为true，结果为true。只有两边都有false，结果为false。

4. ^ : 异或；就是和|有点不一样。当true ^ true = false;

5. &和&&的特点：

   ```
    &:无论左边是true是false。右边都运算。
    &&:当左边为false时，右边不运算。从而提高运算效率
   ```

6. |：两边都参与运算。

   ```
    ||：当左边为true。右边不运算。
   ```

# 位运算

## 位运算符简介

![在这里插入图片描述](https://s2.loli.net/2023/06/14/pzLf7TjGv385brU.png)

## 左移右移运算

1. 左移<<，左移为乘，移几位就乘2的几次方

![在这里插入图片描述](https://s2.loli.net/2023/06/14/solgcYSJPe3InFD.png)2.

右移>> 右移为除，移几位就除2的几次方

![在这里插入图片描述](https://s2.loli.net/2023/06/14/Nc2kIl1gouO4Yvr.png)

1. 无符号右移> > > 和 >>的区别

![在这里插入图片描述](https://s2.loli.net/2023/06/14/G1jKclp2n6AJh4T.png)

## 取反运算符和负数的关系

1. 如何得出负数：即正数的值取反再+1
2. 算法二进制数的负数值为多少：即先加1再取反得到正数，再加负号

## 亦或运算的实用场景

因为1 ^2 ^2=1,5 ^3 ^3=5 所以 当一个数亦或两次相同的数值时，数值不变

**用途**：加密，有个数据要给别人，先亦或一下，当别人收到时，再亦或一遍还原

## 使用位运算替换乘除法

位运算可提高代码执行效率，使用位运算可大大提高代码执行效率

```
package com.optimize.java;

import org.junit.Test;

/**
 * 使用位运算替代乘除法计算
 * testMultiplyBit:9
 * testMultiply:93
 */
public class MathOp {

    @Test
    public void testMultiply() {
        long start = System.currentTimeMillis();
        int a = 100;
        for (int i = 0; i < 100000000; i++) {
            a *= 2;
            a /= 2;
        }
        long end = System.currentTimeMillis();
        System.out.println("testMultiply:" + (end - start));
    }


    @Test
    public void testMultiplyBit() {
        long start = System.currentTimeMillis();
        int a = 100;
        for (int i = 0; i < 100000000; i++) {
            a <<= 1;
            a >>= 1;
        }
        long end = System.currentTimeMillis();
        System.out.println("testMultiplyBit:" + (end - start));
    }
}

```

# 综合练习1(变量交换)

不使用第三个变量交换两个变量的值

1. 倒水法

```
public static void main(String[] args) {
//        倒水法解决变量交换
        int m=3;
        int n=8;
        m=m+n;//将两个变量混在一起
        n=m-n;//n从混在一起的值中减去自己，得到m的值
        m=m-n;//此时n的值就是m原先的值，让m减去自己原先的值，得到n的值

        System.out.println(m);
        System.out.println(n);
    }
```

1. 位运算法

**原理**：n ^ m ^ m=n 即两次异或运算就会还原被异或运算的值

```bash
     public static void main(String[] args) {



//        亦或法解决变量交换
        int m = 3;
        int n = 8;
        m = m ^ n;
        n = m ^ n;//要想让n变成m的值，我们就得做到 n=m^n^n==>所以这里赋值的值就是m^n
        m = n ^ m;//要想让m变成n 我们就得做到m=n^m^m===>所以这里就是n^m
        System.out.println(m);
        System.out.println(n);

    }
```

# 综合练习2(高效率计算2*8)

1. 传统二进制计算2*8 ，一位位乘过去

![在这里插入图片描述](https://s2.loli.net/2023/06/14/7VRw46BHMjfEnWL.png)

1. 使用位运算 2<<3，提高效率

![在这里插入图片描述](https://s2.loli.net/2023/06/14/ovmTHge3aAKFduw.png)

# 程序流程控制

## if

```bash
// 基本用法
int x = 1;

        if(x>1)
        {
            System.out.println("yes");
        }
        else
        {
            System.out.println("a");
        }
```

注意事项，同样if逻辑，使用if else 逻辑比全if效率高

```bash
        int n = 3;

        if(n>1)
            System.out.println("a");
        else if(n>2)
            System.out.println("b");
        else if(n>3)
            System.out.println("c");
        else
            System.out.println("d");

        /*
        if(n>1)
            System.out.println("a");
        if(n>2)
            System.out.println("b");
        if(n>3)
            System.out.println("c");
        else
            System.out.println("d");
        */
```

## switch

1. 常规用法

```bash
int x = 3;

        switch(x)//byte short int char
        {
            default:
                System.out.println("d");
                //break;
            case 4:
                System.out.println("a");
                //break;
            case 6:
                System.out.println("b");
                break;
            case 2:
                System.out.println("c");
                break;


        }

```

1. 注意事项 if和switch语句很像。

   ```
    具体什么场景下，应用哪个语句呢？
    如果判断的具体数值不多，而是符合byte short int char这四种类型。
    虽然两个语句都可以使用，建议使用swtich语句。因为效率稍高。
    **其他情况**：对区间判断，对结果为boolean类型判断，使用if，if的使用范围更广。
   ```

## 使用if else替代switch提高执行效率

```java
/**
 * jdk7使用数组等可以一定程度提高判断性能
 * 但是jdk8 使用if else性能最佳
 */
public class ReplaceSwitch {

    @Test
    public void testSwitchInt() {
        java.util.Random random = new java.util.Random();
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            switchInt(random.nextInt(10) + 1);
        }
        long end = System.currentTimeMillis();
        System.out.println("testSwitchInt:" + (end - start));
    }


    private int switchInt(int idx) {
        switch (idx) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 4;
            case 5:
                return 5;
            case 6:
                return 6;
            case 7:
                return 7;
            case 8:
                return 8;
            default:
                return -1;
        }

    }


    @Test
    public void testArrayInt() {
        java.util.Random random = new java.util.Random();
        int[] answer = new int[]{0, 1, 2, 3, 4, 5, 6, 7, 8};
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            arrayInt(random.nextInt(10) + 1, answer);
        }
        long end = System.currentTimeMillis();
        System.out.println("testArrayInt:" + (end - start));
    }

    private int arrayInt(int idx, int[] answer) {

        if (idx < 1 || idx > 8) {
            return -1;
        } else {
            return answer[idx];
        }
    }



    @Test
    public void testIfElse() {
        java.util.Random random = new java.util.Random();
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            IfElseInt(random.nextInt(10) + 1);
        }
        long end = System.currentTimeMillis();
        System.out.println("testIfElse:" + (end - start));
    }

    private int IfElseInt(int idx) {
        if (idx == 1) {
            return 1;
        } else if (idx == 2) {
            return 2;
        } else if (idx == 3) {
            return 3;
        } else if (idx == 4) {
            return 4;
        } else if (idx == 5) {
            return 5;
        } else if (idx == 6) {
            return 6;
        } else if (idx == 7) {
            return 7;
        } else if (idx == 8) {
            return 8;
        } else {
            return -1;
        }
    }

}
```

## 计算密集型避免使用stream

```java
/**
 * 对于计算密集型流式编程需要构造stream对象并对流中每个对象生成管理对象，开销极大，所以性能极低，并行流更是灾难
 * withStream 81
 * withparallelStream 711
 * withoutStream 4
 */
public class TestStream {
    @Test
    public void withoutStream() {
        int[] arr = new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        long start = System.currentTimeMillis();
        for (int k = 0; k < 100000; k++) {
            for (int i = 0; i < arr.length; i++) {
                arr[i] = arr[i] / 2;
            }
        }

        long end = System.currentTimeMillis();
        System.out.println("withoutStream " + (end - start));

    }

    @Test
    public void withStream() {
        int[] arr = new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        long start = System.currentTimeMillis();
        for (int k = 0; k < 100000; k++) {
            Arrays.stream(arr).map(d -> d / 2).toArray();
        }

        long end = System.currentTimeMillis();
        System.out.println("withStream " + (end - start));

    }


    @Test
    public void withparallelStream() {
        int[] arr = new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        long start = System.currentTimeMillis();
        for (int k = 0; k < 100000; k++) {
            Arrays.stream(arr).parallel().map(d -> d / 2).toArray();
        }

        long end = System.currentTimeMillis();
        System.out.println("withparallelStream " + (end - start));

    }
}
```

# 综合练习3(十进制转十六进制)
使用位运算 2<<3，提高效率
```java
/**
 * 十进制转十六进制
 */
public class TenConvertSixteen {
    public static void main(String[] args) {
        System.out.println(convert(65036 ));
    }

    /**
     * 除16取余数得最低1位，然后把商继续除得第2位，直到商等于0
     * @param num
     * @return
     */
    private static String convert(int num) {
        StringBuilder result = new StringBuilder();

        int temp;
        while (num > 0) {
            temp = num % 16;
            if (temp >= 10) {
                result.insert(0, (char) ('A' + (temp - 10)));
            } else {
                result.insert(0, temp);
            }

            num = num / 16;
        }

        return result.toString();
    }
}
```
