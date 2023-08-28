# Arthas使用小结

## 前言

可能由于日常开发的不注意，所以项目部署到生产环境时不时会出现一些奇奇怪怪的问题，这时候我们就需要一款便捷且轻量的工具监控并排查问题。

这时候我们就不得不提一下Arthas,Arthas是一款强大的开源Java诊断程序，它可以非常方便的启动并以界面式的方式和Java程序进行交互,支持监控程序的内存使用情况、线程信息、gc情况、甚至可以反编译并修改现上代码等。

如下图，arthas的运行原理大致是以下几个步骤:

1. 启动arthas选择目标Java程序后，artahs会向目标程序注入一个代理。
2. 代理会创建一个集HTTP和Telnet的服务器与客户端建立连接。
3. 客户端与服务端建立连接。
4. 后续客户端需要监控或者调整程序都可以通过服务端Java Instrumentation机制和应用程序产生交互。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913847.png)

为了让读者可以快速了并熟练掌握Arhtas的基本使用，笔者就以几个比较常见的例子来演示一下Arthas的日常使用的常规套路。

## 实践

### 快速开始

在介绍几个典型的案例之前，我们需要先下载一下Arthas，并了解Arthas的一些简单的使用方式(注意:笔者为了方便演示所用的环境都是基于win 10，对于Linux环境而言操作也差不多)，Arthas的官方地址如下:

[https://arthas.aliyun.com/(opens new window)](https://arthas.aliyun.com/)

考虑到方便笔者一般是使用命令行的方式下载:

```bash
curl -O https://arthas.aliyun.com/arthas-boot.jar
```

完成后我们通过下面这个命令就可以将Arthas启动了。

```bash
java -jar arthas-boot.jar
```

可以看到刚刚进入界面时，Arthas就会分别为每个服务器中正在运行的Java程序标上序号，我们只需输入对应序号并点击回车即可进行对目标程序的监控，为了演示笔者任意选择一个2，并点击回车。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913853.png)

随后我们就进入的交互界面，如下图:

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913034.png)

Arthas最常用的监控指令就是dashboard，对于dashboard的使用说明，我们可以像使用Linux一下在dashboard命令后面追加一个--help。

如下图所示，可以看出dashboard的用法大抵是这样的:

1. 默认参数都不加，每隔5s刷新一次面板。
2. -i 指定刷新面板间隔。
3. -n 指定刷新次数。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913798.png)

所以假如我们希望每10s刷新一次，重复执行3次的指令就是:

```bash
dashboard -i 10000 -n 3
```

此时面板就会每隔10s刷新一次界面，监控界面如下图所示，从图中不难看出dashboard大抵范围3个板块:

1. 线程信息版块，对应的列名分别是:id、线程名、所属线程组、优先级、线程运行状态、cpu使用率、延迟时间、运行时间、是否被打断。
2. 内存使用版块，大体都是记录着各代内存和gc情况。
3. 服务器运行参数版块，这一版块记录着程序当前运行服务器的内核版本信息、jdk版本等。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913509.png)

在Arthas中，如果我们希望退出dashboard直接按ctrl+c即可，如果我们希望退出当前Java程序的交互界面，输入exit即可。

### 定位CPU 100%问题

CPU 100%问题算是生产环境下最难排查的问题了，在没有Arthas之前，我们常规的排查思路大致为:

1. 使用top确定是否为java进程。
2. 如果是，则使用jps定位Java进程号。
3. 找到最吃资源的线程号。
4. 将线程号转为十六进制。
5. 通过jstack导出日志并使用全局搜索十六进制线程号定位到问题代码段。

如上所述，是不是很繁琐呢？有了Arthas之后，问题的定位就会简单快速许多，为了演示这个例子，笔者使用Spring Boot项目编写了一段模拟CPU 100%问题的代码段，可以看到笔者使用

```java
/**
     * 一个线程数只有1的线程池
     */
    private static ExecutorService threadPool = Executors.newCachedThreadPool();


    @RequestMapping("cpu-100")
    public static void cpu() {
        loopThread();
        cpuHigh();
    }

    /**
     * 极度消耗CPU的线程
     */
    private static void cpuHigh() {

        // 添加到线程
        threadPool.submit(() -> {
            while (true) {
                log.info("cpu working");
            }
        });


    }


    /**
     * 无限循环的线程
     */
    private static void loopThread() {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                while (true) {
                    log.info("死循环线程工作中");
                    try {
                        Thread.sleep(3000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }, "thread" + i).start();
        }
    }
```

完成编写后，我们将项目启动并请求该地址，不久后你就会发现CPU直接飙升接近100%，此时我们的arthas就派上用场了，首先我们自然是将arthas启动。

```bash
java -jar arthas-boot.jar
```

此时控制台会出现下面几个选项，它通过不同序号标明不同的Java程序，我们看到我们的目标程序ArthasExampleApplication，序号为1，所以我们输入1按回车。

```bash
F:\github>java -jar arthas-boot.jar
[INFO] JAVA_HOME: D:\myinstall\jdk8\jre8
[INFO] arthas-boot version: 3.6.9
[INFO] Found existing java process, please choose one and input the serial number of the process, eg : 1. Then hit ENTER.
* [1]: 18720 com.example.arthasExample.ArthasExampleApplication
  [2]: 19300 org.jetbrains.jps.cmdline.Launcher
  [3]: 7876 org.jetbrains.idea.maven.server.RemoteMavenServer
  [4]: 14488
```

进入控制台，我们直接键入thread命令可以看到，有一个名为 pool-1-thread-1的线程CPU使用率非常高，所以我们需要定位它所工作的代码段。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913572.png)

由控制台可知，它的序号为59，所以我们直接键入:

```bash
 thread 59
```

很快的，我们直接定位到了问题代码段，在TestController的42行。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280838765.png)

知道了代码的位置之后，我们根据类的包路径`com.example.arthasExample.TestController`直接通过Arthas反编译查看源码，命令如下:

```bash
jad --source-only  com.example.arthasExample.TestController
```

最终我们定位到了问题代码，即时修复即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913367.png)

### 定位线程死锁问题

对于线程死锁问题，我们也给出下面这样一段示例代码，线程1先取锁1再取锁2，线程2反之，两者取锁顺序构成环路造成死锁。

```bash
 //两把锁
    private Object lock1 = new Object();
    private Object lock2 = new Object();

    @RequestMapping("dead-lock")
    public void deadLock() {
        //线程1先取得锁1，休眠后取锁2
        new Thread(() -> {
            synchronized (lock1) {
                try {
                    log.info("t1 successfully acquired the lock1......");
                    TimeUnit.SECONDS.sleep(5);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }


                synchronized (lock2) {
                    log.info("t1 successfully acquired the lock1......");
                }
            }
        }, "t1").start();

        //线程2先取得锁2，休眠后取锁1
        new Thread(() -> {
            synchronized (lock2) {
                try {
                    log.info("t2 successfully acquired the lock2......");
                    TimeUnit.SECONDS.sleep(5);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }


                synchronized (lock1) {
                    log.info("t2 successfully acquired the lock1......");
                }
            }
        }, "t2").start();
    }
```

了解代码流程之后，我们直接调用这个接口，打开Arthas查看键入thread线程信息可以看到我们的t1和t2两个线程处于等待状态，大概率存在问题。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913618.png)

随后我们直接键入`thread -b`，发现t2线程被锁住了，由此断定这两个线程看定存在死锁，

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913230.png)

由上述结果我们可知两个线程的id分别是65和66，所以使用`thread id号`的命令直接定位到问题代码段并解决问题即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913040.png)

### 反编译查看代码

上文我们其实已经用到了jad这个反编译命令，对于笔者来说，jad有两种比较常见的用法，除了上述那种反编译类的指令`jad --source-only 类的包路径`，还有一种定位方法代码段的命令`jad --source-only 类的包路径 方法名`。

例如笔者想定位TestController的deadLock代码，我们就可以键入:

```bash
jad --source-only  com.example.arthasExample.TestController deadLock
```

如下图，我们可以直接看到的方法的代码:

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913501.png)

### 定位字段信息(不常用)

我们希望看到某个类下所有字段的详情，我们就可以使用这条命令

```bash
sc -d -f 类的包路径
```

例如笔者想查看TestController的字段详情，就可以键入这条命令

```bash
sc -d -f com.example.arthasExample.TestController
```

可以看到这条指令不仅可以查看字段的定义和注解，还可以查看线程池的使用情况以及集合内部的value。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913330.png)

### 查看方法列表(不常用)

这条命令笔者不是很常用，为了教程的完整性笔者也演示一下，假如我们希望查看某个类的方法，可以使用:

```bash
sm 类的包路径
```

以笔者为例,查看TestController的方法为:

```bash
 sm com.example.arthasExample.TestController
```

输出结果如下:

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913238.png)

### 静态变量监控(常用)

Arthas提供了对静态变量的分析，以下面这段代码为例，如果笔者希望看到list 内部详情，我们就可以使用ognl。

```bash
 private static List<String> list = new ArrayList<>();


    @RequestMapping("add")
    public void add() {
        for (int i = 0; i < 10; i++) {
            list.add("val" + i);
        }
    }
```

在我们执行完接口完成添加操作之后，我们可以直接使用ognl进行监控。例如我们希望查看上述list的内容，我们就可以使用命令:

```bash
 ognl '@类的包路径@变量名'
```

所以如果笔者查看list的命令为:

```bash
 ognl '@com.example.arthasExample.TestController@list'
```

输出结果如下

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913978.png)

当然ognl还有一些比较特殊的用法，例如查看集合的长度，添加元素到集合中等操作，具体可以参考GitHub这个issue:

[https://github.com/alibaba/arthas/issues/71(opens new window)](https://github.com/alibaba/arthas/issues/71)

### 运行耗时性能问题排查

对于统计耗时的操作我们经常会用打日志的方式来监控，在环境复杂的生产环境，我们常因为欠缺考虑而忘记对某些方法进行监控。 同样的Arthas也为我们提供了一些便捷的命令来完成对方法耗时的监控与统计:

笔者这里给出一段UserServiceImpl 模拟用户查询时进行参数校验、其他service调用、redis调用、MySQL调用。

```bash
@Service
@Slf4j
public class UserServiceImpl {

    public JSONObject queryUser(Integer uid) throws Exception {
        check(uid);
        service(uid);
        redis(uid);
       return mysql(uid);
    }

    public void service(Integer uid) throws Exception {
        log.info("调用其他service。。。。。");
        TimeUnit.SECONDS.sleep(RandomUtil.randomLong(1, 2));

    }

    public void redis(Integer uid) throws Exception {
        log.info("查看redis缓存数据。。。。。");
        TimeUnit.MILLISECONDS.sleep(RandomUtil.randomInt(100, 200));
    }

    public JSONObject mysql(Integer uid) throws Exception {
        log.info("查询MySQL数据......");
        TimeUnit.SECONDS.sleep(RandomUtil.randomInt(3, 4));
        JSONObject jsonObject = new JSONObject();
        jsonObject.putOnce("name", "xiaoming");
        jsonObject.putOnce("age", 18);
        return jsonObject;
    }

    public boolean check(Integer uid) throws Exception {
        if (uid == null || uid < 0) {
            log.error("非法用户id，uid:{}", uid);
            throw new Exception("非法用户id");
        }
        return true;
    }
}
```

对应的controller代码如下，假如我们在生产环境下发现这个接口非常耗时，我们又没有日志，那么我们如何利用Arthas排查耗时问题呢？

```bash
 @Autowired
    private UserServiceImpl userService;

    @GetMapping(value = "/user")
    public JSONObject queryUser(Integer uid) throws Exception {
        return userService.queryUser(uid);

    }
```

我们可以用trace命令，我们首先用trace追踪一下TestController 的queryUser耗时的调用:

```bash
trace com.example.arthasExample.TestController queryUser
```

可以发现TestController 并无异常，所有的耗时都在UserServiceImpl

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913210.png)

所以我们再对UserServiceImpl 的queryUser进行追钟。

```bash
 trace com.example.arthasExample.UserServiceImpl queryUser
```

完成命令键入后，控制台就会阻塞监控这个方法，然后我们调用一下这个接口，可以发现原来是MySQL查询非常耗时，由此我们就可以进一步去推断问题了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913234.png)

### 方法耗时统计

有时候我们希望监控某个方法单位时间内请求的耗时和调用情况，我们就可以使用monitor命令，例如我们希望每5s查看TestController 的queryUser的情况，我们就可以键入:

```bash
 monitor  -c 5 com.example.arthasExample.TestController queryUser
```

可以看到控制台会每5s输入请求次数、成功和失败次数以及平均耗时等信息。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913144.png)

### 定位出入参错误问题

有时候我们希望定位某个日志没有打到的方法的出入参详情，例如上面的mysql()的出入参，我们完全可以通过Arthas的watch方法做到，对应命令为:

```bash
watch com.example.arthasExample.UserServiceImpl mysql '{params[0],returnObj}'
```

可以看到，我们的入参为1，出参是一个对象。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913828.png)

更进一步，假如我们希望可以打印出对象的内容，那么我们就可以使用toString方法做到

```bash
watch com.example.arthasExample.UserServiceImpl mysql '{params[0],returnObj.toString()}'
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913920.png)

除此之外watch 还支持很多的骚操作，具体可以参考官方文档:

[https://arthas.aliyun.com/doc/watch.html(opens new window)](https://arthas.aliyun.com/doc/watch.html)

### 监控方法调用路径

还是以上文mysql方法为例，如果我们希望快速定位到它的调用路径，我们可以使用stack方法:

```bash
stack com.example.arthasExample.UserServiceImpl mysql
```

可以看到详细的调用路径直接输出到控制台。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913207.png)

### 获取方法调用的过程

我们希望查看方法调用时出现异常的原因，出参和入参时，可以使用tt这条指令,例如我们想查看check方法为何会报错，我们就可以使用tt

```bash
tt -t com.example.arthasExample.UserServiceImpl check
```

从输出结果来看，第二次抛出异常了，我们可以基于1001这个索引去定位问题。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913879.png)

```bash
 tt -i 1001
```

最终可以得出，入参为-1

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913198.png)

如果我们想重新发起调用，可以直接使用

```bash
tt -i 1001 -p
```

### oom问题

以下面这段代码为例，笔者将堆内存改为100m，命令为`-Xms100m -Xmx100m`,启动后直接重现oom问题

```bash
final ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(100, 100, 1, TimeUnit.MINUTES,
            new LinkedBlockingQueue<>());// 创建线程池，通过线程池，保证创建的线程存活

    @RequestMapping(value = "/oom")
    public String oom(HttpServletRequest request) {
        poolExecutor.execute(() -> {
            Byte[] c = new Byte[4* 1024* 1024];
            localVariable.set(c);// 为线程添加变量

        });
        return "success";
    }
```

然后通过arthas发现老年代内存几乎已满，gc也十分频繁。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913599.png)

由此我们可以直接使用Arthas的heapdump 导出文件到mat中进行进一步分析。

```bash
 heapdump D://heap.hprof
```

导出的结果如下，后续我们就可以点击detail推断到问题的源头了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913359.png)

最终我们很快速的定位到了问题代码:

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913281.png)

### 线上替换代码

有时候我们测试难免会遗漏一些情况，如下所示，我们业务要求id小于1才抛出异常，但是我们因为粗心而将判断条件写成id<2，结果懵懵懂懂的就将这段代码部到了生产环境，导致业务查询出了问题。

```bash
@GetMapping(value={"/user/{id}"})
    public JSONObject findUserById(@PathVariable Integer id) {
        log.info("id: {}",id);
        if (id != null && id < 2) {
             throw new IllegalArgumentException("id < 1");
        }
        return new JSONObject().putOnce("name","user"+id).putOnce("age",18);
    }
```

对于生产环境，我们肯定是无法立刻重启替换jar包的，对于这类问题，我们完全可以使用arthas实现在线热更新。

首先第一步，我们将生产环境的字节码反编译并导出到本地，如下所示

```bash
jad  --source-only com.example.arthasExample.TestController >  d://TestController.java
```

然后我们修改一下对应的代码段

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913293.png)

然后我们需要找到这个类对应类加载器的hash码

```bash
sc -d *TestController | grep classLoaderHash
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913527.png)

找到对应hash码之后，我们就可以基于这个类加载器将修改后的Java文件编译成字节码文件:

```bash
 mc -c 18b4aac2 d://TestController.java -d d://
```

最后我们将代码热更新到正在运行的程序

```bash
redefine d://com/example/arthasExample/TestController.class
```

此时我们传1作为参数就不会报错了，说明代码热更新成功了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913841.png)

### 获取spring上下文进行进一步分析操作

有时候我们希望在线上获取Spring容器分析定位问题，我们完全可以通过arthas拦截到这个类并进行进一步调用和分析。

读过Spring MVC源码的读者可能都知道，每当又HTTP请求发送到web容器时请求进行映射转发处理时都会经过RequestMappingHandlerAdapter，从下面的类图不难看出它继承了WebApplicationObjectSupport，而该类有一个方法getWebApplicationContext可以让我们获取到spring容器的上下文，进而去分析管理spring容器。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913364.png)

所以我们可以使用arthas的tt指令追踪这个类的调用：

```bash
tt -t org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter invokeHandlerMethod
```

然后我们随便调用一个接口，得到调用记录

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913661.png)

我们就以索引为1000的调用记录，通过-w指定ognl获取到spring上下文并获取到testController然后完成一个方法调用。

```bash
tt -i 1000 -w 'target.getApplicationContext().getBean("testController").findUserById(3)'
```

如下图，可以看到，我们成功的完成了调用并得到了返回结果。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202307050913634.png)