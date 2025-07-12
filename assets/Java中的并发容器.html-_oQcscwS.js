import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,a as e}from"./app-BJyX0H20.js";const t={},i=e(`<h1 id="并发容器概览" tabindex="-1"><a class="header-anchor" href="#并发容器概览"><span>并发容器概览</span></a></h1><p>在并发情况下，我经常需要一些容器来存储数据，对此我们的容器就必须考虑到线程安全问题，对此jdk也在这些场景为我们提供了如下并发容器</p><ol><li>ConcurrentHashMap:线程安全的HashMap</li><li>CopyOrWriteList:线程安全的list</li><li>BlockingQueue:阻塞队列，非常适用于作为共享通道</li></ol><h1 id="传统的并发容器" tabindex="-1"><a class="header-anchor" href="#传统的并发容器"><span>传统的并发容器</span></a></h1><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2><p>在jdk1.2版本中以及为我们提供的线程安全的同期vector和hashtable，但是他们保证线程安全的方式是使用互斥锁sync，在高并发场景下，这种方式会使得性能大打折扣。</p><h2 id="使用实例" tabindex="-1"><a class="header-anchor" href="#使用实例"><span>使用实例</span></a></h2><h3 id="vector示例以及源码解析" tabindex="-1"><a class="header-anchor" href="#vector示例以及源码解析"><span>Vector示例以及源码解析</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>public class VectorDemo {

    public static void main(String[] args) {
        Vector&lt;String&gt; vector = new Vector&lt;&gt;();
        vector.add(&quot;test&quot;);
        System.out.println(vector.get(0));
    }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过源码我们可以看到add加了sync锁，这就是导致性能下降的主要原因</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> public synchronized boolean add(E e) {
        modCount++;
        ensureCapacityHelper(elementCount + 1);
        elementData[elementCount++] = e;
        return true;
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="hashtable示例以及源码解析" tabindex="-1"><a class="header-anchor" href="#hashtable示例以及源码解析"><span>hashTable示例以及源码解析</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/**
 * 描述：     古老的线程安全的hashTable public synchronized V put(K key, V value)
 */
public class HashtableDemo {
    public static void main(String[] args) {
        Hashtable&lt;String, String&gt; hashtable = new Hashtable&lt;&gt;();
        hashtable.put(&quot;key&quot;, &quot;value&quot;);
        System.out.println(hashtable.get(&quot;key&quot;));
    }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过原本我们可以发现无论get还是set也是都加了sync锁。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> public synchronized V get(Object key) {
        Entry&lt;?,?&gt; tab[] = table;
        int hash = key.hashCode();
        int index = (hash &amp; 0x7FFFFFFF) % tab.length;
        for (Entry&lt;?,?&gt; e = tab[index] ; e != null ; e = e.next) {
            if ((e.hash == hash) &amp;&amp; e.key.equals(key)) {
                return (V)e.value;
            }
        }
        return null;
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="传统容器并发缺陷" tabindex="-1"><a class="header-anchor" href="#传统容器并发缺陷"><span>传统容器并发缺陷</span></a></h1><p>如下源码所示，不难发现这些早期的容器为了控制并发都在方法上使用了sync锁，虽然保证了线程安全，但是这种锁粒度以及锁的工作方式很明显会造成性能下降。</p><h2 id="基于arraylist示例" tabindex="-1"><a class="header-anchor" href="#基于arraylist示例"><span>基于arrayList示例</span></a></h2><p>读者可以通过以下的例子查看输出结果，可以发现arayList的数组长度始终不可能达到2000，原因也很简单，我们完全可以在源码中找到答案</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package collections.predecessor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * list线程不安全的示例
 */
public class baseArrayList {


    public static void main(String[] args) throws InterruptedException {
        final List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
//        final List&lt;Integer&gt; list = Collections.synchronizedList(new ArrayList&lt;Integer&gt;());
//        final List&lt;Integer&gt; list =new CopyOnWriteArrayList&lt;Integer&gt;();

        // 线程A将0-1000添加到list
        new Thread(new Runnable() {
            public void run() {
                for (int i = 0; i &lt; 1000 ; i++) {
                    list.add(i);

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        // 线程B将1000-2000添加到列表
        new Thread(new Runnable() {
            public void run() {
                for (int i = 1000; i &lt; 2000 ; i++) {
                    list.add(i);

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        Thread.sleep(2000);



        // 打印所有结果
        for (int i = 0; i &lt; list.size(); i++) {
            System.out.println(&quot;第&quot; + (i + 1) + &quot;个元素为：&quot; + list.get(i));
        }
        System.out.println(&quot;list:size &quot;+list.size());
    }



}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>源码如下所示，可以发现arrayList在添加操作的时候需要分析对容量进行判断，假如容量不够则需要扩容，所以这期间如果多线程执行add的话，很可能出现以下几种情况： 情况1：</p><ol><li>线程1在9位置插入，进行扩容判断时，发现size为10的时候才需要扩容，所以直接插入</li><li>线程2在线程1工作期间也进行了这样的判断和操作，由于线程2操作晚于线程1，结果线程2在size=10的位置添加元素导致了索引越界。</li></ol><p>情况2：</p><ol><li><p>线程1在9位置插入，进行扩容判断时，发现size为10的时候才需要扩容，所以直接插入</p></li><li><p>线程2在线程1工作期间也进行了这样的判断和操作，由于线程2操作晚于线程1，</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>ensureCapacityInternal(size + 1) elementData[size++] = e;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>非原子性操作，很可能导致线程1扩容并添加完成元素后，线程2的扩容导致线程1的操作全部被清空，进而导致数组大小与预期不符。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>public boolean add(E e) {
     ensureCapacityInternal(size + 1);  // Increments modCount!!
     elementData[size++] = e;
     return true;
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="改进" tabindex="-1"><a class="header-anchor" href="#改进"><span>改进</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/**
 * list线程不安全的示例
 */
public class baseArrayList {


    public static void main(String[] args) throws InterruptedException {
//        final List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        final List&lt;Integer&gt; list = Collections.synchronizedList(new ArrayList&lt;Integer&gt;());
//        final List&lt;Integer&gt; list =new CopyOnWriteArrayList&lt;Integer&gt;();

        // 线程A将0-1000添加到list
        new Thread(new Runnable() {
            public void run() {
                for (int i = 0; i &lt; 1000 ; i++) {
                    list.add(i);

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        // 线程B将1000-2000添加到列表
        new Thread(new Runnable() {
            public void run() {
                for (int i = 1000; i &lt; 2000 ; i++) {
                    list.add(i);

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        Thread.sleep(2000);



        // 打印所有结果
        for (int i = 0; i &lt; list.size(); i++) {
            System.out.println(&quot;第&quot; + (i + 1) + &quot;个元素为：&quot; + list.get(i));
        }
        System.out.println(&quot;list:size &quot;+list.size());
    }



}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过源码我们可以发现，这种操作不过是基于原有list的基础上加一个sync锁，虽然起到了线程安全的作用，但也很可能出现性能下降的风险。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> public boolean add(E e) {
            synchronized (mutex) {return c.add(e);}
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以我们就需要介绍更加强大的并发工具<strong>CopyOrWritterList</strong>，使用代码如下所示</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package collections.predecessor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * list线程不安全的示例
 */
public class baseArrayList {


    public static void main(String[] args) throws InterruptedException {
//        final List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
//        final List&lt;Integer&gt; list = Collections.synchronizedList(new ArrayList&lt;Integer&gt;());
        final List&lt;Integer&gt; list =new CopyOnWriteArrayList&lt;Integer&gt;();

        // 线程A将0-1000添加到list
        new Thread(new Runnable() {
            public void run() {
                for (int i = 0; i &lt; 1000 ; i++) {
                    list.add(i);

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        // 线程B将1000-2000添加到列表
        new Thread(new Runnable() {
            public void run() {
                for (int i = 1000; i &lt; 2000 ; i++) {
                    list.add(i);

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        Thread.sleep(2000);



        // 打印所有结果
        for (int i = 0; i &lt; list.size(); i++) {
            System.out.println(&quot;第&quot; + (i + 1) + &quot;个元素为：&quot; + list.get(i));
        }
        System.out.println(&quot;list:size &quot;+list.size());
    }



}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过源码我们可以发现，CopyOrWriteList添加保证线程安全的做法是加可重入锁，但是他每次进行写操作时都会赋值一份这就是导致大量写操作的情况下性能会十分差劲</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] elements = getArray();
            int len = elements.length;
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            newElements[len] = e;
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是读的情况下性能却非常优秀，没有加任何锁</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> public E get(int index) {
        return get(getArray(), index);
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要唯一注意的一点是，使用CopyOnWriteArrayList迭代器时，你在何时声明迭代器，后续无论如何添加，对他遍历的结果都没有任何作用，如下所示</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>public class CopyOnWriteArrayListBaseUse {

    /**
     * 读写分离，写不改变读的遍历
     * @param args
     */
    public static void main(String[] args) {
        CopyOnWriteArrayList&lt;Integer&gt; list=new CopyOnWriteArrayList&lt;&gt;();
//        ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();

        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);

        Iterator&lt;Integer&gt; it = list.iterator();
        while (it.hasNext()) {
            Integer cur = it.next();
            if (cur.equals(3)){
                Integer obj=5;
               list.remove(obj);
            }
            if (cur.equals(4)){
                list.add(444);
            }
            System.out.println(&quot;curNode &quot;+cur+&quot; list &quot;+list);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="并发容器" tabindex="-1"><a class="header-anchor" href="#并发容器"><span>并发容器</span></a></h1><h2 id="先行介绍一下hashmap" tabindex="-1"><a class="header-anchor" href="#先行介绍一下hashmap"><span>先行介绍一下HashMap</span></a></h2><h3 id="hashmap和优缺点" tabindex="-1"><a class="header-anchor" href="#hashmap和优缺点"><span>HashMap和优缺点</span></a></h3><p>传统HashMap(这里以jdk8为例)它底层就是基于一个数组实现的hash表，在单线程情况下，他的查找和添加、删除效率都是相当不错的。 但是，在单线程情况下，HashMap进行put操作可能会导致以下问题</p><ol><li>多线程put导致数据丢失</li><li>多线程put扩容导致数据丢失</li><li>多线程put扩容导致cpu 100%</li></ol><p>对于第三点，我们不妨先回顾以下HashMap的相关源码</p><p>添加操作源码</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>public V put(K key, V value)
{
    ......
    //算Hash值
    int hash = hash(key.hashCode());
    int i = indexFor(hash, table.length);
    //如果该key已被插入，则替换掉旧的value （链接操作）
    for (Entry&lt;K,V&gt; e = table[i]; e != null; e = e.next) {
        Object k;
        if (e.hash == hash &amp;&amp; ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }
    modCount++;
    //该key不存在，需要增加一个结点
    addEntry(hash, key, value, i);
    return null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>检查容量是否超标</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>void addEntry(int hash, K key, V value, int bucketIndex)
{
    Entry&lt;K,V&gt; e = table[bucketIndex];
    table[bucketIndex] = new Entry&lt;K,V&gt;(hash, key, value, e);
    //查看当前的size是否超过了我们设定的阈值threshold，如果超过，需要resize
    if (size++ &gt;= threshold)
        resize(2 * table.length);
} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>新建一个更大尺寸的hash表，然后把数据从老的Hash表中迁移到新的Hash表中。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>void resize(int newCapacity)
{
    Entry[] oldTable = table;
    int oldCapacity = oldTable.length;
    ......
    //创建一个新的Hash Table
    Entry[] newTable = new Entry[newCapacity];
    //将Old Hash Table上的数据迁移到New Hash Table上
    transfer(newTable);
    table = newTable;
    threshold = (int)(newCapacity * loadFactor);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>元素迁移的源代码</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>void transfer(Entry[] newTable)
{
    Entry[] src = table;
    int newCapacity = newTable.length;
    //下面这段代码的意思是：
    //  从OldTable里摘一个元素出来，然后放到NewTable中
    for (int j = 0; j &lt; src.length; j++) {
        Entry&lt;K,V&gt; e = src[j];
        if (e != null) {
            src[j] = null;
            do {
                Entry&lt;K,V&gt; next = e.next; //记录迁移节点的后继节点
                int i = indexFor(e.hash, newCapacity);
                e.next = newTable[i]; //指向新容器的第一个元素
                newTable[i] = e;//新容器链表头节点指向被迁移节点
                e = next; //将指向需要被迁移节点的指针，指向后继节点
            } while (e != null);
        }
    }
} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>了解了这些源码之后，我们不妨描述这样一个场景，我们现在声明了一个size为2的HashMap,添加3、7、5三个元素。 可以看到添加到5之后容量就超过2了。 所以我们需要进行元素迁移。 按照transfer代码来看，在单线程情况下3、7还是会被迁移到同一个槽位中。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260011338.webp" alt="img"></p><p>我们再来看看多线程情况下的bug。假如多线程情况下，我们线程1执行到<code>Entry&lt;K,V&gt; next = e.next; //记录迁移节点的后继节点</code>被挂起。线程完成像上文单线程的迁移操作。</p><p>线程1拿到cpu时间片再次回来执行。他会完成这样下述步骤：</p><ol><li>将key 3的元素的next指针指向线程1开辟的新容器的首节点，即null</li><li>新容器指向key为3</li><li>e指针指向7</li></ol><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260021924.png" alt="在这里插入图片描述"></p><p>然后在进行如下操作：</p><ol><li>next指向3</li><li>7的next指向新容器槽位3的第一个元素，即3</li><li>新容器头指针指向7</li><li>e指向3</li></ol><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260021483.png" alt="在这里插入图片描述"></p><p>最后我们会执行这样一个步骤：</p><ol><li>next指向7</li><li><code>e.next = newTable[i]</code> 3的next指向新容器的next即7于是环形链形成，cpu就此被打爆。</li></ol><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260021836.png" alt="image-20220926002148838"></p><h3 id="为什么jdk8的hashmap会在链表长度超过8的时候转为红黑树" tabindex="-1"><a class="header-anchor" href="#为什么jdk8的hashmap会在链表长度超过8的时候转为红黑树"><span>为什么jdk8的HashMap会在链表长度超过8的时候转为红黑树</span></a></h3><p>这里我们也可以补充一个有趣的事情，为什么jdk8的HashMap会在链表长度超过8的时候转为红黑树，当离散算法设计良好的话链表长度到达8的概率不到千分之一，假如你的链表长度达到8就说明你的hash算法设计的有问题，这时候就需要转为红黑树了</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> * 0:    0.60653066
     * 1:    0.30326533
     * 2:    0.07581633
     * 3:    0.01263606
     * 4:    0.00157952
     * 5:    0.00015795
     * 6:    0.00001316
     * 7:    0.00000094
     * 8:    0.00000006
     * more: less than 1 in ten million
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="图示以及源码了解concurrenthashmap在jdk7和jdk8的区别" tabindex="-1"><a class="header-anchor" href="#图示以及源码了解concurrenthashmap在jdk7和jdk8的区别"><span>图示以及源码了解ConcurrentHashMap在jdk7和jdk8的区别</span></a></h2><p>如下图所示，jdk7的concurentHashMap,可以看出jdk7版本的ConcurrentHashMap最外层是一个segment，内部结构就是和jdk7版本的HashMap一样的结构，依然是数组+链表形成的拉链法键值对。 而且每个segment都会持有一个reentrantLock,这使得各自的并发操作是互相不会影响的。所以你有几个segment就支持几个并发操作。 同样的缺点也很明显，正是因为这样的操作，导致我们若手动指定segment就会导致map无法进行扩容操作。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260052904.png" alt="image-20220926005229747"> <img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260052973.png" alt="image-20220926005212047"></p><p>相比之下jdk8版本的ConcurrentHashMap就与传统的HashMap无异了。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260052870.png" alt="image-20220926005249580">从源码中我们也能看出ConcurrentHashMap实现线程安全的核心核心</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">final</span> <span class="token class-name">V</span> <span class="token function">putVal</span><span class="token punctuation">(</span><span class="token class-name">K</span> key<span class="token punctuation">,</span> <span class="token class-name">V</span> value<span class="token punctuation">,</span> <span class="token keyword">boolean</span> onlyIfAbsent<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>key <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> value <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NullPointerException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> hash <span class="token operator">=</span> <span class="token function">spread</span><span class="token punctuation">(</span>key<span class="token punctuation">.</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> binCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> tab <span class="token operator">=</span> table<span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> f<span class="token punctuation">;</span> <span class="token keyword">int</span> n<span class="token punctuation">,</span> i<span class="token punctuation">,</span> fh<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>tab <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token punctuation">(</span>n <span class="token operator">=</span> tab<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
                tab <span class="token operator">=</span> <span class="token function">initTable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">//计算f在表的哪个位置</span>
            <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>f <span class="token operator">=</span> <span class="token function">tabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i <span class="token operator">=</span> <span class="token punctuation">(</span>n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> hash<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">casTabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
                             <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>                   <span class="token comment">// no lock when adding to empty bin</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>fh <span class="token operator">=</span> f<span class="token punctuation">.</span>hash<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token constant">MOVED</span><span class="token punctuation">)</span>
                tab <span class="token operator">=</span> <span class="token function">helpTransfer</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> f<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">else</span> <span class="token punctuation">{</span>
                <span class="token class-name">V</span> oldVal <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
                <span class="token comment">//使用节点作为锁完成元素添加操作</span>
                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>f<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">tabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i<span class="token punctuation">)</span> <span class="token operator">==</span> f<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token keyword">if</span> <span class="token punctuation">(</span>fh <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            binCount <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
                            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> e <span class="token operator">=</span> f<span class="token punctuation">;</span><span class="token punctuation">;</span> <span class="token operator">++</span>binCount<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                <span class="token class-name">K</span> ek<span class="token punctuation">;</span>
                            <span class="token comment">//如果key的值一样则执行覆盖逻辑</span>
                                <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>hash <span class="token operator">==</span> hash <span class="token operator">&amp;&amp;</span>
                                    <span class="token punctuation">(</span><span class="token punctuation">(</span>ek <span class="token operator">=</span> e<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token operator">==</span> key <span class="token operator">||</span>
                                     <span class="token punctuation">(</span>ek <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> key<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>ek<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                    oldVal <span class="token operator">=</span> e<span class="token punctuation">.</span>val<span class="token punctuation">;</span>
                                    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>onlyIfAbsent<span class="token punctuation">)</span>
                                        e<span class="token punctuation">.</span>val <span class="token operator">=</span> value<span class="token punctuation">;</span>
                                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                                <span class="token punctuation">}</span>
                                <span class="token comment">//如果后继节点为空则执行后继插入操作</span>
                                <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> pred <span class="token operator">=</span> e<span class="token punctuation">;</span>
                                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>e <span class="token operator">=</span> e<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                    pred<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span>
                                                              value<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                                <span class="token punctuation">}</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">}</span>
                        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>f <span class="token keyword">instanceof</span> <span class="token class-name">TreeBin</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span> p<span class="token punctuation">;</span>
                            binCount <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
                            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>p <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">TreeBin</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span>f<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">putTreeVal</span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span>
                                                           value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                oldVal <span class="token operator">=</span> p<span class="token punctuation">.</span>val<span class="token punctuation">;</span>
                                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>onlyIfAbsent<span class="token punctuation">)</span>
                                    p<span class="token punctuation">.</span>val <span class="token operator">=</span> value<span class="token punctuation">;</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>binCount <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>binCount <span class="token operator">&gt;=</span> <span class="token constant">TREEIFY_THRESHOLD</span><span class="token punctuation">)</span>
                        <span class="token function">treeifyBin</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldVal <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
                        <span class="token keyword">return</span> oldVal<span class="token punctuation">;</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">addCount</span><span class="token punctuation">(</span><span class="token number">1L</span><span class="token punctuation">,</span> binCount<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="concurrenthashmap使用注意事项" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap使用注意事项"><span>ConcurrentHashMap使用注意事项</span></a></h2><p>如下所示，由于+1并不是原子操作，所以这样使用很可能导致线程安全问题</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 描述：     ConcurrentHashMap错误使用示例
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcurrentHashMapDemo</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> thread1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMapDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> thread2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMapDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        thread1<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        thread2<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        thread1<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        thread2<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>




    <span class="token doc-comment comment">/**
     * 线程不安全示例
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">,</span> map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>


    <span class="token punctuation">}</span>


<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以正确方案可以是如下两种，需要了解的是第一种锁粒度太大了，建议使用ConcurrentHashMap提供的第二种解决方案</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 使用sync示例
 */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">ConcurrentHashMapDemo</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                 map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">,</span> map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
             <span class="token punctuation">}</span>
           <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
 <span class="token doc-comment comment">/**
     * 最佳线程安全使用示例
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                    <span class="token keyword">int</span> old<span class="token operator">=</span>map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">int</span> newVal<span class="token operator">=</span>old<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">;</span>
                    <span class="token keyword">boolean</span> b <span class="token operator">=</span> map<span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token string">&quot;k&quot;</span><span class="token punctuation">,</span> old<span class="token punctuation">,</span> newVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">{</span>
                        <span class="token keyword">break</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>



            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>


    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过源码我们就能发现它使用的添加操作工作原理和上述put差不多，锁也是锁节点，而不像我们一样锁一个类，减少了粒度，提高了性能。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260053186.png" alt="image-20220926005327166"></p><h2 id="阻塞队列" tabindex="-1"><a class="header-anchor" href="#阻塞队列"><span>阻塞队列</span></a></h2><h3 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h3><p>队列的作用在并发编程中也是非常重要的，通过并发队列，我们可以使用生产者和消费者模式的方式完成，数据在线程间的传递，同时也将线程安全的问题从我们转移到队列上。</p><h3 id="图解阻塞队列工作机制" tabindex="-1"><a class="header-anchor" href="#图解阻塞队列工作机制"><span>图解阻塞队列工作机制</span></a></h3><p>如下图所示，阻塞队列就是典型的生产者和消费者模式，当队列满时put就会阻塞，当队列为空时get就会为空。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260053188.png" alt="image-20220926005337197"></p><h3 id="阻塞队列常见方法" tabindex="-1"><a class="header-anchor" href="#阻塞队列常见方法"><span>阻塞队列常见方法</span></a></h3><ol><li>put、take:添加或取出操作可能会阻塞</li><li>add、remove、element:添加取出时可能会报异常</li><li>offer、poll(取出时会删除该元素)、peek:第三组操作完成后会有返回值</li></ol><h3 id="arrayblockingqueue" tabindex="-1"><a class="header-anchor" href="#arrayblockingqueue"><span>ArrayBlockingQueue</span></a></h3><p>如下所示，这就是典型阻塞队列用法，通过下属示例就会发现当队列满的时侯，就会阻塞put操作。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">collections<span class="token punctuation">.</span>queue</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ArrayBlockingQueue</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">BlockingQueue</span></span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ArrayBlockingQueueTest</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> queue <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayBlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Producer</span> producer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Producer</span><span class="token punctuation">(</span>queue<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Consumer1</span> consumer1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Consumer1</span><span class="token punctuation">(</span>queue<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>producer<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>consumer1<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token keyword">class</span> <span class="token class-name">Producer</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> queue<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">Producer</span><span class="token punctuation">(</span><span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> queue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;有10个人前来面试&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                queue<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;候选人&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;候选人&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot;入座&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            queue<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;stop&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;候选人全部入队&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token keyword">class</span> <span class="token class-name">Consumer1</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> queue<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">Consumer1</span><span class="token punctuation">(</span><span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> queue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//睡一会让生产者阻塞</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">String</span> man<span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span><span class="token string">&quot;stop&quot;</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>man <span class="token operator">=</span> queue<span class="token punctuation">.</span><span class="token function">take</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>man <span class="token operator">+</span> <span class="token string">&quot; 面试中。。。。。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;面试结束&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="其他队列简介" tabindex="-1"><a class="header-anchor" href="#其他队列简介"><span>其他队列简介</span></a></h3><h4 id="linkedblockingqueue" tabindex="-1"><a class="header-anchor" href="#linkedblockingqueue"><span>LinkedBlockingQueue</span></a></h4><ol><li>默认无界队列</li><li>如下所示，使用两把锁完成入队和出队操作</li></ol><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token doc-comment comment">/** Lock held by take, poll, etc */</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">ReentrantLock</span> takeLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token doc-comment comment">/** Lock held by put, offer, etc */</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">ReentrantLock</span> putLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="priorityblockingqueue" tabindex="-1"><a class="header-anchor" href="#priorityblockingqueue"><span>PriorityBlockingQueue</span></a></h4><ol><li>支持优先级</li><li>自然顺序</li><li>无界队列</li></ol><h4 id="synchronousqueue" tabindex="-1"><a class="header-anchor" href="#synchronousqueue"><span>SynchronousQueue</span></a></h4><ol><li><p>容量为0的队列</p></li><li><p>直接传递数据</p></li><li><p>cacheThread专用队列</p></li></ol><h4 id="concurrentlinkedqueue" tabindex="-1"><a class="header-anchor" href="#concurrentlinkedqueue"><span>ConcurrentLinkedQueue</span></a></h4><p>非阻塞队列，使用cas完成数据操作</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260054918.png" alt="image-20220926005358910"></p>`,100),l=[i];function p(c,o){return s(),a("div",null,l)}const r=n(t,[["render",p],["__file","Java中的并发容器.html.vue"]]),v=JSON.parse('{"path":"/JUC/Java%E4%B8%AD%E7%9A%84%E5%B9%B6%E5%8F%91%E5%AE%B9%E5%99%A8.html","title":"并发容器概览","lang":"zh-CN","frontmatter":{"description":"并发容器概览 在并发情况下，我经常需要一些容器来存储数据，对此我们的容器就必须考虑到线程安全问题，对此jdk也在这些场景为我们提供了如下并发容器 ConcurrentHashMap:线程安全的HashMap CopyOrWriteList:线程安全的list BlockingQueue:阻塞队列，非常适用于作为共享通道 传统的并发容器 简介 在jdk1...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/JUC/Java%E4%B8%AD%E7%9A%84%E5%B9%B6%E5%8F%91%E5%AE%B9%E5%99%A8.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"并发容器概览"}],["meta",{"property":"og:description","content":"并发容器概览 在并发情况下，我经常需要一些容器来存储数据，对此我们的容器就必须考虑到线程安全问题，对此jdk也在这些场景为我们提供了如下并发容器 ConcurrentHashMap:线程安全的HashMap CopyOrWriteList:线程安全的list BlockingQueue:阻塞队列，非常适用于作为共享通道 传统的并发容器 简介 在jdk1..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260011338.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"并发容器概览"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"并发容器概览\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260011338.webp\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260021924.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260021483.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260021836.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260052904.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260052973.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260052870.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260053186.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260053188.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209260054918.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\",\\"email\\":\\"maijunxuan0309@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":2,"title":"使用实例","slug":"使用实例","link":"#使用实例","children":[{"level":3,"title":"Vector示例以及源码解析","slug":"vector示例以及源码解析","link":"#vector示例以及源码解析","children":[]},{"level":3,"title":"hashTable示例以及源码解析","slug":"hashtable示例以及源码解析","link":"#hashtable示例以及源码解析","children":[]}]},{"level":2,"title":"基于arrayList示例","slug":"基于arraylist示例","link":"#基于arraylist示例","children":[]},{"level":2,"title":"改进","slug":"改进","link":"#改进","children":[]},{"level":2,"title":"先行介绍一下HashMap","slug":"先行介绍一下hashmap","link":"#先行介绍一下hashmap","children":[{"level":3,"title":"HashMap和优缺点","slug":"hashmap和优缺点","link":"#hashmap和优缺点","children":[]},{"level":3,"title":"为什么jdk8的HashMap会在链表长度超过8的时候转为红黑树","slug":"为什么jdk8的hashmap会在链表长度超过8的时候转为红黑树","link":"#为什么jdk8的hashmap会在链表长度超过8的时候转为红黑树","children":[]}]},{"level":2,"title":"图示以及源码了解ConcurrentHashMap在jdk7和jdk8的区别","slug":"图示以及源码了解concurrenthashmap在jdk7和jdk8的区别","link":"#图示以及源码了解concurrenthashmap在jdk7和jdk8的区别","children":[]},{"level":2,"title":"ConcurrentHashMap使用注意事项","slug":"concurrenthashmap使用注意事项","link":"#concurrenthashmap使用注意事项","children":[]},{"level":2,"title":"阻塞队列","slug":"阻塞队列","link":"#阻塞队列","children":[{"level":3,"title":"简介","slug":"简介-1","link":"#简介-1","children":[]},{"level":3,"title":"图解阻塞队列工作机制","slug":"图解阻塞队列工作机制","link":"#图解阻塞队列工作机制","children":[]},{"level":3,"title":"阻塞队列常见方法","slug":"阻塞队列常见方法","link":"#阻塞队列常见方法","children":[]},{"level":3,"title":"ArrayBlockingQueue","slug":"arrayblockingqueue","link":"#arrayblockingqueue","children":[]},{"level":3,"title":"其他队列简介","slug":"其他队列简介","link":"#其他队列简介","children":[]}]}],"git":{"createdTime":1664127765000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":13.27,"words":3982},"filePathRelative":"JUC/Java中的并发容器.md","localizedDate":"2022年9月25日","excerpt":"\\n<p>在并发情况下，我经常需要一些容器来存储数据，对此我们的容器就必须考虑到线程安全问题，对此jdk也在这些场景为我们提供了如下并发容器</p>\\n<ol>\\n<li>ConcurrentHashMap:线程安全的HashMap</li>\\n<li>CopyOrWriteList:线程安全的list</li>\\n<li>BlockingQueue:阻塞队列，非常适用于作为共享通道</li>\\n</ol>\\n<h1>传统的并发容器</h1>\\n<h2>简介</h2>\\n<p>在jdk1.2版本中以及为我们提供的线程安全的同期vector和hashtable，但是他们保证线程安全的方式是使用互斥锁sync，在高并发场景下，这种方式会使得性能大打折扣。</p>","autoDesc":true}');export{r as comp,v as data};
