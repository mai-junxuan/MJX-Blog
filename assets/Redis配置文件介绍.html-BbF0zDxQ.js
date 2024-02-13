import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as i,c as n,a as s}from"./app-Digg1ELS.js";const a={},t=s(`<h1 id="redis配置文件介绍" tabindex="-1"><a class="header-anchor" href="#redis配置文件介绍"><span>Redis配置文件介绍</span></a></h1><h2 id="units单位" tabindex="-1"><a class="header-anchor" href="#units单位"><span>Units单位</span></a></h2><ol><li>redis默认单位的度量为byte，而不是bit，这点我们需要注意一下</li><li>计量单位对大小写不敏感</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Note on units: when memory size is needed, it is possible to specify
# it in the usual form of 1k 5GB 4M and so forth:
#
# 1k =&gt; 1000 bytes
# 1kb =&gt; 1024 bytes
# 1m =&gt; 1000000 bytes
# 1mb =&gt; 1024*1024 bytes
# 1g =&gt; 1000000000 bytes
# 1gb =&gt; 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="include" tabindex="-1"><a class="header-anchor" href="#include"><span>include</span></a></h2><p>该配置可以将其他配置全部提取到该配置文件中以便统一管理。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Include one or more other config files here.  This is useful if you
# have a standard template that goes to all Redis servers but also need
# to customize a few per-server settings.  Include files can include
# other files, so use this wisely.
#
# Note that option &quot;include&quot; won&#39;t be rewritten by command &quot;CONFIG REWRITE&quot;
# from admin or Redis Sentinel. Since Redis always uses the last processed
# line as value of a configuration directive, you&#39;d better put includes
# at the beginning of this file to avoid overwriting config change at runtime.
#
# If instead you are interested in using includes to override configuration
# options, it is better to use include as the last line.
#
# include /path/to/local.conf
# include /path/to/other.conf

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="网络相关配置" tabindex="-1"><a class="header-anchor" href="#网络相关配置"><span>网络相关配置</span></a></h2><h3 id="bind" tabindex="-1"><a class="header-anchor" href="#bind"><span>bind</span></a></h3><ol><li>默认绑定127.0.0.1</li><li>若<code>protected-mode yes</code>，且没有设置bind ip、没有设置密码的情况下，只有本机可以访问redis。</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>bind 127.0.0.1 -::1

# Protected mode is a layer of security protection, in order to avoid that
# Redis instances left open on the internet are accessed and exploited.
#
# When protected mode is on and if:
#
# 1) The server is not binding explicitly to a set of addresses using the
#    &quot;bind&quot; directive.
# 2) No password is configured.
#
# The server only accepts connections from clients connecting from the
# IPv4 and IPv6 loopback addresses 127.0.0.1 and ::1, and from Unix domain
# sockets.
#
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured, nor a specific set of interfaces
# are explicitly listed using the &quot;bind&quot; directive.
protected-mode yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如下我们将bind注释，保护模式开启，使用远程连接工具时发现，redis-server拒绝访问了</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220901033637212.png" alt="image-20220901033637212"></p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#bind 127.0.0.1 -::1
protected-mode yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="protected-mode" tabindex="-1"><a class="header-anchor" href="#protected-mode"><span>protected-mode</span></a></h3><p>设置redis的保护模式，若设置为no，则其他服务器的redis客户端可以随便访问你的redis服务端。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured, nor a specific set of interfaces
# are explicitly listed using the &quot;bind&quot; directive.
protected-mode yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="port" tabindex="-1"><a class="header-anchor" href="#port"><span>port</span></a></h3><p>指定redis服务端启用的端口号。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Accept connections on the specified port, default is 6379 (IANA #815344).
# If port 0 is specified Redis will not listen on a TCP socket.
port 6379

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tcp-backlog" tabindex="-1"><a class="header-anchor" href="#tcp-backlog"><span>tcp-backlog</span></a></h3><p>该参数=已经建立3次握手请求队列+未完成三次握手的请求队列。 注：当你设置这个值的时候必须考虑到Linux内核的这两个参数</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. net.core.somaxconn参数决定了端口监听队列的最大长度，存放的是已经处于ESTABLISHED而没有被用户程序（例如nginx）接管的TCP连接，默认是128，对于高并发的，或者瞬发大量连接，必须调高该值，否则会直接丢弃连接
2. net.ipv4.tcp_max_syn_backlog参数决定已经收到syn包，但是还没有来得及确认的连接队列，这是传输层的队列，在高并发的情况下，必须调整该值，提高承载能力。
# TCP listen() backlog.
#
# In high requests-per-second environments you need a high backlog in order
# to avoid slow clients connection issues. Note that the Linux kernel
# will silently truncate it to the value of /proc/sys/net/core/somaxconn so
# make sure to raise both the value of somaxconn and tcp_max_syn_backlog
# in order to get the desired effect.
tcp-backlog 511

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而上述Linux内核参数，可使用vim命令修改下面配置文件生效</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>vim /etc/sysctl.conf

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例内容</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>vm.swappiness = 0
kernel.sysrq = 1

net.ipv4.neigh.default.gc_stale_time = 120

# see details in https://help.aliyun.com/knowledge_detail/39428.html
net.ipv4.conf.all.rp_filter = 0
net.ipv4.conf.default.rp_filter = 0
net.ipv4.conf.default.arp_announce = 2
net.ipv4.conf.lo.arp_announce = 2
net.ipv4.conf.all.arp_announce = 2

# see details in https://help.aliyun.com/knowledge_detail/41334.html
net.ipv4.tcp_max_tw_buckets = 262144
net.ipv4.tcp_syncookies = 1

# tcp_max_syn_backlog will only take effect when net.ipv4.tcp_syncookies == 0
# net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_slow_start_after_idle = 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="timeout" tabindex="-1"><a class="header-anchor" href="#timeout"><span>timeout</span></a></h3><p>表示一个空闲的redis客户端维持多久后关闭，若设置为0，表示永不关闭。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Close the connection after a client is idle for N seconds (0 to disable)
timeout 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tcp-keepalive" tabindex="-1"><a class="header-anchor" href="#tcp-keepalive"><span>tcp-keepalive</span></a></h3><p>该值表示对redis客户端心跳时长检测间隔，默认300s，建议设置成60</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># A reasonable value for this option is 300 seconds, which is the new
# Redis default starting with Redis 3.2.1.
tcp-keepalive 300

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="通用设置" tabindex="-1"><a class="header-anchor" href="#通用设置"><span>通用设置</span></a></h2><h3 id="daemonize" tabindex="-1"><a class="header-anchor" href="#daemonize"><span>daemonize</span></a></h3><p>若设置为yes，则redis服务端会被设置为守护进程，会默认在后台启动</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># By default Redis does not run as a daemon. Use &#39;yes&#39; if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
# When Redis is supervised by upstart or systemd, this parameter has no impact.
daemonize yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="pidfile" tabindex="-1"><a class="header-anchor" href="#pidfile"><span>pidfile</span></a></h3><p>指定redis的pid文件的存放位置</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Note that on modern Linux systems &quot;/run/redis.pid&quot; is more conforming
# and should be used instead.
pidfile /var/run/redis_6379.pid

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="loglevel" tabindex="-1"><a class="header-anchor" href="#loglevel"><span>loglevel</span></a></h3><p>指定日志记录的级别，总共有<code>debug</code>、<code>verbose</code>、<code>notice</code>、<code>warning</code>四个级别，在生产环境，我们建议使用<code>notice</code>、<code>warning</code></p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Specify the server verbosity level.
# This can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)
loglevel notice

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="logfile" tabindex="-1"><a class="header-anchor" href="#logfile"><span>logfile</span></a></h3><p>设置redis服务器的日志名称</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Specify the log file name. Also the empty string can be used to force
# Redis to log on the standard output. Note that if you use standard
# output for logging but daemonize, logs will be sent to /dev/null
logfile &quot;&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="databases" tabindex="-1"><a class="header-anchor" href="#databases"><span>databases</span></a></h3><p>redis设置数据库的数量，默认为16</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT &lt;dbid&gt; where
# dbid is a number between 0 and &#39;databases&#39;-1
databases 16

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>redis客户端可以用如下命令指定操作的redis数据库</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>SELECT &lt;dbid&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; SELECT 1
OK

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安全" tabindex="-1"><a class="header-anchor" href="#安全"><span>安全</span></a></h2><h3 id="requirepass" tabindex="-1"><a class="header-anchor" href="#requirepass"><span>requirepass</span></a></h3><p>解开注释配置这个参数之后，redis客户端连接需要使用密码</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># The requirepass is not compatable with aclfile option and the ACL LOAD
# command, these will cause requirepass to be ignored.
#
# requirepass foobared

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> requirepass 123
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>可以看到设置完requirepass之后，操作redis服务端就需要使用auth进行认证了</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; ping
(error) NOAUTH Authentication required.
127.0.0.1:6379&gt; auth 123
OK
127.0.0.1:6379&gt; ping
PONG
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="限制" tabindex="-1"><a class="header-anchor" href="#限制"><span>限制</span></a></h2><h3 id="maxclients" tabindex="-1"><a class="header-anchor" href="#maxclients"><span>maxclients</span></a></h3><p>redis允许接入的最大客户端连接数，默认为1000</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># IMPORTANT: When Redis Cluster is used, the max number of connections is also
# shared with the cluster bus: every node in the cluster will use two
# connections, one incoming and another outgoing. It is important to size the
# limit accordingly in case of very large clusters.
#
# maxclients 10000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>笔者尝试将这个值改为1之后，开始第2个客户端尝试连接报出了<code>ERR max number of clients reached</code>的错误</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# cd /usr/sbin/
root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379&gt; ping
Error: Broken pipe
127.0.0.1:6379&gt; auth 123
(error) ERR max number of clients reached
127.0.0.1:6379&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="maxmemory" tabindex="-1"><a class="header-anchor" href="#maxmemory"><span>maxmemory</span></a></h3><p>设置内存的使用上限，一旦redis使用上限达到配置值时，就会根据内存<code>maxmemory-policy</code>配置的测卢克进行缓存置换。 当然若未设置该策略或者无法根据规则移除key的话，你只能对redis进行读操作，写操作一律报错。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># In short... if you have replicas attached it is suggested that you set a lower
# limit for maxmemory so that there is some free RAM on the system for replica
# output buffers (but this is not needed if the policy is &#39;noeviction&#39;).
#
# maxmemory &lt;bytes&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="maxmemory-policy" tabindex="-1"><a class="header-anchor" href="#maxmemory-policy"><span>maxmemory-policy</span></a></h3><ol><li><strong>volatile-lru</strong>：使用LRU算法移除key，只对设置了过期时间的键(最近最少使用的key);</li><li><strong>allkeys-lru</strong>：在所有集合key中，使用LRU算法移除key。</li><li><strong>volatile-random</strong>：在过期集合中移除随机的key，只对设置了过期时间的键</li><li><strong>allkeys-random</strong>：在所有集合key中，移除随机的key</li><li><strong>volatile-ttl</strong>：移除那些TTL值最小的key，即那些最近要过期的key</li><li><strong>noeviction</strong>：不进行移除。针对写操作，只是返回错误信息(redis的默认配置)</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Note: with any of the above policies, when there are no suitable keys for
# eviction, Redis will return an error on write operations that require
# more memory. These are usually commands that create new keys, add data or
# modify existing keys. A few examples are: SET, INCR, HSET, LPUSH, SUNIONSTORE,
# SORT (due to the STORE argument), and EXEC (if the transaction includes any
# command that requires memory).
#
# The default is:
#
# maxmemory-policy noeviction

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="maxmemory-samples" tabindex="-1"><a class="header-anchor" href="#maxmemory-samples"><span>maxmemory-samples</span></a></h3><p>在使用LRU或者TTL算法进行内存置换时都无法进行精确计算，所以我们可以设置一定量的样本确保估算值的准确性。 此时我们就可以使用<code>maxmemory-samples</code>达到目的，建议设置在3-7范围以内，这个值越大估算的值越准确，但是性能消耗也会随之变高。</p><p>配置如下所示，redis默认配置为5</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># The default of 5 produces good enough results. 10 Approximates very closely
# true LRU but costs more CPU. 3 is faster but not very accurate.
#
# maxmemory-samples 5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,77),d=[t];function l(r,c){return i(),n("div",null,d)}const u=e(a,[["render",l],["__file","Redis配置文件介绍.html.vue"]]),m=JSON.parse('{"path":"/Redis/Redis%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E4%BB%8B%E7%BB%8D.html","title":"Redis配置文件介绍","lang":"zh-CN","frontmatter":{"description":"Redis配置文件介绍 Units单位 redis默认单位的度量为byte，而不是bit，这点我们需要注意一下 计量单位对大小写不敏感 include 该配置可以将其他配置全部提取到该配置文件中以便统一管理。 网络相关配置 bind 默认绑定127.0.0.1 若protected-mode yes，且没有设置bind ip、没有设置密码的情况下，只有...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/Redis%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E4%BB%8B%E7%BB%8D.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"Redis配置文件介绍"}],["meta",{"property":"og:description","content":"Redis配置文件介绍 Units单位 redis默认单位的度量为byte，而不是bit，这点我们需要注意一下 计量单位对大小写不敏感 include 该配置可以将其他配置全部提取到该配置文件中以便统一管理。 网络相关配置 bind 默认绑定127.0.0.1 若protected-mode yes，且没有设置bind ip、没有设置密码的情况下，只有..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220901033637212.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Redis配置文件介绍"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis配置文件介绍\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/image-20220901033637212.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"Units单位","slug":"units单位","link":"#units单位","children":[]},{"level":2,"title":"include","slug":"include","link":"#include","children":[]},{"level":2,"title":"网络相关配置","slug":"网络相关配置","link":"#网络相关配置","children":[{"level":3,"title":"bind","slug":"bind","link":"#bind","children":[]},{"level":3,"title":"protected-mode","slug":"protected-mode","link":"#protected-mode","children":[]},{"level":3,"title":"port","slug":"port","link":"#port","children":[]},{"level":3,"title":"tcp-backlog","slug":"tcp-backlog","link":"#tcp-backlog","children":[]},{"level":3,"title":"timeout","slug":"timeout","link":"#timeout","children":[]},{"level":3,"title":"tcp-keepalive","slug":"tcp-keepalive","link":"#tcp-keepalive","children":[]}]},{"level":2,"title":"通用设置","slug":"通用设置","link":"#通用设置","children":[{"level":3,"title":"daemonize","slug":"daemonize","link":"#daemonize","children":[]},{"level":3,"title":"pidfile","slug":"pidfile","link":"#pidfile","children":[]},{"level":3,"title":"loglevel","slug":"loglevel","link":"#loglevel","children":[]},{"level":3,"title":"logfile","slug":"logfile","link":"#logfile","children":[]},{"level":3,"title":"databases","slug":"databases","link":"#databases","children":[]}]},{"level":2,"title":"安全","slug":"安全","link":"#安全","children":[{"level":3,"title":"requirepass","slug":"requirepass","link":"#requirepass","children":[]}]},{"level":2,"title":"限制","slug":"限制","link":"#限制","children":[{"level":3,"title":"maxclients","slug":"maxclients","link":"#maxclients","children":[]},{"level":3,"title":"maxmemory","slug":"maxmemory","link":"#maxmemory","children":[]},{"level":3,"title":"maxmemory-policy","slug":"maxmemory-policy","link":"#maxmemory-policy","children":[]},{"level":3,"title":"maxmemory-samples","slug":"maxmemory-samples","link":"#maxmemory-samples","children":[]}]}],"git":{"createdTime":1662316251000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":6.79,"words":2037},"filePathRelative":"Redis/Redis配置文件介绍.md","localizedDate":"2022年9月4日","excerpt":"\\n<h2>Units单位</h2>\\n<ol>\\n<li>redis默认单位的度量为byte，而不是bit，这点我们需要注意一下</li>\\n<li>计量单位对大小写不敏感</li>\\n</ol>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code># Note on units: when memory size is needed, it is possible to specify\\n# it in the usual form of 1k 5GB 4M and so forth:\\n#\\n# 1k =&gt; 1000 bytes\\n# 1kb =&gt; 1024 bytes\\n# 1m =&gt; 1000000 bytes\\n# 1mb =&gt; 1024*1024 bytes\\n# 1g =&gt; 1000000000 bytes\\n# 1gb =&gt; 1024*1024*1024 bytes\\n#\\n# units are case insensitive so 1GB 1Gb 1gB are all the same.\\n\\n</code></pre></div>","autoDesc":true}');export{u as comp,m as data};
