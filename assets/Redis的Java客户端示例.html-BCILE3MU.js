import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-DDXXRmhs.js";const l={};function p(d,s){return e(),a("div",null,[...s[0]||(s[0]=[i(`<h2 id="redis的java客户端示例" tabindex="-1"><a class="header-anchor" href="#redis的java客户端示例"><span>Redis的Java客户端示例</span></a></h2><h2 id="jedis基础示例" tabindex="-1"><a class="header-anchor" href="#jedis基础示例"><span>Jedis基础示例</span></a></h2><h4 id="maven项目引入jedis依赖" tabindex="-1"><a class="header-anchor" href="#maven项目引入jedis依赖"><span>maven项目引入jedis依赖</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> &lt;!--jedis依赖--&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;redis.clients&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;jedis&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;3.2.0&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h4><p>实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用</p><h4 id="开启redis-并测试jedis连通性" tabindex="-1"><a class="header-anchor" href="#开启redis-并测试jedis连通性"><span>开启redis，并测试jedis连通性</span></a></h4><p>若返回true则说明redis连接成功</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> /**</span></span>
<span class="line"><span>     * 测试ping</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testPing() {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        String result = jedis.ping();</span></span>
<span class="line"><span>        System.out.println(&quot;ping返回的结果:&quot; + result);</span></span>
<span class="line"><span>        System.out.println(&quot;PONG&quot;.equals(result));</span></span>
<span class="line"><span>        jedis.close();</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jedis操作字符串" tabindex="-1"><a class="header-anchor" href="#jedis操作字符串"><span>jedis操作字符串</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>/**</span></span>
<span class="line"><span>     * 测试str</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testStr() {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        jedis.set(&quot;key1&quot;, &quot;str1&quot;);</span></span>
<span class="line"><span>        jedis.set(&quot;key2&quot;, &quot;str2&quot;);</span></span>
<span class="line"><span>        jedis.set(&quot;key3&quot;, &quot;str3&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Set&lt;String&gt; keys = jedis.keys(&quot;*&quot;);</span></span>
<span class="line"><span>        int size = keys.size();</span></span>
<span class="line"><span>//        获取key的大小</span></span>
<span class="line"><span>        System.out.println(&quot;key size：&quot; + size);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //遍历所有的key</span></span>
<span class="line"><span>        for (String key : keys) {</span></span>
<span class="line"><span>            System.out.println(&quot;redis中的key： &quot; + key);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //判断key是否存在</span></span>
<span class="line"><span>        System.out.println(jedis.exists(&quot;key1&quot;));</span></span>
<span class="line"><span>        //查看key的ttl值</span></span>
<span class="line"><span>        System.out.println(jedis.ttl(&quot;key1&quot;));</span></span>
<span class="line"><span>        //获取key的值</span></span>
<span class="line"><span>        System.out.println(jedis.get(&quot;key2&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        jedis.close();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        jedis.flushDB();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        jedis.mset(&quot;key1&quot;, &quot;value1&quot;, &quot;key2&quot;, &quot;value2&quot;);</span></span>
<span class="line"><span>        for (String key : jedis.keys(&quot;*&quot;)) {</span></span>
<span class="line"><span>            System.out.println(&quot;key &quot; + key + &quot;  value: &quot; + jedis.get(key));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jedis操作列表" tabindex="-1"><a class="header-anchor" href="#jedis操作列表"><span>jedis操作列表</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> @Test</span></span>
<span class="line"><span>    public void testList() {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        jedis.flushDB();</span></span>
<span class="line"><span>        jedis.rpush(&quot;list&quot;, &quot;a&quot;);</span></span>
<span class="line"><span>        jedis.rpush(&quot;list&quot;, &quot;b&quot;);</span></span>
<span class="line"><span>        jedis.rpush(&quot;list&quot;, &quot;c&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;String&gt; list = jedis.lrange(&quot;list&quot;, 0, -1);</span></span>
<span class="line"><span>        for (String ele : list) {</span></span>
<span class="line"><span>            System.out.println(&quot;list中的元素 &quot; + ele);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        jedis.close();</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用jedis操作集合" tabindex="-1"><a class="header-anchor" href="#使用jedis操作集合"><span>使用jedis操作集合</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@Test</span></span>
<span class="line"><span>    public void testSet() {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        jedis.flushDB();</span></span>
<span class="line"><span>        jedis.sadd(&quot;set&quot;, &quot;a&quot;);</span></span>
<span class="line"><span>        jedis.sadd(&quot;set&quot;, &quot;b&quot;);</span></span>
<span class="line"><span>        jedis.sadd(&quot;set&quot;, &quot;c&quot;);</span></span>
<span class="line"><span>        jedis.sadd(&quot;set&quot;, &quot;c&quot;);</span></span>
<span class="line"><span>        jedis.sadd(&quot;set&quot;, &quot;c&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Set&lt;String&gt; smembers = jedis.smembers(&quot;set&quot;);</span></span>
<span class="line"><span>        for (String ele : smembers) {</span></span>
<span class="line"><span>            System.out.println(&quot;set中的元素 &quot; + ele);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        jedis.close();</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用jedis操作哈希" tabindex="-1"><a class="header-anchor" href="#使用jedis操作哈希"><span>使用jedis操作哈希</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> @Test</span></span>
<span class="line"><span>    public void testHash() {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        jedis.flushDB();</span></span>
<span class="line"><span>        jedis.hset(&quot;user:1&quot;, &quot;name&quot;, &quot;xiaoming&quot;);</span></span>
<span class="line"><span>        jedis.hset(&quot;user:1&quot;, &quot;age&quot;, &quot;18&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Map user2 = new HashMap();</span></span>
<span class="line"><span>        user2.put(&quot;name&quot;, &quot;xiaowang&quot;);</span></span>
<span class="line"><span>        user2.put(&quot;age&quot;, &quot;19&quot;);</span></span>
<span class="line"><span>        jedis.hmset(&quot;user:2&quot;, user2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;String&gt; user1Result = jedis.hmget(&quot;user:1&quot;, &quot;name&quot;, &quot;age&quot;);</span></span>
<span class="line"><span>        for (String s : user1Result) {</span></span>
<span class="line"><span>            System.out.println(&quot;user:1 &quot; + s);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String age = jedis.hget(&quot;user:2&quot;, &quot;age&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;user:2 age:&quot; + age);</span></span>
<span class="line"><span>        jedis.close();</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用jedis操作有序集合" tabindex="-1"><a class="header-anchor" href="#使用jedis操作有序集合"><span>使用jedis操作有序集合</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@Test</span></span>
<span class="line"><span>    public void testZset(){</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        jedis.flushDB();</span></span>
<span class="line"><span>        jedis.zadd(&quot;zset&quot;,10,&quot;a&quot;);</span></span>
<span class="line"><span>        jedis.zadd(&quot;zset&quot;,12,&quot;b&quot;);</span></span>
<span class="line"><span>        jedis.zadd(&quot;zset&quot;,99,&quot;c&quot;);</span></span>
<span class="line"><span>        jedis.zadd(&quot;zset&quot;,18,&quot;d&quot;);</span></span>
<span class="line"><span>        jedis.zadd(&quot;zset&quot;,33,&quot;e&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Set&lt;String&gt; zset = jedis.zrange(&quot;zset&quot;, 0, -1);</span></span>
<span class="line"><span>        for (String s : zset) {</span></span>
<span class="line"><span>            System.out.println(&quot;zset &quot;+s);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        jedis.close();</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基于jedis连接池" tabindex="-1"><a class="header-anchor" href="#基于jedis连接池"><span>基于jedis连接池</span></a></h2><h4 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h4><p>使用上文的方式操作redis会使得每次操作都会新建TCP连接，如果用户操作不当很可能导致连接泄露，所以我们推荐通过jedis连接池的方式建立连接。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045901.png" alt="在这里插入图片描述"></p><h4 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例"><span>使用示例</span></a></h4><p>可以看到笔者使用标准的异常捕获以及close方法归还jedis连接资源。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>/**</span></span>
<span class="line"><span>     * jedis连接池</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testJedisPool() {</span></span>
<span class="line"><span>        GenericObjectPoolConfig jedisConfig = new GenericObjectPoolConfig();</span></span>
<span class="line"><span>//        最大连接数</span></span>
<span class="line"><span>        jedisConfig.setMaxTotal(GenericObjectPoolConfig.DEFAULT_MAX_TOTAL);</span></span>
<span class="line"><span>//        最大空闲连接数</span></span>
<span class="line"><span>        jedisConfig.setMaxIdle(GenericObjectPoolConfig.DEFAULT_MAX_IDLE);</span></span>
<span class="line"><span>        //最小空闲连接数</span></span>
<span class="line"><span>        jedisConfig.setMinIdle(GenericObjectPoolConfig.DEFAULT_MIN_IDLE);</span></span>
<span class="line"><span>        //开启jmx功能</span></span>
<span class="line"><span>        jedisConfig.setJmxEnabled(true);</span></span>
<span class="line"><span>        //设置连接池没有连接后 redis客户端等待获取连接的时长</span></span>
<span class="line"><span>        jedisConfig.setMaxWaitMillis(3000);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        JedisPool jedisPool = new JedisPool(jedisConfig, &quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        Jedis jedis = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            jedis = jedisPool.getResource();</span></span>
<span class="line"><span>            jedis.flushDB();</span></span>
<span class="line"><span>            jedis.set(&quot;hello&quot;, &quot;world&quot;);</span></span>
<span class="line"><span>            String hello = jedis.get(&quot;hello&quot;);</span></span>
<span class="line"><span>            System.out.println(&quot;get result from redis key:hello value: &quot; + hello);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            System.out.println(e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            jedis.close();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于为什么close不是关闭连接资源而是归还连接资源，从jedis源码我们就可以看出，当datasource不为空时，jedis做的就是将连接资源归还，而不是关闭。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249400.png" alt="在这里插入图片描述"></p><h2 id="基于jedis完成短信验证码" tabindex="-1"><a class="header-anchor" href="#基于jedis完成短信验证码"><span>基于jedis完成短信验证码</span></a></h2><h4 id="需求" tabindex="-1"><a class="header-anchor" href="#需求"><span>需求</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>/**</span></span>
<span class="line"><span>     * 1、输入手机号，点击发送后随机生成6位数字码，2分钟有效</span></span>
<span class="line"><span>     * 2、输入验证码，点击验证，返回成功或失败</span></span>
<span class="line"><span>     * 3、每个手机号每天只能申请3次验证码</span></span>
<span class="line"><span>     */</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="实现" tabindex="-1"><a class="header-anchor" href="#实现"><span>实现</span></a></h4><h6 id="生成验证码" tabindex="-1"><a class="header-anchor" href="#生成验证码"><span>生成验证码</span></a></h6><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>private void generateCode(String phoneNum) {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            String countKey = &quot;user:count:&quot; + phoneNum;</span></span>
<span class="line"><span>            String count = jedis.get(countKey);</span></span>
<span class="line"><span>            if (count == null || &quot;&quot;.equals(count)) {</span></span>
<span class="line"><span>                jedis.setex(countKey, 24 * 60 * 60, &quot;1&quot;);</span></span>
<span class="line"><span>            } else if (Integer.valueOf(count) &lt;= 2) {</span></span>
<span class="line"><span>                jedis.incr(countKey);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                System.out.println(&quot;每个手机号每天只能申请3次验证码&quot;);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            String code = String.valueOf((int) ((Math.random() * 9 + 1) * Math.pow(10, 5)));</span></span>
<span class="line"><span>            String codeKey = &quot;user:code:&quot; + phoneNum;</span></span>
<span class="line"><span>            System.out.println(&quot;key：&quot; + countKey + &quot;生成的验证码为:&quot; + code);</span></span>
<span class="line"><span>            //输入手机号，点击发送后随机生成6位数字码，2分钟有效</span></span>
<span class="line"><span>            jedis.setex(codeKey, 120, code);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            System.out.println(e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (jedis != null) {</span></span>
<span class="line"><span>                jedis.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="校验" tabindex="-1"><a class="header-anchor" href="#校验"><span>校验</span></a></h6><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>private void verify(String phoneNum, String code) {</span></span>
<span class="line"><span>        Jedis jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            String redisCode = jedis.get(&quot;user:code:&quot; + phoneNum);</span></span>
<span class="line"><span>            if (redisCode != null &amp;&amp; !&quot;&quot;.equals(redisCode) &amp;&amp; redisCode.equals(code)) {</span></span>
<span class="line"><span>                System.out.println(phoneNum + &quot;校验成功&quot;);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                System.out.println(phoneNum + &quot;校验失败&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (jedis != null) {</span></span>
<span class="line"><span>                jedis.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="测试" tabindex="-1"><a class="header-anchor" href="#测试"><span>测试</span></a></h6><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> @Test</span></span>
<span class="line"><span>    public void captchaTest() {</span></span>
<span class="line"><span>        String phone = &quot;123&quot;;</span></span>
<span class="line"><span>        generateCode(phone);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//        verify(phone,&quot;469471&quot;);</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先得到验证码</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249502.png" alt="在这里插入图片描述"></p><p>再进行校验</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249971.png" alt="在这里插入图片描述"></p><h6 id="测试申请3次验证码" tabindex="-1"><a class="header-anchor" href="#测试申请3次验证码"><span>测试申请3次验证码</span></a></h6><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249854.png" alt="在这里插入图片描述"></p><h2 id="spring-boot整合redis使用示例" tabindex="-1"><a class="header-anchor" href="#spring-boot整合redis使用示例"><span>spring boot整合Redis使用示例</span></a></h2><h4 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖"><span>引入依赖</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> &lt;!-- redis --&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- spring2.X集成redis所需common-pool2--&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.apache.commons&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;commons-pool2&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="spring-boot配置文件增加配置" tabindex="-1"><a class="header-anchor" href="#spring-boot配置文件增加配置"><span>spring boot配置文件增加配置</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>server.port=8080</span></span>
<span class="line"><span>##Redis服务器地址</span></span>
<span class="line"><span>spring.redis.host=127.0.0.1</span></span>
<span class="line"><span>##Redis服务器连接端口</span></span>
<span class="line"><span>spring.redis.port=6379</span></span>
<span class="line"><span>##Redis数据库索引（默认为0）</span></span>
<span class="line"><span>spring.redis.database= 0</span></span>
<span class="line"><span>##连接超时时间（毫秒）</span></span>
<span class="line"><span>spring.redis.timeout=1800000</span></span>
<span class="line"><span>##连接池最大连接数（使用负值表示没有限制）</span></span>
<span class="line"><span>spring.redis.lettuce.pool.max-active=20</span></span>
<span class="line"><span>##最大阻塞等待时间(负数表示没限制)</span></span>
<span class="line"><span>spring.redis.lettuce.pool.max-wait=-1</span></span>
<span class="line"><span>##连接池中的最大空闲连接</span></span>
<span class="line"><span>spring.redis.lettuce.pool.max-idle=5</span></span>
<span class="line"><span>##连接池中的最小空闲连接</span></span>
<span class="line"><span>spring.redis.lettuce.pool.min-idle=0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="编写配置类" tabindex="-1"><a class="header-anchor" href="#编写配置类"><span>编写配置类</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>package com.example.demo.redisTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.fasterxml.jackson.annotation.JsonAutoDetect;</span></span>
<span class="line"><span>import com.fasterxml.jackson.annotation.PropertyAccessor;</span></span>
<span class="line"><span>import com.fasterxml.jackson.databind.ObjectMapper;</span></span>
<span class="line"><span>import org.springframework.cache.CacheManager;</span></span>
<span class="line"><span>import org.springframework.cache.annotation.CachingConfigurerSupport;</span></span>
<span class="line"><span>import org.springframework.cache.annotation.EnableCaching;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Bean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span>import org.springframework.data.redis.cache.RedisCacheConfiguration;</span></span>
<span class="line"><span>import org.springframework.data.redis.cache.RedisCacheManager;</span></span>
<span class="line"><span>import org.springframework.data.redis.connection.RedisConnectionFactory;</span></span>
<span class="line"><span>import org.springframework.data.redis.core.RedisTemplate;</span></span>
<span class="line"><span>import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;</span></span>
<span class="line"><span>import org.springframework.data.redis.serializer.RedisSerializationContext;</span></span>
<span class="line"><span>import org.springframework.data.redis.serializer.RedisSerializer;</span></span>
<span class="line"><span>import org.springframework.data.redis.serializer.StringRedisSerializer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.Duration;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@EnableCaching</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class RedisConfig extends CachingConfigurerSupport {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public RedisTemplate&lt;String, Object&gt; redisTemplate(RedisConnectionFactory factory) {</span></span>
<span class="line"><span>        RedisTemplate&lt;String, Object&gt; template = new RedisTemplate&lt;&gt;();</span></span>
<span class="line"><span>        RedisSerializer&lt;String&gt; redisSerializer = new StringRedisSerializer();</span></span>
<span class="line"><span>        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);</span></span>
<span class="line"><span>        ObjectMapper om = new ObjectMapper();</span></span>
<span class="line"><span>        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);</span></span>
<span class="line"><span>        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);</span></span>
<span class="line"><span>        jackson2JsonRedisSerializer.setObjectMapper(om);</span></span>
<span class="line"><span>        template.setConnectionFactory(factory);</span></span>
<span class="line"><span>//key序列化方式</span></span>
<span class="line"><span>        template.setKeySerializer(redisSerializer);</span></span>
<span class="line"><span>//value序列化</span></span>
<span class="line"><span>        template.setValueSerializer(jackson2JsonRedisSerializer);</span></span>
<span class="line"><span>//value hashmap序列化</span></span>
<span class="line"><span>        template.setHashValueSerializer(jackson2JsonRedisSerializer);</span></span>
<span class="line"><span>        return template;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public CacheManager cacheManager(RedisConnectionFactory factory) {</span></span>
<span class="line"><span>        RedisSerializer&lt;String&gt; redisSerializer = new StringRedisSerializer();</span></span>
<span class="line"><span>        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);</span></span>
<span class="line"><span>//解决查询缓存转换异常的问题</span></span>
<span class="line"><span>        ObjectMapper om = new ObjectMapper();</span></span>
<span class="line"><span>        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);</span></span>
<span class="line"><span>        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);</span></span>
<span class="line"><span>        jackson2JsonRedisSerializer.setObjectMapper(om);</span></span>
<span class="line"><span>// 配置序列化（解决乱码的问题）,过期时间600秒</span></span>
<span class="line"><span>        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()</span></span>
<span class="line"><span>                .entryTtl(Duration.ofSeconds(600))</span></span>
<span class="line"><span>                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(redisSerializer))</span></span>
<span class="line"><span>                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jackson2JsonRedisSerializer))</span></span>
<span class="line"><span>                .disableCachingNullValues();</span></span>
<span class="line"><span>        RedisCacheManager cacheManager = RedisCacheManager.builder(factory)</span></span>
<span class="line"><span>                .cacheDefaults(config)</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        return cacheManager;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="测试类" tabindex="-1"><a class="header-anchor" href="#测试类"><span>测试类</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@RestController</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private RedisTemplate redisTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(&quot;/set&quot;)</span></span>
<span class="line"><span>    public void setStr() {</span></span>
<span class="line"><span>        redisTemplate.opsForValue().set(&quot;user:1&quot;, &quot;hello world&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(&quot;/get&quot;)</span></span>
<span class="line"><span>    public String get() {</span></span>
<span class="line"><span>        return String.valueOf(redisTemplate.opsForValue().get(&quot;user:1&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012250625.png" alt="在这里插入图片描述"></p>`,54)])])}const t=n(l,[["render",p]]),u=JSON.parse('{"path":"/Redis/Redis%E7%9A%84Java%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%A4%BA%E4%BE%8B.html","title":"","lang":"zh-CN","frontmatter":{"description":"Redis的Java客户端示例 Jedis基础示例 maven项目引入jedis依赖 简介 实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用 开启redis，并测试jedis连通性 若返回true则说明redis连接成功 jedis操作字符串 jedis操作列表 使用jedis操作集合 使用jedis操...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045901.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249400.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249502.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249971.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249854.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012250625.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\",\\"email\\":\\"maijunxuan0309@gmail.com\\"}]}"],["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/Redis%E7%9A%84Java%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%A4%BA%E4%BE%8B.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:description","content":"Redis的Java客户端示例 Jedis基础示例 maven项目引入jedis依赖 简介 实际上jedis很多api都和redis操作命令相同，我们完全可以通过调试快速掌握jedis的使用 开启redis，并测试jedis连通性 若返回true则说明redis连接成功 jedis操作字符串 jedis操作列表 使用jedis操作集合 使用jedis操..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045901.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}]]},"git":{"createdTime":1662316251000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","username":"MJX","email":"1585225345@qq.com","commits":3,"url":"https://github.com/MJX"}]},"readingTime":{"minutes":4.89,"words":1466},"filePathRelative":"Redis/Redis的Java客户端示例.md","excerpt":"<h2>Redis的Java客户端示例</h2>\\n<h2>Jedis基础示例</h2>\\n<h4>maven项目引入jedis依赖</h4>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span> &lt;!--jedis依赖--&gt;</span></span>\\n<span class=\\"line\\"><span>        &lt;dependency&gt;</span></span>\\n<span class=\\"line\\"><span>            &lt;groupId&gt;redis.clients&lt;/groupId&gt;</span></span>\\n<span class=\\"line\\"><span>            &lt;artifactId&gt;jedis&lt;/artifactId&gt;</span></span>\\n<span class=\\"line\\"><span>            &lt;version&gt;3.2.0&lt;/version&gt;</span></span>\\n<span class=\\"line\\"><span>        &lt;/dependency&gt;</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{t as comp,u as data};
