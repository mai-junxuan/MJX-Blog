import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,a as e}from"./app-DITNE2eT.js";const t={},p=e(`<h1 id="redis的3种特殊类型" tabindex="-1"><a class="header-anchor" href="#redis的3种特殊类型"><span>Redis的3种特殊类型</span></a></h1><blockquote><p>Redis除了中5种基础数据类型，还有三种特殊的数据类型，分别是 <strong>HyperLogLogs</strong>（基数统计）， <strong>Bitmaps</strong> (位图) 和 <strong>geospatial</strong> （地理位置）。</p></blockquote><h2 id="hyperloglogs-基数统计" tabindex="-1"><a class="header-anchor" href="#hyperloglogs-基数统计"><span>HyperLogLogs（基数统计）</span></a></h2><blockquote><p>Redis 2.8.9 版本更新了 Hyperloglog 数据结构！</p></blockquote><ul><li><strong>什么是基数？</strong></li></ul><p>举个例子，A = {1, 2, 3, 4, 5}， B = {3, 5, 6, 7, 9}；那么基数（不重复的元素）= 1, 2, 4, 6, 7, 9； （允许容错，即可以接受一定误差）</p><ul><li><strong>HyperLogLogs 基数统计用来解决什么问题</strong>？</li></ul><p>这个结构可以非常省内存的去统计各种计数，比如注册 IP 数、每日访问 IP 数、页面实时UV、在线用户数，共同好友数等。</p><ul><li><strong>它的优势体现在哪</strong>？</li></ul><p>一个大型的网站，每天 IP 比如有 100 万，粗算一个 IP 消耗 15 字节，那么 100 万个 IP 就是 15M。而 HyperLogLog 在 Redis 中每个键占用的内容都是 12K，理论存储近似接近 2^64 个值，不管存储的内容是什么，它一个基于基数估算的算法，只能比较准确的估算出基数，可以使用少量固定的内存去存储并识别集合中的唯一元素。而且这个估算的基数并不一定准确，是一个带有 0.81% 标准错误的近似值（对于可以接受一定容错的业务场景，比如IP数统计，UV等，是可以忽略不计的）。</p><ul><li><strong>相关命令使用</strong></li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> pfadd key1 a b c d e f g h i	<span class="token comment"># 创建第一组元素</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">1</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> pfcount key1					<span class="token comment"># 统计元素的基数数量</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">9</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> pfadd key2 c j k l m e g a		<span class="token comment"># 创建第二组元素</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">1</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> pfcount key2
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">8</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> pfmerge key3 key1 key2			<span class="token comment"># 合并两组：key1 key2 -&gt; key3 并集</span>
OK
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> pfcount key3
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">13</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="bitmap-位存储" tabindex="-1"><a class="header-anchor" href="#bitmap-位存储"><span>Bitmap （位存储）</span></a></h2><blockquote><p>Bitmap 即位图数据结构，都是操作二进制位来进行记录，只有0 和 1 两个状态。</p></blockquote><ul><li><strong>用来解决什么问题</strong>？</li></ul><p>比如：统计用户信息，活跃，不活跃！ 登录，未登录！ 打卡，不打卡！ <strong>两个状态的，都可以使用 Bitmaps</strong>！</p><p>如果存储一年的打卡状态需要多少内存呢？ 365 天 = 365 bit 1字节 = 8bit 46 个字节左右！</p><ul><li><strong>相关命令使用</strong></li></ul><p>使用bitmap 来记录 周一到周日的打卡！ 周一：1 周二：0 周三：0 周四：1 ......</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">0</span> <span class="token number">1</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">1</span> <span class="token number">1</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">2</span> <span class="token number">0</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">3</span> <span class="token number">1</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">4</span> <span class="token number">0</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">5</span> <span class="token number">0</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> setbit sign <span class="token number">6</span> <span class="token number">1</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看某一天是否有打卡！</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> getbit sign <span class="token number">3</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">1</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> getbit sign <span class="token number">5</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>统计操作，统计 打卡的天数！</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> bitcount sign <span class="token comment"># 统计这周的打卡记录，就可以看到是否有全勤！</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">3</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="geospatial-地理位置" tabindex="-1"><a class="header-anchor" href="#geospatial-地理位置"><span>geospatial (地理位置)</span></a></h2><blockquote><p>Redis 的 Geo 在 Redis 3.2 版本就推出了! 这个功能可以推算地理位置的信息: 两地之间的距离, 方圆几里的人</p></blockquote><h3 id="geoadd" tabindex="-1"><a class="header-anchor" href="#geoadd"><span>geoadd</span></a></h3><blockquote><p>添加地理位置</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geoadd china:city <span class="token number">118.76</span> <span class="token number">32.04</span> manjing <span class="token number">112.55</span> <span class="token number">37.86</span> taiyuan <span class="token number">123.43</span> <span class="token number">41.80</span> shenyang
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">3</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geoadd china:city <span class="token number">144.05</span> <span class="token number">22.52</span> shengzhen <span class="token number">120.16</span> <span class="token number">30.24</span> hangzhou <span class="token number">108.96</span> <span class="token number">34.26</span> xian
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">3</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>规则</strong></p><p>两级无法直接添加，我们一般会下载城市数据(这个网址可以查询 GEO： http://www.jsons.cn/lngcode)！</p><ul><li>有效的经度从-180度到180度。</li><li>有效的纬度从-85.05112878度到85.05112878度。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 当坐标位置超出上述指定范围时，该命令将会返回一个错误。</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geoadd china:city <span class="token number">39.90</span> <span class="token number">116.40</span> beijin
<span class="token punctuation">(</span>error<span class="token punctuation">)</span> ERR invalid longitude,latitude pair <span class="token number">39.900000</span>,116.400000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="geopos" tabindex="-1"><a class="header-anchor" href="#geopos"><span>geopos</span></a></h3><blockquote><p>获取指定的成员的经度和纬度</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geopos china:city taiyuan manjing
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;112.54999905824661255&quot;</span>
   <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;37.86000073876942196&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;118.75999957323074341&quot;</span>
   <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;32.03999960287850968&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获得当前定位, 一定是一个坐标值!</p><h3 id="geodist" tabindex="-1"><a class="header-anchor" href="#geodist"><span>geodist</span></a></h3><blockquote><p>如果不存在, 返回空</p></blockquote><p>单位如下</p><ul><li>m</li><li>km</li><li>mi 英里</li><li>ft 英尺</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geodist china:city taiyuan shenyang m
<span class="token string">&quot;1026439.1070&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geodist china:city taiyuan shenyang km
<span class="token string">&quot;1026.4391&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="georadius" tabindex="-1"><a class="header-anchor" href="#georadius"><span>georadius</span></a></h3><blockquote><p>附近的人 ==&gt; 获得所有附近的人的地址, 定位, 通过半径来查询</p></blockquote><p>获得指定数量的人</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> georadius china:city <span class="token number">110</span> <span class="token number">30</span> <span class="token number">1000</span> km			以 <span class="token number">100,30</span> 这个坐标为中心, 寻找半径为1000km的城市
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;hangzhou&quot;</span>
<span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;manjing&quot;</span>
<span class="token number">4</span><span class="token punctuation">)</span> <span class="token string">&quot;taiyuan&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> georadius china:city <span class="token number">110</span> <span class="token number">30</span> <span class="token number">500</span> km
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> georadius china:city <span class="token number">110</span> <span class="token number">30</span> <span class="token number">500</span> km withdist
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
   <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;483.8340&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> georadius china:city <span class="token number">110</span> <span class="token number">30</span> <span class="token number">1000</span> km withcoord withdist count <span class="token number">2</span>
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
   <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;483.8340&quot;</span>
   <span class="token number">3</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;108.96000176668167114&quot;</span>
      <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;34.25999964418929977&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;manjing&quot;</span>
   <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;864.9816&quot;</span>
   <span class="token number">3</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;118.75999957323074341&quot;</span>
      <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;32.03999960287850968&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数 key 经度 纬度 半径 单位 [显示结果的经度和纬度] [显示结果的距离] [显示的结果的数量]</p><h3 id="georadiusbymember" tabindex="-1"><a class="header-anchor" href="#georadiusbymember"><span>georadiusbymember</span></a></h3><blockquote><p>显示与指定成员一定半径范围内的其他成员</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> georadiusbymember china:city taiyuan <span class="token number">1000</span> km
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;manjing&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;taiyuan&quot;</span>
<span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> georadiusbymember china:city taiyuan <span class="token number">1000</span> km withcoord withdist count <span class="token number">2</span>
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;taiyuan&quot;</span>
   <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;0.0000&quot;</span>
   <span class="token number">3</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;112.54999905824661255&quot;</span>
      <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;37.86000073876942196&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
   <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;514.2264&quot;</span>
   <span class="token number">3</span><span class="token punctuation">)</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;108.96000176668167114&quot;</span>
      <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;34.25999964418929977&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数与 georadius 一样</p><h3 id="geohash" tabindex="-1"><a class="header-anchor" href="#geohash"><span>geohash</span></a></h3><blockquote><p>该命令返回11个字符的hash字符串</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> geohash china:city taiyuan shenyang
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;ww8p3hhqmp0&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;wxrvb9qyxk0&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将二维的经纬度转换为一维的字符串, 如果两个字符串越接近, 则距离越近</p><h3 id="底层" tabindex="-1"><a class="header-anchor" href="#底层"><span>底层</span></a></h3><blockquote><p>geo底层的实现原理实际上就是Zset, 我们可以通过Zset命令来操作geo</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">type</span> china:city
zset
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>查看全部元素 删除指定的元素</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> zrange china:city <span class="token number">0</span> <span class="token parameter variable">-1</span> withscores
 <span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
 <span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;4040115445396757&quot;</span>
 <span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;hangzhou&quot;</span>
 <span class="token number">4</span><span class="token punctuation">)</span> <span class="token string">&quot;4054133997236782&quot;</span>
 <span class="token number">5</span><span class="token punctuation">)</span> <span class="token string">&quot;manjing&quot;</span>
 <span class="token number">6</span><span class="token punctuation">)</span> <span class="token string">&quot;4066006694128997&quot;</span>
 <span class="token number">7</span><span class="token punctuation">)</span> <span class="token string">&quot;taiyuan&quot;</span>
 <span class="token number">8</span><span class="token punctuation">)</span> <span class="token string">&quot;4068216047500484&quot;</span>
 <span class="token number">9</span><span class="token punctuation">)</span> <span class="token string">&quot;shenyang&quot;</span>
<span class="token number">1</span><span class="token punctuation">)</span>  <span class="token string">&quot;4072519231994779&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span>  <span class="token string">&quot;shengzhen&quot;</span>
<span class="token number">3</span><span class="token punctuation">)</span>  <span class="token string">&quot;4154606886655324&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> zrem china:city manjing
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">1</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> zrange china:city <span class="token number">0</span> <span class="token parameter variable">-1</span>
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;xian&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;hangzhou&quot;</span>
<span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;taiyuan&quot;</span>
<span class="token number">4</span><span class="token punctuation">)</span> <span class="token string">&quot;shenyang&quot;</span>
<span class="token number">5</span><span class="token punctuation">)</span> <span class="token string">&quot;shengzhen&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,60),o=[p];function i(l,c){return s(),a("div",null,o)}const d=n(t,[["render",i],["__file","Redis的3种特殊类型.html.vue"]]),m=JSON.parse('{"path":"/Redis/Redis%E7%9A%843%E7%A7%8D%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B.html","title":"Redis的3种特殊类型","lang":"zh-CN","frontmatter":{"description":"Redis的3种特殊类型 Redis除了中5种基础数据类型，还有三种特殊的数据类型，分别是 HyperLogLogs（基数统计）， Bitmaps (位图) 和 geospatial （地理位置）。 HyperLogLogs（基数统计） Redis 2.8.9 版本更新了 Hyperloglog 数据结构！ 什么是基数？ 举个例子，A = {1, 2,...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/Redis%E7%9A%843%E7%A7%8D%E7%89%B9%E6%AE%8A%E7%B1%BB%E5%9E%8B.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"Redis的3种特殊类型"}],["meta",{"property":"og:description","content":"Redis的3种特殊类型 Redis除了中5种基础数据类型，还有三种特殊的数据类型，分别是 HyperLogLogs（基数统计）， Bitmaps (位图) 和 geospatial （地理位置）。 HyperLogLogs（基数统计） Redis 2.8.9 版本更新了 Hyperloglog 数据结构！ 什么是基数？ 举个例子，A = {1, 2,..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2022-09-25T17:42:45.000Z"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2022-09-25T17:42:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis的3种特殊类型\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2022-09-25T17:42:45.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"HyperLogLogs（基数统计）","slug":"hyperloglogs-基数统计","link":"#hyperloglogs-基数统计","children":[]},{"level":2,"title":"Bitmap （位存储）","slug":"bitmap-位存储","link":"#bitmap-位存储","children":[]},{"level":2,"title":"geospatial (地理位置)","slug":"geospatial-地理位置","link":"#geospatial-地理位置","children":[{"level":3,"title":"geoadd","slug":"geoadd","link":"#geoadd","children":[]},{"level":3,"title":"geopos","slug":"geopos","link":"#geopos","children":[]},{"level":3,"title":"geodist","slug":"geodist","link":"#geodist","children":[]},{"level":3,"title":"georadius","slug":"georadius","link":"#georadius","children":[]},{"level":3,"title":"georadiusbymember","slug":"georadiusbymember","link":"#georadiusbymember","children":[]},{"level":3,"title":"geohash","slug":"geohash","link":"#geohash","children":[]},{"level":3,"title":"底层","slug":"底层","link":"#底层","children":[]}]}],"git":{"createdTime":1664127765000,"updatedTime":1664127765000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":1}]},"readingTime":{"minutes":4.62,"words":1387},"filePathRelative":"Redis/Redis的3种特殊类型.md","localizedDate":"2022年9月25日","excerpt":"\\n<blockquote>\\n<p>Redis除了中5种基础数据类型，还有三种特殊的数据类型，分别是 <strong>HyperLogLogs</strong>（基数统计）， <strong>Bitmaps</strong> (位图) 和 <strong>geospatial</strong> （地理位置）。</p>\\n</blockquote>\\n<h2>HyperLogLogs（基数统计）</h2>\\n<blockquote>\\n<p>Redis 2.8.9 版本更新了 Hyperloglog 数据结构！</p>\\n</blockquote>\\n<ul>\\n<li><strong>什么是基数？</strong></li>\\n</ul>","autoDesc":true}');export{d as comp,m as data};
