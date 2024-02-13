import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as i,c as n,a as s}from"./app-Digg1ELS.js";const d={},a=s(`<h2 id="redis的java客户端示例" tabindex="-1"><a class="header-anchor" href="#redis的java客户端示例"><span>Redis的Java客户端示例</span></a></h2><h2 id="jedis基础示例" tabindex="-1"><a class="header-anchor" href="#jedis基础示例"><span>Jedis基础示例</span></a></h2><h4 id="maven项目引入jedis依赖" tabindex="-1"><a class="header-anchor" href="#maven项目引入jedis依赖"><span>maven项目引入jedis依赖</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> &lt;!--jedis依赖--&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;redis.clients&lt;/groupId&gt;
            &lt;artifactId&gt;jedis&lt;/artifactId&gt;
            &lt;version&gt;3.2.0&lt;/version&gt;
        &lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h4><p>实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用</p><h4 id="开启redis-并测试jedis连通性" tabindex="-1"><a class="header-anchor" href="#开启redis-并测试jedis连通性"><span>开启redis，并测试jedis连通性</span></a></h4><p>若返回true则说明redis连接成功</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> /**
     * 测试ping
     */
    @Test
    public void testPing() {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        String result = jedis.ping();
        System.out.println(&quot;ping返回的结果:&quot; + result);
        System.out.println(&quot;PONG&quot;.equals(result));
        jedis.close();
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jedis操作字符串" tabindex="-1"><a class="header-anchor" href="#jedis操作字符串"><span>jedis操作字符串</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/**
     * 测试str
     */
    @Test
    public void testStr() {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        jedis.set(&quot;key1&quot;, &quot;str1&quot;);
        jedis.set(&quot;key2&quot;, &quot;str2&quot;);
        jedis.set(&quot;key3&quot;, &quot;str3&quot;);

        Set&lt;String&gt; keys = jedis.keys(&quot;*&quot;);
        int size = keys.size();
//        获取key的大小
        System.out.println(&quot;key size：&quot; + size);

        //遍历所有的key
        for (String key : keys) {
            System.out.println(&quot;redis中的key： &quot; + key);
        }

        //判断key是否存在
        System.out.println(jedis.exists(&quot;key1&quot;));
        //查看key的ttl值
        System.out.println(jedis.ttl(&quot;key1&quot;));
        //获取key的值
        System.out.println(jedis.get(&quot;key2&quot;));

        jedis.close();

        jedis.flushDB();

        jedis.mset(&quot;key1&quot;, &quot;value1&quot;, &quot;key2&quot;, &quot;value2&quot;);
        for (String key : jedis.keys(&quot;*&quot;)) {
            System.out.println(&quot;key &quot; + key + &quot;  value: &quot; + jedis.get(key));
        }


    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jedis操作列表" tabindex="-1"><a class="header-anchor" href="#jedis操作列表"><span>jedis操作列表</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> @Test
    public void testList() {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        jedis.flushDB();
        jedis.rpush(&quot;list&quot;, &quot;a&quot;);
        jedis.rpush(&quot;list&quot;, &quot;b&quot;);
        jedis.rpush(&quot;list&quot;, &quot;c&quot;);

        List&lt;String&gt; list = jedis.lrange(&quot;list&quot;, 0, -1);
        for (String ele : list) {
            System.out.println(&quot;list中的元素 &quot; + ele);
        }
        jedis.close();
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用jedis操作集合" tabindex="-1"><a class="header-anchor" href="#使用jedis操作集合"><span>使用jedis操作集合</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>@Test
    public void testSet() {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        jedis.flushDB();
        jedis.sadd(&quot;set&quot;, &quot;a&quot;);
        jedis.sadd(&quot;set&quot;, &quot;b&quot;);
        jedis.sadd(&quot;set&quot;, &quot;c&quot;);
        jedis.sadd(&quot;set&quot;, &quot;c&quot;);
        jedis.sadd(&quot;set&quot;, &quot;c&quot;);

        Set&lt;String&gt; smembers = jedis.smembers(&quot;set&quot;);
        for (String ele : smembers) {
            System.out.println(&quot;set中的元素 &quot; + ele);
        }
        jedis.close();
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用jedis操作哈希" tabindex="-1"><a class="header-anchor" href="#使用jedis操作哈希"><span>使用jedis操作哈希</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> @Test
    public void testHash() {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        jedis.flushDB();
        jedis.hset(&quot;user:1&quot;, &quot;name&quot;, &quot;xiaoming&quot;);
        jedis.hset(&quot;user:1&quot;, &quot;age&quot;, &quot;18&quot;);

        Map user2 = new HashMap();
        user2.put(&quot;name&quot;, &quot;xiaowang&quot;);
        user2.put(&quot;age&quot;, &quot;19&quot;);
        jedis.hmset(&quot;user:2&quot;, user2);

        List&lt;String&gt; user1Result = jedis.hmget(&quot;user:1&quot;, &quot;name&quot;, &quot;age&quot;);
        for (String s : user1Result) {
            System.out.println(&quot;user:1 &quot; + s);
        }

        String age = jedis.hget(&quot;user:2&quot;, &quot;age&quot;);
        System.out.println(&quot;user:2 age:&quot; + age);
        jedis.close();
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用jedis操作有序集合" tabindex="-1"><a class="header-anchor" href="#使用jedis操作有序集合"><span>使用jedis操作有序集合</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>@Test
    public void testZset(){
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        jedis.flushDB();
        jedis.zadd(&quot;zset&quot;,10,&quot;a&quot;);
        jedis.zadd(&quot;zset&quot;,12,&quot;b&quot;);
        jedis.zadd(&quot;zset&quot;,99,&quot;c&quot;);
        jedis.zadd(&quot;zset&quot;,18,&quot;d&quot;);
        jedis.zadd(&quot;zset&quot;,33,&quot;e&quot;);

        Set&lt;String&gt; zset = jedis.zrange(&quot;zset&quot;, 0, -1);
        for (String s : zset) {
            System.out.println(&quot;zset &quot;+s);
        }

        jedis.close();
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基于jedis连接池" tabindex="-1"><a class="header-anchor" href="#基于jedis连接池"><span>基于jedis连接池</span></a></h2><h4 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h4><p>使用上文的方式操作redis会使得每次操作都会新建TCP连接，如果用户操作不当很可能导致连接泄露，所以我们推荐通过jedis连接池的方式建立连接。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045901.png" alt="在这里插入图片描述"></p><h4 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例"><span>使用示例</span></a></h4><p>可以看到笔者使用标准的异常捕获以及close方法归还jedis连接资源。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/**
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

        JedisPool jedisPool = new JedisPool(jedisConfig, &quot;127.0.0.1&quot;);
        Jedis jedis = null;

        try {
            jedis = jedisPool.getResource();
            jedis.flushDB();
            jedis.set(&quot;hello&quot;, &quot;world&quot;);
            String hello = jedis.get(&quot;hello&quot;);
            System.out.println(&quot;get result from redis key:hello value: &quot; + hello);
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            jedis.close();
        }


    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于为什么close不是关闭连接资源而是归还连接资源，从jedis源码我们就可以看出，当datasource不为空时，jedis做的就是将连接资源归还，而不是关闭。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249400.png" alt="在这里插入图片描述"></p><h2 id="基于jedis完成短信验证码" tabindex="-1"><a class="header-anchor" href="#基于jedis完成短信验证码"><span>基于jedis完成短信验证码</span></a></h2><h4 id="需求" tabindex="-1"><a class="header-anchor" href="#需求"><span>需求</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/**
     * 1、输入手机号，点击发送后随机生成6位数字码，2分钟有效
     * 2、输入验证码，点击验证，返回成功或失败
     * 3、每个手机号每天只能申请3次验证码
     */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="实现" tabindex="-1"><a class="header-anchor" href="#实现"><span>实现</span></a></h4><h6 id="生成验证码" tabindex="-1"><a class="header-anchor" href="#生成验证码"><span>生成验证码</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>private void generateCode(String phoneNum) {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);

        try {
            String countKey = &quot;user:count:&quot; + phoneNum;
            String count = jedis.get(countKey);
            if (count == null || &quot;&quot;.equals(count)) {
                jedis.setex(countKey, 24 * 60 * 60, &quot;1&quot;);
            } else if (Integer.valueOf(count) &lt;= 2) {
                jedis.incr(countKey);
            } else {
                System.out.println(&quot;每个手机号每天只能申请3次验证码&quot;);
                return;
            }

            String code = String.valueOf((int) ((Math.random() * 9 + 1) * Math.pow(10, 5)));
            String codeKey = &quot;user:code:&quot; + phoneNum;
            System.out.println(&quot;key：&quot; + countKey + &quot;生成的验证码为:&quot; + code);
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="校验" tabindex="-1"><a class="header-anchor" href="#校验"><span>校验</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>private void verify(String phoneNum, String code) {
        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);
        try {
            String redisCode = jedis.get(&quot;user:code:&quot; + phoneNum);
            if (redisCode != null &amp;&amp; !&quot;&quot;.equals(redisCode) &amp;&amp; redisCode.equals(code)) {
                System.out.println(phoneNum + &quot;校验成功&quot;);
            } else {
                System.out.println(phoneNum + &quot;校验失败&quot;);
            }

        } catch (Exception e) {

        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="测试" tabindex="-1"><a class="header-anchor" href="#测试"><span>测试</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> @Test
    public void captchaTest() {
        String phone = &quot;123&quot;;
        generateCode(phone);

//        verify(phone,&quot;469471&quot;);
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先得到验证码</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249502.png" alt="在这里插入图片描述"></p><p>再进行校验</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249971.png" alt="在这里插入图片描述"></p><h6 id="测试申请3次验证码" tabindex="-1"><a class="header-anchor" href="#测试申请3次验证码"><span>测试申请3次验证码</span></a></h6><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249854.png" alt="在这里插入图片描述"></p><h2 id="spring-boot整合redis使用示例" tabindex="-1"><a class="header-anchor" href="#spring-boot整合redis使用示例"><span>spring boot整合Redis使用示例</span></a></h2><h4 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖"><span>引入依赖</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> &lt;!-- redis --&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
            &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;
        &lt;/dependency&gt;

        &lt;!-- spring2.X集成redis所需common-pool2--&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;org.apache.commons&lt;/groupId&gt;
            &lt;artifactId&gt;commons-pool2&lt;/artifactId&gt;
        &lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="spring-boot配置文件增加配置" tabindex="-1"><a class="header-anchor" href="#spring-boot配置文件增加配置"><span>spring boot配置文件增加配置</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>server.port=8080
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="编写配置类" tabindex="-1"><a class="header-anchor" href="#编写配置类"><span>编写配置类</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package com.example.demo.redisTemplate;

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
    public RedisTemplate&lt;String, Object&gt; redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate&lt;String, Object&gt; template = new RedisTemplate&lt;&gt;();
        RedisSerializer&lt;String&gt; redisSerializer = new StringRedisSerializer();
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
        RedisSerializer&lt;String&gt; redisSerializer = new StringRedisSerializer();
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="测试类" tabindex="-1"><a class="header-anchor" href="#测试类"><span>测试类</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>@RestController
public class TestController {
    @Autowired
    private RedisTemplate redisTemplate;

    @RequestMapping(&quot;/set&quot;)
    public void setStr() {
        redisTemplate.opsForValue().set(&quot;user:1&quot;, &quot;hello world&quot;);
    }

    @RequestMapping(&quot;/get&quot;)
    public String get() {
        return String.valueOf(redisTemplate.opsForValue().get(&quot;user:1&quot;));
    }

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012250625.png" alt="在这里插入图片描述"></p>`,54),l=[a];function t(r,u){return i(),n("div",null,l)}const o=e(d,[["render",t],["__file","Redis的Java客户端示例.html.vue"]]),m=JSON.parse('{"path":"/Redis/Redis%E7%9A%84Java%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%A4%BA%E4%BE%8B.html","title":"","lang":"zh-CN","frontmatter":{"description":"Redis的Java客户端示例 Jedis基础示例 maven项目引入jedis依赖 简介 实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用 开启redis，并测试jedis连通性 若返回true则说明redis连接成功 jedis操作字符串 jedis操作列表 使用jedis操作集合 使用jedis操...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/Redis%E7%9A%84Java%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%A4%BA%E4%BE%8B.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:description","content":"Redis的Java客户端示例 Jedis基础示例 maven项目引入jedis依赖 简介 实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用 开启redis，并测试jedis连通性 若返回true则说明redis连接成功 jedis操作字符串 jedis操作列表 使用jedis操作集合 使用jedis操..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045901.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045901.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249400.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249502.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249971.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249854.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012250625.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"Redis的Java客户端示例","slug":"redis的java客户端示例","link":"#redis的java客户端示例","children":[]},{"level":2,"title":"Jedis基础示例","slug":"jedis基础示例","link":"#jedis基础示例","children":[]},{"level":2,"title":"基于jedis连接池","slug":"基于jedis连接池","link":"#基于jedis连接池","children":[]},{"level":2,"title":"基于jedis完成短信验证码","slug":"基于jedis完成短信验证码","link":"#基于jedis完成短信验证码","children":[]},{"level":2,"title":"spring boot整合Redis使用示例","slug":"spring-boot整合redis使用示例","link":"#spring-boot整合redis使用示例","children":[]}],"git":{"createdTime":1662316251000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":4.89,"words":1466},"filePathRelative":"Redis/Redis的Java客户端示例.md","localizedDate":"2022年9月4日","excerpt":"<h2>Redis的Java客户端示例</h2>\\n<h2>Jedis基础示例</h2>\\n<h4>maven项目引入jedis依赖</h4>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code> &lt;!--jedis依赖--&gt;\\n        &lt;dependency&gt;\\n            &lt;groupId&gt;redis.clients&lt;/groupId&gt;\\n            &lt;artifactId&gt;jedis&lt;/artifactId&gt;\\n            &lt;version&gt;3.2.0&lt;/version&gt;\\n        &lt;/dependency&gt;\\n</code></pre></div>","autoDesc":true}');export{o as comp,m as data};
