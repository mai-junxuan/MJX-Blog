import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-DDXXRmhs.js";const l={};function p(d,s){return e(),a("div",null,[...s[0]||(s[0]=[i(`<h1 id="redis事务" tabindex="-1"><a class="header-anchor" href="#redis事务"><span>redis事务</span></a></h1><h2 id="redis事务的定义" tabindex="-1"><a class="header-anchor" href="#redis事务的定义"><span>redis事务的定义</span></a></h2><p>redis的事务是一个单独隔离的操作，它会将一系列指令按需排队并顺序执行，期间不会被其他客户端的指令插队。</p><h2 id="事务三大指令multi、exec、discard" tabindex="-1"><a class="header-anchor" href="#事务三大指令multi、exec、discard"><span>事务三大指令multi、exec、discard</span></a></h2><h3 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h3><ol><li>multi:开启事务</li><li>exec:执行事务</li><li>取消事务</li></ol><p>如下图，通过multi，当前客户端就会开启事务，后续的指令都会安迅存到队列中。当用户键入exec后，这些指令都会按顺序执行。 若开启multi后输入若干指令，在键入discard，则之前的指令通通取消执行。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248019.png" alt="在这里插入图片描述"></p><h3 id="基础示例" tabindex="-1"><a class="header-anchor" href="#基础示例"><span>基础示例</span></a></h3><p>开启事务并提交</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 开启事务</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span># 将两个指令组队</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k1 v1</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k2 v2</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span># 执行两个指令</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; EXEC</span></span>
<span class="line"><span>1) OK</span></span>
<span class="line"><span>2) OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; keys *</span></span>
<span class="line"><span>1) &quot;k1&quot;</span></span>
<span class="line"><span>2) &quot;k2&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="事务的错误" tabindex="-1"><a class="header-anchor" href="#事务的错误"><span>事务的错误</span></a></h2><h3 id="组队时错误" tabindex="-1"><a class="header-anchor" href="#组队时错误"><span>组队时错误</span></a></h3><p>如下，我们在组队时输入错误的指令，redis会之间将所有指令都会失效，因为这是一个问题队列。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k1 v1</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k2 v2</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k33</span></span>
<span class="line"><span>(error) ERR wrong number of arguments for &#39;set&#39; command</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k4 v4</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; exec</span></span>
<span class="line"><span>(error) EXECABORT Transaction discarded because of previous errors.</span></span>
<span class="line"><span>127.0.0.1:6379&gt; keys *</span></span>
<span class="line"><span>(empty array)</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="执行时错误" tabindex="-1"><a class="header-anchor" href="#执行时错误"><span>执行时错误</span></a></h3><p>执行时错误比较特殊，他在按序处理所有指令，遇到错误就按正常流程处理继续执行下去。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k1 v1</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; INCR k1</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; set k2 v2</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; EXEC</span></span>
<span class="line"><span>1) OK</span></span>
<span class="line"><span>2) (error) ERR value is not an integer or out of range</span></span>
<span class="line"><span>3) OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; keys *</span></span>
<span class="line"><span>1) &quot;k1&quot;</span></span>
<span class="line"><span>2) &quot;k2&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h3><p>为什么组队时出错和运行时出错会出现两种不同的情况呢？其实我们可以这样理解:</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>1. 组队时出错，错误对于redis来说是已知的，从设计者的角度出发，对于已知的错误我们需要提醒用户进行处理，所以就让事务中的所有指令都失效。</span></span>
<span class="line"><span>2. 运行时出错:因为错误是未知的，所以redis必须执行时才能知道错误，而redis也无错误回滚机制，所以就出现了将错就错，继续执行后续指令并有效的情况。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="为什么需要事务" tabindex="-1"><a class="header-anchor" href="#为什么需要事务"><span>为什么需要事务</span></a></h2><h2 id="高并发导致超卖问题" tabindex="-1"><a class="header-anchor" href="#高并发导致超卖问题"><span>高并发导致超卖问题</span></a></h2><p>如下图，假设一个秒杀活动中有3个用户，高并发场景下,执行以下步骤</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>    1. 都从数据库中查询到商品，若大于0开抢，小于等于0通知用户秒杀活动结束</span></span>
<span class="line"><span>    2. 有两个用户线程在此期间休眠</span></span>
<span class="line"><span>    3. 1人抢到商品，数据库扣为0</span></span>
<span class="line"><span>    4. 另外两个线程此时复活，由于休眠前查询到库存为1，也都执行抢产品的逻辑，导致库存最终变为-2，出现超卖问题</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248643.png" alt="在这里插入图片描述"></p><h2 id="悲观锁" tabindex="-1"><a class="header-anchor" href="#悲观锁"><span>悲观锁</span></a></h2><p><strong>悲观锁(Pessimistic Lock)</strong> 认为自己操作的数据很可能会被他人修改，所以每次进行操作前都会对数据上锁，常见的关系型数据库MySQL的行锁、表锁等都是基于这种锁机制。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248871.png" alt="在这里插入图片描述"></p><h2 id="乐观锁" tabindex="-1"><a class="header-anchor" href="#乐观锁"><span>乐观锁</span></a></h2><h3 id="乐观锁简介" tabindex="-1"><a class="header-anchor" href="#乐观锁简介"><span>乐观锁简介</span></a></h3><p><strong>乐观锁(Optimistic Lock)</strong> 认为自己操作的数据不会被他人修改，当用户使用乐观锁锁住数据时，用户对拿到当前数据的版本号，修改完成后，会比较这个版本号和数据的版本号是否一致，若一致则说明别人没动过，提交修改操作。反之就是数据被他人动过，用户持有数据过期，提交失败。redis就是利用这种check and set机制实现事务的。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248505.png" alt="在这里插入图片描述"></p><h2 id="基于watch实现乐观锁" tabindex="-1"><a class="header-anchor" href="#基于watch实现乐观锁"><span>基于watch实现乐观锁</span></a></h2><h3 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h3><p>redis就是通过CAS(check and set)实现乐观锁的，通过watch指令监听一个或者多个key值，当用户提交修改key值的事务时，会检查监听的key是否发生变化。若没有发生变化，则提交成功。</p><h3 id="第一个客户端初始化key值并开启监听以及事务" tabindex="-1"><a class="header-anchor" href="#第一个客户端初始化key值并开启监听以及事务"><span>第一个客户端初始化key值并开启监听以及事务</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 刷新数据库</span></span>
<span class="line"><span>127.0.0.1:6379&gt; FLUSHDB</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span># 设置key值</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set key 10</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span># 监听key</span></span>
<span class="line"><span>127.0.0.1:6379&gt; WATCH key</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span># 开启事务</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端2同样开启监听并开启事务" tabindex="-1"><a class="header-anchor" href="#客户端2同样开启监听并开启事务"><span>客户端2同样开启监听并开启事务</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 监听key</span></span>
<span class="line"><span>127.0.0.1:6379&gt; WATCH key</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span># 开启事务</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端1提交修改" tabindex="-1"><a class="header-anchor" href="#客户端1提交修改"><span>客户端1提交修改</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 指令加入队列</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; INCR key</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span># 执行指令，可以看到执行成功，修改了一条数据，值被更新为11</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; EXEC</span></span>
<span class="line"><span>1) (integer) 11</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端2指令组队并提交" tabindex="-1"><a class="header-anchor" href="#客户端2指令组队并提交"><span>客户端2指令组队并提交</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>127.0.0.1:6379(TX)&gt; INCR key</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379(TX)&gt; exec</span></span>
<span class="line"><span>(nil)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="小结-1" tabindex="-1"><a class="header-anchor" href="#小结-1"><span>小结</span></a></h3><p>可以上到两个客户端同时监听一个key值，第一个客户端修改后，第2个客户端的修改就无法成功提交，说明redis的watch是基于乐观锁机制的。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248063.png" alt="在这里插入图片描述"></p><h2 id="更深入的理解事务" tabindex="-1"><a class="header-anchor" href="#更深入的理解事务"><span>更深入的理解事务</span></a></h2><h3 id="为什么redis不支持事务回滚" tabindex="-1"><a class="header-anchor" href="#为什么redis不支持事务回滚"><span>为什么redis不支持事务回滚</span></a></h3><ol><li><p>redis实际上是支持事务回滚的，只不过这种回滚是发生在指令组队阶段，因为这些指令是可以预知的。</p></li><li><p>对于运行时出错，redis是不支持回滚的，因为情况是未知的，所以为了保证redis简单快速，所以设计者并未将运行时出错的事务回滚。</p><h3 id="如何理解redis的事务与acid" tabindex="-1"><a class="header-anchor" href="#如何理解redis的事务与acid"><span>如何理解redis的事务与ACID</span></a></h3></li><li><p><strong>原子性:</strong> redis设计者认为他们是支持原子性的，因为原子性的概念是:所有指令要么全部执行，要么全部不执行。而非一起成功或者失败。</p></li><li><p><strong>一致性:</strong> redis事务保证命令失败(组队时出错)的情况下可以回滚，确保了一致性。</p></li><li><p><strong>隔离性:</strong> redis是基于单线程的，所以执行指令时不会被其他客户端打断，保证了隔离性。但是redis并没有像其他关系型数据库一样设计隔离级别。</p></li><li><p><strong>持久性:</strong> 持久性的定义为<strong>事务处理结束后，对数据的修改就是永久的</strong>，<strong>即便系统故障也不会丢失。</strong>)，考虑到性能问题，redis无论rdb还是aof都是异步持久化，所以并不能保证持久性。</p></li></ol><h3 id="redis事务的其他实现" tabindex="-1"><a class="header-anchor" href="#redis事务的其他实现"><span>Redis事务的其他实现</span></a></h3><p>基于lua脚本可以保证redis指令一次性执按顺序执行完成，并且不会被其他客户端打断。我们可以将其想象为redis实现悲观锁的一种方式，但是这种方式却无法实现事务回滚。</p><h2 id="事务三特性" tabindex="-1"><a class="header-anchor" href="#事务三特性"><span>事务三特性</span></a></h2><ol><li><strong>单独的隔离操作</strong>:事务中的命令都会序列化并且按序执行，执行过程中不会被其他客户端的指令打断。</li><li><strong>没有隔离级别的概念</strong>: 事务提交前所有指令都不会被执行。</li><li><strong>无原子性</strong>:上文示例已经演示过，执行时出错某段指令，事务过程中的指令仍然会生效。</li></ol><h2 id="实践——基于redis事务实现秒杀" tabindex="-1"><a class="header-anchor" href="#实践——基于redis事务实现秒杀"><span>实践——基于redis事务实现秒杀</span></a></h2><h3 id="需求简介" tabindex="-1"><a class="header-anchor" href="#需求简介"><span>需求简介</span></a></h3><p>我们使用一段简单的java代码实现一次秒杀活动,需求：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>    1. 秒杀成功的用户不可重复参加活动</span></span>
<span class="line"><span>    2. 秒杀的产品为0时，用户不可进行秒杀</span></span>
<span class="line"><span>    3. 若仓库中不存着该产品，则提示活动未开始</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基础代码" tabindex="-1"><a class="header-anchor" href="#基础代码"><span>基础代码</span></a></h3><h4 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>public boolean doSecKill(String uid, String productId) {</span></span>
<span class="line"><span>        if (uid == null || &quot;&quot;.equals(uid)) {</span></span>
<span class="line"><span>            System.out.println(&quot;uid 不可为空&quot;);</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (productId == null || &quot;&quot;.equals(productId)) {</span></span>
<span class="line"><span>            System.out.println(&quot;productId 不可为空&quot;);</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Jedis jedis = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            jedis = new Jedis(&quot;127.0.0.1&quot;);</span></span>
<span class="line"><span>            String productCount = jedis.get(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span>            if (null == productCount || &quot;&quot;.equals(productCount)) {</span></span>
<span class="line"><span>                System.out.println(&quot;秒杀还未开始&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (jedis.sadd(&quot;sk:users&quot;, uid) &lt;= 0) {</span></span>
<span class="line"><span>                System.out.println(&quot;该用户已参与过秒杀活动,不可重复参加&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            int count = Integer.valueOf(productCount);</span></span>
<span class="line"><span>            if (count &lt;= 0) {</span></span>
<span class="line"><span>                System.out.println(&quot;秒杀失败，谢谢参与&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            jedis.decr(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span>            jedis.sadd(&quot;sk:users&quot;, uid);</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            System.out.println(e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (jedis != null) {</span></span>
<span class="line"><span>                jedis.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="测试代码" tabindex="-1"><a class="header-anchor" href="#测试代码"><span>测试代码</span></a></h4><h5 id="基础测试" tabindex="-1"><a class="header-anchor" href="#基础测试"><span>基础测试</span></a></h5><p>首先我们在redis中设置好商品数量</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>127.0.0.1:6379&gt; set sk:001 10</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get sk:001</span></span>
<span class="line"><span>&quot;10&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行测试逻辑</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> @Test</span></span>
<span class="line"><span>    public void secKillTest() {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 15; i++) {</span></span>
<span class="line"><span>            doSecKill(&quot;&quot; + i, &quot;001&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到代码正常运行并且库存被秒杀光了</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249600.png" alt="在这里插入图片描述"></p><p>秒杀成功的用户是这几个</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>127.0.0.1:6379&gt; SMEMBERS sk:users</span></span>
<span class="line"><span> 1) &quot;0&quot;</span></span>
<span class="line"><span> 2) &quot;1&quot;</span></span>
<span class="line"><span> 3) &quot;2&quot;</span></span>
<span class="line"><span> 4) &quot;3&quot;</span></span>
<span class="line"><span> 5) &quot;4&quot;</span></span>
<span class="line"><span> 6) &quot;5&quot;</span></span>
<span class="line"><span> 7) &quot;6&quot;</span></span>
<span class="line"><span> 8) &quot;7&quot;</span></span>
<span class="line"><span> 9) &quot;8&quot;</span></span>
<span class="line"><span>10) &quot;9&quot;</span></span>
<span class="line"><span>11) &quot;10&quot;</span></span>
<span class="line"><span>12) &quot;11&quot;</span></span>
<span class="line"><span>13) &quot;12&quot;</span></span>
<span class="line"><span>14) &quot;13&quot;</span></span>
<span class="line"><span>15) &quot;14&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="存在问题" tabindex="-1"><a class="header-anchor" href="#存在问题"><span>存在问题</span></a></h4><ol><li>超卖</li><li>并发场景下容易出现redis请求超时</li></ol><p>超卖测试用例，这里笔者为了简单快捷，就是用了juc的工具模拟并发并使用flushdb清空redis数据库，再设置10个库存量。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@Test</span></span>
<span class="line"><span>    public void concurrencySecKillTest() throws InterruptedException {</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(1);</span></span>
<span class="line"><span>        ExecutorService threadPool = Executors.newFixedThreadPool(2000);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 2000; i++) {</span></span>
<span class="line"><span>            final String uid = &quot;&quot; + i + 1;</span></span>
<span class="line"><span>            Runnable r = () -&gt; {</span></span>
<span class="line"><span>                System.out.println(&quot;uid &quot; + uid + &quot;准备开抢&quot;);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    countDownLatch.await();</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    System.out.println(&quot;uid&quot; + uid + &quot;秒杀失败 原因:&quot; + e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                boolean result = doSecKill(uid, &quot;001&quot;);</span></span>
<span class="line"><span>                System.out.println(&quot;uid&quot; + uid + &quot; 秒杀结果 &quot; + result);</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            threadPool.submit(r);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Thread.sleep(5000);</span></span>
<span class="line"><span>        System.out.println(&quot;秒杀开始&quot;);</span></span>
<span class="line"><span>        countDownLatch.countDown();</span></span>
<span class="line"><span>        threadPool.shutdown();</span></span>
<span class="line"><span>        while (!threadPool.isTerminated()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到库存出现负数，这就大名鼎鼎的超卖问题。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249770.png" alt="在这里插入图片描述"></p><p>如下图，由于查询库存，扣除库存，记录获奖用户三个指令对于每一个redis客户端来说都是独立的，所以又可能出现宏观上(即相差几毫秒)，n个用户查询到库存中有1个商品，然后各自执行扣除逻辑，导致库存出现超卖的情况。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249275.png" alt="在这里插入图片描述"></p><h3 id="改进-池化和增加事务解决超卖问题" tabindex="-1"><a class="header-anchor" href="#改进-池化和增加事务解决超卖问题"><span>改进(池化和增加事务解决超卖问题)</span></a></h3><h4 id="示例-1" tabindex="-1"><a class="header-anchor" href="#示例-1"><span>示例</span></a></h4><p>首先我们编写一个jedis池化工具解决偶现的redis请求超时问题</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import redis.clients.jedis.Jedis;</span></span>
<span class="line"><span>import redis.clients.jedis.JedisPool;</span></span>
<span class="line"><span>import redis.clients.jedis.JedisPoolConfig;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JedisPoolUtil {</span></span>
<span class="line"><span>    private static volatile JedisPool jedisPool = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private JedisPoolUtil() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static JedisPool getJedisPoolInstance() {</span></span>
<span class="line"><span>        if (null == jedisPool) {</span></span>
<span class="line"><span>            synchronized (JedisPoolUtil.class) {</span></span>
<span class="line"><span>                if (null == jedisPool) {</span></span>
<span class="line"><span>                    JedisPoolConfig poolConfig = new JedisPoolConfig();</span></span>
<span class="line"><span>                    poolConfig.setMaxTotal(200);</span></span>
<span class="line"><span>                    poolConfig.setMaxIdle(32);</span></span>
<span class="line"><span>                    poolConfig.setMaxWaitMillis(100*1000);</span></span>
<span class="line"><span>                    poolConfig.setBlockWhenExhausted(true);</span></span>
<span class="line"><span>                    poolConfig.setTestOnBorrow(true);  // ping  PONG</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    jedisPool = new JedisPool(poolConfig, &quot;127.0.0.1&quot;, 6379, 60000 );</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return jedisPool;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基于事务改进秒杀案例</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>public boolean doSecKill(String uid, String productId) {</span></span>
<span class="line"><span>        if (uid == null || &quot;&quot;.equals(uid)) {</span></span>
<span class="line"><span>            System.out.println(&quot;uid 不可为空&quot;);</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (productId == null || &quot;&quot;.equals(productId)) {</span></span>
<span class="line"><span>            System.out.println(&quot;productId 不可为空&quot;);</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Jedis jedis = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //避免redis连接超时</span></span>
<span class="line"><span>            jedis = JedisPoolUtil.getJedisPoolInstance().getResource();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //监视库存 相当于拿到库存的乐观锁</span></span>
<span class="line"><span>            jedis.watch(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>            String productCount = jedis.get(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span>            if (null == productCount || &quot;&quot;.equals(productCount)) {</span></span>
<span class="line"><span>                System.out.println(&quot;秒杀还未开始&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (jedis.sismember(&quot;sk:success:uid&quot;, uid)) {</span></span>
<span class="line"><span>                System.out.println(&quot;该用户已成功秒杀，不可重复参加&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //开启事务执行扣减操作</span></span>
<span class="line"><span>            Transaction multi = jedis.multi();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            int count = Integer.valueOf(productCount);</span></span>
<span class="line"><span>            if (count &lt;= 0) {</span></span>
<span class="line"><span>                System.out.println(&quot;活动结束，谢谢参与&quot;);</span></span>
<span class="line"><span>//                jedis.close();</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            multi.decr(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span>            multi.sadd(&quot;sk:success:uid&quot;, uid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            List&lt;Object&gt; result = multi.exec();</span></span>
<span class="line"><span>            for (Object o : result) {</span></span>
<span class="line"><span>                System.out.println(&quot;执行结果: &quot; + o.toString());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (null == result || CollectionUtils.isEmpty(result)) {</span></span>
<span class="line"><span>                System.out.println(&quot;秒杀失败,谢谢参与&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            System.out.println(e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (jedis != null) {</span></span>
<span class="line"><span>                jedis.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[测试</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> @Test</span></span>
<span class="line"><span>    public void concurrencySecKillTest() throws InterruptedException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(1);</span></span>
<span class="line"><span>        ExecutorService threadPool = Executors.newFixedThreadPool(2000);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10000; i++) {</span></span>
<span class="line"><span>            final String uid = &quot;&quot; + i + 1;</span></span>
<span class="line"><span>            Runnable r = () -&gt; {</span></span>
<span class="line"><span>                System.out.println(&quot;uid &quot; + uid + &quot;准备开抢&quot;);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    countDownLatch.await();</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    System.out.println(&quot;uid&quot; + uid + &quot;秒杀失败 原因:&quot; + e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                boolean result = doSecKill(uid, &quot;001&quot;);</span></span>
<span class="line"><span>                System.out.println(&quot;uid&quot; + uid + &quot; 秒杀结果 &quot; + result);</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            threadPool.submit(r);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>        System.out.println(&quot;秒杀开始&quot;);</span></span>
<span class="line"><span>        countDownLatch.countDown();</span></span>
<span class="line"><span>        threadPool.shutdown();</span></span>
<span class="line"><span>        while (!threadPool.isTerminated()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        long total = end - start;</span></span>
<span class="line"><span>        System.out.println(&quot;执行结束总执行时间 &quot; + total);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次压测就会发现，这次就不会再出现超卖问题</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249152.png" alt="在这里插入图片描述"></p><h4 id="存在问题-1" tabindex="-1"><a class="header-anchor" href="#存在问题-1"><span>存在问题</span></a></h4><p>库存遗留问题，由于redis事务使用的是乐观锁，有可能出现大量用户操作数据过期而导致大量库存并没有被秒杀完的情况，对此我们可以增加一定的库存量来模拟库存遗留问题</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249382.png" alt="在这里插入图片描述"></p><p>为了更好的演示这种情况，我们将库存设置为995个，开启1000个线程</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@Test</span></span>
<span class="line"><span>    public void concurrencySecKillTest() throws InterruptedException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(1);</span></span>
<span class="line"><span>        ExecutorService threadPool = Executors.newFixedThreadPool(2000);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 1000; i++) {</span></span>
<span class="line"><span>            final String uid = &quot;&quot; + i + 1;</span></span>
<span class="line"><span>            Runnable r = () -&gt; {</span></span>
<span class="line"><span>                System.out.println(&quot;uid &quot; + uid + &quot;准备开抢&quot;);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    countDownLatch.await();</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    System.out.println(&quot;uid&quot; + uid + &quot;秒杀失败 原因:&quot; + e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                boolean result = doSecKill(uid, &quot;001&quot;);</span></span>
<span class="line"><span>                System.out.println(&quot;uid&quot; + uid + &quot; 秒杀结果 &quot; + result);</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            threadPool.submit(r);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>        System.out.println(&quot;秒杀开始&quot;);</span></span>
<span class="line"><span>        countDownLatch.countDown();</span></span>
<span class="line"><span>        threadPool.shutdown();</span></span>
<span class="line"><span>        while (!threadPool.isTerminated()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        long total = end - start;</span></span>
<span class="line"><span>        System.out.println(&quot;执行结束总执行时间 &quot; + total);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到问题复现了</p><h3 id="再改进-基于lua脚本解决库存遗留问题" tabindex="-1"><a class="header-anchor" href="#再改进-基于lua脚本解决库存遗留问题"><span>再改进(基于lua脚本解决库存遗留问题)</span></a></h3><h4 id="lua脚本的优势" tabindex="-1"><a class="header-anchor" href="#lua脚本的优势"><span>lua脚本的优势</span></a></h4><ol><li>可以轻易调用redis使用的C语言库函数，也可以轻易被C语言代码调用</li><li>具有一定原子性，将上述查询，扣减等逻辑全部编写到一个lua脚本中，避免宏观的并发查询和扣减，从而解决乐观锁的库存遗留问题</li></ol><h4 id="代码示例" tabindex="-1"><a class="header-anchor" href="#代码示例"><span>代码示例</span></a></h4><p>代码如下所示，这里笔者就不做测试了</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>public boolean doSecKillByLua(String uid, String productId) {</span></span>
<span class="line"><span>        Jedis jedis = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            jedis = JedisPoolUtil.getJedisPoolInstance().getResource();</span></span>
<span class="line"><span>            /**</span></span>
<span class="line"><span>             * uid KEYS[1] 用户传入的第一个变量,用户id</span></span>
<span class="line"><span>             * prodid KEYS[2] 用户传入的第2个变量 产品id</span></span>
<span class="line"><span>             * 若用户已在秒杀成功名单中返回-1</span></span>
<span class="line"><span>             * 若库存小于等于0 返回0</span></span>
<span class="line"><span>             * 反之调用成功返回1</span></span>
<span class="line"><span>             */</span></span>
<span class="line"><span>            String luaScript = &quot;local uid=KEYS[1]; \\n&quot; +</span></span>
<span class="line"><span>                    &quot;local prodid=KEYS[2];\\n&quot; +</span></span>
<span class="line"><span>                    &quot;local productCount=\\&quot;sk:\\&quot;..prodid;\\n&quot; +</span></span>
<span class="line"><span>                    &quot;local successUsers=\\&quot;sk:success:uid\\&quot;; \\n&quot; +</span></span>
<span class="line"><span>                    &quot;local userExists=redis.call(\\&quot;sismember\\&quot;,successUsers,uid);\\n&quot; +</span></span>
<span class="line"><span>                    &quot;if tonumber(userExists)==1 then \\n&quot; +</span></span>
<span class="line"><span>                    &quot;  return -1;\\n&quot; +</span></span>
<span class="line"><span>                    &quot;end\\n&quot; +</span></span>
<span class="line"><span>                    &quot;local num= redis.call(\\&quot;get\\&quot; ,productCount);\\n&quot; +</span></span>
<span class="line"><span>                    &quot;if tonumber(num)&lt;=0 then \\n&quot; +</span></span>
<span class="line"><span>                    &quot;  return 0; \\n&quot; +</span></span>
<span class="line"><span>                    &quot;else \\n&quot; +</span></span>
<span class="line"><span>                    &quot;  redis.call(\\&quot;decr\\&quot;,productCount);\\n&quot; +</span></span>
<span class="line"><span>                    &quot;  redis.call(\\&quot;sadd\\&quot;,successUsers,uid);\\n&quot; +</span></span>
<span class="line"><span>                    &quot;end\\n&quot; +</span></span>
<span class="line"><span>                    &quot;return 1;\\n&quot; +</span></span>
<span class="line"><span>                    &quot;\\n&quot; +</span></span>
<span class="line"><span>                    &quot;\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            String s = jedis.scriptLoad(luaScript);</span></span>
<span class="line"><span>            Object object = jedis.evalsha(s, 2, uid, productId);</span></span>
<span class="line"><span>            String result = String.valueOf(object);</span></span>
<span class="line"><span>            if (&quot;-1&quot;.equals(result)) {</span></span>
<span class="line"><span>                System.out.println(&quot;当前用户以秒杀成功，不可重复&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            } else if (&quot;0&quot;.equals(result)) {</span></span>
<span class="line"><span>                System.out.println(&quot;活动结束&quot;);</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            } else if (&quot;1&quot;.equals(result)) {</span></span>
<span class="line"><span>                System.out.println(&quot;uid:&quot; + uid + &quot;秒杀成功&quot;);</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            System.out.println(e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            jedis.close();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="更进一步反思-基于java锁的性能是否比lua脚本更优越" tabindex="-1"><a class="header-anchor" href="#更进一步反思-基于java锁的性能是否比lua脚本更优越"><span>更进一步反思，基于java锁的性能是否比lua脚本更优越</span></a></h3><h4 id="代码示例-1" tabindex="-1"><a class="header-anchor" href="#代码示例-1"><span>代码示例</span></a></h4><p>以下便是java锁实现的秒杀案例的代码</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>public boolean doSecKill3(String uid, String productId) {</span></span>
<span class="line"><span>        if (uid == null || &quot;&quot;.equals(uid)) {</span></span>
<span class="line"><span>            System.out.println(&quot;uid 不可为空&quot;);</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (productId == null || &quot;&quot;.equals(productId)) {</span></span>
<span class="line"><span>            System.out.println(&quot;productId 不可为空&quot;);</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Jedis jedis = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //避免redis连接超时</span></span>
<span class="line"><span>            jedis = JedisPoolUtil.getJedisPoolInstance().getResource();</span></span>
<span class="line"><span>            synchronized (SecKillTest.class) {</span></span>
<span class="line"><span>                //监视库存 相当于拿到库存的乐观锁</span></span>
<span class="line"><span>                jedis.watch(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>                String productCount = jedis.get(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span>                if (null == productCount || &quot;&quot;.equals(productCount)) {</span></span>
<span class="line"><span>                    System.out.println(&quot;秒杀还未开始&quot;);</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (jedis.sismember(&quot;sk:success:uid&quot;, uid)) {</span></span>
<span class="line"><span>                    System.out.println(&quot;该用户已成功秒杀，不可重复参加&quot;);</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>                //开启事务执行扣减操作</span></span>
<span class="line"><span>                Transaction multi = jedis.multi();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                int count = Integer.valueOf(productCount);</span></span>
<span class="line"><span>                if (count &lt;= 0) {</span></span>
<span class="line"><span>                    System.out.println(&quot;活动结束，谢谢参与&quot;);</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                multi.decr(&quot;sk:&quot; + productId);</span></span>
<span class="line"><span>                multi.sadd(&quot;sk:success:uid&quot;, uid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                List&lt;Object&gt; result = multi.exec();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (null == result || CollectionUtils.isEmpty(result)) {</span></span>
<span class="line"><span>                    System.out.println(&quot;秒杀失败,谢谢参与&quot;);</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (jedis != null) {</span></span>
<span class="line"><span>                jedis.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="性能评测" tabindex="-1"><a class="header-anchor" href="#性能评测"><span>性能评测</span></a></h4><h5 id="基于java锁" tabindex="-1"><a class="header-anchor" href="#基于java锁"><span>基于java锁</span></a></h5><p>我们同样设置9990个库存和10000个线程来看看效果</p><p>基于java锁的测试代码</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@Test</span></span>
<span class="line"><span>    public void concurrencySecKillTest() throws InterruptedException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(1);</span></span>
<span class="line"><span>        ExecutorService threadPool = Executors.newFixedThreadPool(2000);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10000; i++) {</span></span>
<span class="line"><span>            final String uid = &quot;&quot; + i + 1;</span></span>
<span class="line"><span>            Runnable r = () -&gt; {</span></span>
<span class="line"><span>                System.out.println(&quot;uid &quot; + uid + &quot;准备开抢&quot;);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    countDownLatch.await();</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    System.out.println(&quot;uid&quot; + uid + &quot;秒杀失败 原因:&quot; + e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                boolean result = doSecKill3(uid, &quot;001&quot;);</span></span>
<span class="line"><span>                System.out.println(&quot;uid&quot; + uid + &quot; 秒杀结果 &quot; + result);</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            threadPool.submit(r);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>        System.out.println(&quot;秒杀开始&quot;);</span></span>
<span class="line"><span>        countDownLatch.countDown();</span></span>
<span class="line"><span>        threadPool.shutdown();</span></span>
<span class="line"><span>        while (!threadPool.isTerminated()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        long total = end - start;</span></span>
<span class="line"><span>        System.out.println(&quot;执行结束总执行时间 &quot; + total);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行时间</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>执行结束总执行时间 5091</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h5 id="基于lua脚本" tabindex="-1"><a class="header-anchor" href="#基于lua脚本"><span>基于lua脚本</span></a></h5><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>@Test</span></span>
<span class="line"><span>    public void concurrencySecKillTest() throws InterruptedException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(1);</span></span>
<span class="line"><span>        ExecutorService threadPool = Executors.newFixedThreadPool(2000);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10000; i++) {</span></span>
<span class="line"><span>            final String uid = &quot;&quot; + i + 1;</span></span>
<span class="line"><span>            Runnable r = () -&gt; {</span></span>
<span class="line"><span>                System.out.println(&quot;uid &quot; + uid + &quot;准备开抢&quot;);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    countDownLatch.await();</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    System.out.println(&quot;uid&quot; + uid + &quot;秒杀失败 原因:&quot; + e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                boolean result = doSecKillByLua(uid, &quot;001&quot;);</span></span>
<span class="line"><span>                System.out.println(&quot;uid&quot; + uid + &quot; 秒杀结果 &quot; + result);</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            threadPool.submit(r);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>        System.out.println(&quot;秒杀开始&quot;);</span></span>
<span class="line"><span>        countDownLatch.countDown();</span></span>
<span class="line"><span>        threadPool.shutdown();</span></span>
<span class="line"><span>        while (!threadPool.isTerminated()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        long total = end - start;</span></span>
<span class="line"><span>        System.out.println(&quot;执行结束总执行时间 &quot; + total);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行时间</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>执行结束总执行时间 4180</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h5 id="小结-2" tabindex="-1"><a class="header-anchor" href="#小结-2"><span>小结</span></a></h5><p>由于lua脚本更接近底层的调用C语言代码，所以执行效率相比java锁更加高效。</p><h2 id="面试题" tabindex="-1"><a class="header-anchor" href="#面试题"><span>面试题</span></a></h2><h3 id="如何使用-redis-事务" tabindex="-1"><a class="header-anchor" href="#如何使用-redis-事务"><span>如何使用 Redis 事务？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>Redis 可以通过 MULTI，EXEC，DISCARD 和 WATCH 等命令来实现事务(transaction)功能。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="redis-支持原子性吗" tabindex="-1"><a class="header-anchor" href="#redis-支持原子性吗"><span>Redis 支持原子性吗？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>redis事务出错不回滚使得很多人认为redis事务是未被原子性这一原则的，实际上redis设计者不这么认为，因为redis设计者认为原子性的定义为:所有指令要么一起执行，要么全都不执行，而不是完全成功。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="如何解决-redis-事务的缺陷" tabindex="-1"><a class="header-anchor" href="#如何解决-redis-事务的缺陷"><span>如何解决 Redis 事务的缺陷？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>从上文我们看出基于redis事务进行秒杀方面的需求时会出现库存遗留问题，这就是redis事务乐观锁机制的缺陷。</span></span>
<span class="line"><span>为了保证所有事务都能一次性的执行，我们可以使用lua脚本更快(lua脚本可以轻易调用C语言库函数以及被C语言直接调用)、更有效(基于lua脚本可以保证指令一次性被执行不会被其他线程打断)，但是这种方案不支持回滚。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div>`,125)])])}const t=n(l,[["render",p]]),u=JSON.parse('{"path":"/Redis/Redis%E4%BA%8B%E5%8A%A1.html","title":"redis事务","lang":"zh-CN","frontmatter":{"description":"redis事务 redis事务的定义 redis的事务是一个单独隔离的操作，它会将一系列指令按需排队并顺序执行，期间不会被其他客户端的指令插队。 事务三大指令multi、exec、discard 简介 multi:开启事务 exec:执行事务 取消事务 如下图，通过multi，当前客户端就会开启事务，后续的指令都会安迅存到队列中。当用户键入exec后，...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"redis事务\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248019.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248643.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248871.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248505.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248063.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249600.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249770.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249275.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249152.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012249382.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\",\\"email\\":\\"maijunxuan0309@gmail.com\\"}]}"],["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/Redis%E4%BA%8B%E5%8A%A1.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"redis事务"}],["meta",{"property":"og:description","content":"redis事务 redis事务的定义 redis的事务是一个单独隔离的操作，它会将一系列指令按需排队并顺序执行，期间不会被其他客户端的指令插队。 事务三大指令multi、exec、discard 简介 multi:开启事务 exec:执行事务 取消事务 如下图，通过multi，当前客户端就会开启事务，后续的指令都会安迅存到队列中。当用户键入exec后，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209012248019.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}]]},"git":{"createdTime":1662316251000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","username":"MJX","email":"1585225345@qq.com","commits":3,"url":"https://github.com/MJX"}]},"readingTime":{"minutes":14.23,"words":4269},"filePathRelative":"Redis/Redis事务.md","excerpt":"\\n<h2>redis事务的定义</h2>\\n<p>redis的事务是一个单独隔离的操作，它会将一系列指令按需排队并顺序执行，期间不会被其他客户端的指令插队。</p>\\n<h2>事务三大指令multi、exec、discard</h2>\\n<h3>简介</h3>\\n<ol>\\n<li>multi:开启事务</li>\\n<li>exec:执行事务</li>\\n<li>取消事务</li>\\n</ol>\\n<p>如下图，通过multi，当前客户端就会开启事务，后续的指令都会安迅存到队列中。当用户键入exec后，这些指令都会按顺序执行。 若开启multi后输入若干指令，在键入discard，则之前的指令通通取消执行。</p>","autoDesc":true}');export{t as comp,u as data};
