import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as i,c as n,a as s}from"./app-2Nmlc3aW.js";const a={},d=s(`<h1 id="rdb简介" tabindex="-1"><a class="header-anchor" href="#rdb简介"><span>RDB简介</span></a></h1><p>RDB持久化机制是将<strong>内存</strong>中的数据生成<strong>快照</strong>并持久化到<strong>磁盘</strong>的过程，RDB可以通过<strong>手动</strong>或者<strong>自动</strong>的方式实现持久化。</p><h2 id="rdb触发流程" tabindex="-1"><a class="header-anchor" href="#rdb触发流程"><span>RDB触发流程</span></a></h2><h3 id="手动触发" tabindex="-1"><a class="header-anchor" href="#手动触发"><span>手动触发</span></a></h3><h4 id="save" tabindex="-1"><a class="header-anchor" href="#save"><span>save</span></a></h4><p>save会指令会直接阻塞当前redis服务器，知道RDB完成了为止，对于线上生产环境数据的备份，我们非常不建议使用这种方式。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; save
OK

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="bgsave" tabindex="-1"><a class="header-anchor" href="#bgsave"><span>bgsave</span></a></h4><p>bgsave则是主进程fork一个子进程，由子进程完成持久化操作，而主进程继续处理客户端的读写请求，如果我们需要手动实现持久化，非常推荐使用这种方式。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 从输出我们就可以看出这种方式会将持久化的操作放在后台执行
127.0.0.1:6379&gt; bgsave
Background saving started

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>bgsave的工作流程如下图所示，整体可以简述为:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 主进程fork出一个子进程，这时候主进程会被阻塞
2. 子进程创建完成后，redis客户端会输出Background saving started，这就意味子进程开始进行持久化操作了
3. 子进程持久化完成后，会生成一个rdb文件，将本次的rdb文件通过原子替换的方式将上一次备份的rdb覆盖。
4. 子进程发送信号通知父进程本次任务完成
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044305.png" alt="在这里插入图片描述"></p><h4 id="自动触发" tabindex="-1"><a class="header-anchor" href="#自动触发"><span>自动触发</span></a></h4><p>自动触发我们可以通过配置实现redis.conf的save参数实现，如下所示，假如我们希望用户20s内写入3次就进行持久化，只需在配置中加一条<code>save 20 3</code>即可。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Unless specified otherwise, by default Redis will save the DB:
#   * After 3600 seconds (an hour) if at least 1 key changed
#   * After 300 seconds (5 minutes) if at least 100 keys changed
#   * After 60 seconds if at least 10000 keys changed
#
# You can set these explicitly by uncommenting the three following lines.
#
# save 3600 1
# save 300 100
# save 60 10000
save 20 3

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是<code>save 20 3</code>的20s是以redis的时间间隔为主，并不是用户第1次写入后的20s内再写入两次进行持久化。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045621.png" alt="在这里插入图片描述"></p><h2 id="rdb配置参数详解" tabindex="-1"><a class="header-anchor" href="#rdb配置参数详解"><span>RDB配置参数详解</span></a></h2><h3 id="指定rdb持久化文件名" tabindex="-1"><a class="header-anchor" href="#指定rdb持久化文件名"><span>指定rdb持久化文件名</span></a></h3><p>如下所示，我们可以通过配置dbfilename来指定，默认为dump.rdb</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># The filename where to dump the DB
dbfilename dump.rdb

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="文件持久化位置" tabindex="-1"><a class="header-anchor" href="#文件持久化位置"><span>文件持久化位置</span></a></h3><p>通过dir来指定，如下默认配置就意味着持久化文件位置和redis服务端位置一致。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># The working directory.
#
# The DB will be written inside this directory, with the filename specified
# above using the &#39;dbfilename&#39; configuration directive.
#
# The Append Only File will also be created inside this directory.
#
# Note that you must specify a directory here, not a file name.
dir ./

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="stop-writes-on-bgsave-error" tabindex="-1"><a class="header-anchor" href="#stop-writes-on-bgsave-error"><span>stop-writes-on-bgsave-error</span></a></h3><p>当reids无法将文件写入磁盘，直接关掉redis的写操作，默认为yes</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># However if you have setup your proper monitoring of the Redis server
# and persistence, you may want to disable this feature so that Redis will
# continue to work as usual even if there are problems with disk,
# permissions, and so forth.
stop-writes-on-bgsave-error yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rdbcompression" tabindex="-1"><a class="header-anchor" href="#rdbcompression"><span>rdbcompression</span></a></h3><p>redis默认会通过LZF算法压缩rdb文件。这种方式会消耗CPU，但是压缩后的大小远远小于内存，但是带来的收益却远远大于这点开销，通过压缩的文件无论是通过网络发送到从节点还是存储到硬盘的空间都是非常可观的。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Compress string objects using LZF when dump .rdb databases?
# By default compression is enabled as it&#39;s almost always a win.
# If you want to save some CPU in the saving child set it to &#39;no&#39; but
# the dataset will likely be bigger if you have compressible values or keys.
rdbcompression yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rdbchecksum" tabindex="-1"><a class="header-anchor" href="#rdbchecksum"><span>rdbchecksum</span></a></h3><p>在存储快照后，还可以让redis使用<strong>CRC64</strong>算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># RDB files created with checksum disabled have a checksum of zero that will
# tell the loading code to skip the check.
rdbchecksum yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rdb持久化示例" tabindex="-1"><a class="header-anchor" href="#rdb持久化示例"><span>RDB持久化示例</span></a></h2><h3 id="模拟断电备份" tabindex="-1"><a class="header-anchor" href="#模拟断电备份"><span>模拟断电备份</span></a></h3><p>上文中我们已经配置了20s内3次写入即可触发rdb，所以我们使用redis客户端进行3次写入</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; set k1 v1
OK
127.0.0.1:6379&gt; set k2 v2
OK
127.0.0.1:6379&gt; set k3 v3
OK
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成后查看是否生成rdb文件，确认无误后，我们将这个文件备份，并强制关闭redis服务端，模拟断电的场景</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 强制关闭redis服务端
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ll dump.rdb
-rw-r--r-- 1 root root 118 Aug 24 23:20 dump.rdb
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ps -ef |grep redis
root      7773     1  0 22:59 ?        00:00:01 redis-server 127.0.0.1:6379
root      8884  7103  0 23:21 pts/0    00:00:00 grep --color=auto redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# kill -9 7773

# 重命名rdb文件
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv dump.rdb dump.rdb.bak
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时我们再启动redis就会发现数据为空</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; keys *
(empty array)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们将rdb文件还原，并重启redis，可以发现备份数据还原了</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 强制关闭redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ps -ef |grep redis |grep -v grep
root      8956     1  0 23:22 ?        00:00:00 redis-server 127.0.0.1:6379
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# kill -9 8956

# 还原rdb，并启动redis
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv dump.rdb.bak dump.rdb
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379&gt; auth 123
OK

# 可以看到之前设置的数据都回来了
127.0.0.1:6379&gt; keys *
1) &quot;k3&quot;
2) &quot;k2&quot;
3) &quot;k1&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注</strong>:当我们使用<strong>shutdown</strong>指令也会自动触发<strong>bgsave</strong>，读者可以自行测试</p><h2 id="rdb优缺点" tabindex="-1"><a class="header-anchor" href="#rdb优缺点"><span>RDB优缺点</span></a></h2><h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点"><span>优点</span></a></h3><ol><li>rdb是紧凑压缩的二进制文件，非常实用与备份或者全景复制等场景。</li><li>rdb恢复数据效率远远高于aof</li></ol><h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点"><span>缺点</span></a></h3><ol><li>无法做到毫秒级别的实时性持久化，尽管我们可以通过设置紧凑的save完成持久化，但是频繁的fork子进程进行持久化，很可能造成redis主进行长期阻塞。</li><li>存储的文件是二进制，不够直观。</li></ol><h2 id="rdb更深入的理解" tabindex="-1"><a class="header-anchor" href="#rdb更深入的理解"><span>RDB更深入的理解</span></a></h2><ol><li>生产环境大内存的redis数据如何在持久化的时候保持数据一致性呢？</li></ol><blockquote><p>redis的rdb持久化是基于cow(写时复制思想)，redis会fork一个子进程完成数据持久化，再次期间发生的原数据修改或者写入的新数据都会生成一个数据副本，被fork的bgsave子进程写入到快照文件中。</p></blockquote><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044035.png" alt="在这里插入图片描述"></p><ol><li>在进行快照操作的这段时间，如果发生服务崩溃怎么办？</li></ol><blockquote><p>服务恢复的数据只会是上一次备份的rdb文件数据，因为bgsave子进程只会将操作成功的文件生成rdb文件覆盖上一次备份的文件。</p></blockquote><ol><li>可以每秒做一次快照吗？</li></ol><blockquote><p>可以，但是开销很大,原因有两点 1.频繁写入内存数据会给磁盘带来很大的压力，多个fork子进程抢占优先的磁盘带宽，前一个子进程没写完，后一个子进程又来写入。 2. rdb持久化每次fork子进程都会阻塞主进程，频繁fork很可能导致主进程长期处于阻塞状态。</p></blockquote><h2 id="rdb相关面试题" tabindex="-1"><a class="header-anchor" href="#rdb相关面试题"><span>RDB相关面试题</span></a></h2><ol><li>什么是 RDB 持久化？</li></ol><blockquote><p>Redis可以通过指定时间或者手动的方式将数据以rdb格式的文件持久化到磁盘中，完成数据备份，或者将数据备份到其他的从节点中。还可以用这个rdb文件作为备份文件，在redis数据丢失的时候可以通过rdb文件时间数据还原。</p></blockquote>`,61),r=[d];function t(l,o){return i(),n("div",null,r)}const b=e(a,[["render",t],["__file","RDB简介.html.vue"]]),u=JSON.parse('{"path":"/Redis/RDB%E7%AE%80%E4%BB%8B.html","title":"RDB简介","lang":"zh-CN","frontmatter":{"description":"RDB简介 RDB持久化机制是将内存中的数据生成快照并持久化到磁盘的过程，RDB可以通过手动或者自动的方式实现持久化。 RDB触发流程 手动触发 save save会指令会直接阻塞当前redis服务器，知道RDB完成了为止，对于线上生产环境数据的备份，我们非常不建议使用这种方式。 bgsave bgsave则是主进程fork一个子进程，由子进程完成持久...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/RDB%E7%AE%80%E4%BB%8B.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"RDB简介"}],["meta",{"property":"og:description","content":"RDB简介 RDB持久化机制是将内存中的数据生成快照并持久化到磁盘的过程，RDB可以通过手动或者自动的方式实现持久化。 RDB触发流程 手动触发 save save会指令会直接阻塞当前redis服务器，知道RDB完成了为止，对于线上生产环境数据的备份，我们非常不建议使用这种方式。 bgsave bgsave则是主进程fork一个子进程，由子进程完成持久..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044305.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"RDB简介"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"RDB简介\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044305.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022045621.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044035.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\",\\"email\\":\\"maijunxuan0309@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"RDB触发流程","slug":"rdb触发流程","link":"#rdb触发流程","children":[{"level":3,"title":"手动触发","slug":"手动触发","link":"#手动触发","children":[]}]},{"level":2,"title":"RDB配置参数详解","slug":"rdb配置参数详解","link":"#rdb配置参数详解","children":[{"level":3,"title":"指定rdb持久化文件名","slug":"指定rdb持久化文件名","link":"#指定rdb持久化文件名","children":[]},{"level":3,"title":"文件持久化位置","slug":"文件持久化位置","link":"#文件持久化位置","children":[]},{"level":3,"title":"stop-writes-on-bgsave-error","slug":"stop-writes-on-bgsave-error","link":"#stop-writes-on-bgsave-error","children":[]},{"level":3,"title":"rdbcompression","slug":"rdbcompression","link":"#rdbcompression","children":[]},{"level":3,"title":"rdbchecksum","slug":"rdbchecksum","link":"#rdbchecksum","children":[]}]},{"level":2,"title":"RDB持久化示例","slug":"rdb持久化示例","link":"#rdb持久化示例","children":[{"level":3,"title":"模拟断电备份","slug":"模拟断电备份","link":"#模拟断电备份","children":[]}]},{"level":2,"title":"RDB优缺点","slug":"rdb优缺点","link":"#rdb优缺点","children":[{"level":3,"title":"优点","slug":"优点","link":"#优点","children":[]},{"level":3,"title":"缺点","slug":"缺点","link":"#缺点","children":[]}]},{"level":2,"title":"RDB更深入的理解","slug":"rdb更深入的理解","link":"#rdb更深入的理解","children":[]},{"level":2,"title":"RDB相关面试题","slug":"rdb相关面试题","link":"#rdb相关面试题","children":[]}],"git":{"createdTime":1662316251000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":6.19,"words":1857},"filePathRelative":"Redis/RDB简介.md","localizedDate":"2022年9月4日","excerpt":"\\n<p>RDB持久化机制是将<strong>内存</strong>中的数据生成<strong>快照</strong>并持久化到<strong>磁盘</strong>的过程，RDB可以通过<strong>手动</strong>或者<strong>自动</strong>的方式实现持久化。</p>\\n<h2>RDB触发流程</h2>\\n<h3>手动触发</h3>\\n<h4>save</h4>\\n<p>save会指令会直接阻塞当前redis服务器，知道RDB完成了为止，对于线上生产环境数据的备份，我们非常不建议使用这种方式。</p>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code>127.0.0.1:6379&gt; save\\nOK\\n\\n</code></pre></div>","autoDesc":true}');export{b as comp,u as data};
