import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as i,c as n,a}from"./app-BJyX0H20.js";const s={},d=a(`<h1 id="redis的安装与基本操作" tabindex="-1"><a class="header-anchor" href="#redis的安装与基本操作"><span>Redis的安装与基本操作</span></a></h1><h2 id="什么是redis" tabindex="-1"><a class="header-anchor" href="#什么是redis"><span>什么是Redis</span></a></h2><ol><li>基于键值对的NoSql数据库，支持stirng、hash、list、set、zset、bitmaps、HyperLogLog、GEO等数据结构极其算法。</li><li>读写性能非常好。</li><li>有将数据存到快照或者日志上的机制，便于数据恢复。</li><li>提供键过期、发布订阅、事务、流水线、lua脚本等附加功能。</li></ol><h2 id="redis特性" tabindex="-1"><a class="header-anchor" href="#redis特性"><span>Redis特性</span></a></h2><ol><li>读写速度据统计可达10w/s。</li><li>支持列表、哈希、集合、有序集合等数据结构的操作和算法。</li><li>功能丰富，支持键值过期、发布订阅、lua脚本创造新的Redis命令、客户端支持流水线操作，将一系列命令传给redis，避免多次网络io。</li><li>简单稳定</li><li>支持多种语言的客户端。</li><li>有RDB和AOF两种持久化策略。</li><li>支持主从复制。</li><li>支持高可用和分布式。</li></ol><h2 id="redis支持的场景" tabindex="-1"><a class="header-anchor" href="#redis支持的场景"><span>Redis支持的场景</span></a></h2><ol><li>缓存</li><li>排行榜系统</li><li>计数器应用</li><li>社交网络点赞等功能</li><li>消息队列(不常用)</li></ol><h2 id="不建议使用redis的场景" tabindex="-1"><a class="header-anchor" href="#不建议使用redis的场景"><span>不建议使用Redis的场景</span></a></h2><ol><li>几亿用户行为的数据不建议使用redis进行维护管理。</li><li>不经常被使用的冷数据不建议使用redis管理。</li></ol><h2 id="redis安装" tabindex="-1"><a class="header-anchor" href="#redis安装"><span>redis安装</span></a></h2><h4 id="安装c-语言的编译环境" tabindex="-1"><a class="header-anchor" href="#安装c-语言的编译环境"><span>安装C 语言的编译环境</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>yum install centos<span class="token operator">-</span>release<span class="token operator">-</span>scl scl<span class="token operator">-</span>utils<span class="token operator">-</span>build
yum install <span class="token operator">-</span>y devtoolset<span class="token operator">-</span><span class="token number">8</span><span class="token operator">-</span>toolchain
scl enable devtoolset<span class="token operator">-</span><span class="token number">8</span> bash
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="完成之后设置gcc版本" tabindex="-1"><a class="header-anchor" href="#完成之后设置gcc版本"><span>完成之后设置gcc版本</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>gcc <span class="token operator">--</span>version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="下载redis-6-2-1-tar-gz放-opt目录" tabindex="-1"><a class="header-anchor" href="#下载redis-6-2-1-tar-gz放-opt目录"><span>下载redis-6.2.1.tar.gz放/opt目录</span></a></h4><h4 id="解压redis" tabindex="-1"><a class="header-anchor" href="#解压redis"><span>解压redis</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>tar -zxvf redis-6.2.1.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="解压完成后进入目录-cd-redis-6-2-1" tabindex="-1"><a class="header-anchor" href="#解压完成后进入目录-cd-redis-6-2-1"><span>解压完成后进入目录：cd redis-6.2.1</span></a></h4><h4 id="键入make" tabindex="-1"><a class="header-anchor" href="#键入make"><span>键入<code>make</code></span></a></h4><p>注意：2.2.2.6.如果没有准备好C语言编译环境，make 会报错—Jemalloc/jemalloc.h：没有那个文件，可以运行<code>make distclean</code>，再次运行<code>make</code>即可解决问题</p><h4 id="运行make-install" tabindex="-1"><a class="header-anchor" href="#运行make-install"><span>运行<code>make install</code></span></a></h4><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h4><p>自此，redis安装已经全部完成，redis会被默认安装在<code>/usr/local/bin</code>目录，所以为了方便后续各种操作，我们可以运行如下命令，创建一个redis配置目录方便后续各种实验操作</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>## 创建配置文件实验文件夹
mkdir myredis
进入redis解压目录
cd <span class="token operator">/</span>opt<span class="token operator">/</span>redis<span class="token operator">-</span><span class="token number">6.2</span><span class="token number">.1</span><span class="token operator">/</span>
复制配置文件到新文件夹
cp redis<span class="token punctuation">.</span>conf <span class="token operator">/</span>myredis<span class="token operator">/</span>
## 进入redis命令目录
cd <span class="token operator">/</span>usr<span class="token operator">/</span>local<span class="token operator">/</span>bin<span class="token operator">/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动" tabindex="-1"><a class="header-anchor" href="#启动"><span>启动</span></a></h2><h4 id="前台启动" tabindex="-1"><a class="header-anchor" href="#前台启动"><span>前台启动</span></a></h4><p>一旦按ctrl+c进程直接结束</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>redis<span class="token operator">-</span>server <span class="token operator">/</span>myredis<span class="token operator">/</span>redis<span class="token punctuation">.</span>conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="后台启动-推荐" tabindex="-1"><a class="header-anchor" href="#后台启动-推荐"><span>后台启动(推荐)</span></a></h4><h6 id="运行一下命令配置文件" tabindex="-1"><a class="header-anchor" href="#运行一下命令配置文件"><span>运行一下命令配置文件</span></a></h6><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>vim <span class="token operator">/</span>myredis<span class="token operator">/</span>redis<span class="token punctuation">.</span>conf

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>按<code>/daemonize</code>找到<code>daemonize</code>，将此参数设置为yes，如下图所示</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>## 启动redis
<span class="token operator">/</span>usr<span class="token operator">/</span>local<span class="token operator">/</span>bin<span class="token operator">/</span>redis<span class="token operator">-</span>server <span class="token operator">/</span>myredis<span class="token operator">/</span>redis<span class="token punctuation">.</span>conf
## 检查redis是否启动
 ps <span class="token operator">-</span>ef<span class="token operator">|</span>grep redis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="启动客户端" tabindex="-1"><a class="header-anchor" href="#启动客户端"><span>启动客户端</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token operator">/</span>usr<span class="token operator">/</span>local<span class="token operator">/</span>bin<span class="token operator">/</span>redis<span class="token operator">-</span>cli
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="cli键入ping" tabindex="-1"><a class="header-anchor" href="#cli键入ping"><span>cli键入<code>ping</code></span></a></h4><p>若输出PONG，则说明redis客户端已经与服务端连通。</p><h4 id="关闭服务端" tabindex="-1"><a class="header-anchor" href="#关闭服务端"><span>关闭服务端</span></a></h4><ol><li>客户端运行<code>shutdown</code></li><li><code>/usr/local/bin/redis-cli -p 6379 shutdown</code></li></ol><h2 id="redis常用操作" tabindex="-1"><a class="header-anchor" href="#redis常用操作"><span>Redis常用操作</span></a></h2><h4 id="查看所有键值" tabindex="-1"><a class="header-anchor" href="#查看所有键值"><span>查看所有键值</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; keys *
(empty list or set)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="添加或者删除键值" tabindex="-1"><a class="header-anchor" href="#添加或者删除键值"><span>添加或者删除键值</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 添加字符串
127.0.0.1:6379&gt; set hello world
OK
127.0.0.1:6379&gt; set java jedis
OK
127.0.0.1:6379&gt; set python redis-py
OK

## 添加一个key名为mylist的键,存储一堆元素a b c d e f g
127.0.0.1:6379&gt; RPUSH mylist a b c d e f g
(integer) 7

## 使用keys * ,查看我们刚刚添加的key
127.0.0.1:6379&gt; KEYS *
1) &quot;python&quot;
2) &quot;java&quot;
3) &quot;hello&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看当前键的数" tabindex="-1"><a class="header-anchor" href="#查看当前键的数"><span>查看当前键的数</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; DBSIZE
(integer) 3

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看key是否存在" tabindex="-1"><a class="header-anchor" href="#查看key是否存在"><span>查看key是否存在</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 存在返回1 不存在返回0
127.0.0.1:6379&gt; EXISTS java
(integer) 1

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="设置键过期" tabindex="-1"><a class="header-anchor" href="#设置键过期"><span>设置键过期</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 添加一个键hello 设置10秒过期
127.0.0.1:6379&gt; set hello world
OK
## 查看是否存在
127.0.0.1:6379&gt; EXPIRE hello 10
(integer) 1
## 我们也可以用tts判断是否存在,若过期则返回-2
127.0.0.1:6379&gt; ttl  hello
(integer) -2


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看键值对的数据类型" tabindex="-1"><a class="header-anchor" href="#查看键值对的数据类型"><span>查看键值对的数据类型</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; type mylist
list

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="字符串操作" tabindex="-1"><a class="header-anchor" href="#字符串操作"><span>字符串操作</span></a></h2><h4 id="操作指令" tabindex="-1"><a class="header-anchor" href="#操作指令"><span>操作指令</span></a></h4><h6 id="设置值" tabindex="-1"><a class="header-anchor" href="#设置值"><span>设置值</span></a></h6><p>赋值指令如下所示，<code>]</code>为可选项</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>set key value ex  value 秒级过期时间] px value 设置当前键值对的毫秒级过期时间]  nx 若键值存在才能赋值] xx 若键值存在才能赋值]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例 设置一个key为str，value为hello的字符串</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; set str hello
OK
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置一个10s过期的字符串str2，值为str2</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; set str2 str2 ex 10
OK
## 10s内值还在
127.0.0.1:6379&gt; get str2
&quot;str2&quot;

## 10s后键值对消失
127.0.0.1:6379&gt; get str2
(nil)
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="setnx、setxx、setex" tabindex="-1"><a class="header-anchor" href="#setnx、setxx、setex"><span>setnx、setxx、setex</span></a></h6><p>setnx和set的nx选项类似，值不存在时才能建立键值对</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>setnx key value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 判断hello是否存在
127.0.0.1:6379&gt; EXISTS hello
(integer) 0
## 设置hello
127.0.0.1:6379&gt; set hello world
OK
## 如果hello不存在 则设置一个key为hello value为h的键值对
127.0.0.1:6379&gt; SETNX hello h
(integer) 0
## 发现值没变还是原本set指令的
127.0.0.1:6379&gt; get hello
&quot;world&quot;
## h不存在
127.0.0.1:6379&gt; EXISTS h
(integer) 0
## 使用setnx赋值，在使用get指令查看，发现存在
127.0.0.1:6379&gt; SETNX h hello
(integer) 1
127.0.0.1:6379&gt; get h
&quot;hello&quot;
127.0.0.1:6379&gt;


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>setxx相对set指令的xx选项，这里就不多赘述了</p><p>setex相当于set指令的ex选项</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 设置一个10s过期的键为key 值为value的键值对
127.0.0.1:6379&gt; SETEX key 10 value
OK
127.0.0.1:6379&gt; get key
&quot;value&quot;
## 10s后过期
127.0.0.1:6379&gt; get key
(nil)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="获取值" tabindex="-1"><a class="header-anchor" href="#获取值"><span>获取值</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>get key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="批量设置值和获取值" tabindex="-1"><a class="header-anchor" href="#批量设置值和获取值"><span>批量设置值和获取值</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 批量设置
mset key value key value] key value] key value]
## 批量获取
mget key1 key2 ....
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; MSET a 1 b 2 c 3
OK
127.0.0.1:6379&gt; MGET a b c
1) &quot;1&quot;
2) &quot;2&quot;
3) &quot;3&quot;


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意:如果我们某个业务需要获取redis中大量的key值，建议使用mget，原因：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>使用set获取1000个key: 1000个网络io时间+1000个指令执行时间
使用mget获取1000个key:1个网络io时间+1000个指令执行时间
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>get指令请求模型</p><p>mget指令请求模型</p><h6 id="计数" tabindex="-1"><a class="header-anchor" href="#计数"><span>计数</span></a></h6><p>自增指令，若值不存在，则创建并初始值为1，若存在且为整数则自增，若存在且为字符文字则报错。 因为redis是单线程的，所以计数指令无需考虑线程安全问题，无需使用cas等手段来修改值而是顺序执行自增，所以性能相当优秀。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>incr key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; INCR k
(integer) 1
127.0.0.1:6379&gt; INCR k
(integer) 2
127.0.0.1:6379&gt; set str str
OK
127.0.0.1:6379&gt; incr str
(error) ERR value is not an integer or out of range
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其他计数指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 自减
decr key
## 自增自己指定的值
incrby key increment
## 自减指定的值
decrby key decrement
## 自增小数值
incrbyfloat key increment
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="不常用指令" tabindex="-1"><a class="header-anchor" href="#不常用指令"><span>不常用指令</span></a></h6><p>追加值</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>append key value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 对key为hello的值增加一个world字符串
127.0.0.1:6379&gt; set hello hello
OK
127.0.0.1:6379&gt; APPEND hello world
(integer) 10
127.0.0.1:6379&gt; get hello
&quot;helloworld&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取字符串长度</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>strlen key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; strlen hello
(integer) 10
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置并返回原先的值</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>getset key value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; set hello world
OK
127.0.0.1:6379&gt; GETSET hello redis
&quot;world&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取指定范围</p><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> GETRANGE key start  end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; set str 0123456789
OK
127.0.0.1:6379&gt; GETRANGE str 0  2
&quot;012&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="不同长度的字符串的内部编码" tabindex="-1"><a class="header-anchor" href="#不同长度的字符串的内部编码"><span>不同长度的字符串的内部编码</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 8位数的长整型为int
127.0.0.1:6379&gt; set str 111
OK
127.0.0.1:6379&gt; object encoding str
&quot;int&quot;

## 小于39字节的字符串为embstr
127.0.0.1:6379&gt; set str helloworld
OK
127.0.0.1:6379&gt; object encoding str
&quot;embstr&quot;

## 大于39字节为raw
127.0.0.1:6379&gt; set str abcdefghijklmnopqrstudksajdlksadklsdaskdjlkasdjasdjajdlksadadjl
OK
127.0.0.1:6379&gt; object encoding str
&quot;raw&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h4><h6 id="用户信息缓存" tabindex="-1"><a class="header-anchor" href="#用户信息缓存"><span>用户信息缓存</span></a></h6><p>如下所示，可将常见的数据库数据存到redis中提高访问数据，建议使用的key为<code>表名:对象名:id</code>,例如<code>userInfo:user:1</code></p><p>伪代码示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>UserInfo getUserInfo(long id){
userRedisKey = &quot;user:info:&quot; + id
value = redis.get(userRedisKey);
UserInfo userInfo;
if (value != null) {
userInfo = deserialize(value);
} else {
userInfo = mysql.get(id);
if (userInfo != null)
redis.setex(userRedisKey, 3600, serialize(userInfo));
}
return userInfo;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="视频播放量计数" tabindex="-1"><a class="header-anchor" href="#视频播放量计数"><span>视频播放量计数</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>long incrVideoCounter(long id) {
key = &quot;video:playCount:&quot; + id;
return redis.incr(key);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="共享session" tabindex="-1"><a class="header-anchor" href="#共享session"><span>共享session</span></a></h6><p>为了保证用户在集群场景下能够公用一个会话session，我们会另起一台服务器搭建redis服务保存会话session，避免用户因为负载均衡在各个服务器之间时重复登录。</p><h6 id="短信限速" tabindex="-1"><a class="header-anchor" href="#短信限速"><span>短信限速</span></a></h6><p>避免单用户一分钟不能超过5次访问</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>phoneNum = &quot;138xxxxxxxx&quot;;
key = &quot;shortMsg:limit:&quot; + phoneNum;
// SET key value EX 60 NX
isExists = redis.set(key,1,&quot;EX 60&quot;,&quot;NX&quot;);
if(isExists != null || redis.incr(key) &lt;=5){
//  通过
}else{
//  限速
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="哈希" tabindex="-1"><a class="header-anchor" href="#哈希"><span>哈希</span></a></h2><h4 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h4><p>存储键值对的数据结构，也叫映射，字典</p><h4 id="操作" tabindex="-1"><a class="header-anchor" href="#操作"><span>操作</span></a></h4><h6 id="设置值和取值" tabindex="-1"><a class="header-anchor" href="#设置值和取值"><span>设置值和取值</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 设置值
HSET key field value
## 获取值
HGET key field
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; HSET hashmap key1 value1 key2 value2
(integer) 2
127.0.0.1:6379&gt; HGET hashmap key1
&quot;value1&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="删除哈希一个键" tabindex="-1"><a class="header-anchor" href="#删除哈希一个键"><span>删除哈希一个键</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>HDEL key field
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>格式</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 删除hashmap的key1
127.0.0.1:6379&gt; HDEL hashmap key1
(integer) 1
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="计算哈希的key的个数" tabindex="-1"><a class="header-anchor" href="#计算哈希的key的个数"><span>计算哈希的key的个数</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>HLEN key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; HLEN hashmap
(integer) 1
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="批量设置哈希的值和批量获取哈希的值" tabindex="-1"><a class="header-anchor" href="#批量设置哈希的值和批量获取哈希的值"><span>批量设置哈希的值和批量获取哈希的值</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> HMSET key  field value field value] field value]
 HMGET key  field field] field] field]


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; HMSET user:1 name xiaoming age 18 city fujian
OK
127.0.0.1:6379&gt; HMGET user:1 name age city
1) &quot;xiaoming&quot;
2) &quot;18&quot;
3) &quot;fujian&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="判断键值对是否存在" tabindex="-1"><a class="header-anchor" href="#判断键值对是否存在"><span>判断键值对是否存在</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; HEXISTS key field
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; HEXISTS user:1 name
(integer) 1
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="获取所有key、获取所有value、获取所有的key-value" tabindex="-1"><a class="header-anchor" href="#获取所有key、获取所有value、获取所有的key-value"><span>获取所有key、获取所有value、获取所有的key-value</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 获取所有key
HKEYS key

## 获取所有value
 HVALS  key

## 获取所有key-value
HGETALL key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; HKEYS user:1
1) &quot;name&quot;
2) &quot;age&quot;
3) &quot;city&quot;
127.0.0.1:6379&gt; HVALS user:1
1) &quot;xiaoming&quot;
2) &quot;18&quot;
3) &quot;fujian&quot;
127.0.0.1:6379&gt; HGETALL user:1
1) &quot;name&quot;
2) &quot;xiaoming&quot;
3) &quot;age&quot;
4) &quot;18&quot;
5) &quot;city&quot;
6) &quot;fujian&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>建议:若哈希中存在多个键值对且我们需要一次性获取，建议使用hscan而不是hmget，避免造成redis阻塞</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 使用hscan从0位置获取所有键值对
127.0.0.1:6379&gt; HSCAN user:1 0
1) &quot;0&quot;
2) 1) &quot;name&quot;
   2) &quot;xiaoming&quot;
   3) &quot;age&quot;
   4) &quot;18&quot;
   5) &quot;city&quot;
   6) &quot;fujian&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="hincrby-hincrbyfloat" tabindex="-1"><a class="header-anchor" href="#hincrby-hincrbyfloat"><span>hincrby hincrbyfloat</span></a></h6><p>和incr类似，只不过增长的是field的值</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>hincrby key field
hincrbyfloat key field
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="计算field的长度" tabindex="-1"><a class="header-anchor" href="#计算field的长度"><span>计算field的长度</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>hstrlen key field
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>获取user:1 的name的长度
127.0.0.1:6379&gt; HSTRLEN user:1 name
(integer) 8
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="内部编码" tabindex="-1"><a class="header-anchor" href="#内部编码"><span>内部编码</span></a></h6><p>在键值对个数小于512且所有值都小于64字节时，哈希的内部编码为ziplist，当超过这些限制时使用的就是hashtable(超过限制后使用这种数据结构时间复杂度更低,查询效率为O(1))。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 小于64字节为ziplist
127.0.0.1:6379&gt; hset user:1 name xiaoming
(integer) 0
127.0.0.1:6379&gt; object encoding user:1
&quot;ziplist&quot;
## 超过后为hashtable
127.0.0.1:6379&gt; hset user:1 name djdjkhdjhdhdhwhquehqhdjksdhqjhdjkojhdlksadsahdjsalkhdjlksahdjoaehduioqwajwksdhjaksdhjsahdsajkdhjslkadhjlksahdjksahdjksahdjk
(integer) 0
127.0.0.1:6379&gt; object encoding user:1
&quot;hashtable&quot;


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用场景-1" tabindex="-1"><a class="header-anchor" href="#使用场景-1"><span>使用场景</span></a></h4><p>如果我们要缓存某行用户信息，使用哈希非常合适不过</p><p>原因如下:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> 1. 相较于字符串(占用过多的键)，哈希内聚更好更易于维护大量的用户信息
 2. 如果使用字符串进行序列化存储，就会造成网络io时序列化和反序列化的开销
 3. 操作简单，修改用户字段更加方便
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意:哈希存储相对二维表更加稀疏，如上图，二维表中null的数据，在哈希表中key是完全不存在的用户使用时需要考虑到这一点。</p><h2 id="列表" tabindex="-1"><a class="header-anchor" href="#列表"><span>列表</span></a></h2><h4 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h4><p>线性结构，允许重复元素，可以充当队列和栈。</p><h4 id="操作-1" tabindex="-1"><a class="header-anchor" href="#操作-1"><span>操作</span></a></h4><h6 id="添加" tabindex="-1"><a class="header-anchor" href="#添加"><span>添加</span></a></h6><p>从右边插入，语法:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>RPUSH key value value]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 右边一次插入a b c
127.0.0.1:6379&gt; RPUSH list a b c
(integer) 3
## 查看list的元素
127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;b&quot;
3) &quot;c&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从左边插入元素 lpush</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>LPUSH key value value...]
## 从左边依次插入
127.0.0.1:6379&gt; LPUSH arr a b c
(integer) 3
## 查看最终的元素值
127.0.0.1:6379&gt; LRANGE arr 0 -1
1) &quot;c&quot;
2) &quot;b&quot;
3) &quot;a&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>向元素前或者后添加元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>linsert key before|after pivot value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例：向a后面添加一个元素a+</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;b&quot;
3) &quot;c&quot;
127.0.0.1:6379&gt; LINSERT list after a a+
(integer) 4
127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;a+&quot;
3) &quot;b&quot;
4) &quot;c&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="查询" tabindex="-1"><a class="header-anchor" href="#查询"><span>查询</span></a></h6><p>查找指定范围的元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>lrange key start end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 查看list的所有元素
127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;a+&quot;
3) &quot;b&quot;
4) &quot;c&quot;
##  查看一个不存在的key的元素
127.0.0.1:6379&gt; LRANGE key 1 2
(empty array)
## 查看list 2-3的元素
127.0.0.1:6379&gt; LRANGE list 1 2
1) &quot;a+&quot;
2) &quot;b&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取指定索引的元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>lindex key index
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例:查看key为list第0个元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;a+&quot;
3) &quot;b&quot;
4) &quot;c&quot;
127.0.0.1:6379&gt; LINDEX list 0
&quot;a&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取列表长度</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>llen key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;a+&quot;
3) &quot;b&quot;
4) &quot;c&quot;
127.0.0.1:6379&gt; LLEN list
(integer) 4
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="删除" tabindex="-1"><a class="header-anchor" href="#删除"><span>删除</span></a></h6><p>从列表左侧弹出元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>lpop key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a&quot;
2) &quot;a+&quot;
3) &quot;b&quot;
4) &quot;c&quot;
127.0.0.1:6379&gt; LPOP list
&quot;a&quot;
127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a+&quot;
2) &quot;b&quot;
3) &quot;c&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同理右侧为rpop，不多赘述</p><p>删除元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>lrem key count value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>count的大小有以下几种情况</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 大于0，从左到右删除count个元素
2. 小于0，从右到左删除count个元素
3. =0 删除所有元素
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例:从左到右删除一个为a的元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a+&quot;
2) &quot;b&quot;
3) &quot;c&quot;
127.0.0.1:6379&gt; LREM list 1 b
(integer) 1
127.0.0.1:6379&gt; LRANGE list 0 -1
1) &quot;a+&quot;
2) &quot;c&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修剪列表至指定索引范围</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>ltrim key start end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例，将列表修剪为只有2 15索引范围内的元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; LRANGE list 0 -1
 1) &quot;a+&quot;
 2) &quot;z&quot;
 3) &quot;a&quot;
 4) &quot;b&quot;
 5) &quot;c&quot;
 6) &quot;d&quot;
 7) &quot;e&quot;
 8) &quot;f&quot;
 9) &quot;g&quot;
10) &quot;h&quot;
11) &quot;i&quot;
12) &quot;j&quot;
13) &quot;k&quot;
14) &quot;l&quot;
15) &quot;m&quot;
16) &quot;n&quot;
127.0.0.1:6379&gt; LTRIM list 2 15
OK
127.0.0.1:6379&gt; LRANGE list 0 -1
 1) &quot;a&quot;
 2) &quot;b&quot;
 3) &quot;c&quot;
 4) &quot;d&quot;
 5) &quot;e&quot;
 6) &quot;f&quot;
 7) &quot;g&quot;
 8) &quot;h&quot;
 9) &quot;i&quot;
10) &quot;j&quot;
11) &quot;k&quot;
12) &quot;l&quot;
13) &quot;m&quot;
14) &quot;n&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="修改" tabindex="-1"><a class="header-anchor" href="#修改"><span>修改</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>lset key index newValue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="阻塞操作" tabindex="-1"><a class="header-anchor" href="#阻塞操作"><span>阻塞操作</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>blpop key key ...] timeout
brpop key key ...] timeout
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>brpop 示例，当timeout大于0时，若有元素立即返回，若没有则等到对应时间为止 若timeout设置为0，则无限等待，如下所示，笔者使用另一个客户端push一个元素进来，这个阻塞就会立刻将这个元素弹出。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; BRPOP arr 3
1) &quot;arr&quot;
2) &quot;a&quot;
127.0.0.1:6379&gt; BRPOP arr 3
1) &quot;arr&quot;
2) &quot;b&quot;
127.0.0.1:6379&gt; BRPOP arr 3
1) &quot;arr&quot;
2) &quot;c&quot;
127.0.0.1:6379&gt; BRPOP arr 3
(nil)
(3.04s)
127.0.0.1:6379&gt; BRPOP arr 3
(nil)
(3.07s)
127.0.0.1:6379&gt; BRPOP arr 0
1) &quot;arr&quot;
2) &quot;a&quot;
(43.69s)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="内部编码-1" tabindex="-1"><a class="header-anchor" href="#内部编码-1"><span>内部编码</span></a></h6><p>当内部元素个数小于512，且每个元素小于64字节，列表默认使用ziplist，反之就会使用linklist</p><h6 id="使用场景-2" tabindex="-1"><a class="header-anchor" href="#使用场景-2"><span>使用场景</span></a></h6><p>Redis的lpush+brpop命令组合即可实现阻塞队列，如下图，每个消费者只需要关注自己感兴趣的专题即可，作为生产者只需不断使lpush添加专题即可。</p><p>关于列表更多用法可以参见以下口诀</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. lpush+lpop=Stack（栈）
2. lpush+rpop=Queue（队列）
3. lpsh+ltrim=Capped Collection（有限集合）
4. lpush+brpop=Message Queue（消息队列）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="集合" tabindex="-1"><a class="header-anchor" href="#集合"><span>集合</span></a></h2><h4 id="特点" tabindex="-1"><a class="header-anchor" href="#特点"><span>特点</span></a></h4><ol><li>最多可存储2^32-1个元素</li><li>集合内部元素不重复</li></ol><h4 id="命令" tabindex="-1"><a class="header-anchor" href="#命令"><span>命令</span></a></h4><h6 id="添加元素" tabindex="-1"><a class="header-anchor" href="#添加元素"><span>添加元素</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sadd key element element ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例，可以看到第2次添加的元素并没有成功</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SADD set a b c
(integer) 3
127.0.0.1:6379&gt; SADD set a b
(integer) 0
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="删除元素" tabindex="-1"><a class="header-anchor" href="#删除元素"><span>删除元素</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>srem key element element ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="计算集合大小" tabindex="-1"><a class="header-anchor" href="#计算集合大小"><span>计算集合大小</span></a></h6><p>注意，这个计算的时间复杂度为O(1)，因为获得的这个集合的大小并不是计算来的，而是通过redis维护的一个内部变量得来的。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>scard key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="判断元素是否在集合中" tabindex="-1"><a class="header-anchor" href="#判断元素是否在集合中"><span>判断元素是否在集合中</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sismember key element
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SISMEMBER set a
(integer) 1
127.0.0.1:6379&gt; SISMEMBER set ac
(integer) 0
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="随机获取集合内的元素" tabindex="-1"><a class="header-anchor" href="#随机获取集合内的元素"><span>随机获取集合内的元素</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>srandmember key count]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SRANDMEMBER set 1
1) &quot;a&quot;
127.0.0.1:6379&gt; SRANDMEMBER set 1
1) &quot;c&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="随机弹出一个元素" tabindex="-1"><a class="header-anchor" href="#随机弹出一个元素"><span>随机弹出一个元素</span></a></h6><p>与srandmember 差不多，只不过该操作会将元素输出并将集合中的这个元素删除</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>spop key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SPOP set
&quot;c&quot;
127.0.0.1:6379&gt; SPOP set
&quot;a&quot;
127.0.0.1:6379&gt; SPOP set
&quot;b&quot;
127.0.0.1:6379&gt; SPOP set
(nil)
127.0.0.1:6379&gt; SPOP set
(nil)
127.0.0.1:6379&gt; SPOP set
(nil)
127.0.0.1:6379&gt; SPOP set
(nil)
127.0.0.1:6379&gt; SPOP set
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="获取所有元素" tabindex="-1"><a class="header-anchor" href="#获取所有元素"><span>获取所有元素</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>smembers key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="获取两个集合之间的交集" tabindex="-1"><a class="header-anchor" href="#获取两个集合之间的交集"><span>获取两个集合之间的交集</span></a></h6><p>语法</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sinter key key ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例，可以看出set1和set2的交集为a</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SADD set1 a b c d
(integer) 4
127.0.0.1:6379&gt; SADD set2 a e f g h
(integer) 5
127.0.0.1:6379&gt; SINTER set1 set2
1) &quot;a&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="求并集" tabindex="-1"><a class="header-anchor" href="#求并集"><span>求并集</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>suinon key key ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="求差集" tabindex="-1"><a class="header-anchor" href="#求差集"><span>求差集</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sdiff key key ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例，注意这个差集指的是第一个集合有，其他集合没有的元素</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SDIFF set1 set2
1) &quot;b&quot;
2) &quot;d&quot;
3) &quot;c&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="将交集、差集、并集结果保存" tabindex="-1"><a class="header-anchor" href="#将交集、差集、并集结果保存"><span>将交集、差集、并集结果保存</span></a></h6><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sinterstore destination key key ...]
suionstore destination key key ...]
sdiffstore destination key key ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例:将并集的结果保存</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SADD set1 a b c d
(integer) 4
127.0.0.1:6379&gt; SADD set2 a e f g h
(integer) 5
127.0.0.1:6379&gt; SINTERstore set3 set1 set2
(integer) 1
127.0.0.1:6379&gt; SMEMBERS set3
1) &quot;a&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="内部编码-2" tabindex="-1"><a class="header-anchor" href="#内部编码-2"><span>内部编码</span></a></h4><p>当元素为整数且大小小于512时会使用intset(节省内存)，反之就会转为hashtable提高效率。</p><h4 id="使用场景-3" tabindex="-1"><a class="header-anchor" href="#使用场景-3"><span>使用场景</span></a></h4><ol><li>sadd=Tagging（标签,例如交友网站个人标签）</li><li>spop/srandmember=Random item（生成随机数，比如抽奖）</li><li>sadd+sinter=Social Graph（社交需求，与附近的人爱好匹配）</li></ol><h2 id="有序集合" tabindex="-1"><a class="header-anchor" href="#有序集合"><span>有序集合</span></a></h2><h4 id="简介-2" tabindex="-1"><a class="header-anchor" href="#简介-2"><span>简介</span></a></h4><ol><li>相较于集合，增加一个score属性，使得整体有序。</li><li>集合元素不可重复，但是score可以重复。</li></ol><h4 id="指令" tabindex="-1"><a class="header-anchor" href="#指令"><span>指令</span></a></h4><h6 id="添加成员" tabindex="-1"><a class="header-anchor" href="#添加成员"><span>添加成员</span></a></h6><p>命令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zadd key score member score member ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; zadd zset 1 tom 2 jack 3 lucy
(integer) 3
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可选项</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. nx：member必须不存在，才可以设置成功，用于添加。
2. xx：member必须存在，才可以设置成功，用于更新。
3. ch：返回此次操作后，有序集合元素和分数发生变化的个数
4. incr：对score做增加，相当于后面介绍的zincrby。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例:如果tom存在，给tom自增。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; zadd zset xx incr 1 tom
&quot;2&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>相比于集合，有序集合增加了排序的操作，添加成员的时间复杂度由原来的<code>O(1)</code>变为<code>O(logn)</code></p><h6 id="计算有序集合的大小" tabindex="-1"><a class="header-anchor" href="#计算有序集合的大小"><span>计算有序集合的大小</span></a></h6><p>于scard一样，时间复杂度也是<code>O(1)</code></p><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zcard key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZCARD zset
(integer) 3
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="查看成员分数" tabindex="-1"><a class="header-anchor" href="#查看成员分数"><span>查看成员分数</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zscore key member
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; zscore zset tom
&quot;3&quot;
127.0.0.1:6379&gt; zscore zset jack
&quot;2&quot;
127.0.0.1:6379&gt; zscore zset xiaoming
(nil)
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="计算成员排名" tabindex="-1"><a class="header-anchor" href="#计算成员排名"><span>计算成员排名</span></a></h6><p>命令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 升序排名
zrank key member
## 降序排名
zrevrank key member
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZRANK zset tom
(integer) 2
127.0.0.1:6379&gt; ZrevRANK zset tom
(integer) 0
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="删除成员" tabindex="-1"><a class="header-anchor" href="#删除成员"><span>删除成员</span></a></h6><p>命令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zrem key member member ...]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZREM zset tom jack
(integer) 2
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="给成员增加分数" tabindex="-1"><a class="header-anchor" href="#给成员增加分数"><span>给成员增加分数</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zincrby key increment member
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZINCRBY zset 100 tom
&quot;100&quot;
127.0.0.1:6379&gt; ZINCRBY zset 100 tom
&quot;200&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="查看排名" tabindex="-1"><a class="header-anchor" href="#查看排名"><span>查看排名</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zrange key start end withscores]
zrevrange key start end withscores]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZRANGE zset 0 -1 withscores
1) &quot;lucy&quot;
2) &quot;3&quot;
3) &quot;tom&quot;
4) &quot;200&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="返回指定分数范围的成员" tabindex="-1"><a class="header-anchor" href="#返回指定分数范围的成员"><span>返回指定分数范围的成员</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zrangebyscore key min max withscores] limit offset count]
zrevrangebyscore key max min withscores] limit offset count]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZRANGEBYSCORE zset 0 300 withscores
1) &quot;lucy&quot;
2) &quot;3&quot;
3) &quot;tom&quot;
4) &quot;200&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取10到无限大的成员</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZRANGEBYSCORE zset (10 +inf withscores
1) &quot;liu&quot;
2) &quot;11&quot;
3) &quot;tom&quot;
4) &quot;200&quot;
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="获取指定分数范围内的用户" tabindex="-1"><a class="header-anchor" href="#获取指定分数范围内的用户"><span>获取指定分数范围内的用户</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zcount key min max
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZCOUNT zset 0 10
(integer) 2
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="删除指定排名内的用户" tabindex="-1"><a class="header-anchor" href="#删除指定排名内的用户"><span>删除指定排名内的用户</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zremrangebyrank key start end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例:删除前3名成员</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZREMRANGEBYRANK zset 0 2
(integer) 3
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="删除指定分数范围内的用户" tabindex="-1"><a class="header-anchor" href="#删除指定分数范围内的用户"><span>删除指定分数范围内的用户</span></a></h6><p>指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zremrangebyscore key min max
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ZREMRANGEBYSCORE zset (250 +inf
(integer) 1
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="内部编码-3" tabindex="-1"><a class="header-anchor" href="#内部编码-3"><span>内部编码</span></a></h4><p>当集合size小于512且每个字符串大小不超过64字节时，有序集合使用的时ziplist，反之就是使用调表。从设计的角度来看，使用平衡树或者红黑树也能解决问题，但是跳表的实现相较于前者更加简单。查询也差不多。</p><h4 id="使用场景-4" tabindex="-1"><a class="header-anchor" href="#使用场景-4"><span>使用场景</span></a></h4><p>常用于点赞、播放量等排行榜</p><p>如下就模拟了点赞排行榜的操作</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>## 小明获得10个赞
127.0.0.1:6379&gt; zadd user:ranking:20220810 10 xiaoming
(integer) 1
## 小王获得11个赞
127.0.0.1:6379&gt; zadd user:ranking:20220810 11 xiaowang
(integer) 1
## 小刘获得8个赞
127.0.0.1:6379&gt; zadd user:ranking:20220810 8 xiaoliu
(integer) 1
## 小刘的赞+1
127.0.0.1:6379&gt; zincrby user:ranking:20220810  1  xiaoliu
&quot;9&quot;
## 查看排名前3
127.0.0.1:6379&gt; zrevrange user:ranking:20220810 0 2
1) &quot;xiaowang&quot;
2) &quot;xiaoming&quot;
3) &quot;xiaoliu&quot;
## 小刘被取消一个赞
127.0.0.1:6379&gt; zincrby user:ranking:20220810  -1  xiaoliu
&quot;8&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,345),l=[d];function t(r,v){return i(),n("div",null,l)}const o=e(s,[["render",t],["__file","Redis的安装与基本操作.html.vue"]]),m=JSON.parse('{"path":"/Redis/Redis%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C.html","title":"Redis的安装与基本操作","lang":"zh-CN","frontmatter":{"description":"Redis的安装与基本操作 什么是Redis 基于键值对的NoSql数据库，支持stirng、hash、list、set、zset、bitmaps、HyperLogLog、GEO等数据结构极其算法。 读写性能非常好。 有将数据存到快照或者日志上的机制，便于数据恢复。 提供键过期、发布订阅、事务、流水线、lua脚本等附加功能。 Redis特性 读写速度据...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/Redis%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"Redis的安装与基本操作"}],["meta",{"property":"og:description","content":"Redis的安装与基本操作 什么是Redis 基于键值对的NoSql数据库，支持stirng、hash、list、set、zset、bitmaps、HyperLogLog、GEO等数据结构极其算法。 读写性能非常好。 有将数据存到快照或者日志上的机制，便于数据恢复。 提供键过期、发布订阅、事务、流水线、lua脚本等附加功能。 Redis特性 读写速度据..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2022-09-04T18:30:51.000Z"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2022-09-04T18:30:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis的安装与基本操作\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2022-09-04T18:30:51.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\",\\"email\\":\\"maijunxuan0309@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"什么是Redis","slug":"什么是redis","link":"#什么是redis","children":[]},{"level":2,"title":"Redis特性","slug":"redis特性","link":"#redis特性","children":[]},{"level":2,"title":"Redis支持的场景","slug":"redis支持的场景","link":"#redis支持的场景","children":[]},{"level":2,"title":"不建议使用Redis的场景","slug":"不建议使用redis的场景","link":"#不建议使用redis的场景","children":[]},{"level":2,"title":"redis安装","slug":"redis安装","link":"#redis安装","children":[]},{"level":2,"title":"启动","slug":"启动","link":"#启动","children":[]},{"level":2,"title":"Redis常用操作","slug":"redis常用操作","link":"#redis常用操作","children":[]},{"level":2,"title":"字符串操作","slug":"字符串操作","link":"#字符串操作","children":[]},{"level":2,"title":"哈希","slug":"哈希","link":"#哈希","children":[]},{"level":2,"title":"列表","slug":"列表","link":"#列表","children":[]},{"level":2,"title":"集合","slug":"集合","link":"#集合","children":[]},{"level":2,"title":"有序集合","slug":"有序集合","link":"#有序集合","children":[]}],"git":{"createdTime":1662316251000,"updatedTime":1662316251000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":1}]},"readingTime":{"minutes":16.58,"words":4974},"filePathRelative":"Redis/Redis的安装与基本操作.md","localizedDate":"2022年9月4日","excerpt":"\\n<h2>什么是Redis</h2>\\n<ol>\\n<li>基于键值对的NoSql数据库，支持stirng、hash、list、set、zset、bitmaps、HyperLogLog、GEO等数据结构极其算法。</li>\\n<li>读写性能非常好。</li>\\n<li>有将数据存到快照或者日志上的机制，便于数据恢复。</li>\\n<li>提供键过期、发布订阅、事务、流水线、lua脚本等附加功能。</li>\\n</ol>\\n<h2>Redis特性</h2>\\n<ol>\\n<li>读写速度据统计可达10w/s。</li>\\n<li>支持列表、哈希、集合、有序集合等数据结构的操作和算法。</li>\\n<li>功能丰富，支持键值过期、发布订阅、lua脚本创造新的Redis命令、客户端支持流水线操作，将一系列命令传给redis，避免多次网络io。</li>\\n<li>简单稳定</li>\\n<li>支持多种语言的客户端。</li>\\n<li>有RDB和AOF两种持久化策略。</li>\\n<li>支持主从复制。</li>\\n<li>支持高可用和分布式。</li>\\n</ol>","autoDesc":true}');export{o as comp,m as data};
