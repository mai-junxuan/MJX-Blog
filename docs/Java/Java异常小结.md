# 异常

## 概述

当程序出现问题时，将错误交给虚拟机进而停止程序执行的情况，我们称为异常。

## Exception和Error的区别

### Exception

这种错误类型程序是可以处理的，Exception包含受检异常和非受检异常，这一点我们后文会展开详细介绍。

### Error

这种错误一般都是OOM，Java虚拟机运行错误(Virtual MachineError)，或者类定义错误(NoClassDefFoundError)。我们不建议通过catch进行捕获。而是让虚拟机进行线程终止。

## 受检异常和非受检异常

### 受检异常

受检异常一般在调用时，用户就需要对其进行处理，如果不处理则不会通过编译。

例如FileInputStream，如果我们没有对其构造方法抛出的错误(即受检异常)进行处理，我们是无法通过编译的。

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252159285.png)

### 非受检异常

非受检异常一般是运行时异常，常见的有空指针异常、非法参数异常、算数异常、数组越界等。

## Throwable常用的方法有哪些

1. String getMessage():返回异常的错误的简要信息。
2. String toString():返回异常发生时的详细信息。
3. String getLocalizedMessage():返回异常本地化信息。
4. void printStackTrace():在控制台上打印堆栈追踪信息。

## 异常抛出示例

我们自定义一个受检异常

```java
public class ArithmeticException extends Exception {
    @Override
    public String getMessage() {
        return "自定义算术异常";
    }
}
```

编写一个除法的函数

```java
private int calculate(int  number,int divNum) throws ArithmeticException {
        if (divNum==0){
            throw new ArithmeticException();
        }
        return number / divNum;
    }
```

测试代码

```java
@Test
    public void calculateTest(){
        int number=20;
        try {
            int result = calculate(number,0);
            System.out.println(result);
        } catch (ArithmeticException e) {
            logger.error("calculateTest计算失败，请求参数:[{}],错误原因[{}]",number,e.getMessage(),e);
            /**
             * 输出
             * [main] ERROR com.guide.exception.ExceptionTest - calculateTest计算失败，请求参数:[20],错误原因[自定义算术异常]
             */
        }
    }
```

## try-catch运行原理

try块代码执行报错 若有catch模块catch则会对其进行捕获处理，例如我们上文捕获了ArithmeticException ，那么catch (ArithmeticException e) 实质上会做一个Exception e = new ArithmeticException()的动作，进而按照用户的想法进行错误捕获逻辑处理。

## 多异常捕获处理技巧

### 原则

1. 有几个异常就处理几个异常，如果无法处理就抛出
2. 父类exception放在最下方
3. 多异常建议使用|进行归类整理

### 代码示例

如下所示，我们自定义一个自定义错误函数

```java
private int calculate(int  number,int divNum) throws ArithmeticException,FileNotFoundException, UnknownHostException, IOException {
        if (divNum==0){
            throw new ArithmeticException();
        }
        return number / divNum;
    }
```

假定UnknownHostException 是用户配置问题，我们无法处理，那么就抛出，其他错误一一捕获，所以我们的代码可能是这样

```java
@Test
    public void calculateTest(){
        int number=20;

        int result = 0;
        try {
            result = calculate(number,0);
        } catch (ArithmeticException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e){

        }catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(result);

    }
```

实际在为了让代码更加整洁高效。生成的catch块也只是一个公共的代码块，所以我们最终的代码应该是下面这个样子

```java
@Test
    public void calculateTest()throws UnknownHostException{
        int number=20;

        int result = 0;
        try {
            result = calculate(number,0);
        } catch (ArithmeticException|FileNotFoundException e) {
            logger.error("calculateTest执行报错，用户执行出错或者文件数据获取失败，请求参数[{}],错误信息[{}]",number,e.getMessage(),e);
        } catch (IOException e) {
            logger.error("calculateTest执行报错，文件操作异常，请求参数[{}],错误信息[{}]",number,e.getMessage(),e);
        }catch (Exception e){
            logger.error("calculateTest执行报错，请求参数[{}],错误信息[{}]",number,e.getMessage(),e);

        }
        System.out.println(result);

    }

```

### 注意事项

使用|运算符之后e会变为final变量，用户无法改变引用的指向

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252159071.png)

## throw于throws的区别

1. throws放在函数上，throw放在函数内
2. throws可以跟多个错误类，throw只能跟单个异常对象

## 特殊的异常对象 RuntimeException

### 概述

使用runtime异常类时，在函数内throw则函数上不用throws，编译可以正常通过

### 代码范例

如下代码，即使没有`throws ArithmeticException`(ArithmeticException为runtime的子类)，编译照样通过

```java
class Demo
{
    int div(int a,int b)throws Exception//throws ArithmeticException
    {

        if(b<0)
            throw new Exception("出现了除数为负数了");
        if(b==0)
            throw new ArithmeticException("被零除啦");
        return a/b;
    }
}
```

### 原因

在程序运行时，正常的exception必须在函数上throws 错误，让开发人员进行异常修复，但是runtime异常比较特殊，他编译时不检测函数是否又throws，这样做的目的就是有意让开发者不知道这一错误，让错误在运行时暴露，由开发人员修正代码来规范程序。

# java异常层次结构

java异常层次结构如下图所示

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252159098.png)

# finally关键字

finally无论异常是否执行，在try块结束后必定会运行的，需要注意的是如果程序出现异常，finally中有return语句的话，catch块的return将没有任何作用，代码如下所示

```java
public static int func() {
        try {
            int i = 1 / 0;
        } catch (Exception e) {
            return 2;
        } finally {
            return 1;
        }
    }
```

## finally常规用法(资源释放)

```java
//读取文本文件的内容
        Scanner scanner = null;
        try {
            scanner = new Scanner(new File("D://read.txt"));
            while (scanner.hasNext()) {
                System.out.println(scanner.nextLine());
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (scanner != null) {
                scanner.close();
            }
        }
```

## try-with-resources——优雅解决方案

可以看到上述代码十分冗长，可读性十分差劲，于是java对这种做法做了相应改进，如下所示，对于继承Closeable、AutoCloseable的类都可以使用以下语法完成资源加载和释放

```java
 try (Scanner scanner = new Scanner(new File("D://read.txt"))) {
            while (scanner.hasNext()) {
                System.out.println(scanner.nextLine());
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
```

## finally 中的代码一定会执行吗

不一定，如下代码所示，当虚拟机执行退出的话，finally是不会被执行的

```java
@Test
    public void finallyNoRun() {
        try {
            System.out.println("try code run.....");
            System.exit(0);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("finally run...");
        }

        /**
         * 输出结果
         * try code run.....
         */
    }
```

# 异常使用注意事项

## 不要在finnally中使用return

函数执行的try块返回值会被缓存的本地变量中，当finally进行return操作就会覆盖这个本地变量

```java
@Test
    public void finallyReturnTest() {
        System.out.println(finallyReturnFun());
        /**
         * 输出结果
         * finallyReturnVal
         * 原因:try块的return会被缓存在本地变量中，
         * 当finally有return时，会覆盖这个结果
         */
    }

    private String finallyReturnFun() {
        try {
            int ten = 10;
            return "tryRetunVal";
        } catch (Exception e) {
            System.out.println("报错了。。。。");
        } finally {
            return "finallyReturnVal";
        }

    }
```

## 异常不处理就抛出

捕获异常是为了处理它，不要捕获了却什么都不处理而抛弃之，如果不想处理它，请 将该异常抛给它的调用者。最外层的业务使用者，必须处理异常，将其转化为用户可以理解的内容。

### 代码示例

自定义一个异常

```java
public class MyIllegalArgumentException extends Exception {

    public MyIllegalArgumentException(String msg) {
        super(msg);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
```

### 测试代码

```java
 @Test
    public void checkTest() {
        String param = null;
        try {
            check(null);
        } catch (MyIllegalArgumentException e) {

            logger.info("参数校验异常，请求参数[{}],错误信息[{}]", param, e.getMessage(), e);
            /**
             * [main] INFO com.guide.exception.ExceptionTest - 参数校验异常，请求参数[null],错误信息[字符串不可为空]
             */
        }
    }


    private void check(String str) throws MyIllegalArgumentException {
        if (str == null || str.length() <= 0) {
            throw new MyIllegalArgumentException("字符串不可为空");
        }
    }
```

## try块代码使用粒度和性能探讨

1. try-catch阻止jvm试图进行的优化，所以当我们要使用try块时，使用的粒度尽可能要小一些。
2. 现代标准遍历模式并不会导致冗余检查，所以我们无需为了避免越界检查而使用try块解决问题

```java
/**
     * 异常捕获后不要用来做流程控制，条件控制。
     * try catch 阻止了jvm原本会对其做的优化工作
     */
    @Test
    public void stackPopByCatch() {
        long start = System.currentTimeMillis();
        try {
            Stack stack = new Stack();
            for (int i = 0; i < 100_0000; i++) {
                stack.push(i);
            }
            while (true) {
                try {
                    stack.pop();
                } catch (Exception e) {
                    System.out.println("出栈结束");
                    break;
                }
            }
        } catch (Exception e) {

        }


        long end = System.currentTimeMillis();
        System.out.println("使用try进行异常捕获，执行时间:" + (end - start));


        start = System.currentTimeMillis();
        Stack stack2 = new Stack();
        for (int i = 0; i < 100_0000; i++) {
            stack2.push(i);

        }
        for (int i = 0; i < stack2.size(); i++) {
            stack2.pop();
        }
        end = System.currentTimeMillis();
        System.out.println("使用逻辑进行出栈操作，执行时间:" + (end - start));

        /**
         * 输出结果
         * 出栈结束
         * 使用try进行异常捕获，执行时间:94
         * 使用逻辑进行出栈操作，执行时间:52
         */
    }
```

## 日志打印规范

1. 不要使用JSON工具，因为某些get方法可能会抛出异常
2. 记录参数，错误信息，堆栈信息

```java
/**
     * 打印日志格式规范
     */
    @Test
    public void logShowTest() {
        Map inputParam = new JSONObject().fluentPut("key", "value");
        try {
            logShow(inputParam);
        } catch (ArithmeticException e) {
            logger.error("inputParam:{} ,errorMessage:{}", inputParam.toString(), e.getMessage(), e);
            /**
             * [main] ERROR com.guide.exception.ExceptionTest - inputParam:{"key":"value"} ,errorMessage:自定义算术异常
             * com.guide.exception.ArithmeticException: 自定义算术异常
             *     at com.guide.exception.ExceptionTest.logShow(ExceptionTest.java:166)
             */
        }
    }


    private int logShow(Map inputParam) throws ArithmeticException {
        int zero = 0;
        if (zero==0){
           throw new ArithmeticException();
        }
        return 19 / zero;
    }
```

# 异常是否耗时？为什么会耗时？

如下代码所示，可以看到频繁抛出和捕获对象是非常耗时的，所以我们不建议使用异常来作为处理逻辑，我们完全可以和前端协商好错误码从而避免没必要的性能开销

```java
private int testTimes;

    public ExceptionTest(int testTimes) {
        this.testTimes = testTimes;
    }

    public void newObject() {
        long l = System.currentTimeMillis();
        for (int i = 0; i < testTimes; i++) {
            new Object();
        }
        System.out.println("建立对象：" + (System.currentTimeMillis() - l));
    }

    public void newException() {
        long l = System.currentTimeMillis();
        for (int i = 0; i < testTimes; i++) {
            new Exception();
        }
        System.out.println("建立异常对象：" + (System.currentTimeMillis() - l));
    }

    public void catchException() {
        long l = System.currentTimeMillis();
        for (int i = 0; i < testTimes; i++) {
            try {
                throw new Exception();
            } catch (Exception e) {
            }
        }
        System.out.println("建立、抛出并接住异常对象：" + (System.currentTimeMillis() - l));
    }

    public void catchObj() {
        long l = System.currentTimeMillis();
        for (int i = 0; i < testTimes; i++) {
            try {
                new Object();
            } catch (Exception e) {
            }
        }
        System.out.println("建立,普通对象并catch：" + (System.currentTimeMillis() - l));
    }

    public static void main(String[] args) {
        ExceptionTest test = new ExceptionTest(100_0000);
        test.newObject();
        test.newException();
        test.catchException();
        test.catchObj();
        /**
         * 输出结果
         * 建立对象：3
         * 建立异常对象：484
         * 建立、抛出并接住异常对象：539
         * 建立,普通对象并catch：3
         */
    }
```
