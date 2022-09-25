# 概述

都说反射是各种框架的灵魂，就想Spring等框架需要获取注解上的bean名称等都会用到反射这个技术，所以我们不妨基于这篇文章来简单再复习一下反射。

# Class类简介

每一个类都只会有一个Class对象，如下代码所示，他们都得得到一个true，这是为什么呢？ 实际上jvm在加载每个类时都会为每个类通过类加载器中的`defineClass` 去创建一个Class对象，而且只创建一次，所以后续我们无论通过何种方式获取到的某个类的Class对象都是一样的。

```java
/**
 * 获取Class对象的三种方式
 * 1 Object ——> getClass();
 * 2 任何数据类型（包括基本数据类型）都有一个“静态”的class属性
 * 3 通过Class类的静态方法：forName（String  className）(常用)
 *
 */
public class FansheConstruct {
    public static void main(String[] args) {
        //第一种方式获取Class对象
        StudentConstruct stu1 = new StudentConstruct();//这一new 产生一个Student对象，一个Class对象。
        Class stuClass = stu1.getClass();//获取Class对象
        System.out.println(stuClass.getName());

        //第二种方式获取Class对象
        Class stuClass2 = StudentConstruct.class;
        System.out.println(stuClass == stuClass2);//判断第一种方式获取的Class对象和第二种方式获取的是否是同一个

        //第三种方式获取Class对象
        try {
            Class stuClass3 = Class.forName("edu.zhku.mjx.interview.javaBase.refect.StudentConstruct");//注意此字符串必须是真实路径，就是带包名的类路径，包名.类名
            System.out.println(stuClass3 == stuClass2);//判断三种方式是否获取的是同一个Class对象
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

    }
}
```

输出结果

```java
调用了公有、无参构造方法执行了。。。
edu.zhku.mjx.interview.javaBase.refect.StudentConstruct
true
true
```

# 几个反射的示例

## 通过反射获取构造方法

### 基础学生类

```java
public class Student {

    //---------------构造方法-------------------
    //（默认的构造方法）
    Student(String str){
        System.out.println("(默认)的构造方法 s = " + str);
    }

    //无参构造方法
    public Student(){
        System.out.println("调用了公有、无参构造方法执行了。。。");
    }

    //有一个参数的构造方法
    public Student(char name){
        System.out.println("姓名：" + name);
    }

    //有多个参数的构造方法
    public Student(String name ,int age){
        System.out.println("姓名："+name+"年龄："+ age);//这的执行效率有问题，以后解决。
    }

    //受保护的构造方法
    protected Student(boolean n){
        System.out.println("受保护的构造方法 n = " + n);
    }

    //私有构造方法
    private Student(int age){
        System.out.println("私有的构造方法   年龄："+ age);
    }

}
```

### 通过反射获取构造方法

几个获取构造方法的方式介绍

```java
          1. public Constructor[] getConstructors()：所有"公有的"构造方法
        2. public Constructor[] getDeclaredConstructors()：获取所有的构造方法(包括私有、受保护、默认、公有)
          3. public Constructor getConstructor(Class... parameterTypes):获取单个的"公有的"构造方法：
          4. public Constructor getDeclaredConstructor(Class... parameterTypes):获取"某个构造方法"可以是私有的，或受保护、默认、公有；
```

代码示例

```java
public class Constructors {

    public static void main(String[] args) throws Exception {
        //1.加载Class对象
        Class clazz = Class.forName("com.guide.reflect.Student");


        //2.获取所有公有构造方法
        System.out.println("**********************所有公有构造方法*********************************");
        Constructor[] conArray = clazz.getConstructors();
        for(Constructor c : conArray){
            System.out.println(c);
        }


        System.out.println("************所有的构造方法(包括：私有、受保护、默认、公有)***************");
        conArray = clazz.getDeclaredConstructors();
        for(Constructor c : conArray){
            System.out.println(c);
        }

        System.out.println("*****************获取公有、无参的构造方法*******************************");
        Constructor con = clazz.getConstructor(null);
        //1>、因为是无参的构造方法所以类型是一个null,不写也可以：这里需要的是一个参数的类型，切记是类型
        //2>、返回的是描述这个无参构造函数的类对象。

        System.out.println("con = " + con);
        //调用构造方法
        Object obj = con.newInstance();
        //    System.out.println("obj = " + obj);
        //    Student stu = (Student)obj;

        System.out.println("******************获取私有构造方法，并调用*******************************");
        con = clazz.getDeclaredConstructor(char.class);
        System.out.println(con);
        //调用构造方法
        con.setAccessible(true);//暴力访问(忽略掉访问修饰符)
        obj = con.newInstance('男');
    }

}
```

输出结果

```java
**********************所有公有构造方法*********************************
public com.guide.reflect.Student(java.lang.String,int)
public com.guide.reflect.Student(char)
public com.guide.reflect.Student()
************所有的构造方法(包括：私有、受保护、默认、公有)***************
private com.guide.reflect.Student(int)
protected com.guide.reflect.Student(boolean)
public com.guide.reflect.Student(java.lang.String,int)
public com.guide.reflect.Student(char)
public com.guide.reflect.Student()
com.guide.reflect.Student(java.lang.String)
*****************获取公有、无参的构造方法*******************************
con = public com.guide.reflect.Student()
调用了公有、无参构造方法执行了。。。
******************获取私有构造方法，并调用*******************************
public com.guide.reflect.Student(char)
姓名：男
```

## 通过反射获取成员变量

```java
public class StudentField {
    public StudentField(){

    }
    //**********字段*************//
    public String name;

    protected int age;

    char sex;

    private String phoneNum;

    @Override
    public String toString() {
        return "Student [name=" + name + ", age=" + age + ", sex=" + sex
                + ", phoneNum=" + phoneNum + "]";
    }

}


import java.lang.reflect.Field;

public class GetFields {
    public static void main(String[] args) throws Exception {
        //1.获取Class对象
        Class stuClass = Class.forName("edu.zhku.mjx.interview.javaBase.refect.StudentField");
        //2.获取字段
        System.out.println("************获取所有公有的字段********************");
        Field[] fieldArray = stuClass.getFields();
        for(Field f : fieldArray){
            System.out.println(f);
        }
        System.out.println("************获取所有的字段(包括私有、受保护、默认的)********************");
        fieldArray = stuClass.getDeclaredFields();
        for(Field f : fieldArray){
            System.out.println(f);
        }
        System.out.println("*************获取公有字段**并调用***********************************");
        Field f = stuClass.getField("name");
        System.out.println(f);
        //获取一个对象
        Object obj = stuClass.getConstructor().newInstance();//产生Student对象--》Student stu = new Student();
        //为字段设置值
        f.set(obj, "刘德华");//为Student对象中的name属性赋值--》stu.name = "刘德华"
        //验证
        StudentField stu = (StudentField)obj;
        System.out.println("验证姓名：" + stu.name);


        System.out.println("**************获取私有字段****并调用********************************");
        f = stuClass.getDeclaredField("phoneNum");
        System.out.println(f);
        f.setAccessible(true);//暴力反射，解除私有限定
        f.set(obj, "18888889999");
        System.out.println("验证电话：" + stu);


        f = stuClass.getDeclaredField("age");
        System.out.println(f);
        f.setAccessible(true);//暴力反射，解除私有限定
        f.set(obj, 18);
        System.out.println("验证保护变量年龄：" + stu);

    }

}

```

## 通过反射获取方法

```java


public class StudentMethod {

    //**************成员方法***************//
    public void show1(String s){
        System.out.println("调用了：公有的，String参数的show1(): s = " + s);
    }
    protected void show2(){
        System.out.println("调用了：受保护的，无参的show2()");
    }
    void show3(){
        System.out.println("调用了：默认的，无参的show3()");
    }
    private String show4(int age){
        System.out.println("调用了，私有的，并且有返回值的，int参数的show4(): age = " + age);
        return "abcd";
    }

}



import java.lang.reflect.Method;

public class GetMethod {

    public static void main(String[] args) throws Exception {
        //1.获取Class对象
        Class stuClass = Class.forName("edu.zhku.mjx.interview.javaBase.refect.StudentMethod");
        //2.获取所有公有方法
        System.out.println("***************获取所有的”公有“方法*******************");
        Method[] methodArray = stuClass.getMethods();
        for(Method m : methodArray){
            System.out.println(m);
        }
        System.out.println("***************获取所有的方法，包括私有的*******************");
        methodArray = stuClass.getDeclaredMethods();
        for(Method m : methodArray){
            System.out.println(m);
        }
        System.out.println("***************获取公有的show1()方法*******************");
        Method m = stuClass.getMethod("show1", String.class);
        System.out.println(m);
        //实例化一个Student对象
        Object obj = stuClass.getConstructor().newInstance();
        m.invoke(obj, "刘德华");

        System.out.println("***************获取私有的show4()方法******************");
        m = stuClass.getDeclaredMethod("show4", int.class);
        System.out.println(m);
        m.setAccessible(true);//解除私有限定
        Object result = m.invoke(obj, 20);//需要两个参数，一个是要调用的对象（获取有反射），一个是实参
        System.out.println("返回值：" + result);

        System.out.println("***************获取私有的show3()方法******************");
        m = stuClass.getDeclaredMethod("show3");
        System.out.println(m);
        m.setAccessible(true);//解除私有限定
        Object result2 = m.invoke(obj);
        System.out.println("返回值：" + result2);


    }

}

```

## 一个有趣的实验，通过反射调用main

```java
public class StudentMain {
    public static void main(String[] args) {
        System.out.println("main方法执行了。。。");
    }
}



import java.lang.reflect.Method;

public class GetMain {

    public static void main(String[] args) {
        try {
            //1、获取Student对象的字节码
            Class clazz = Class.forName("edu.zhku.mjx.interview.javaBase.refect.StudentMain");

            //2、获取main方法
            Method methodMain = clazz.getMethod("main", String[].class);//第一个参数：方法名称，第二个参数：方法形参的类型，
            //3、调用main方法
            // methodMain.invoke(null, new String[]{"a","b","c"});
            //第一个参数，对象类型，因为方法是static静态的，所以为null可以，第二个参数是String数组，这里要注意在jdk1.4时是数组，jdk1.5之后是可变参数
            //这里拆的时候将  new String[]{"a","b","c"} 拆成3个对象。。。所以需要将它强转。
            methodMain.invoke(null, (Object)new String[]{"a","b","c"});//方式一
            // methodMain.invoke(null, new Object[]{new String[]{"a","b","c"}});//方式二

        } catch (Exception e) {
            e.printStackTrace();
        }


    }

}

```

## 比较实用的示例，通过反射完成泛型擦除

我们都知道java是一门伪泛型语言，泛型仅仅是在编译器会进行检查，一旦过了编译泛型就会被擦除，所以假如某些情况下我们不能修改某个类的泛型，且需要为这个为这个指定泛型的变量赋一个非泛型的值时，我们就可以使用反射技术，如下所示：

```java
public class ModifyGenerics {
    public static void main(String[] args) throws Exception {

        ArrayList<String> strList = new ArrayList<>();
        strList.add("aaa");
        strList.add("bbb");

        //    strList.add(100);
        //获取ArrayList的Class对象，反向的调用add()方法，添加数据
        Class listClass = strList.getClass(); //得到 strList 对象的字节码 对象
        //获取add()方法
        Method m = listClass.getMethod("add", Object.class);
        //调用add()方法
        m.invoke(strList, 100);

        //遍历集合
        for (Object obj : strList) {
            System.out.println(obj);
        }

    }
}
```

# 反射的工作原理

要了解Class类我们必须了解一下jvm的工作机制，当你通过一个new创建一个对象时，它实际的工作如下图所示，即jvm会去加载经过编译后生成的class文件，然后创建一个Class对象，并将其放至内存中。然后在堆区创建对象。 而反射的工作原理也很简单，它也只是将jvm通过`defClass`生成的Class对象取出来，拿到该类的所有信息，然后创建对象的一个过程。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252156804.png)

# 总结反射的优缺点

## 优点

运行期动态加载，提高代码的灵活度

## 缺点

反射实质上就是一堆解释操作，即通知jvm做各种操作，这远远比运行机器码要慢得多。这正是为什么effect java中要求我们接口优于反射

> 1.你失去了编译时类型检查的所有好处， 包括异常检查。如果一个程序试图反射性地调用一个不存在的或不可访问的方法，它将在运行时失败，除非你采取了特殊的预防措施。 2.执行反射访问所需的代码既笨拙又冗长。 写起来很乏味，读起来也很困难。 3.性能降低。 反射方法调用比普通方法调用慢得多。到底慢了多少还很难说，因为有很多因素在起作用。在我的机器上，调用一个没有输入参数和返回 int 类型的方法时，用反射执行要慢 11 倍。

# 代理模式(反射常见用处)

## 简介

代理模式是一种很常见的设计模式，即通过各种方式实现对被代理对象的增强，在完成被代理对象功能被扩展的情况下，又可以保证访问代理的人和被代理人之间的解耦。

## 两种代理模式

### 静态代理

静态代理说起来很简单，他就是通过编码的形式，将被代理对象以成员变量的形式出现在代理对象中。从jvm的角度来看，之所以我们叫他静态代理，正是因为他会在编译的时候，将上述的一个个类编译成一个个的class文件。代码如下所示：

```java
/**
 * 通过接口抽象代理类和被代理类的动作
 */
public interface SmsService {
    String send(String message);
}
/**
 * 被代理类
 */
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}

/**
 * 代理类
 */
public class SmsProxy implements SmsService {

    /**
     * 通过关联关系将被代理对象以成员变量形式组合到代理类中
     */
    private final SmsService smsService;

    public SmsProxy(SmsService smsService) {
        this.smsService = smsService;
    }

    @Override
    public String send(String message) {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method send()");
        smsService.send(message);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method send()");
        return null;
    }
}
/**
 * 运行代码
 */
public class StaticMain {

    public static void main(String[] args) {
        SmsService smsService = new SmsServiceImpl();
        SmsProxy smsProxy = new SmsProxy(smsService);
        smsProxy.send("java");
    }


}
```

### 动态代理模式

相比与静态代理，动态代理则相对灵活一些，它可以在运行时候动态的生成被代理类的字节码并加载到jvm中，而且与静态代理相比它无需创建接口类去规范代理类的方法(如果被代理类没有实现接口完全可以使用CGLIB来实现)。

#### 基于jdk实现的动态代理模式的实现(用到了本文的反射)

```java
public interface SmsService {
    String send(String message);
}


public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}




import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 通过jdk代理增强被代理方法
 */
public class DebugInvocationHandler implements InvocationHandler {
    /**
     * 代理类中的真实对象
     */
    private final Object target;

    public DebugInvocationHandler(Object target) {
        this.target = target;
    }


    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object result = method.invoke(target, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return result;
    }
}





import java.lang.reflect.Proxy;

/**
 * jdk代理类 可以看到Obj对象类型任意，真正实现了代码解耦
 */
public class JdkProxyFactory {
    public static Object getProxy(Object target) {
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(), // 目标类的类加载
                target.getClass().getInterfaces(),  // 代理需要实现的接口，可指定多个
                new DebugInvocationHandler(target)   // 代理对象对应的自定义 InvocationHandler
        );
    }
}




public class Main {
    public static void main(String[] args) {
        SmsService smsService = (SmsService) JdkProxyFactory.getProxy(new SmsServiceImpl());
        smsService.send("java");

    }
}

```

#### 基于CGLIB实现代理模式(同样用到了反射技术)

需要补充的是cglib是动态生成代理对象，所以无法为final或者private方法进行处理

```java


/**
 * 需要被代理的类
 */
public class AliSmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}



import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
 * 自定义MethodInterceptor
 */
public class DebugMethodInterceptor implements MethodInterceptor {


    /**
     * @param o           代理对象（增强的对象）
     * @param method      被拦截的方法（需要增强的方法）
     * @param args        方法入参
     * @param methodProxy 用于调用原始方法
     */
    @Override
    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object object = methodProxy.invokeSuper(o, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return object;
    }

}



import net.sf.cglib.proxy.Enhancer;

/**
 * 代理类
 */
public class CglibProxyFactory {

    public static Object getProxy(Class<?> clazz) {
        // 创建动态代理增强类
        Enhancer enhancer = new Enhancer();
        // 设置类加载器
        enhancer.setClassLoader(clazz.getClassLoader());
        // 设置被代理类
        enhancer.setSuperclass(clazz);
        // 设置方法拦截器
        enhancer.setCallback(new DebugMethodInterceptor());
        // 创建代理类
        return enhancer.create();
    }
}




public class Main {
    public static void main(String[] args) {
        AliSmsService aliSmsService = (AliSmsService) CglibProxyFactory.getProxy(AliSmsService.class);
        aliSmsService.send("java");

    }
}

```

#### 小结动态代理

在《精通spring4.x》一书中，我们可以知道，jdk生成的代理对象性能远远差于cglib生成代理对象，但cglib创建代理对象花费的时间却远远高于jdk代理创建的对象。所以在spring框架的使用中，如果是单例的bean需要实现aop等操作，我们建议是使用cglib动态代理技术。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252156031.png)
