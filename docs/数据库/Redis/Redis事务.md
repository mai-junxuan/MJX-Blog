# redis事务

## redis事务的定义

redis的事务是一个单独隔离的操作，它会将一系列指令按需排队并顺序执行，期间不会被其他客户端的指令插队。

## 事务三大指令multi、exec、discard

### 简介

1. multi:开启事务
2. exec:执行事务
3. 取消事务

如下图，通过multi，当前客户端就会开启事务，后续的指令都会安迅存到队列中。当用户键入exec后，这些指令都会按顺序执行。 若开启multi后输入若干指令，在键入discard，则之前的指令通通取消执行。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248019.png)

### 基础示例

开启事务并提交

```
# 开启事务
127.0.0.1:6379> MULTI
OK
# 将两个指令组队
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
# 执行两个指令
127.0.0.1:6379(TX)> EXEC
1) OK
2) OK
127.0.0.1:6379> keys *
1) "k1"
2) "k2"
127.0.0.1:6379>
```

## 事务的错误

### 组队时错误

如下，我们在组队时输入错误的指令，redis会之间将所有指令都会失效，因为这是一个问题队列。

```
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> set k33
(error) ERR wrong number of arguments for 'set' command
127.0.0.1:6379(TX)> set k4 v4
QUEUED
127.0.0.1:6379(TX)> exec
(error) EXECABORT Transaction discarded because of previous errors.
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379>
```

### 执行时错误

执行时错误比较特殊，他在按序处理所有指令，遇到错误就按正常流程处理继续执行下去。

```
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> INCR k1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> EXEC
1) OK
2) (error) ERR value is not an integer or out of range
3) OK
127.0.0.1:6379> keys *
1) "k1"
2) "k2"
127.0.0.1:6379>
```

### 小结

为什么组队时出错和运行时出错会出现两种不同的情况呢？其实我们可以这样理解:

```
1. 组队时出错，错误对于redis来说是已知的，从设计者的角度出发，对于已知的错误我们需要提醒用户进行处理，所以就让事务中的所有指令都失效。
2. 运行时出错:因为错误是未知的，所以redis必须执行时才能知道错误，而redis也无错误回滚机制，所以就出现了将错就错，继续执行后续指令并有效的情况。
```

## 为什么需要事务

## 高并发导致超卖问题

如下图，假设一个秒杀活动中有3个用户，高并发场景下,执行以下步骤

```
    1. 都从数据库中查询到商品，若大于0开抢，小于等于0通知用户秒杀活动结束
    2. 有两个用户线程在此期间休眠
    3. 1人抢到商品，数据库扣为0
    4. 另外两个线程此时复活，由于休眠前查询到库存为1，也都执行抢产品的逻辑，导致库存最终变为-2，出现超卖问题
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248643.png)

## 悲观锁

**悲观锁(Pessimistic Lock)** 认为自己操作的数据很可能会被他人修改，所以每次进行操作前都会对数据上锁，常见的关系型数据库MySQL的行锁、表锁等都是基于这种锁机制。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248871.png)

## 乐观锁

### 乐观锁简介

**乐观锁(Optimistic Lock)** 认为自己操作的数据不会被他人修改，当用户使用乐观锁锁住数据时，用户对拿到当前数据的版本号，修改完成后，会比较这个版本号和数据的版本号是否一致，若一致则说明别人没动过，提交修改操作。反之就是数据被他人动过，用户持有数据过期，提交失败。redis就是利用这种check and set机制实现事务的。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248505.png)

## 基于watch实现乐观锁

### 简介

redis就是通过CAS(check and set)实现乐观锁的，通过watch指令监听一个或者多个key值，当用户提交修改key值的事务时，会检查监听的key是否发生变化。若没有发生变化，则提交成功。

### 第一个客户端初始化key值并开启监听以及事务

```
# 刷新数据库
127.0.0.1:6379> FLUSHDB
OK
# 设置key值
127.0.0.1:6379> set key 10
OK
# 监听key
127.0.0.1:6379> WATCH key
OK
# 开启事务
127.0.0.1:6379> MULTI
OK

```

### 客户端2同样开启监听并开启事务

```
# 监听key
127.0.0.1:6379> WATCH key
OK
# 开启事务
127.0.0.1:6379> MULTI
OK
```

### 客户端1提交修改

```
# 指令加入队列
127.0.0.1:6379(TX)> INCR key
QUEUED
# 执行指令，可以看到执行成功，修改了一条数据，值被更新为11
127.0.0.1:6379(TX)> EXEC
1) (integer) 11
```

### 客户端2指令组队并提交

```
127.0.0.1:6379(TX)> INCR key
QUEUED
127.0.0.1:6379(TX)> exec
(nil)
```

### 小结

可以上到两个客户端同时监听一个key值，第一个客户端修改后，第2个客户端的修改就无法成功提交，说明redis的watch是基于乐观锁机制的。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248063.png)

## 更深入的理解事务

### 为什么redis不支持事务回滚

1. redis实际上是支持事务回滚的，只不过这种回滚是发生在指令组队阶段，因为这些指令是可以预知的。

2. 对于运行时出错，redis是不支持回滚的，因为情况是未知的，所以为了保证redis简单快速，所以设计者并未将运行时出错的事务回滚。

   ### 如何理解redis的事务与ACID

3. **原子性:** redis设计者认为他们是支持原子性的，因为原子性的概念是:所有指令要么全部执行，要么全部不执行。而非一起成功或者失败。

4. **一致性:** redis事务保证命令失败(组队时出错)的情况下可以回滚，确保了一致性。

5. **隔离性:** redis是基于单线程的，所以执行指令时不会被其他客户端打断，保证了隔离性。但是redis并没有像其他关系型数据库一样设计隔离级别。

6. **持久性:** 持久性的定义为**事务处理结束后，对数据的修改就是永久的**，**即便系统故障也不会丢失。**)，考虑到性能问题，redis无论rdb还是aof都是异步持久化，所以并不能保证持久性。

### Redis事务的其他实现

基于lua脚本可以保证redis指令一次性执按顺序执行完成，并且不会被其他客户端打断。我们可以将其想象为redis实现悲观锁的一种方式，但是这种方式却无法实现事务回滚。

## 事务三特性

1. **单独的隔离操作**:事务中的命令都会序列化并且按序执行，执行过程中不会被其他客户端的指令打断。
2. **没有隔离级别的概念**: 事务提交前所有指令都不会被执行。
3. **无原子性**:上文示例已经演示过，执行时出错某段指令，事务过程中的指令仍然会生效。

## 实践——基于redis事务实现秒杀

### 需求简介

我们使用一段简单的java代码实现一次秒杀活动,需求：

```
    1. 秒杀成功的用户不可重复参加活动
    2. 秒杀的产品为0时，用户不可进行秒杀
    3. 若仓库中不存着该产品，则提示活动未开始
```

### 基础代码

#### 示例

```
public boolean doSecKill(String uid, String productId) {
        if (uid == null || "".equals(uid)) {
            System.out.println("uid 不可为空");
            return false;
        }

        if (productId == null || "".equals(productId)) {
            System.out.println("productId 不可为空");
            return false;
        }

        Jedis jedis = null;
        try {
            jedis = new Jedis("127.0.0.1");
            String productCount = jedis.get("sk:" + productId);
            if (null == productCount || "".equals(productCount)) {
                System.out.println("秒杀还未开始");
                return false;
            }

            if (jedis.sadd("sk:users", uid) <= 0) {
                System.out.println("该用户已参与过秒杀活动,不可重复参加");
                return false;
            }

            int count = Integer.valueOf(productCount);
            if (count <= 0) {
                System.out.println("秒杀失败，谢谢参与");
                return false;
            }
            jedis.decr("sk:" + productId);
            jedis.sadd("sk:users", uid);
            return true;

        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }

        return true;
    }
```

#### 测试代码

##### 基础测试

首先我们在redis中设置好商品数量

```
127.0.0.1:6379> set sk:001 10
OK
127.0.0.1:6379> get sk:001
"10"
```

执行测试逻辑

```
 @Test
    public void secKillTest() {
        for (int i = 0; i < 15; i++) {
            doSecKill("" + i, "001");
        }

    }
```

可以看到代码正常运行并且库存被秒杀光了

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249600.png)

秒杀成功的用户是这几个

```
127.0.0.1:6379> SMEMBERS sk:users
 1) "0"
 2) "1"
 3) "2"
 4) "3"
 5) "4"
 6) "5"
 7) "6"
 8) "7"
 9) "8"
10) "9"
11) "10"
12) "11"
13) "12"
14) "13"
15) "14"
```

#### 存在问题

1. 超卖
2. 并发场景下容易出现redis请求超时

超卖测试用例，这里笔者为了简单快捷，就是用了juc的工具模拟并发并使用flushdb清空redis数据库，再设置10个库存量。

```
@Test
    public void concurrencySecKillTest() throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(1);
        ExecutorService threadPool = Executors.newFixedThreadPool(2000);
        for (int i = 0; i < 2000; i++) {
            final String uid = "" + i + 1;
            Runnable r = () -> {
                System.out.println("uid " + uid + "准备开抢");
                try {
                    countDownLatch.await();
                } catch (InterruptedException e) {
                    System.out.println("uid" + uid + "秒杀失败 原因:" + e);
                }
                boolean result = doSecKill(uid, "001");
                System.out.println("uid" + uid + " 秒杀结果 " + result);
            };
            threadPool.submit(r);

        }

        Thread.sleep(5000);
        System.out.println("秒杀开始");
        countDownLatch.countDown();
        threadPool.shutdown();
        while (!threadPool.isTerminated()) {

        }


    }
```

可以看到库存出现负数，这就大名鼎鼎的超卖问题。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249770.png)

如下图，由于查询库存，扣除库存，记录获奖用户三个指令对于每一个redis客户端来说都是独立的，所以又可能出现宏观上(即相差几毫秒)，n个用户查询到库存中有1个商品，然后各自执行扣除逻辑，导致库存出现超卖的情况。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249275.png)

### 改进(池化和增加事务解决超卖问题)

#### 示例

首先我们编写一个jedis池化工具解决偶现的redis请求超时问题

```
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class JedisPoolUtil {
    private static volatile JedisPool jedisPool = null;

    private JedisPoolUtil() {
    }

    public static JedisPool getJedisPoolInstance() {
        if (null == jedisPool) {
            synchronized (JedisPoolUtil.class) {
                if (null == jedisPool) {
                    JedisPoolConfig poolConfig = new JedisPoolConfig();
                    poolConfig.setMaxTotal(200);
                    poolConfig.setMaxIdle(32);
                    poolConfig.setMaxWaitMillis(100*1000);
                    poolConfig.setBlockWhenExhausted(true);
                    poolConfig.setTestOnBorrow(true);  // ping  PONG

                    jedisPool = new JedisPool(poolConfig, "127.0.0.1", 6379, 60000 );
                }
            }
        }
        return jedisPool;
    }

}
```

基于事务改进秒杀案例

```
public boolean doSecKill(String uid, String productId) {
        if (uid == null || "".equals(uid)) {
            System.out.println("uid 不可为空");
            return false;
        }

        if (productId == null || "".equals(productId)) {
            System.out.println("productId 不可为空");
            return false;
        }

        Jedis jedis = null;
        try {
            //避免redis连接超时
            jedis = JedisPoolUtil.getJedisPoolInstance().getResource();

            //监视库存 相当于拿到库存的乐观锁
            jedis.watch("sk:" + productId);


            String productCount = jedis.get("sk:" + productId);
            if (null == productCount || "".equals(productCount)) {
                System.out.println("秒杀还未开始");
                return false;
            }

            if (jedis.sismember("sk:success:uid", uid)) {
                System.out.println("该用户已成功秒杀，不可重复参加");
                return false;
            }

            //开启事务执行扣减操作
            Transaction multi = jedis.multi();

            int count = Integer.valueOf(productCount);
            if (count <= 0) {
                System.out.println("活动结束，谢谢参与");
//                jedis.close();
                return false;
            }
            multi.decr("sk:" + productId);
            multi.sadd("sk:success:uid", uid);

            List<Object> result = multi.exec();
            for (Object o : result) {
                System.out.println("执行结果: " + o.toString());
            }
            if (null == result || CollectionUtils.isEmpty(result)) {
                System.out.println("秒杀失败,谢谢参与");
                return false;
            }
            return true;

        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }

        return true;
    }
```

[测试

```
 @Test
    public void concurrencySecKillTest() throws InterruptedException {

        long start = System.currentTimeMillis();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        ExecutorService threadPool = Executors.newFixedThreadPool(2000);
        for (int i = 0; i < 10000; i++) {
            final String uid = "" + i + 1;
            Runnable r = () -> {
                System.out.println("uid " + uid + "准备开抢");
                try {
                    countDownLatch.await();
                } catch (InterruptedException e) {
                    System.out.println("uid" + uid + "秒杀失败 原因:" + e);
                }
                boolean result = doSecKill(uid, "001");
                System.out.println("uid" + uid + " 秒杀结果 " + result);
            };
            threadPool.submit(r);

        }

        Thread.sleep(1000);
        System.out.println("秒杀开始");
        countDownLatch.countDown();
        threadPool.shutdown();
        while (!threadPool.isTerminated()) {

        }

        long end = System.currentTimeMillis();
        long total = end - start;
        System.out.println("执行结束总执行时间 " + total);

    }
```

再次压测就会发现，这次就不会再出现超卖问题

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249152.png)

#### 存在问题

库存遗留问题，由于redis事务使用的是乐观锁，有可能出现大量用户操作数据过期而导致大量库存并没有被秒杀完的情况，对此我们可以增加一定的库存量来模拟库存遗留问题

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249382.png)

为了更好的演示这种情况，我们将库存设置为995个，开启1000个线程

```
@Test
    public void concurrencySecKillTest() throws InterruptedException {

        long start = System.currentTimeMillis();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        ExecutorService threadPool = Executors.newFixedThreadPool(2000);
        for (int i = 0; i < 1000; i++) {
            final String uid = "" + i + 1;
            Runnable r = () -> {
                System.out.println("uid " + uid + "准备开抢");
                try {
                    countDownLatch.await();
                } catch (InterruptedException e) {
                    System.out.println("uid" + uid + "秒杀失败 原因:" + e);
                }
                boolean result = doSecKill(uid, "001");
                System.out.println("uid" + uid + " 秒杀结果 " + result);
            };
            threadPool.submit(r);

        }

        Thread.sleep(1000);
        System.out.println("秒杀开始");
        countDownLatch.countDown();
        threadPool.shutdown();
        while (!threadPool.isTerminated()) {

        }

        long end = System.currentTimeMillis();
        long total = end - start;
        System.out.println("执行结束总执行时间 " + total);

    }
```

可以看到问题复现了

### 再改进(基于lua脚本解决库存遗留问题)

#### lua脚本的优势

1. 可以轻易调用redis使用的C语言库函数，也可以轻易被C语言代码调用
2. 具有一定原子性，将上述查询，扣减等逻辑全部编写到一个lua脚本中，避免宏观的并发查询和扣减，从而解决乐观锁的库存遗留问题

#### 代码示例

代码如下所示，这里笔者就不做测试了

```
public boolean doSecKillByLua(String uid, String productId) {
        Jedis jedis = null;

        try {
            jedis = JedisPoolUtil.getJedisPoolInstance().getResource();
            /**
             * uid KEYS[1] 用户传入的第一个变量,用户id
             * prodid KEYS[2] 用户传入的第2个变量 产品id
             * 若用户已在秒杀成功名单中返回-1
             * 若库存小于等于0 返回0
             * 反之调用成功返回1
             */
            String luaScript = "local uid=KEYS[1]; \n" +
                    "local prodid=KEYS[2];\n" +
                    "local productCount=\"sk:\"..prodid;\n" +
                    "local successUsers=\"sk:success:uid\"; \n" +
                    "local userExists=redis.call(\"sismember\",successUsers,uid);\n" +
                    "if tonumber(userExists)==1 then \n" +
                    "  return -1;\n" +
                    "end\n" +
                    "local num= redis.call(\"get\" ,productCount);\n" +
                    "if tonumber(num)<=0 then \n" +
                    "  return 0; \n" +
                    "else \n" +
                    "  redis.call(\"decr\",productCount);\n" +
                    "  redis.call(\"sadd\",successUsers,uid);\n" +
                    "end\n" +
                    "return 1;\n" +
                    "\n" +
                    "\n";

            String s = jedis.scriptLoad(luaScript);
            Object object = jedis.evalsha(s, 2, uid, productId);
            String result = String.valueOf(object);
            if ("-1".equals(result)) {
                System.out.println("当前用户以秒杀成功，不可重复");
                return false;
            } else if ("0".equals(result)) {
                System.out.println("活动结束");
                return false;
            } else if ("1".equals(result)) {
                System.out.println("uid:" + uid + "秒杀成功");
                return true;
            }

            return false;
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            jedis.close();
        }
        return false;
    }
```

### 更进一步反思，基于java锁的性能是否比lua脚本更优越

#### 代码示例

以下便是java锁实现的秒杀案例的代码

```
public boolean doSecKill3(String uid, String productId) {
        if (uid == null || "".equals(uid)) {
            System.out.println("uid 不可为空");
            return false;
        }

        if (productId == null || "".equals(productId)) {
            System.out.println("productId 不可为空");
            return false;
        }

        Jedis jedis = null;
        try {
            //避免redis连接超时
            jedis = JedisPoolUtil.getJedisPoolInstance().getResource();
            synchronized (SecKillTest.class) {
                //监视库存 相当于拿到库存的乐观锁
                jedis.watch("sk:" + productId);


                String productCount = jedis.get("sk:" + productId);
                if (null == productCount || "".equals(productCount)) {
                    System.out.println("秒杀还未开始");
                    return false;
                }

                if (jedis.sismember("sk:success:uid", uid)) {
                    System.out.println("该用户已成功秒杀，不可重复参加");
                    return false;
                }


                //开启事务执行扣减操作
                Transaction multi = jedis.multi();

                int count = Integer.valueOf(productCount);
                if (count <= 0) {
                    System.out.println("活动结束，谢谢参与");
                    return false;
                }
                multi.decr("sk:" + productId);
                multi.sadd("sk:success:uid", uid);

                List<Object> result = multi.exec();

                if (null == result || CollectionUtils.isEmpty(result)) {
                    System.out.println("秒杀失败,谢谢参与");
                    return false;
                }
                return true;
            }


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }

        return true;
    }
```

#### 性能评测

##### 基于java锁

我们同样设置9990个库存和10000个线程来看看效果

基于java锁的测试代码

```
@Test
    public void concurrencySecKillTest() throws InterruptedException {

        long start = System.currentTimeMillis();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        ExecutorService threadPool = Executors.newFixedThreadPool(2000);
        for (int i = 0; i < 10000; i++) {
            final String uid = "" + i + 1;
            Runnable r = () -> {
                System.out.println("uid " + uid + "准备开抢");
                try {
                    countDownLatch.await();
                } catch (InterruptedException e) {
                    System.out.println("uid" + uid + "秒杀失败 原因:" + e);
                }
                boolean result = doSecKill3(uid, "001");
                System.out.println("uid" + uid + " 秒杀结果 " + result);
            };
            threadPool.submit(r);

        }

        Thread.sleep(1000);
        System.out.println("秒杀开始");
        countDownLatch.countDown();
        threadPool.shutdown();
        while (!threadPool.isTerminated()) {

        }

        long end = System.currentTimeMillis();
        long total = end - start;
        System.out.println("执行结束总执行时间 " + total);

    }
```

执行时间

```
执行结束总执行时间 5091
```

##### 基于lua脚本

```
@Test
    public void concurrencySecKillTest() throws InterruptedException {

        long start = System.currentTimeMillis();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        ExecutorService threadPool = Executors.newFixedThreadPool(2000);
        for (int i = 0; i < 10000; i++) {
            final String uid = "" + i + 1;
            Runnable r = () -> {
                System.out.println("uid " + uid + "准备开抢");
                try {
                    countDownLatch.await();
                } catch (InterruptedException e) {
                    System.out.println("uid" + uid + "秒杀失败 原因:" + e);
                }
                boolean result = doSecKillByLua(uid, "001");
                System.out.println("uid" + uid + " 秒杀结果 " + result);
            };
            threadPool.submit(r);

        }

        Thread.sleep(1000);
        System.out.println("秒杀开始");
        countDownLatch.countDown();
        threadPool.shutdown();
        while (!threadPool.isTerminated()) {

        }

        long end = System.currentTimeMillis();
        long total = end - start;
        System.out.println("执行结束总执行时间 " + total);

    }
```

执行时间

```
执行结束总执行时间 4180
```

##### 小结

由于lua脚本更接近底层的调用C语言代码，所以执行效率相比java锁更加高效。

## 面试题

### 如何使用 Redis 事务？

```
Redis 可以通过 MULTI，EXEC，DISCARD 和 WATCH 等命令来实现事务(transaction)功能。
```

### Redis 支持原子性吗？

```
redis事务出错不回滚使得很多人认为redis事务是未被原子性这一原则的，实际上redis设计者不这么认为，因为redis设计者认为原子性的定义为:所有指令要么一起执行，要么全都不执行，而不是完全成功。
```

### 如何解决 Redis 事务的缺陷？

```
从上文我们看出基于redis事务进行秒杀方面的需求时会出现库存遗留问题，这就是redis事务乐观锁机制的缺陷。
为了保证所有事务都能一次性的执行，我们可以使用lua脚本更快(lua脚本可以轻易调用C语言库函数以及被C语言直接调用)、更有效(基于lua脚本可以保证指令一次性被执行不会被其他线程打断)，但是这种方案不支持回滚。
```