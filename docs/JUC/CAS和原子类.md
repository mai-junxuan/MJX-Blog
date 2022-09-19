# CAS和原子类

## 什么是CAS

CAS全称Compare-And-Swap，说白就是就是比较当前的值与旧值是否相等若相等则进行修改操作，该类常用于多线程共享变量的修改操作。而其底层实现也是基于硬件平台的汇编指令，JVM只是封装其调用仅此而已。 CAS基础使用示例

如下所示，可以看出使用封装CAS操作的AtomicInteger操作多线程共享变量无需我们手动加锁，因为避免过多人为操作这就大大减少了多线程操作下的失误。

使用原子类操作共享数据

```java
public class CasTest {
    private AtomicInteger count = new AtomicInteger();


    public void increment() {
        count.incrementAndGet();
    }
    // 使用 AtomicInteger 后，不需要加锁，也可以实现线程安全
    public int getCount() {
        return count.get();
    }

    public static void main(String[] args) {

    }
}
```

使用sync锁操作数据

```java
public class Test {
    private int i=0;
    public synchronized int add(){
        return i++;
    }
}
```

## CAS与传统synchronized区别

除了上述区别以外CAS工作原理是基于乐观锁且操作是原子性的，与synchronized的悲观锁相比，效率也会相对高一些。

但即便如此CAS仍然存在两个问题：

1. 可能存在长时间CAS：如下代码所示，这就是AtomicInteger底层的UNSAFE类如何进行CAS的具体代码 ，可以看出这个CAS操作需要拿到volatile变量后在进行循环CAS才有可能成功这就很可能存在自旋循环，从而给cpu带来很大的执行开销。

```java
 public final int getAndSetInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var4));

        return var5;
    }
```

1. CAS只能对一个变量进行原子操作：为了解决这个问题，JDK 1.5之后通过AtomicReference使得变量可以封装成一个对象进行操作

2. ABA问题：总所周知CAS就是比对当前值与旧值是否相等，在进行修改操作，假设我现在有一个变量值为A，我改为B，再还原为A，这样操作变量值是没变的？那么CAS也会成功不就不合理吗？这就好比一个银行储户想查询概念转账记录，如果转账一次记为1，如果按照ABA问题的逻辑，那么这个银行账户转账记录次数有可能会缺少。为了解决这个问题JDK 1.5提供了AtomicStampedReference，通过比对版本号在进行CAS操作，那么上述操作就会变为1A->2B->3A,由于版本追加，那么我们就能捕捉到当前变量的变化了。

## CAS实现——基于java封装汇编的UNSAFE

代码也很简单，就是拿到具有现场可见性的volatile变量在进行原子操作的CAS

```java
public final int getAndAddInt(Object paramObject, long paramLong, int paramInt)
  {
    int i;
    do
      i = getIntVolatile(paramObject, paramLong);
    while (!compareAndSwapInt(paramObject, paramLong, i, i + paramInt));
    return i;
  }

  public final long getAndAddLong(Object paramObject, long paramLong1, long paramLong2)
  {
    long l;
    do
      l = getLongVolatile(paramObject, paramLong1);
    while (!compareAndSwapLong(paramObject, paramLong1, l, l + paramLong2));
    return l;
  }

  public final int getAndSetInt(Object paramObject, long paramLong, int paramInt)
  {
    int i;
    do
      i = getIntVolatile(paramObject, paramLong);
    while (!compareAndSwapInt(paramObject, paramLong, i, paramInt));
    return i;
  }

  public final long getAndSetLong(Object paramObject, long paramLong1, long paramLong2)
  {
    long l;
    do
      l = getLongVolatile(paramObject, paramLong1);
    while (!compareAndSwapLong(paramObject, paramLong1, l, paramLong2));
    return l;
  }

  public final Object getAndSetObject(Object paramObject1, long paramLong, Object paramObject2)
  {
    Object localObject;
    do
      localObject = getObjectVolatile(paramObject1, paramLong);
    while (!compareAndSwapObject(paramObject1, paramLong, localObject, paramObject2));
    return localObject;
  }
```

## AtomicInteger以及相关原子类

### 原子类更新基本类型

```
AtomicBoolean: 原子更新布尔类型。
AtomicInteger: 原子更新整型。
AtomicLong: 原子更新长整型。
```

### 原子类更新数组类型

```java
AtomicIntegerArray: 原子更新整型数组里的元素。

AtomicLongArray: 原子更新长整型数组里的元素。

AtomicReferenceArray: 原子更新引用类型数组里的元素。
```

#### 基本使用示例

```java
import java.util.concurrent.atomic.AtomicIntegerArray;

public class AtomicIntegerArrayDemo {


    public static void main(String[] args) throws InterruptedException {
        AtomicIntegerArray array = new AtomicIntegerArray(new int[] { 0, 0 });
        System.out.println(array);
//        索引1位置+2
        System.out.println(array.getAndAdd(1, 2));
        System.out.println(array);
    }
}
```

### 原子类更新引用类型

```java
AtomicReference: 原子更新引用类型。

AtomicStampedReference: 原子更新引用类型, 内部使用Pair来存储元素值及其版本号。

AtomicMarkableReferce: 原子更新带有标记位的引用类型。
```

#### 使用示例

```java
import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceTest {

    public static void main(String[] args){

        // 创建两个Person对象，它们的id分别是101和102。
        Person p1 = new Person(101);
        Person p2 = new Person(102);
        // 新建AtomicReference对象，初始化它的值为p1对象
        AtomicReference ar = new AtomicReference(p1);
        // 通过CAS设置ar。如果ar的值为p1的话，则将其设置为p2。
        ar.compareAndSet(p1, p2);

        Person p3 = (Person)ar.get();
        System.out.println("p3 is "+p3);
        System.out.println("p3.equals(p1)="+p3.equals(p1));
        System.out.println("p3.equals(p2)="+p3.equals(p2));
    }
}

class Person {
    volatile long id;
    public Person(long id) {
        this.id = id;
    }
    public String toString() {
        return "id:"+id;
    }
}
```

### 原子类更新字段类型

```java
AtomicIntegerFieldUpdater: 原子更新整型的字段的更新器。

AtomicLongFieldUpdater: 原子更新长整型字段的更新器。

AtomicStampedFieldUpdater: 原子更新带有版本号的引用类型。

AtomicReferenceFieldUpdater: 上面已经说过此处不在赘述。
```

#### 基础使用示例

```java
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;

public class TestAtomicIntegerFieldUpdater {

    public static void main(String[] args){
        TestAtomicIntegerFieldUpdater tIA = new TestAtomicIntegerFieldUpdater();
        tIA.doIt();
    }

    public AtomicIntegerFieldUpdater<DataDemo> updater(String name){
        return AtomicIntegerFieldUpdater.newUpdater(DataDemo.class,name);

    }

    public void doIt(){
        DataDemo data = new DataDemo();
//        通过源码发现返回的是更新前的值
//        System.out.println("publicVar = "+updater("publicVar").getAndAdd(data, 2));
//        System.out.println(data.publicVar);
        /*
         * 由于在DataDemo类中属性value2/value3,在TestAtomicIntegerFieldUpdater中不能访问
         * */
//        System.out.println("protectedVar = "+updater("protectedVar").getAndAdd(data,2));
//        System.out.println("privateVar = "+updater("privateVar").getAndAdd(data,2));

//        System.out.println("staticVar = "+updater("staticVar").getAndIncrement(data));//报java.lang.IllegalArgumentException
        /*
         * 下面报异常：must be integer
         * */
//        System.out.println("integerVar = "+updater("integerVar").getAndIncrement(data));
        //System.out.println("longVar = "+updater("longVar").getAndIncrement(data));
    }

}

class DataDemo{

    public volatile int publicVar=3;
    protected volatile int protectedVar=4;
    private volatile  int privateVar=5;

    public volatile static int staticVar = 10;
    //public  final int finalVar = 11;

    public volatile Integer integerVar = 19;
    public volatile Long longVar = 18L;

}
```

### 通过上述代码我们可以总结出CAS字段必须符合以下要求：

```java
1. 变量必须使用volatile保证可见性

2. 必须是当前对象可以访问到的类型才可进行操作‘

3. 只能是实例变量而不是类变量，即不可以有static修饰符

4. 包装类也不行
```

## ABA问题

```java
public class AtomicStampedReference<V> {
    private static class Pair<T> {
        final T reference;  //维护对象引用
        final int stamp;  //用于标志版本
        private Pair(T reference, int stamp) {
            this.reference = reference;
            this.stamp = stamp;
        }
        static <T> Pair<T> of(T reference, int stamp) {
            return new Pair<T>(reference, stamp);
        }
    }
    private volatile Pair<V> pair;
    ....

    /**
      * expectedReference ：更新之前的原始引用值
      * newReference : 新值
      * expectedStamp : 期待当前版本与之一致的值
      * newStamp : 新版本值
      */
    public boolean compareAndSet(V   expectedReference,
                             V   newReference,
                             int expectedStamp,
                             int newStamp) {
        // 获取当前的(元素值，版本号)对
        Pair<V> current = pair;
        return
            // 引用没变
            expectedReference == current.reference &&
            // 版本号没变
            expectedStamp == current.stamp &&
           //可以看到这个括号里面用了一个短路运算如果当前版本与新值一样就说更新过，就不往下走CAS代码了
            ((newReference == current.reference &&

            newStamp == current.stamp) ||
            // 构造新的Pair对象并CAS更新
            casPair(current, Pair.of(newReference, newStamp)));
    }

    private boolean casPair(Pair<V> cmp, Pair<V> val) {
        // 调用Unsafe的compareAndSwapObject()方法CAS更新pair的引用为新引用
        return UNSAFE.compareAndSwapObject(this, pairOffset, cmp, val);
    }
```

代码示例，我们下面就用other代码模拟干扰现场，如果other现场先进行cas更新再还原操作，那么main线程的版本号就会过时，CAS就会操作失败

```java
/**
 * ABA问题代码示例
 */
public class AtomicStampedReferenceTest {
    private static AtomicStampedReference<Integer> atomicStampedRef =
            new AtomicStampedReference<>(1, 0);

    public static void main(String[] args) {
        Thread main = new Thread(() -> {
            System.out.println("操作线程" + Thread.currentThread() + ",初始值 a = " + atomicStampedRef.getReference());
            int stamp = atomicStampedRef.getStamp(); //获取当前标识别
            try {
                Thread.sleep(1000); //等待1秒 ，以便让干扰线程执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            boolean isCASSuccess = atomicStampedRef.compareAndSet(1, 2, stamp, stamp + 1);  //此时expectedReference未发生改变，但是stamp已经被修改了,所以CAS失败
            System.out.println("操作线程" + Thread.currentThread() + ",CAS操作结果: " + isCASSuccess);
        }, "主操作线程");

        Thread other = new Thread(() -> {
            Thread.yield(); // 确保thread-main 优先执行
            atomicStampedRef.compareAndSet(1, 2, atomicStampedRef.getStamp(), atomicStampedRef.getStamp() + 1);
            System.out.println("操作线程" + Thread.currentThread() + ",【increment】 ,值 = " + atomicStampedRef.getReference());
            atomicStampedRef.compareAndSet(2, 1, atomicStampedRef.getStamp(), atomicStampedRef.getStamp() + 1);
            System.out.println("操作线程" + Thread.currentThread() + ",【decrement】 ,值 = " + atomicStampedRef.getReference());
        }, "干扰线程");

        main.start();
        other.start();
    }

}
```
