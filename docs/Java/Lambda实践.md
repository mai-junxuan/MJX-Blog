# Lambda实践

## java8以前的comparator和java8的comparator

可以看到使用lambda表达式，使得对象的创建以及声明变得简单且优雅

```
//老版本的比较器声明方式
Comparator<Apple> comparator=new Comparator<Apple>() {
    @Override
    public int compare(Apple a1, Apple a2) {
        return a1.getWeight().compareTo(a2.getWeight());
    }
};
//java8的比较器的声明方式
Comparator<Apple> cmp=(a1,a2)->a1.getWeight().compareTo(a2.getWeight());
```

## lambda的优势

1. 匿名：使用lambda声明方法无需像普通方法需要很多明确的东西，它给了我们一种写得少但是想得多的优雅
2. 函数：lambda表达式用起来就和方法一样，有参数列表、函数主体、返回值等
3. 传递：lambda可以作为参数传递或者存储在变量中
4. 简洁：如上文所示的代码，使用lambda可以避免没必要的模板编写，优雅且简洁

## lambda的使用场景

### 函数式接口

在介绍lambda表达式之前我们需要先介绍一下函数式接口，因为lambda就是为缩写函数式的接口而生的。 如下图所示Runnable接口就是一个函数式接口，函数式接口的特征也很明显，他是一个接口，且有且只有一个方法。并且还有一个注解`@FunctionalInterface`,需要说明的是这个注解非必须的，他只是告知编译器这是个函数式接口而已，让编译器留点心 也正是因为方法为一，才能确保简洁的lambda表达式可以唯一确定匹配接口的方法。

![image-20220905223204749](http://rrmrwrjnu.hn-bkt.clouddn.com/202209052232783.png)

### 函数式描述符

了解了函数式接口，了解函数描述符就很简单了，以Runnable为例，他的方法是 `public abstract void run();` 所以他是一个没有参数且没有返回值的方法。 那么它的函数描述符就是`() -> void`，后续我们使用lambda表达式的时候只要遵循这个表达式即可。 再看看一个例子，这也是笔者自定义的一个函数式接口，可以看出他的入参是一个苹果类，返回值是boolean，所以它的函数描述符是**(Apple)->boolean**

```
interface ApplePredicate{
         boolean test(Apple a);
    }
ApplePredicate applePredicate=(a)->true;
```

这就是为什么我们声明ApplePredicate可以缩写成下文所示

## 使用lambda优化环绕执行模式的调用

### 需求描述
我们现在有个文件data.txt,它的内容为
```
Java
8
Lambdas
In
Action
```

我们希望编写的代码只读取第1行的结果然后返回即可

### 代码实现

可以看到这个需求实现也非常简单，如下所示

```
 public static String processFileLimited() throws IOException {
        try (BufferedReader br =
                     new BufferedReader(new FileReader("F:\\github\\src\\main\\resources\\lambdasinaction\\chap3\\data.txt"))) {
            return br.readLine();
        }
    }
```

### 项目演进

#### 需求描述

现在需求变了，我们希望能够读取两行，后续可能还会发生变化，这时候警觉的你就会发现读取文件这个行为可能多变无常，我们需要对变化进行封装

#### 声明函数式接口

所以我们将读取文件这个行为封装成一个函数式接口，代码如下所示

```
public interface BufferedReaderProcessor{
         String process(BufferedReader b) throws IOException;

    }
```

#### 修改原有方法逻辑

这时候我们在进行行为参数化，将读取文件内容这个逻辑参数化，后续我们就可以大展身手了

```
public static String processFile(BufferedReaderProcessor p) throws IOException {
        try(BufferedReader br = new BufferedReader(new FileReader("F:\\github\\Java8InAction\\src\\main\\resources\\lambdasinaction\\chap3\\data.txt"))){
            return p.process(br);
        }
    }
```

#### 调用并查看测试结果

这时候我们就可以使用lambda进行调用测试了

测试读取1行

```
//        测试读取1行 输出结果 Java
        String s = processFile(b -> b.readLine());
        System.out.println(s);
```

测试读取2行

```
//        测试读取2行 输出结果 Java 8
        String s2 = processFile(b -> b.readLine()+" "+b.readLine());
        System.out.println(s2);
```

测试读取1行并行尾加上 "本人已读"

```
        //测试读取1行并行尾加上 "本人已读" 输出结果 Java 本人已读
        String s3 = processFile(b -> b.readLine()+" 本人已读");
        System.out.println(s3);
```

## "现成的轮子" java8自带的函数式接口

### 简介

其实面对常见的行为参数化，java已经考虑到这些情况了，他也为我们提供了不少的现有轮子，下面我们就来一一介绍几个常见的轮子

### Predicate

这个接口就是针对于那些需要传入指定类型，并返回Boolean行的行为，例如：我们需要一组对字符串进行判断操作的行为，我们可以先这样写一个方法，通过Predicate将行为参数化

```
public static boolean test(String s,Predicate<String> p){
        return p.test(s);
    }
```

假如我们需要判断字符串是大于2，我们就可以这样调用

```
 boolean result = test("123", (s) -> s.length() > 12);
        System.out.println(result);
```

假如我们需要判断字符串是否为test，我们可以这样调用

```
  boolean result=test("test",(s)->"test".equals(s));
        System.out.println(result);
```

### Consumer

与上同理，Consumer的函数描述符为`(T)->void`,即传入任意类型，无返回值的操作。 例如我们现在要遍历并输出不同类型的元素，我们可以先定义一个方法，将consumer行为参数化

```
 public static <T> void   forEach(List<T> list, Consumer<T> consumer){
        for (T t : list) {
            consumer.accept(t);
        }
    } 
```

假如我们要遍历整形数组，我们可以这样

```
 List<Integer> integerList=new ArrayList<>();
        integerList.add(1);
        integerList.add(2);
        integerList.add(3);
        integerList.add(4);
        forEach(integerList,(i)-> System.out.println(i));
```

### Function

通过查看源码，function的定义如下，不难看出，它适用于那些传入T类型返回R类型的行为

```
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);

}

```

假如我们要求传入一个字符串，返回它的长度或者字符串第1位unocode码值，我们就可以使用Function做到。 首先我们定义一个方法，将返回整型的行为参数化，如下所示

```
 public static Integer StringCalculate(String s, Function<String,Integer> function){
        return function.apply(s);
    }
```

调用如下所示

```
        //获取字符串长度
        System.out.println(StringCalculate("123", (s) -> s.length()));
//        获取字符串第1位unicode
        System.out.println(StringCalculate("132", (s) -> s.codePointAt(0)));
```

### 更多函数式接口

![image-20220905223123171](http://rrmrwrjnu.hn-bkt.clouddn.com/202209052231413.png) ![在这

## lambda工作原理简析

### 类型检查

那么问题来了，lambda表达式如此精简，请问它是如何完成类型检查的呢？我们就以下面代码为例，可以看到这段代码就是根据传入的String返回相应的boolean值

```
public static <T> boolean test(T s, Predicate<T> p) {
        return p.test(s);
    }
```

假如我们这样调用

```
boolean result = test("123", (String s) -> s.length() > 12);
```

他的匹配过程就如下图所示，首先根据调用方法找到主方法，根据主方法的泛型得知入参是String，再查看predicate的唯一方法得知返回值是boolean，由此得知函数描述符为`String->boolean`,最终和调用的lambda匹配成功，校验通过 

![image-20220905222806554](http://rrmrwrjnu.hn-bkt.clouddn.com/202209052228365.png)

### 类型推断

因为函数式接口方法是唯一的，我们也可以对类型进行省略，让java编译器去自动推断类型

```
 boolean result = test("123", (s) -> s.length() > 12);
        System.out.println(result);
```

### 使用限制(使用lambda使用局部变量)

如下代码所示，这样一段代码在idea中会报红，原因很简单，局部变量分配在栈上，而r线程可能会在该变量被回收之后才使用这个变量，所以java在让线程r访问这个变量的时候，实际上访问到的num是num的副本，所以假如lambda访问变量num，再给num赋值就会爆红，因为如下所示代码若能正常执行，那么r线程最终输出的num很可能前后不一致是随机，进而导致线程安全问题。

```java
 int num=1;
 Runnable r=()-> System.out.println(num);
 r.run();
 num=2;
```