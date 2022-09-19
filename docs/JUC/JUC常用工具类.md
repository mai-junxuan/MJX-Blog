# JUC常用工具类

## CountDownLatch

### 简介

倒计时门闩，只有倒计时门闩值变为0时，阻塞状态才会结束。 常用api

```java
countDownLatch(int count)//构造函数，参数count为需要倒数的值。


awiait()//调用这个方法的线程会被挂起，直到count为0才继续执行。


countDown()//调用一次这个方法，会将count减1。

```

### 示例

#### 工厂中，质检，5个工人检查，所有人都认为通过，才通过

```java
package flowcontrol.countdownlatch;

import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

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

#### 以运动员听枪比赛示例介绍countDownLatch确保多线程同时开始的示例

```java
package flowcontrol.countdownlatch;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * countDownLatch第二种示例
 * 以运动员听枪比赛示例介绍countDownLatch确保多线程同时开始的示例
 */
public class CountDownLatchBaseUse2 {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch=new CountDownLatch(1);
        ExecutorService threadPool= Executors.newFixedThreadPool(5);
        for (int i = 0; i < 5; i++) {
            int finalI = i+1;
            Runnable runnable=new Runnable() {
                @Override
                public void run() {
                    System.out.println("no"+ finalI +"准备完成，等待枪响");
                    try {
                        countDownLatch.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("no"+ finalI +"冲向终点");
                }
            };

            threadPool.execute(runnable);
        }
        Thread.sleep(5000);
        System.out.println("开枪，比赛开始。。。。。");
        countDownLatch.countDown();
        threadPool.shutdown();

    }
}

```

## Semaphore

### 简介

信号量常用于控制多线程使用有限资源的场景

### 使用方式

1. 初始化Semaphore并指定许可证的数量。

   1. 需要信号量使用acquire()来获取，只要有剩余就会分配。
   2. 当使用完毕后，使用release()释放信号量。

### 使用示例

```java
public class SemaphoreBaseUse {
    //加true则实现公平策略线程会按照顺序来
    static Semaphore semaphore = new Semaphore(5,true);

    public static void main(String[] args) {
        ExecutorService threadPool = Executors.newFixedThreadPool(50);
        for (int i = 0; i < 50; i++) {
            threadPool.submit(new Task());
        }
        threadPool.shutdown();
    }

    static class Task implements Runnable {


        @Override
        public void run() {

            try {
                semaphore.acquire(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println(Thread.currentThread().getName() + "拿到了许可证");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            semaphore.release(3);
            System.out.println(Thread.currentThread().getName() + "释放了许可证");
        }
    }
}
```

### 注意事项

1. 获取和释放的时候都可以指定数量，但是要保持一致。
2. 公平性设置为true会更加合理
3. 并不必须由获取许可证的线程释放许可证。可以是A获取，B释放。

## Condition

### 简介

当A线程需要等待某个条件的时候，它就去执行condition.await()方法，一旦执行了await()方法，线程就会进入阻塞状态。

如果线程B执行condition.signal()方法，则JVM就会从被阻塞线程中找到等待该condition的线程。当线程A收到可执行信号的时候，他的线程状态就会变成Runnable可执行状态。

### 示例

#### 基础使用示例

```java
public class ConditionBaseUse1 {
    private ReentrantLock reentrantLock = new ReentrantLock();
    private Condition condition = reentrantLock.newCondition();

    public static void main(String[] args) {
        ConditionBaseUse1 conditionBaseUse1=new ConditionBaseUse1();
        //注意这里必须先让唤醒线程开启，并且将其设置为休眠，保证它开启，且能够让出cpu时间片给等待线程运行
        new Thread(()->{
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            conditionBaseUse1.notifyCondition();
        }).start();

        conditionBaseUse1.waitCondition();
    }


    void waitCondition() {
        reentrantLock.lock();
        System.out.println("等待条件完成中。。。。。");
        try {
            condition.await();
            System.out.println("条件完成，开始执行业务逻辑。。。。。");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            reentrantLock.unlock();
        }
    }

    void notifyCondition() {
        reentrantLock.lock();
        try {
            System.out.println("条件完成，通知其他线程");
            condition.signal();
        } finally {
            reentrantLock.unlock();
        }
    }

}
```

#### 基于条件对象完成生产者、消费者模式

```java
package flowcontrol.condition;

import java.util.PriorityQueue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionBaseUse2 {
    private PriorityQueue<Integer> queue = new PriorityQueue<>(10);
    private int queueSize = 10;
    private ReentrantLock lock = new ReentrantLock();
    private Condition notFull = lock.newCondition();
    private Condition notEmpty = lock.newCondition();

    public static void main(String[] args) {
        ConditionBaseUse2 conditionBaseUse2=new ConditionBaseUse2();
        Consumer consumer=conditionBaseUse2.new Consumer();
        Producer producer=conditionBaseUse2.new Producer();
        producer.start();
        consumer.start();
    }

    class Consumer extends Thread {
        @Override
        public void run() {
            consumer();
        }

        void consumer() {
            while (true) {
                lock.lock();
                try {
                    if (queue.size() == 0) {
                        System.out.println("队列已空，等待生产");
                        notEmpty.await();
                    }

                    queue.poll();
                    notFull.signal();
                    System.out.println("从队列消费一个数据，当前剩余 " +  queue.size());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }

            }
        }



    }

    class Producer extends Thread {
        @Override
        public void run() {
            producer();
        }

        void producer() {
            while (true) {
                lock.lock();
                try {
                    if (queue.size() == queueSize) {
                        System.out.println("队列已满，等待消费");
                        notFull.await();
                    }

                    queue.offer(1);
                    notEmpty.signal();
                    System.out.println("向队列插入一个元素，当前剩余空间 " + (queueSize - queue.size()));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }

            }
        }
    }
}
```

## CyclicBarrier

### 简介

直到指定数量的线程都到达同一个点，然后才一起继续执行。

### 示例

```java
package flowcontrol.cyclicbarrier;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierBaseUse1 {


    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(5, () -> {
            System.out.println("人已到齐，准备出发");
        });

        //循环栅栏可以复用
        for (int i = 0; i <10 ; i++) {
            new Thread(new Task(i,cyclicBarrier)).start();
        }
    }


    static class Task implements Runnable {
        private int id;
        private CyclicBarrier cyclicBarrier;

        public Task(int id, CyclicBarrier cyclicBarrier) {
            this.id = id;
            this.cyclicBarrier = cyclicBarrier;
        }

        @Override
        public void run() {
            System.out.println("线程" + id + "前往集合地点");
            try {
                Thread.sleep((long) (Math.random() * 10000));
                System.out.println("线程" + id + "到达集合地点，等待其他人到达");
                cyclicBarrier.await();
                System.out.println("线程" + id + "准备出发");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }

        }
    }
}

```

### 与CountDownLatch简介区别

1. CountDownLatch用户事件，循环栅栏作用于线程
2. 循环栅栏可重复使用，CountDownLatch则不能
