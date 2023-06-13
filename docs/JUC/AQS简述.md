# 为什么要AQS

无论是倒计时门闩、还是可重入锁或者读写锁等，他们都有一个共同点，那就是协作，所以Doug Lea就提取了这些类写作的共性，协同了大名鼎鼎的AQS使得各种锁只需处理自己的逻辑即可，无需关心线程间取锁和解锁的具体底层实现逻辑。

# AQS三要素

## state

如下所示，这就是AQS中重要的变量，他主要是用于同步状态用的，具体情况笔者会在后续在不同锁之间进行分析

```java
 /**
     * The synchronization state.
     */
    private volatile int state;
```

## 队列

AQS在底层实现了一个基于链表的FIFO队列，会在所有需要等待的线程存放至这个队列中，当锁释放时就会将合适的节点从队列中取出释放并运行。

```java
static final class Node
```

![image-20220925223339992](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252233102.png)

## 获取和释放方法

源码如下所示，AQS相当于为我们提供了获取锁和释放锁的模板方法，我们只需按需重写`tryAcquire`、`tryRelease`即可。

```java
//获取锁的逻辑
 public final void acquire(int arg) {
 //短路运算技巧，当取锁失败就添加到等待队列，并将其这个线程打断
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
//释放锁的逻辑
public final boolean release(int arg) {
//如果释放锁成功就通知后继节点
        if (tryRelease(arg)) {
            Node h = head;
            if (h != null && h.waitStatus != 0)
                unparkSuccessor(h);
            return true;
        }
        return false;
    }
```

# 用一次debug各种并发流程工具对AQS的运用

由于信号量、可重入锁等对于AQS运用都差不多，我们就以countDownLatch为例的源码进行介绍

## debug示例代码

如下所示，这就是笔者本次debug的示例代码，在debug之前我们必须知道本次debug的目的

```java
        1. await如何阻塞主线程
        2. countDown如何控制并发流程并唤醒主线程
```

以下便是笔者的本次debug所用示例代码

```java
public class CountDownLatchBaseUse {
    public static void main(String[] args) {
        CountDownLatch latch = new CountDownLatch(5);
        ExecutorService threadPool = Executors.newFixedThreadPool(5);
        for (int i = 0; i < 5; i++) {
            int no = i + 1;

                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Thread.sleep((long) (Math.random() * 10000));
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }finally {
                            latch.countDown();
                        }
                        System.out.println("No" + no + "完成了检查");
                    }
                };
            threadPool.execute(runnable);

        }
        System.out.println("等待所有检查完成");
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("所有人都完成了工作，进入下一个环节。");
        threadPool.shutdown();

    }
}
```

## debug

### 先行步骤

如图所示笔者在await和countdown都设置了断点，并且suspend设置为thread ![image-20220925222750622](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252227581.png)

### await如何阻塞主线程

如下图所示，我们debug到main线程 

![image-20220925222826904](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252228824.png)

我们步进看到调用sync调用的方法 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252228815.png)

这时候他会尝试获取共享锁，我们步进看看 

![image-20220925222855137](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252228901.png)

由于倒计时门闩设置为5，一次没扣，所以这里返回-1，上方代码会走到do逻辑，我们不妨看看do逻辑做了什么事情 

![image-20220925222911326](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252229637.png)

 可以看到，就是添加一个node节点，如果取锁失败，则添加到队列中，然后执行`shouldParkAfterFailedAcquire`和`parkAndCheckInterrupt()` 

![image-20220925223314695](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252233785.png)

这时候main线程状态就被设置为wait，cpu时间片就让出给其他子线程了 

![image-20220925222926890](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252229960.png) 

第一个问题解决，我们继续debug的代码解决第二个问题

### countDown如何控制并发流程并唤醒主线程

可以看到线程执行到了thread-4 

![image-20220925222959869](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252230775.png)

他调用了释放锁的逻辑 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252230737.png)

调用`tryReleaseShared`尝试释放锁，我们步入看看 

![image-20220925223254343](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252232578.png) 

逻辑很简单，使用cas扣除state值。这里使用for循环的目的也很简单，考虑到可能存在cas操作失败的情况(即同样一个线程拿到当前c的值，先于本线程完成cas操作导致state设置失败的情况) 完成扣除操作返回当前count是否为0，如果为0就说明倒计时门闩倒计时，完成，就会执行上述do逻辑 

![image-20220925223028988](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252230176.png) 

我们不妨看看do逻辑做了什么 

![image-20220925223051091](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252230242.png) 

获取当前头节点状态，若为`SIGNAL`则执行cas操作讲h节点状态设置为0，再执行`unparkSuccessor`

![image-20220925223106756](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252231768.png)

`unparkSuccessor`逻辑也很简单，即讲头节点之后的节点释放

![image-20220925223127572](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252231652.png)

![image-20220925223149155](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252231203.png)

此时main线程就得以解脱，状态变为running 

![image-20220925223209790](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252232739.png) 

自此代码运行完成

 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209252232567.png)

# 自定义一把一次性门闩demo

```java
public class MyOneDownLatch {

    private Sync sync = new Sync();

    /**
     * 取锁逻辑
     */
    public void await() {
        sync.acquireShared(0);
    }

    /**
     * 释放锁
     */
    public void signal() {
        sync.releaseShared(0);
    }


    private static class Sync extends AbstractQueuedSynchronizer {

        @Override
        protected int tryAcquireShared(int arg) {
            //这里等于1说明调用了tryReleaseShared 可以释放节点了
            return (getState() == 1) ? 1 : -1;
        }

        /**
         * 将state设置为1，返回true说明取锁成功
         * @param arg
         * @return
         */
        @Override
        protected boolean tryReleaseShared(int arg) {
            setState(1);
            return true;
        }
    }

    public static void main(String[] args) {
        MyOneDownLatch oneDownLatch = new MyOneDownLatch();
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "等待中");
                oneDownLatch.await();
                System.out.println(Thread.currentThread().getName() + "开始运行");
            }).start();
        }

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("通知所有线程运行");
        oneDownLatch.signal();
    }
}
```
