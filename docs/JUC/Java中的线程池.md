# Java中的线程池

## 降低资源消耗，创建一个线程的开销远大于创建一个对象

如下所示，我们使用这条命令就可以看到如下图所示的控制台

```
java -XX:+UnlockDiagnosticVMOptions -XX:NativeMemoryTracking=summary -XX:+PrintNMTStatistics -version

```

可以从控制台看出，平均一个线程的大小是1M 

![image-20220920053221748](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920053221748.png)

## 提高响应速度，由于我们统一使用线程池进行管理了，所以无需等待线程的创建时间

## 由于线程池数量是在一定范围内，所以更加方便我们管理与监控

# Executor 框架结构简介

## 1. 提交任务的方式

Executor提交任务的方式有两种一种是基于提交继承`Runnable`接口的任务对象，另一种则是提交`Callable`接口类型的对象。这两种类型区别在这里我们可以简单理解为Runnable类型没有返回值，而Callable类型有返回值。

## 2. 返回值类型

线程池返回类型使用的类基本都是基于`future`类，所以当我们把`runnable`和`callable`使用submit提交时，就会返回一个future对象，这回时候我们就可以使用get方式对主线程进行阻塞并获取当前线程的结果。具体可以参考以下代码:

```
public class FutureTaskDemo {

    public static void main(String[] args) throws ExecutionException, InterruptedException {


//          第一种方式:Future + ExecutorService
////       创建缓存线程池
        ExecutorService service = Executors.newCachedThreadPool();
//        创建任务
        Task task = new Task();
        Future<Integer> future = service.submit(task);
        System.out.println(future.get());
        service.shutdown();



    }

    // 1. 继承Callable接口,实现call()方法,泛型参数为要返回的类型
    static class Task implements Callable<Integer> {

        @Override
        public Integer call() throws Exception {
            System.out.println("Thread [" + Thread.currentThread().getName() + "] is running");
            int result = 0;
            for (int i = 1; i <= 100; ++i) {
                result += i;
            }

            Thread.sleep(3000);
//            System.out.println(result);
            return result;
        }
    }
}
```

# java实现和管理线程池的方式有哪些？简单举例使用

## 线程池基础使用示例

```
/**
 * 工作线程
 */
public class WorkerThread implements Runnable {

    private String command;

    public WorkerThread(String s){
        this.command=s;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName()+" Start. Command = "+command);
        processCommand();
        System.out.println(Thread.currentThread().getName()+" End.");
    }

    private void processCommand() {
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String toString(){
        return this.command;
    }
}


/**
 * 线程池使用的基础示例
 */
public class ThreadPool {

    public static void main(String[] args) {
//        创建一个定量工作线程且队列无限大的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        for (int i = 0; i < 10; i++) {
            WorkerThread thread = new WorkerThread("线程" + i);
            executorService.execute(thread);
        }
//        等待当前所有任务执行完成且不再接手新任务进来
        executorService.shutdown();
        //如果有任务未完成就在这个循环中
        while (!executorService.isTerminated()) {

        }
        System.out.println("总线程运行结束");
    }
}
```

上文说过使用线程池可以做一个线程池的监控器，下面我们就来简单实现一个

```
/**
 * 拒绝策略
 */
public class RejectedExecutionHandlerImpl implements RejectedExecutionHandler {
    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        System.out.println(r.toString() + "被拒绝了");
    }
}
package com.shark.wiki.threadExecutor.monitor;

import java.util.concurrent.ThreadPoolExecutor;

public class MyMonitorThread implements Runnable {


    private ThreadPoolExecutor executor;

    private int seconds;

    private boolean run=true;

    public MyMonitorThread(ThreadPoolExecutor executor, int delay)
    {
        this.executor = executor;
        this.seconds=delay;
    }

    public void shutdown(){
        this.run=false;
    }

    @Override
    public void run()
    {
//        如果当前对象run为true就不断循环打印线程池监控状态
        while(run){
            System.out.println(
                    String.format("[monitor] [%d/%d] Active: %d, Completed: %d, Task: %d, isShutdown: %s, isTerminated: %s",
                            this.executor.getPoolSize(),
                            this.executor.getCorePoolSize(),
                            this.executor.getActiveCount(),
                            this.executor.getCompletedTaskCount(),
                            this.executor.getTaskCount(),
                            this.executor.isShutdown(),
                            this.executor.isTerminated()));
            try {
                Thread.sleep(seconds*1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

    }
}
/**
 * 测试代码
 */
public class Test {


    public static void main(String args[]) throws InterruptedException {
        //RejectedExecutionHandler implementation
        RejectedExecutionHandlerImpl rejectionHandler = new RejectedExecutionHandlerImpl();
        //Get the ThreadFactory implementation to use
        ThreadFactory threadFactory = Executors.defaultThreadFactory();
        //creating the ThreadPoolExecutor
        ThreadPoolExecutor executorPool = new ThreadPoolExecutor(2, 4, 10, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(2), threadFactory, rejectionHandler);
        //start the monitoring thread
        MyMonitorThread monitor = new MyMonitorThread(executorPool, 3);
        Thread monitorThread = new Thread(monitor);
        monitorThread.start();
        //submit work to the thread pool
        for (int i = 0; i < 10; i++) {
            executorPool.execute(new WorkerThread("cmd" + i));
        }

        Thread.sleep(30000);
        //shut down the pool
        executorPool.shutdown();
        //shut down the monitor thread
        Thread.sleep(5000);
        monitor.shutdown();

    }
}
```

# ThreadPoolExecutors使用详解

## 工作流程

![image-20220920053242776](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920053242776.png)

## 核心参数

如下所示：

> 1.corePoolSize代表着核心的线程数
>
> 2.maximumPoolSize代表着当队列都满了，允许在开放的线程数
>
> 3.unit和keepAliveTime则代表着备份开启线程在没有任务的情况下可以存活的时间
>
> 4.workQueue则代表保存等待时间的任务队列
>
> 5.handler则是处理那些连备份线程都没有空闲处理的线程，而JUC为我们提供了以下四种拒绝策略：
>
> ```
> AbortPolicy: 直接抛出异常，默认策略；
> CallerRunsPolicy: 用调用者所在的线程来执行任务；
> DiscardOldestPolicy: 丢弃阻塞队列中靠最前的任务，并执行当前任务；
> DiscardPolicy: 直接丢弃任务；
> ```

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              RejectedExecutionHandler handler) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
             Executors.defaultThreadFactory(), handler);
    }
```

## 状态

```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
private static final int COUNT_BITS = Integer.SIZE - 3; //    Integer.SIZE为 32 -3为29
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;

// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS; //通过左移运算符使得高位为-1，当前状态表示会接受新任务且也会同理对了中的任务
private static final int SHUTDOWN   =  0 << COUNT_BITS;//表示会处理任务但不接受新任务
private static final int STOP       =  1 << COUNT_BITS;//不处理任务也不接受新任务，并会中断所有的任务
private static final int TIDYING    =  2 << COUNT_BITS; //表示所有任务都已成功终止
private static final int TERMINATED =  3 << COUNT_BITS; //执行执行完terminated()即代表当前线程池已经终止执行了       


// Packing and unpacking ctl
private static int runStateOf(int c)     { return c & ~CAPACITY; }
private static int workerCountOf(int c)  { return c & CAPACITY; }
private static int ctlOf(int rs, int wc) { return rs | wc; }
```

## 任务执行

如下所示，源码已经个我们足够的提示不多赘述，需要的读者可以配合翻译阅读，我们不妨继续往下看看addWorker

```java
public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        /*
         * Proceed in 3 steps:
         *
         * 1. If fewer than corePoolSize threads are running, try to
         * start a new thread with the given command as its first
         * task.  The call to addWorker atomically checks runState and
         * workerCount, and so prevents false alarms that would add
         * threads when it shouldn't, by returning false.
         *
         * 2. If a task can be successfully queued, then we still need
         * to double-check whether we should have added a thread
         * (because existing ones died since last checking) or that
         * the pool shut down since entry into this method. So we
         * recheck state and if necessary roll back the enqueuing if
         * stopped, or start a new thread if there are none.
         *
         * 3. If we cannot queue task, then we try to add a new
         * thread.  If it fails, we know we are shut down or saturated
         * and so reject the task.
         */
        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            reject(command);
    }



private boolean addWorker(Runnable firstTask, boolean core) {
        retry:
        for (;;) {<br>
　　　　//获取当前运行状态//

            int c = ctl.get();
            int rs = runStateOf(c);

            // Check if queue empty only if necessary.
            if (rs >= SHUTDOWN &&
                ! (rs == SHUTDOWN &&
                   firstTask == null &&
                   ! workQueue.isEmpty()))
                return false;

            for (;;) {
                int wc = workerCountOf(c);
                if (wc >= CAPACITY ||
                    wc >= (core ? corePoolSize : maximumPoolSize))
                    return false;
                if (compareAndIncrementWorkerCount(c))
                    break retry;
                c = ctl.get();  // Re-read ctl<br>
　　　　　　　　//状态有改变从retry开始执行

                if (runStateOf(c) != rs)
                    continue retry;
                // else CAS failed due to workerCount change; retry inner loop
            }
        }
<br>
　　　　//加锁并初始化创建worker将任务分配给worker线程

        boolean workerStarted = false;
        boolean workerAdded = false;
        Worker w = null;
        try {
            w = new Worker(firstTask);
            final Thread t = w.thread;
            if (t != null) {
                final ReentrantLock mainLock = this.mainLock;
                mainLock.lock();
                try {
                    // Recheck while holding lock.
                    // Back out on ThreadFactory failure or if
                    // shut down before lock acquired.
                    int rs = runStateOf(ctl.get());

                    if (rs < SHUTDOWN ||
                        (rs == SHUTDOWN && firstTask == null)) {
                        if (t.isAlive()) // precheck that t is startable
                            throw new IllegalThreadStateException();
                        workers.add(w);
                        int s = workers.size();
                        if (s > largestPoolSize)
                            largestPoolSize = s;
                        workerAdded = true;
                    }
                } finally {
                    mainLock.unlock();
                }
                if (workerAdded) {
                    t.start();
                    workerStarted = true;
                }
            }
        } finally {
            if (! workerStarted)
                addWorkerFailed(w);
        }
        return workerStarted;
    }
```

最后我们再来看看worker是如何运行任务的

```java
 final void runWorker(Worker w) {
        Thread wt = Thread.currentThread();<br>
　　　　//拿到任务并重置firstTask

        Runnable task = w.firstTask;
        w.firstTask = null;
        w.unlock(); // allow interrupts
        boolean completedAbruptly = true;
        try {<br>
　　　　　　　　//循环的去执行任务

            while (task != null || (task = getTask()) != null) {
                w.lock();
                // If pool is stopping, ensure thread is interrupted;
                // if not, ensure thread is not interrupted.  This
                // requires a recheck in second case to deal with
                // shutdownNow race while clearing interrupt
                if ((runStateAtLeast(ctl.get(), STOP) ||
                     (Thread.interrupted() &&
                      runStateAtLeast(ctl.get(), STOP))) &&
                    !wt.isInterrupted())
                    wt.interrupt();
                try {
                    beforeExecute(wt, task);
                    Throwable thrown = null;
                    try {
                    //执行任务
                        task.run();
                    } catch (RuntimeException x) {
                        thrown = x; throw x;
                    } catch (Error x) {
                        thrown = x; throw x;
                    } catch (Throwable x) {
                        thrown = x; throw new Error(x);
                    } finally {
                        afterExecute(task, thrown);
                    }
                } finally {
                //让当前worker任务置为空，记录完成的任务
                    task = null;
                    w.completedTasks++;
                    w.unlock();
                }
            }
            completedAbruptly = false;
        } finally {
            processWorkerExit(w, completedAbruptly);
        }
    }
```

## 任务提交

如下所示，我们经常用的开发方式就callable执行，future获取结果，future的get原理就是阻塞主线程将主线程放入waiters中，当前线程执行完成后会通过LockSupport类unpark唤醒主线程

```java
public class Test {


    public static void main(String[] args) {

        ExecutorService es = Executors.newCachedThreadPool();
        Future<String> future = es.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                try {
                    TimeUnit.SECONDS.sleep(2);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return "future result";
            }
        });
        try {
            String result = future.get();
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}




// submit方法在AbstractExecutorService中的实现
public Future<?> submit(Runnable task) {
    if (task == null) throw new NullPointerException();
    // 通过submit方法提交的Callable任务会被封装成了一个FutureTask对象。如下一段代码所示
    RunnableFuture<Void> ftask = newTaskFor(task, null);
    execute(ftask);
    return ftask;
}

关于futureTask可以参考笔者的这篇文章简单聊聊FutureTask

protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {
        return new FutureTask<T>(callable);
    }
```

# 线程池关闭

```java
public void shutdown() {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        //检查是否可以关闭线程
        checkShutdownAccess();
        //设置线程池状态
        advanceRunState(SHUTDOWN);
        //尝试中断worker
        interruptIdleWorkers();
            //预留方法,留给子类实现
        onShutdown(); // hook for ScheduledThreadPoolExecutor
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
}

private void interruptIdleWorkers() {
    interruptIdleWorkers(false);
}

private void interruptIdleWorkers(boolean onlyOne) {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        //遍历所有的worker
        for (Worker w : workers) {
            Thread t = w.thread;
            //先尝试调用w.tryLock(),如果获取到锁,就说明worker是空闲的,就可以直接中断它
            //注意的是,worker自己本身实现了AQS同步框架,然后实现的类似锁的功能
            //它实现的锁是不可重入的,所以如果worker在执行任务的时候,会先进行加锁,这里tryLock()就会返回false
            if (!t.isInterrupted() && w.tryLock()) {
                try {
                    t.interrupt();
                } catch (SecurityException ignore) {
                } finally {
                    w.unlock();
                }
            }
            if (onlyOne)
                break;
        }
    } finally {
        mainLock.unlock();
    }
}
```

## Executors可以创建哪三种线程池？

newFixedThreadPool通过源码我们可以看出这样将会创建定量的线程，而且任务队列将是无限量的，所以这就导致了`maximumPoolSize`和`keepAliveTime`没有任何作用

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
```

newSingleThreadExecutor如其名线程池中永远只有一个线程池，当任务超过线程池线程数量就会将其放到无限量的队列中，且永远不会拒绝任务。

```java
public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>(),
                                    threadFactory));
    }
```

newCachedThreadPool就比较特殊了，这个线程池初始时线程池的线程是0，每当有个任务进来且线程池没有空闲的线程时，就会创建一个新的线程，当线程超过60s后没有任务时就会将这个线程释放。

```java
public static ExecutorService newCachedThreadPool(ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>(),
                                      threadFactory);
    }
```

# 为什么很多公司不允许使用Executors取创建线程池？

有了上文的三种线程池创建方式我们就会发现， newFixedThreadPool、newSingleThreadExecutor在大量线程任务情况下很可能出现OOM问题，而newCachedThreadPool就可能创建大量的线程进而造成极其严重的资源开销。

## OOM场景示例

# ThreadPoolExecutor使用示例

```java
/**
 * 无返回值的线程使用示例
 */
public class ThreadPoolExecutorDemo {

    private static final int CORE_POOL_SIZE = 5;
//    开10个每个线程5s并行5s搞定
//    private static final int CORE_POOL_SIZE = 10;
    private static final int MAX_POOL_SIZE = 10;
    private static final int QUEUE_CAPACITY = 100;
    private static final Long KEEP_ALIVE_TIME = 1L;

    public static void main(String[] args) {

        long start = System.currentTimeMillis();

        //使用阿里巴巴推荐的创建线程池的方式
        //通过ThreadPoolExecutor构造函数自定义参数创建
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAX_POOL_SIZE,
                KEEP_ALIVE_TIME,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(QUEUE_CAPACITY),
                new ThreadPoolExecutor.CallerRunsPolicy());

        for (int i = 0; i < 10; i++) {
            //创建WorkerThread对象（WorkerThread类实现了Runnable 接口）
            Runnable worker = new MyRunnable("线程" + i);
            //执行Runnable
            executor.execute(worker);
        }
        //终止线程池
        executor.shutdown();
        while (!executor.isTerminated()) {
        }
        long end = System.currentTimeMillis();
        System.out.println("Finished all threads use:" + (end - start)+"ms");
    }
}
```

# 几个常见的对比

## Runnable vs Callable

这两者最明显的区别就是一个有返回值而另一个没有返回值，具体示例如下所示

```java
/**
 * 无返回值的线程使用示例
 */
public class ThreadPoolExecutorDemo {

    private static final int CORE_POOL_SIZE = 5;
//    开10个每个线程5s并行5s搞定
//    private static final int CORE_POOL_SIZE = 10;
    private static final int MAX_POOL_SIZE = 10;
    private static final int QUEUE_CAPACITY = 100;
    private static final Long KEEP_ALIVE_TIME = 1L;

    public static void main(String[] args) {

        long start = System.currentTimeMillis();

        //使用阿里巴巴推荐的创建线程池的方式
        //通过ThreadPoolExecutor构造函数自定义参数创建
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAX_POOL_SIZE,
                KEEP_ALIVE_TIME,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(QUEUE_CAPACITY),
                new ThreadPoolExecutor.CallerRunsPolicy());

        for (int i = 0; i < 10; i++) {
            //创建WorkerThread对象（WorkerThread类实现了Runnable 接口）
            Runnable worker = new MyRunnable("线程" + i);
            //执行Runnable
            executor.execute(worker);
        }
        //终止线程池
        executor.shutdown();
        while (!executor.isTerminated()) {
        }
        long end = System.currentTimeMillis();
        System.out.println("Finished all threads use:" + (end - start)+"ms");
    }
}
/**
 * 带返回值的线程使用示例
 */
public class Test {


    public static void main(String[] args) {

        ExecutorService es = Executors.newCachedThreadPool();
        Future<String> future = es.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                try {
                    TimeUnit.SECONDS.sleep(2);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return "future result";
            }
        });
        try {
            String result = future.get();
            System.out.println(result);
            //简单示例下记得关闭线程池
            es.shutdown();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

需要补充的是runnable是可以是可以转换为带返回值的任务的，具体可参照如下代码

```java
/**
 * runable改造后带返回值的线程池使用示例
 */
public class ThreadPoolExecutorDemo {

//    private static final int CORE_POOL_SIZE = 5;
    //    开10个每个线程5s并行5s搞定
    private static final int CORE_POOL_SIZE = 10;
    private static final int MAX_POOL_SIZE = 10;
    private static final int QUEUE_CAPACITY = 100;
    private static final Long KEEP_ALIVE_TIME = 1L;

    public static void main(String[] args) throws ExecutionException, InterruptedException {

        long start = System.currentTimeMillis();

        //使用阿里巴巴推荐的创建线程池的方式
        //通过ThreadPoolExecutor构造函数自定义参数创建
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAX_POOL_SIZE,
                KEEP_ALIVE_TIME,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(QUEUE_CAPACITY),
                new ThreadPoolExecutor.CallerRunsPolicy());
        List<Future> futureList=new ArrayList<>();

        for (int i = 0; i < 100; i++) {
            //创建WorkerThread对象（WorkerThread类实现了Runnable 接口）
            Callable worker = Executors.callable(new BaseTask("线程" + i),true);
            //执行Runnable
            Future future = executor.submit(worker);
            futureList.add(future);
        }

        for (int i = 0; i < futureList.size(); i++) {
            System.out.println(futureList.get(i).get());
        }
        //终止线程池
        executor.shutdown();

        long end = System.currentTimeMillis();
        System.out.println("Finished all threads use:" + (end - start) + "ms");
    }
}
```

前者是提交无返回值的任务，而后者则是提交带返回值任务的，具体示例也可以参照上文

# 线程池使用注意事项

在使用线程池过程中，我们必须记得将父线程和子线程进行线程池隔离，否则可能出现所有父线程都在执行过程中，则子线程都在排队，导致父线程必须等待子线程执行完才能释放线程，而子线程必须等待父线程归还线程才能从任务队列中被取出执行，这就是著名的线程死锁。 

![image-20220920053312954](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920053312954.png)

# 如何debug线程池

说了这么多，我们不妨补充一个调试多线程的方法，以下代码为例，笔者将会通过idea完成对线程1的debug

```java
public class DebugRunnable implements Runnable{

    @Override
    public void run() {
        Thread currentThread = Thread.currentThread();
        System.out.println(currentThread.getName() + "-------------进入");

        try {
            TimeUnit.SECONDS.sleep(5);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            System.out.println(currentThread.getName() + "-------------离开");
        }

    }


    public static void main(String[] args) {
        DebugRunnable myRunnable = new DebugRunnable();
        Thread thread1 = new Thread(myRunnable, "线程1");
        Thread thread2 = new Thread(myRunnable, "线程2");
        Thread thread3 = new Thread(myRunnable, "线程3");

        thread1.start();
        thread2.start();
        thread3.start();
    }


}
```

如下图所示，只要设置thread断点+指定条件我们即可完成专注于debug一个线程了

![image-20220920040020396](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920040020396.png)

# 关于线程池的相关面试题

## 为什么要用线程池？

1. 减少资源开销
2. 提高响应速度
3. 便于统一管理

## 实现 Runnable 接口和 Callable 接口的区别

从以下源码我们就能看出前者只能提交任务，无法看到返回值,而且无法抛出异常。而后者可以，但是我们并不能因此完全使用后者，如果你提交的线程任务无需返回值或者抛出异常的话，更推荐使用前者。

```java
@FunctionalInterface
public interface Runnable {

    public abstract void run();
}
@FunctionalInterface
public interface Callable<V> {

    V call() throws Exception;
}
```

## 执行 execute()方法和 submit()方法的区别是什么呢？

如下源码所示execute提交的任务返回值我们无法获取

```java
public interface Executor {


    void execute(Runnable command);
}

```

而submit可以获取返回值，如下源码所示，他会将传入的任务封装成一个RunnableFuture对象(这个对象我们在源码也可以看出继承了Future所以可以拿到返回值)，我们可以通过这个类的get方法阻塞获取返回值，而你你也可以通过`get(long timeout, TimeUnit unit)`在指定时间内阻塞获取返回值，当然小心使用，否则报了一个超时异常如代码段2

```java
 public Future<?> submit(Runnable task) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<Void> ftask = newTaskFor(task, null);
        execute(ftask);
        return ftask;
    }
//线程池使用超时的例子
public static void main(String[] args) throws InterruptedException, ExecutionException, TimeoutException {
        ExecutorService executorService = Executors.newSingleThreadExecutor();

        Future<Integer> future = executorService.submit(new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                Thread.currentThread().sleep(5000);
                System.out.println(Thread.currentThread().getName());
                return 3;
            }
        });

        System.out.println( future.get(1000, TimeUnit.MILLISECONDS));
        executorService.shutdown();


    }
```

## 如何创建线程池

由阿里开发手册我们就知道创建线程池的方式尽可能使`ThreadPoolExecutor` ，若使用`newSingleThreadExecutor`或者使用`newFixedThreadPool`通过源码我们可以看出，他们使用的队列都是无界队列，使用不当很容易导致OOM问题，源码如下所示

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
public LinkedBlockingQueue() {
        this(Integer.MAX_VALUE);
    }
```

而使用`newScheduledThreadPool`和`newCachedThreadPool`他对于创建的线程数没有任和限制，也会导致OOM问题，如下源码所示

```java
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```

## 请你讲一下ThreadPoolExecutor

## 核心参数

1. corePoolSize:当前线程池的核心线程数
2. maximumPoolSize:当核心线程和队列都满了时，就会开启最大的线程数
3. keepAliveTime：当最大线程数空闲执行时间时，就会被销毁
4. unit：上述参数的单位
5. workQueue：等待队列
6. threadFactory：创建线程的工厂，可自定义
7. handler：拒绝策略

## 四个拒绝策略

1. ThreadPoolExecutor.AbortPolicy： 抛出 RejectedExecutionException来拒绝新任务的处理(默认就是使用这种拒绝策略)。
2. ThreadPoolExecutor.CallerRunsPolicy： 如果线程和队列都满了的话，该策略则会调用执行自己的线程运行任务，也就是直接在调用execute方法的线程中运行(run)被拒绝的任务，如果执行程序已关闭，则会丢弃该任务。因此这种策略会降低对于新任务提交速度，影响程序的整体性能。如果您的应用程序可以承受此延迟并且你要求任何一个任务请求都要被执行的话，你可以选择这个策略。 可能这样讲不是很懂，我们可以拿以下这样一段示例代码说明

```
/**
 * 自定义线程任务
 */
public class MyTask implements Runnable {
    private int id;

    public MyTask(int id) {
        this.id = id;
    }

    @Override
    public void run() {
        System.out.println("当前线程名: " + Thread.currentThread().getName() + " id:" + id);
    }
}

```

输出结果，可以看出多出来的任务都交给主线程处理了

> 当前线程名: main id:3 当前线程名: pool-1-thread-2 id:2 当前线程名: pool-1-thread-1 id:0 当前线程名: main id:4 当前线程名: pool-1-thread-2 id:1

1. ThreadPoolExecutor.DiscardPolicy： 不处理新任务，直接丢弃掉。
2. ThreadPoolExecutor.DiscardOldestPolicy： 此策略将丢弃最早的未处理的任务请求。

## 请你解释以下线程池是如何添加任务的

具体详见下述源码，注释已经保姆级的讲述了，通俗来说就是添加任务时会判断当前任务是否小于核心线程数，若小于则添加一个worker跑这个任务，如果大于则添加到队列中，若队列也容不下就开启应急线程，注意应急线程数不能大于`maximumPoolSize`，如果大于`maximumPoolSize`，则走拒绝策略了

```java
 public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        /*
         * Proceed in 3 steps:
         *
         * 1. If fewer than corePoolSize threads are running, try to
         * start a new thread with the given command as its first
         * task.  The call to addWorker atomically checks runState and
         * workerCount, and so prevents false alarms that would add
         * threads when it shouldn't, by returning false.
         *
         * 2. If a task can be successfully queued, then we still need
         * to double-check whether we should have added a thread
         * (because existing ones died since last checking) or that
         * the pool shut down since entry into this method. So we
         * recheck state and if necessary roll back the enqueuing if
         * stopped, or start a new thread if there are none.
         *
         * 3. If we cannot queue task, then we try to add a new
         * thread.  If it fails, we know we are shut down or saturated
         * and so reject the task.
         */
        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            reject(command);
    }
```
