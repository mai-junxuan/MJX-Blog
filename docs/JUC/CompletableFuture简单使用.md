# 为什么需要CompletableFuture

CompletableFuture继承了CompletionStage接口和Future接口，在原有future的基础上增加了异步回调、流式处理以及任务组合，成为java8多任务协同场景下一个有效利器。

# 基础使用示例

## 提交有返回值的异步任务

可以看到提交带返回值的任务的方式很简单，只需使用CompletableFuture的api`supplyAsync`即可，这个方法完全可以使用lambda将你需要的任务作为参数传入即可。 最后只需使用get方法即可拿到值。

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> supplyAsync = CompletableFuture.supplyAsync(() -> {
            long start = System.currentTimeMillis();
            System.out.println(Thread.currentThread().getName() + "开始工作了，执行时间：" + start);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "结束工作了，总执行时间：" + (System.currentTimeMillis() - start));
            return 1;
        });

        System.out.println("主线程开始运行");
        System.out.println("输出结果 "+supplyAsync.get());
        System.out.println("主线程运行结束");

    }
```

### 通过源码了解get的原理

可以看到如果任务没有结果就`waitingGet` 

![image-20220920052933117](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920052933117.png)

我们再来看看`waitingGet`，他所作的也很简单，就是无限自旋等待结果返回而已

![image-20220920052953726](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920052953726.png)

然后调用`postComplete`再返回结果

![image-20220920053008955](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920053008955.png) 

而`postComplete`做的事情也很简单，使用变量f指向this，如果this有返回值就cas取出下一个任务压入任务栈

```java
final void postComplete() {
        /*
         * On each step, variable f holds current dependents to pop
         * and run.  It is extended along only one path at a time,
         * pushing others to avoid unbounded recursion.
         */
         //指向当前对象
        CompletableFuture<?> f = this; Completion h;

        while ((h = f.stack) != null ||
               (f != this && (h = (f = this).stack) != null)) {
            CompletableFuture<?> d; Completion t;
            //使用cas将下一个任务换到this栈的顶部
            if (f.casStack(h, t = h.next)) {
                if (t != null) {
                //结果cas后若f不为this 就说明指向新任务了
                    if (f != this) {
                    //h指向this的栈顶，这一步就是将this的栈顶任务，即刚刚cas的新任务压入栈中
                        pushStack(h);
                        continue;
                    }
                    h.next = null;    // detach
                }
                 //对f赋值任务的处理结果返回
                f = (d = h.tryFire(NESTED)) == null ? this : d;
            }
        }
    }
```

输出结果

```java
主线程开始运行
ForkJoinPool.commonPool-worker-1开始工作了，执行时间：1651244818430
ForkJoinPool.commonPool-worker-1结束工作了，总执行时间：1007
输出结果 1
主线程运行结束
```

## 提交无返回值的异步任务

可以看到提交没有返回值的任务时使用的api是runAsync

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Void> supplyAsync = CompletableFuture.runAsync(() -> {
            long start = System.currentTimeMillis();
            System.out.println(Thread.currentThread().getName() + "开始工作了，执行时间：" + start);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "结束工作了，总执行时间：" + (System.currentTimeMillis() - start));
        });

        System.out.println("主线程开始运行");
        //没有get阻塞就拿不到结束工作了的输出
        supplyAsync.get();
        System.out.println("主线程运行结束");
    }
```

输出结果

```java
主线程开始运行
ForkJoinPool.commonPool-worker-1开始工作了，执行时间：1651251489755
ForkJoinPool.commonPool-worker-1结束工作了，总执行时间：1010
主线程运行结束
```

## 将异步任务提交给自己的线程池处理

上文的异步任务都没有指定线程池，从输出结果中我们就可以看到使用的线程都是来自默认的线程池ForkJoinPool。注意CompletableFuture在没有指定线程池的情况下，若计算机是单核的那么默认的线程池是`ThreadPerTaskExecutor`，这一点我们完全可以在源码中得到印证，如下所示，这里的useCommonPool在计算机多核情况下是true，反之为false，感兴趣的读者可以自行去看看CompletableFuture的源码
![image-20220920053028803](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220920053028803.png) 

话不多说，我们接下来就来介绍一下如何指定自定义线程池，代码如下，可以看到笔者将自定的线程池executorService作为入参作为supplyAsync 的第2个参数

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        CompletableFuture<Integer> supplyAsync = CompletableFuture.supplyAsync(() -> {
            long start = System.currentTimeMillis();
            System.out.println(Thread.currentThread() + "开始工作了，执行时间：" + start);
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了，总执行时间：" + (System.currentTimeMillis() - start));
            return 1;
        },executorService);

        System.out.println("主线程开始运行");
        System.out.println("输出结果 "+supplyAsync.get());
        System.out.println("主线程运行结束");

        executorService.shutdown();
        while (executorService.isTerminated()){

        }
    }
```

从输出结果也可以看出这里使用的线程池是我们自定义的线程池

```java
主线程开始运行
Thread[pool-1-thread-1,5,main]开始工作了，执行时间：1651251851358
Thread[pool-1-thread-1,5,main]结束工作了，总执行时间：2005
输出结果 1
主线程运行结束

```

# 回调使用示例

## thenApply / thenApplyAsync

### thenApply

thenApply 适用那些需要顺序执行的异步任务，如下所示，拿着第一个异步任务的返回值交给第二个异步任务进行加工处理，最终返回自己需要的结果

```java
 public static void execute1() throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread()+"开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread()+"结束工作了");
            return 100;
        },executorService);

        CompletableFuture<String> future1 = future.thenApply((data) -> {
            System.out.println("第二个线程：" + Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "第一个线程的结果为 " + data;
        });

        System.out.println("拿第一个任务的结果");
        System.out.println(future.get());
        System.out.println("第一个任务结果结束");

        System.out.println("拿第2个任务的结果");
        System.out.println("第二个任务的结果 "+future1.get());
        System.out.println("第2个任务结果结束");

       executorService.shutdown();
       while (executorService.isTerminated()){

       }

        /**
         * 输出结果
         * Thread[pool-1-thread-1,5,main]开始工作了
         * 拿第一个任务的结果
         * Thread[pool-1-thread-1,5,main]结束工作了
         * 第二个线程：Thread[pool-1-thread-1,5,main]开始工作了
         * 100
         * 第一个任务结果结束
         * 拿第2个任务的结果
         * 第二个任务的结果 第一个线程的结果为 100
         * 第2个任务结果结束
         */

    }
```

### thenApplyAsync

thenApplyAsync与thenApply不同的是，在第一个异步任务有指定线程池的情况下，第二个异步任务会被提交到其他线程池中，这个规律在后文中也一样，各种回调的api，都会有一个带Async的方法，工作原理也是一样，后文就不多赘述了，示例代码如下

```java
public static void execute2() throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread()+"开始工作了");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread()+"结束工作了");
            return 100;
        },executorService);

        CompletableFuture<String> future1 = future.thenApplyAsync((data) -> {
            System.out.println("第二个线程：" + Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "第一个线程的结果为 " + data;
        });

        System.out.println("拿第一个任务的结果");
        System.out.println(future.get());
        System.out.println("第一个任务结果结束");

        System.out.println("拿第2个任务的结果");
        System.out.println("第二个任务的结果 "+future1.get());
        System.out.println("第2个任务结果结束");

        executorService.shutdown();
        while (executorService.isTerminated()){

        }
        /**
         * 输出结果
         * Thread[pool-1-thread-1,5,main]开始工作了
         * 拿第一个任务的结果
         * Thread[pool-1-thread-1,5,main]结束工作了
         * 100
         * 第一个任务结果结束
         * 拿第2个任务的结果
         * 第二个线程：Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * 第二个任务的结果 第一个线程的结果为 100
         * 第2个任务结果结束
         */

    }
```

输出结果，可以看到异步任务2任务被提交到ForkJoinPool中

```java
 /**
         * 输出结果
         * Thread[pool-1-thread-1,5,main]开始工作了
         * 拿第一个任务的结果
         * Thread[pool-1-thread-1,5,main]结束工作了
         * 100
         * 第一个任务结果结束
         * 拿第2个任务的结果
         * 第二个线程：Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * 第二个任务的结果 第一个线程的结果为 100
         * 第2个任务结果结束
         */
```

## thenAccept / thenRun

thenAccept就是拿着上一个任务的返回值作为入参，但是没有返回值 thenRun会在上一个任务执行结束后才开始处理，既没有入参也没有返回值 具体实例代码如下所示，可以看到笔者最终想拿任务2的结果并不是用任务2.get,而是

```java
public static void execute1() throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            System.out.println("第一个任务"+Thread.currentThread()+"开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread()+"结束工作了");
            return 300;
        },executorService);

        CompletableFuture<String> future2 = future.thenApply((data) -> {
            System.out.println("第2个线程：" + Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "第2个线程的结果为 " + data;
        });

        CompletableFuture<Void> future3 = future2.thenAccept((data) -> {
            System.out.println("第3个线程开始执行，该任务接收上一个任务的结果，但无返回值，收到上一个任务的结果值为 " + data);
        });
        CompletableFuture<Void> future4 = future3.thenRun(() -> {
            System.out.println("一切都结束了");
        });

        System.out.println("拿第一个任务的结果");
        System.out.println("第一个任务的结果"+future.get());
        System.out.println("第一个任务结果结束");

        System.out.println("拿第2个任务的结果");
        System.out.println("第二个任务的结果 "+future2.get());
        System.out.println("第2个任务结果结束");


        System.out.println("拿第3个任务的结果");
        System.out.println("第3个任务的结果 "+future3.get());
        System.out.println("第3个任务结果结束");


        System.out.println("拿第4个任务的结果");
        System.out.println("第4个任务的结果 "+future4.get());
        System.out.println("第4个任务结果结束");

        executorService.shutdown();
        while (executorService.isTerminated()){

        }

        /**
         * 第一个任务Thread[pool-1-thread-1,5,main]开始工作了
         * 拿第一个任务的结果
         * Thread[pool-1-thread-1,5,main]结束工作了
         * 第一个任务的结果300
         * 第2个线程：Thread[pool-1-thread-1,5,main]开始工作了
         * 第一个任务结果结束
         * 拿第2个任务的结果
         * 第3个线程开始执行，该任务接收上一个任务的结果，但无返回值，收到上一个任务的结果值为 第2个线程的结果为 300
         * 一切都结束了
         * 第二个任务的结果 第2个线程的结果为 300
         * 第2个任务结果结束
         * 拿第3个任务的结果
         * 第3个任务的结果 null
         * 第3个任务结果结束
         * 拿第4个任务的结果
         * 第4个任务的结果 null
         * 第4个任务结果结束
         */


    }
```

## exceptionally

我们在处理异步任务过程中，难免会出现错误的情况，有些情况下我们可以捕获处理，所以CompletableFuture也为我们提供了一个不错的api——exceptionally，假如我们有两个异步任务，执行顺序为任务1——任务2，任务1执行过程有可能会出现报错，那么我们就可以在这两个任务之间添加一个exceptionally方法，实例代码如下，可以看到笔者在获取任务2的结果时并不是使用`finalFuture.get();`而是使用 `exceptionally.get()`

```java
public static void execute1() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> supplyAsync = CompletableFuture.supplyAsync(() -> {
            long start = System.currentTimeMillis();
            System.out.println(Thread.currentThread().getName() + "开始工作了，执行时间：" + start);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            Random random = new java.util.Random();
            int num = random.nextInt(10);
            if (num < 5) {
                throw new RuntimeException("报错了 num:"+num);
            }
            System.out.println(Thread.currentThread().getName() + "结束工作了，总执行时间：" + (System.currentTimeMillis() - start));
            return 1024;
        });

        CompletableFuture<Integer> exceptionally = supplyAsync.exceptionally((e) -> {
            System.out.println("上一个任务报错了，错误信息" + e.getMessage());
            return -1;
        });

        CompletableFuture finalFuture = supplyAsync.thenAccept((param) -> {
            System.out.println("走到正常的结束分支了");
        });

        System.out.println("主线程开始运行");
//        调用错误捕获的任务执行结束也会自动走到正常结束的分支
        System.out.println("输出结果 " + exceptionally.get());
        System.out.println("主线程运行结束");
        /**
         * ForkJoinPool.commonPool-worker-1开始工作了，执行时间：1651168395414
         * 主线程开始运行
         * ForkJoinPool.commonPool-worker-1结束工作了，总执行时间：1011
         * 走到正常的结束分支了
         * 输出结果 1024
         * 主线程运行结束
         */
    }
```

## whenComplete

相比于exceptionally，whenComplete更适用于处理不需要协同但是可能报错的异步任务，实例代码如下所示，可以看到假如提交异步任务err不为空就说明执行出错了，那么我们就可以对异常进行处理，若为空则说明没有报错，我们就可以将上一个任务的结果输出以及返回出去

```java
public static void execute1() throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread()+"开始工作了");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            Random random = new java.util.Random();
            int num = random.nextInt(10);
            if (num < 5) {
                throw new RuntimeException("报错了 num:"+num);
            }
            System.out.println(Thread.currentThread()+"结束工作了");
            return num;
        },executorService);

        CompletableFuture<Integer> future2 = future.whenComplete((result, err) -> {
            System.out.println("第二个线程：" + Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            if (err != null) {
                err.printStackTrace();
            }

        });



        System.out.println("拿第1个任务的结果");
        System.out.println("第1个任务的结果 "+future2.get());
        System.out.println("第1个任务结果结束");

        executorService.shutdown();
        while (executorService.isTerminated()){

        }

        /**
         * Thread[pool-1-thread-1,5,main]开始工作了
         * 拿第1个任务的结果
         * Thread[pool-1-thread-1,5,main]结束工作了
         * 第二个线程：Thread[pool-1-thread-1,5,main]开始工作了
         * 第1个任务的结果 6
         * 第1个任务结果结束
         */

    }
```

## handle

handle使用和whenComplete差不多，唯一的区别就是whenComplete返回的是上一个任务的结果，而handle可以返回自己的结果，代码如下所示

```java
public static void execute1() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            Random random = new java.util.Random();
            int num = random.nextInt(10);
            if (num < 5) {
                throw new RuntimeException("报错了 num:" + num);
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return num;
        });

        CompletableFuture<String> future2 = future.handle((result, err) -> {
            System.out.println("第二个线程：" + Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            if (err != null) {
                System.out.println(err.getMessage());
                ;return "fail";
            }
            return "sucdess";
        });


        System.out.println("拿第1个任务的结果");
        System.out.println("第1个任务的结果 " + future2.get());
        System.out.println("第1个任务结果结束");



        /**
         * 输出结果
         * Thread[pool-1-thread-1,5,main]开始工作了
         * 拿第一个任务的结果
         * Thread[pool-1-thread-1,5,main]结束工作了
         * 第二个线程：Thread[pool-1-thread-1,5,main]开始工作了
         * 100
         * 第一个任务结果结束
         * 拿第2个任务的结果
         * 第二个任务的结果 第一个线程的结果为 100
         * 第2个任务结果结束
         */

    }
```

# 任务组合示例

## thenCombine / thenAcceptBoth / runAfterBoth

这几个方法都是将两个任务组合起来执行的，只有两个任务都顺利完成了，才会执行之后的方法，唯一的区别是

```
1. thenCombine 接收两个任务的返回值，也能返回值
2. thenAcceptBoth 接收两个参数返回值，但没有返回值
3. runAfterBoth 既不能接收入参，也无返回值
```

示例代码如下，读者可以自行调试

```java
public static void thenCombineDemo() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Integer> completableFuture = future1.thenCombine(future2, (result1, result2) -> {
            System.out.println(result1);
            System.out.println(result2);
            return result1 + result2;
        });



        System.out.println(completableFuture.get());

        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * 100
         * 200
         * 300
         */
    }



    public static void thenAcceptBothDemo() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Void> completableFuture = future1.thenAcceptBoth(future2, (result1, result2) -> {
            System.out.println(result1);
            System.out.println(result2);

        });

        System.out.println(completableFuture);


        System.out.println(completableFuture.get());
        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * java.util.concurrent.CompletableFuture@4dd8dc3[Not completed]
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * 100
         * 200
         * null
         */
    }

    public static void runAfterBothDemo() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Void> completableFuture = future1.runAfterBoth(future2, () -> {
            System.out.println("一切都结束了");

        });

        System.out.println(completableFuture);


        System.out.println(completableFuture.get());
        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * java.util.concurrent.CompletableFuture@6d03e736[Not completed]
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * 一切都结束了
         * null
         */
    }
```

## applyToEither / acceptEither / runAfterEither

和上一个组合模式一样，依次规律也是接收入参，含返回值。接收入参，无返回值。无入参，无返回值。 这种组合模式只要有一个异步任务成功，就会触发后续的方法，常适用于秒杀这样这样的异步任务

示例代码如下

```java
public static void applyToEitherDemo() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<String> completableFuture = future1.applyToEither (future2, (result) -> {
            System.out.println("有个任务完成了结果为"+result);
            return "success";
        });


        System.out.println(completableFuture.get());

        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * 有个任务完成了结果为200
         * success
         */

    }


    public static void acceptEitherDemo() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Void> completableFuture = future1.acceptEither (future2, (result) -> {
            System.out.println("有个任务完成了结果为"+result);
        });



        System.out.println(completableFuture.get());
        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * 有个任务完成了结果为100
         * null
         */
    }


    public static void runAfterEitherDemo() throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Void> completableFuture = future1.runAfterEither (future2, () -> {
            System.out.println("有个任务完成了结果为");
        });



        System.out.println(completableFuture.get());

        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * 有个任务完成了结果为
         * null
         * 
         */
    }
```

## thenCompose

thenCompose适用于构建一个异步任务的串，示例代码如下所示，第2个任务thenCompose第1个异步任务，这就使得第一个任务执行完返回一个CompletableFuture给异步任务2，任务2拿着它的返回值做进一步处理，示例代码如下

```java
public static void tenComposeDemo() throws Exception {
        // 创建异步执行任务:
        CompletableFuture<Double> future1 = CompletableFuture.supplyAsync(()->{
            System.out.println(Thread.currentThread()+" 开始第1个任务,time->"+System.currentTimeMillis());
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
            }
            System.out.println(Thread.currentThread()+" 退出第1个任务,time->"+System.currentTimeMillis());
            return 1.0;
        });
        CompletableFuture<String> future2= future1.thenCompose((param)->{
            System.out.println(Thread.currentThread()+" 开始第2个任务,time->"+System.currentTimeMillis());
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
            }
            System.out.println(Thread.currentThread()+" 结束第2个任务,time->"+System.currentTimeMillis());
            return CompletableFuture.supplyAsync(()->{
                System.out.println(Thread.currentThread()+" 开始第3个任务,time->"+System.currentTimeMillis());
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                }
                System.out.println(Thread.currentThread()+" 结束第3个任务,time->"+System.currentTimeMillis());
                return "job3 test";
            });
        });

        System.out.println("执行结果->"+future2.get());
        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main] 开始第1个任务,time->1651254948166
         * Thread[ForkJoinPool.commonPool-worker-1,5,main] 退出第1个任务,time->1651254948268
         * Thread[ForkJoinPool.commonPool-worker-1,5,main] 开始第2个任务,time->1651254948268
         * Thread[ForkJoinPool.commonPool-worker-1,5,main] 结束第2个任务,time->1651254950277
         * Thread[ForkJoinPool.commonPool-worker-1,5,main] 开始第3个任务,time->1651254950278
         * Thread[ForkJoinPool.commonPool-worker-1,5,main] 结束第3个任务,time->1651254952288
         * 执行结果->job3 test
         */

    }
```

## allOf / anyOf

allOf返回的CompletableFuture是所有任务都执行完成后才会执行，只要有一个任务执行异常，则返回的CompletableFuture执行get方法时会抛出异常，如果都是正常执行，则get返回null。 而anyOf则是只要有一个任务完成就可以触发后续方法，并且可以返回先完成任务的返回值

```java
public static void allofDemo() throws Exception {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Void> whenComplete = future1.allOf(future1, future2).whenComplete((result, err) -> {
            if (err != null) {
                System.out.println(err.getMessage());

            }
            System.out.println("正常结束，结果为"+result);
        });

        System.out.println(whenComplete.get());
        /**
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
         * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
         * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
         * 正常结束，结果为null
         * null
         */


    }


    public static void anyofDemo() throws Exception {
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 100;
        });


        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread() + "开始工作了");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread() + "结束工作了");
            return 200;
        });

        CompletableFuture<Object> anyOfFuture = future1.anyOf(future1, future2);

        System.out.println(anyOfFuture.get());

/**
 * Thread[ForkJoinPool.commonPool-worker-1,5,main]开始工作了
 * Thread[ForkJoinPool.commonPool-worker-2,5,main]开始工作了
 * Thread[ForkJoinPool.commonPool-worker-2,5,main]结束工作了
 * Thread[ForkJoinPool.commonPool-worker-1,5,main]结束工作了
 * 200
 */
    }
```
