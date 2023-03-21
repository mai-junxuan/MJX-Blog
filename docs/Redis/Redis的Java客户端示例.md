## Redis的Java客户端示例

## Jedis基础示例

#### maven项目引入jedis依赖

```
 <!--jedis依赖-->
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>3.2.0</version>
        </dependency>
```

#### 简介

实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用

#### 开启redis，并测试jedis连通性

若返回true则说明redis连接成功

```
 /**
     * 测试ping
     */
    @Test
    public void testPing() {
        Jedis jedis = new Jedis("127.0.0.1");
        String result = jedis.ping();
        System.out.println("ping返回的结果:" + result);
        System.out.println("PONG".equals(result));
        jedis.close();
    }
```

#### jedis操作字符串

```
/**
     * 测试str
     */
    @Test
    public void testStr() {
        Jedis jedis = new Jedis("127.0.0.1");
        jedis.set("key1", "str1");
        jedis.set("key2", "str2");
        jedis.set("key3", "str3");

        Set<String> keys = jedis.keys("*");
        int size = keys.size();
//        获取key的大小
        System.out.println("key size：" + size);

        //遍历所有的key
        for (String key : keys) {
            System.out.println("redis中的key： " + key);
        }

        //判断key是否存在
        System.out.println(jedis.exists("key1"));
        //查看key的ttl值
        System.out.println(jedis.ttl("key1"));
        //获取key的值
        System.out.println(jedis.get("key2"));

        jedis.close();

        jedis.flushDB();

        jedis.mset("key1", "value1", "key2", "value2");
        for (String key : jedis.keys("*")) {
            System.out.println("key " + key + "  value: " + jedis.get(key));
        }


    }
```

#### jedis操作列表

```
 @Test
    public void testList() {
        Jedis jedis = new Jedis("127.0.0.1");
        jedis.flushDB();
        jedis.rpush("list", "a");
        jedis.rpush("list", "b");
        jedis.rpush("list", "c");

        List<String> list = jedis.lrange("list", 0, -1);
        for (String ele : list) {
            System.out.println("list中的元素 " + ele);
        }
        jedis.close();
    }
```

#### 使用jedis操作集合

```
@Test
    public void testSet() {
        Jedis jedis = new Jedis("127.0.0.1");
        jedis.flushDB();
        jedis.sadd("set", "a");
        jedis.sadd("set", "b");
        jedis.sadd("set", "c");
        jedis.sadd("set", "c");
        jedis.sadd("set", "c");

        Set<String> smembers = jedis.smembers("set");
        for (String ele : smembers) {
            System.out.println("set中的元素 " + ele);
        }
        jedis.close();
    }
```

#### 使用jedis操作哈希

```
 @Test
    public void testHash() {
        Jedis jedis = new Jedis("127.0.0.1");
        jedis.flushDB();
        jedis.hset("user:1", "name", "xiaoming");
        jedis.hset("user:1", "age", "18");

        Map user2 = new HashMap();
        user2.put("name", "xiaowang");
        user2.put("age", "19");
        jedis.hmset("user:2", user2);

        List<String> user1Result = jedis.hmget("user:1", "name", "age");
        for (String s : user1Result) {
            System.out.println("user:1 " + s);
        }

        String age = jedis.hget("user:2", "age");
        System.out.println("user:2 age:" + age);
        jedis.close();
    }
```

#### 使用jedis操作有序集合

```
@Test
    public void testZset(){
        Jedis jedis = new Jedis("127.0.0.1");
        jedis.flushDB();
        jedis.zadd("zset",10,"a");
        jedis.zadd("zset",12,"b");
        jedis.zadd("zset",99,"c");
        jedis.zadd("zset",18,"d");
        jedis.zadd("zset",33,"e");

        Set<String> zset = jedis.zrange("zset", 0, -1);
        for (String s : zset) {
            System.out.println("zset "+s);
        }

        jedis.close();
    }
```

## 基于jedis连接池

#### 简介

使用上文的方式操作redis会使得每次操作都会新建TCP连接，如果用户操作不当很可能导致连接泄露，所以我们推荐通过jedis连接池的方式建立连接。

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209022045901.png)

#### 使用示例

可以看到笔者使用标准的异常捕获以及close方法归还jedis连接资源。

```
/**
     * jedis连接池
     */
    @Test
    public void testJedisPool() {
        GenericObjectPoolConfig jedisConfig = new GenericObjectPoolConfig();
//        最大连接数
        jedisConfig.setMaxTotal(GenericObjectPoolConfig.DEFAULT_MAX_TOTAL);
//        最大空闲连接数
        jedisConfig.setMaxIdle(GenericObjectPoolConfig.DEFAULT_MAX_IDLE);
        //最小空闲连接数
        jedisConfig.setMinIdle(GenericObjectPoolConfig.DEFAULT_MIN_IDLE);
        //开启jmx功能
        jedisConfig.setJmxEnabled(true);
        //设置连接池没有连接后 redis客户端等待获取连接的时长
        jedisConfig.setMaxWaitMillis(3000);

        JedisPool jedisPool = new JedisPool(jedisConfig, "127.0.0.1");
        Jedis jedis = null;

        try {
            jedis = jedisPool.getResource();
            jedis.flushDB();
            jedis.set("hello", "world");
            String hello = jedis.get("hello");
            System.out.println("get result from redis key:hello value: " + hello);
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            jedis.close();
        }


    }
```

至于为什么close不是关闭连接资源而是归还连接资源，从jedis源码我们就可以看出，当datasource不为空时，jedis做的就是将连接资源归还，而不是关闭。

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209012249400.png)

## 基于jedis完成短信验证码

#### 需求

```
/**
     * 1、输入手机号，点击发送后随机生成6位数字码，2分钟有效
     * 2、输入验证码，点击验证，返回成功或失败
     * 3、每个手机号每天只能申请3次验证码
     */
```

#### 实现

###### 生成验证码

```
private void generateCode(String phoneNum) {
        Jedis jedis = new Jedis("127.0.0.1");

        try {
            String countKey = "user:count:" + phoneNum;
            String count = jedis.get(countKey);
            if (count == null || "".equals(count)) {
                jedis.setex(countKey, 24 * 60 * 60, "1");
            } else if (Integer.valueOf(count) <= 2) {
                jedis.incr(countKey);
            } else {
                System.out.println("每个手机号每天只能申请3次验证码");
                return;
            }

            String code = String.valueOf((int) ((Math.random() * 9 + 1) * Math.pow(10, 5)));
            String codeKey = "user:code:" + phoneNum;
            System.out.println("key：" + countKey + "生成的验证码为:" + code);
            //输入手机号，点击发送后随机生成6位数字码，2分钟有效
            jedis.setex(codeKey, 120, code);
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }

    }
```

###### 校验

```
private void verify(String phoneNum, String code) {
        Jedis jedis = new Jedis("127.0.0.1");
        try {
            String redisCode = jedis.get("user:code:" + phoneNum);
            if (redisCode != null && !"".equals(redisCode) && redisCode.equals(code)) {
                System.out.println(phoneNum + "校验成功");
            } else {
                System.out.println(phoneNum + "校验失败");
            }

        } catch (Exception e) {

        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
```

###### 测试

```
 @Test
    public void captchaTest() {
        String phone = "123";
        generateCode(phone);

//        verify(phone,"469471");
    }
```

首先得到验证码

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209012249502.png)

再进行校验

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209012249971.png)

###### 测试申请3次验证码

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209012249854.png)

## spring boot整合Redis使用示例

#### 引入依赖

```
 <!-- redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- spring2.X集成redis所需common-pool2-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>
```

#### spring boot配置文件增加配置

```
server.port=8080
##Redis服务器地址
spring.redis.host=127.0.0.1
##Redis服务器连接端口
spring.redis.port=6379
##Redis数据库索引（默认为0）
spring.redis.database= 0
##连接超时时间（毫秒）
spring.redis.timeout=1800000
##连接池最大连接数（使用负值表示没有限制）
spring.redis.lettuce.pool.max-active=20
##最大阻塞等待时间(负数表示没限制)
spring.redis.lettuce.pool.max-wait=-1
##连接池中的最大空闲连接
spring.redis.lettuce.pool.max-idle=5
##连接池中的最小空闲连接
spring.redis.lettuce.pool.min-idle=0
```

#### 编写配置类

```
package com.example.demo.redisTemplate;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@EnableCaching
@Configuration
public class RedisConfig extends CachingConfigurerSupport {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setConnectionFactory(factory);
//key序列化方式
        template.setKeySerializer(redisSerializer);
//value序列化
        template.setValueSerializer(jackson2JsonRedisSerializer);
//value hashmap序列化
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        return template;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
//解决查询缓存转换异常的问题
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
// 配置序列化（解决乱码的问题）,过期时间600秒
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(600))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(redisSerializer))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jackson2JsonRedisSerializer))
                .disableCachingNullValues();
        RedisCacheManager cacheManager = RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
        return cacheManager;
    }
}

```

#### 测试类

```
@RestController
public class TestController {
    @Autowired
    private RedisTemplate redisTemplate;

    @RequestMapping("/set")
    public void setStr() {
        redisTemplate.opsForValue().set("user:1", "hello world");
    }

    @RequestMapping("/get")
    public String get() {
        return String.valueOf(redisTemplate.opsForValue().get("user:1"));
    }

}
```

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209012250625.png)
