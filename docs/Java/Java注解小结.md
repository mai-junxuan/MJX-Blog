# 简介

## 注解的定义

注解也叫元数据，jdk1.5引入的，和类、接口等属于同一个层级。可用在类、字段、接口、方法、形参上。

## 注解与注释的区别

注释:告知程序员这段程序的用意。 注解:告知计算机这段程序的用意。

# 注解的三大作用

## 生成带有说明的文档

如下所示代码，由于添加了作者、版本、since这些注解，所以在生成文档的时候就会体现这些内容。

### 代码示例

```java
/**
 * 注解javadoc演示
 *
 * @author test
 * @version 1.0
 * @since 1.5
 */
public class AnnoDemo1 {

    /**
     * 计算两数的和
     * @param a 整数
     * @param b 整数
     * @return 两数的和
     */
    public int add(int a, int b ){
        return a + b;
    }
}
```

### 生成文档示例

使用`javadoc`命令进行文档生成

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201018222438464.png#pic_center)

可以看到生成的类文档的作者、版本等都是我们注解后面编写的值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020101822250365.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NoYXJrX2NoaWxpMzAwNw==,size_16,color_FFFFFF,t_70#pic_center)

## 代码分析

使用反射完成基于代码里标识的注解对代码进行分析，后文我们会对此展开详细介绍。

## 编译检查

通过代码里标识的注解让编译器能够实现基本的编译检查【Override】

# java内置的三大注解

## @Override

源码如下所示，可以看到元注解有`target`和`retenion`，其中`retention`为`source`，即在编译时检查当前子类重写的方法在父类中是否存在，如果存在则编译通过，反之。

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

## @Deprecated

这个注解常用于提醒开发被加上注解的玩意已经不推荐使用了

该注解用于提醒开发被加上注解的方法不推荐使用了。

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {
}
```

## @SuppressWarnings

压制程序中某些警告。

```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {

    String[] value();
}
```

# 元注解(用于描述注解的注解)

## @Target：描述注解能够作用的位置

```java
        * ElementType取值：
            * TYPE：可以作用于类上
            * METHOD：可以作用于方法上
            * FIELD：可以作用于成员变量上
```

如下注解 只可作用于类和字段上，在函数上则会报错

```java
@Target({ElementType.TYPE,ElementType.FIELD})
public @interface MyAnno3 {
}

```

如下所示，我们将Target在字段上的注解用在方法上就报错了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201018225206354.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NoYXJrX2NoaWxpMzAwNw==,size_16,color_FFFFFF,t_70#pic_center)

## @Retention

描述注解被保留的阶段 @Retention(RetentionPolicy.RUNTIME)：当前被描述的注解，会保留到class字节码文件中，并被JVM读取到。

## @Documented

### 简介

描述注解是否被抽取到api文档中

### 示例

#### 自定义注解Myanno3

如下代码，Myanno3加入注解@Documented后，worker类使用该Myanno3注解，当使用worker生成文档后该注解会被显示在使用注解的类、函数、字段上

```java
import java.lang.annotation.*;

/**

 元注解：用于描述注解的注解
     * @Target：描述注解能够作用的位置
     * @Retention：描述注解被保留的阶段
     * @Documented：描述注解是否被抽取到api文档中
     * @Inherited：描述注解是否被子类继承


 *
 */

@Target({ElementType.TYPE,ElementType.METHOD,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface MyAnno3 {
}

```

##### Worker上使用MyAnno注解

如下所示，可以看到我们在类、字段、方法上都用到了注解。

```java
@MyAnno(value=12,per = Person.P1,anno2 = @MyAnno2,strs="bbb",name = "李四")
@MyAnno3
public class Worker {
    @MyAnno3
    public String name = "aaa";
    @MyAnno3
    public void show(){


    }
}

```

使用javadoc命令生成文档后，可以看到该类的myAnno3的注解都存在

![在这里插入图片描述](https://img-blog.csdnimg.cn/202010182258497.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NoYXJrX2NoaWxpMzAwNw==,size_16,color_FFFFFF,t_70#pic_center)

## @Inherited

描述注解是否被子类继承

# 基于注解实现简单的测试框架

## 需求描述

我们希望自定义一个注解check，每个增加check的我们都会通过反射获取，如果计算保存则假如统计文本中。

## 代码示例

### 首先定义check注解

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Check {
}

```

## 需要测试的类代码

```java
public class Calculator {

    //加法
    @Check
    public void add() {
        String str = null;
        str.toString();
        System.out.println("1 + 0 =" + (1 + 0));
    }


    //减法
    @Check
    public void sub() {
        System.out.println("1 - 0 =" + (1 - 0));
    }

    //乘法
    @Check
    public void mul() {
        System.out.println("1 * 0 =" + (1 * 0));
    }

    //除法
    @Check
    public void div() {
        System.out.println("1 / 0 =" + (1 / 0));
    }


    public void show() {
        System.out.println("永无bug...");
    }

}


```

## 测试类

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class CheckUtil {


    public static void main(String[] args) throws IOException {
        Calculator calculator = new Calculator();
        Class<? extends Calculator> clzz = calculator.getClass();
        Method[] methods = clzz.getMethods();

        String methodName = null;


        int errCount = 0;
        BufferedWriter writer = new BufferedWriter(new FileWriter("err.log"));
        for (Method method : methods) {
            methodName = method.getName();
            if (method.isAnnotationPresent(Check.class)) {
                try {
                    method.invoke(calculator);
                } catch (Exception e) {
                    String msg = String.format("出错了，第%d个错误，方法名:%s,错误原因:%s", ++errCount, methodName, e.getCause().getMessage());
                    System.out.println(msg);
                    writer.write(msg);
                    writer.newLine();
                }
            }
        }

        writer.flush();
        writer.close();


    }
}

```

输出结果

```
出错了，第1个错误，方法名:add,错误原因:null
出错了，第2个错误，方法名:div,错误原因:/ by zero

```

# 注解的本质

聊到注解的本质，其实最简单的方法就是反编译看看实质，代码如下所示：

```
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Foo{
    String[] value();
    boolean bar();
}
```

使用以下命令完成编译生成字节码还反编译为java文件

```
 javac Foo.java

 javap -c Foo.class
```

我们就可以得出如下一段输出，可以看到看注解的本质就是一个接口。

```
Compiled from "Foo.java"
public interface edu.zhku.mjx.interview.javaBase.annotation.Foo extends java.lang.annotation.Annotation {
public abstract java.lang.String[] value();

public abstract boolean bar();
}
```

# 注解与反射的关系与简单实践

其实我们在日常使用Spring框架时经常会用到注解，例如Service("userSerivice"),那么请问Spring是如何通过注解拿到这个bean的值的呢？ 我们不妨自定义一个注解来实验这个问题，首先我们自定义一个service

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Service {
    String value();
    String scope();
}
```

然后我们编写如下一段代码，并在idea的vim option键入这一一段jvm命令`-Dsun.misc.ProxyGenerator.saveGeneratedFiles=true`

```
@Service(value = "userService", scope = "singleton")
public class Test {


    public static void main(String[] args) throws Exception{
        Service service = Test.class.getAnnotation(Service.class);
        System.out.println(service.value());
        System.out.println(service.scope());

    }
}
```

可以看到会输出userService，在查看项目文件中会出现下图这样一个文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/892ca38e02a74d81907e5ea45da49845.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc2hhcmtf6L6j5qSS,size_20,color_FFFFFF,t_70,g_se,x_16)

查看$Proxy1.class源码，我们可以看到这样一段代码，可以看到这两个变量`Class.forName("edu.zhku.mjx.interview.javaBase.annotation.Service").getMethod("scope")`、`Class.forName("edu.zhku.mjx.interview.javaBase.annotation.Service").getMethod("value")`不就是我们注解中定义的值吗？然后我们再找找他的调用处

```
  static {
        try {

    m4 =Class.forName("edu.zhku.mjx.interview.javaBase.annotation.Service").getMethod("scope");
    m3 = Class.forName("edu.zhku.mjx.interview.javaBase.annotation.Service").getMethod("value");



        } catch (NoSuchMethodException var2) {
            throw new NoSuchMethodError(var2.getMessage());
        } catch (ClassNotFoundException var3) {
            throw new NoClassDefFoundError(var3.getMessage());
        }
    }
```

以scope为例，我们看到了这样一段代码，不难看出我们之前调用的Service.scope()就是使用这个方法。这里有个invoke，我们点进去看看调用

```
public final String scope() throws  {
        try {
            return (String)super.h.invoke(this, m4, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }
```

这时候我们看到一个接口，没有看到具体实现，没关系，源码的设计者命名永远是合理的，所以，我们完完全全可以通过查找与注解命名相关的继承类

![在这里插入图片描述](https://img-blog.csdnimg.cn/f99ebea13de7496b88ba3291df26ea8a.png)

这时候笔者就发现了这个

![在这里插入图片描述](https://img-blog.csdnimg.cn/00d0798d837b4f3e8878d69e8b212904.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc2hhcmtf6L6j5qSS,size_20,color_FFFFFF,t_70,g_se,x_16)

具体实现源码如下，关键笔者都在代码中注释了

```
public Object invoke(Object var1, Method var2, Object[] var3) {
//var2就是上一步传入的scope
        String var4 = var2.getName();
        Class[] var5 = var2.getParameterTypes();
        if (var4.equals("equals") && var5.length == 1 && var5[0] == Object.class) {
            return this.equalsImpl(var3[0]);
        } else if (var5.length != 0) {
            throw new AssertionError("Too many parameters for an annotation method");
        } else {
            byte var7 = -1;
            switch(var4.hashCode()) {
            case -1776922004:
                if (var4.equals("toString")) {
                    var7 = 0;
                }
                break;
            case 147696667:
                if (var4.equals("hashCode")) {
                    var7 = 1;
                }
                break;
            case 1444986633:
                if (var4.equals("annotationType")) {
                    var7 = 2;
                }
            }
//根据var2标记var7，然后从返回响应的var值，这里scope就走最后一个分支了返回了scope的字符串
            switch(var7) {
            case 0:
                return this.toStringImpl();
            case 1:
                return this.hashCodeImpl();
            case 2:
                return this.type;
            default:
                Object var6 = this.memberValues.get(var4);
                if (var6 == null) {
                    throw new IncompleteAnnotationException(this.type, var4);
                } else if (var6 instanceof ExceptionProxy) {
                    throw ((ExceptionProxy)var6).generateException();
                } else {
                    if (var6.getClass().isArray() && Array.getLength(var6) != 0) {
                        var6 = this.cloneArray(var6);
                    }

                    return var6;
                }
            }
        }
    }
```

# 总结

1. 注解给谁用?

```
1. 编译器
2. 给解析程序用
```

1. 注解不是程序的一部分，可以理解为注解让计算机理解代码说明的一个标签

由上述的例子我们很好的理解了注解在框架中用法，他的诞生就是为了解决长期使用xml配置导致维护愈发复杂的场景，即是一种通过高耦合解决低耦合导致维护困难的最佳实践。
