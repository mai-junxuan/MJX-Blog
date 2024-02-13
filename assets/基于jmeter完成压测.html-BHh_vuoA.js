import{_ as p}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as r,c as i,b as e,d as a,e as s,a as t}from"./app-DITNE2eT.js";const l={},c=t('<h1 id="基于jmeter完成压测" tabindex="-1"><a class="header-anchor" href="#基于jmeter完成压测"><span>基于jmeter完成压测</span></a></h1><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p><code>jmeter</code>算是我们日常比较常用的压测工具，这篇文章笔者就介绍一下基于<code>win10</code>完成<code>jmeter</code>的安装及使用。</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2><h3 id="下载" tabindex="-1"><a class="header-anchor" href="#下载"><span>下载</span></a></h3><p>首先我们必须到达官网下载对应的安装包。</p>',6),d={href:"https://archive.apache.org/dist/jmeter/binaries/",target:"_blank",rel:"noopener noreferrer"},m=t(`<p>注意下载的时候必须下载<code>Binaries</code>类型而非源码类型，否则启动时可能会抛出<code>Unable to access jarfile ApacheJMeter</code>，如下图所示，笔者本次下载的就是<code>5.1</code>版本。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801797.png" alt="在这里插入图片描述"></p><h3 id="配置环境变量" tabindex="-1"><a class="header-anchor" href="#配置环境变量"><span>配置环境变量</span></a></h3><p>完成下载后，我们可以将<code>jmeter</code>存放到自己喜欢的目录然后设置环境变量。首先添加一个环境变量<code>JMETER_HOME</code>，值为<code>jmeter</code>的存放路径</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801761.png" alt="在这里插入图片描述"></p><p>然后在环境变量<code>path</code>添加一条<code>%JMETER_HOME%\\bin</code></p><h3 id="启动测试" tabindex="-1"><a class="header-anchor" href="#启动测试"><span>启动测试</span></a></h3><p>配置完成环境变量后，我们就可以启动测试可用性了，我们打开<code>cmd</code>控制台输入<code>jmeter</code>，如下所示，如果输出这样一段文字并且启动的<code>jmeter</code>的图形界面则说明安装成功了。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span>Zsy<span class="token operator">&gt;</span>jmeter
<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span>
Don&#39;t use GUI mode <span class="token keyword">for</span> load testing <span class="token operator">!</span>, only <span class="token keyword">for</span> Test creation and Test debugging.
For load testing, use CLI Mode <span class="token punctuation">(</span>was NON GUI<span class="token punctuation">)</span>:
   jmeter <span class="token parameter variable">-n</span> <span class="token parameter variable">-t</span> <span class="token punctuation">[</span>jmx file<span class="token punctuation">]</span> <span class="token parameter variable">-l</span> <span class="token punctuation">[</span>results file<span class="token punctuation">]</span> <span class="token parameter variable">-e</span> <span class="token parameter variable">-o</span> <span class="token punctuation">[</span>Path to web report folder<span class="token punctuation">]</span>
<span class="token operator">&amp;</span> increase Java Heap to meet your <span class="token builtin class-name">test</span> requirements:
   Modify current <span class="token function">env</span> variable <span class="token assign-left variable">HEAP</span><span class="token operator">=</span><span class="token string">&quot;-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m&quot;</span> <span class="token keyword">in</span> the jmeter batch <span class="token function">file</span>
Check <span class="token builtin class-name">:</span> https://jmeter.apache.org/usermanual/best-practices.html
<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="调整为中文" tabindex="-1"><a class="header-anchor" href="#调整为中文"><span>调整为中文</span></a></h3><p>我们进入<code>apache-jmeter-5.1\\bin</code>找到文件<code>jmeter.properties</code>，如下图，找到<code>language</code>改为<code>zh_CN</code>，下次启动直接生效。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837492.png" alt="在这里插入图片描述"></p><h2 id="压测" tabindex="-1"><a class="header-anchor" href="#压测"><span>压测</span></a></h2><h3 id="创建线程组" tabindex="-1"><a class="header-anchor" href="#创建线程组"><span>创建线程组</span></a></h3><p>要进行压测，我们首先需要创建一个线程组。如下图所示:</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837042.png" alt="在这里插入图片描述"></p><p>创建线程组之后，我们就可以设置线程组名称，压测参数。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837720.png" alt="在这里插入图片描述"></p><h3 id="创建压测地址" tabindex="-1"><a class="header-anchor" href="#创建压测地址"><span>创建压测地址</span></a></h3><p>如下图，右键创建<code>HTTP</code>请求。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837595.png" alt="在这里插入图片描述"></p><p>输入请求的协议类型，地址、端口号、映射路径、参数等。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837765.png" alt="在这里插入图片描述"></p><h3 id="添加结果树和聚合报告" tabindex="-1"><a class="header-anchor" href="#添加结果树和聚合报告"><span>添加结果树和聚合报告</span></a></h3><p>然后我们就可以进行压测了，但是笔者希望看到压测结果和聚合报告，这时候我们就可以右键刚刚创建的<code>HTTP</code>请求，添加结果树和聚合报告</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837193.png" alt="在这里插入图片描述"></p><h3 id="点击启动进行压测" tabindex="-1"><a class="header-anchor" href="#点击启动进行压测"><span>点击启动进行压测</span></a></h3><p>如下图，我们点击这个绿色按钮即可开始压测。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837596.png" alt="在这里插入图片描述"></p><p>点击结果树就能看到请求结果</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837037.png" alt="在这里插入图片描述"></p><p>点击聚合报告就能看到性能测试报告</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801274.png" alt="在这里插入图片描述"></p><h2 id="一些比较特殊的压测" tabindex="-1"><a class="header-anchor" href="#一些比较特殊的压测"><span>一些比较特殊的压测</span></a></h2><h3 id="基于jmeter测试post请求" tabindex="-1"><a class="header-anchor" href="#基于jmeter测试post请求"><span>基于Jmeter测试POST请求</span></a></h3><p>了解了jmeter整体的操作之后，我们再来补充一下日常用的最多的json传参的post请求，由于jmeter界面发起POST稍微有些麻烦，所以笔者就在这里补充一下post请求的配置步骤：</p><ol><li>首先自然是填写<code>HTTP</code>请求的常规信息，如下图，设置请求方式、映射地址、请求参数、端口号等信息:</li></ol><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801288.png" alt="在这里插入图片描述"></p><ol><li>重点来了，我们必须手动创建<code>HTTP</code>信息头管理器，配置文本类型告知<code>Jmeter</code>我们当前发起的请求是参数为<code>JSON</code>格式的<code>POST</code>请求，如下图所示点击对应选项创建<code>HTTP</code>信息头管理器。</li></ol><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801706.png" alt="在这里插入图片描述"></p><p>如下图，<code>key</code>和<code>value</code>分别配置<code>Content-Type</code>和<code>application/json;charset=UTF-8</code>，完成信息头的配置之后，我们就可以发起<code>POST</code>请求开始着手压测了。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837856.png" alt="在这里插入图片描述"></p><h3 id="基于jmeter压测udp请求" tabindex="-1"><a class="header-anchor" href="#基于jmeter压测udp请求"><span>基于jmeter压测UDP请求</span></a></h3><p>某些情况下，我们可能需要对UDP进行压测，但是jmeter默认情况下是不提供UDP请求，所以我们需要下载一下UDP插件。</p><p>首先我们必须要下载一个jmeter插件管理器:</p>`,45),g={href:"https://jmeter-plugins.org/install/Install/",target:"_blank",rel:"noopener noreferrer"},h=t('<p>如下图，点击这个jar包下载完成后，将其放到lib的ext目录下即可</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801730.png" alt="在这里插入图片描述"></p><p>如下图，可以看到笔者将这个插件复制到了ext目录下:</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801715.png" alt="在这里插入图片描述"></p><p>然后我们再次启动jmeter找到选项，找到插件管理</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801734.png" alt="在这里插入图片描述"></p><p>搜索UDP并选择应用改变再重启</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801013.png" alt="在这里插入图片描述"></p><p>可以看到重启后创建取样器就可以找到UDP的了。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837092.png" alt="在这里插入图片描述"></p>',10),u=e("code",null,"kg.apc.jmeter.samplers.UDPSampler",-1),j={href:"https://jmeter-plugins.org/wiki/UDPRequest/?utm_source=jmeter&utm_medium=helplink&utm_campaign=UDPRequest",target:"_blank",rel:"noopener noreferrer"},k=e("p",null,"可以看到笔者请求的是7000端口,发送的udp报文为hello",-1),v=e("p",null,[e("img",{src:"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801120.png",alt:"在这里插入图片描述"})],-1),x=e("p",null,"点击压测后虚拟机中的服务确实收到了udp报文，自此我们的UDP报文压测配置成功了",-1),_=e("p",null,[e("img",{src:"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801228.png",alt:"在这里插入图片描述"})],-1);function b(C,f){const n=o("ExternalLinkIcon");return r(),i("div",null,[c,e("p",null,[e("a",d,[a("https://archive.apache.org/dist/jmeter/binaries/(opens new window)"),s(n)])]),m,e("p",null,[e("a",g,[a("https://jmeter-plugins.org/install/Install/(opens new window)"),s(n)])]),h,e("p",null,[a("以笔者取样器为例，编码类型选的是"),u,a("，即最基本的文本格式,更多格式可以参考jmeter官方文档中关于UDP测试模板的样例:"),e("a",j,[a("https://jmeter-plugins.org/wiki/UDPRequest/?utm_source=jmeter&utm_medium=helplink&utm_campaign=UDPRequest(opens new window)"),s(n)])]),k,v,x,_])}const P=p(l,[["render",b],["__file","基于jmeter完成压测.html.vue"]]),T=JSON.parse('{"path":"/%E5%B7%A5%E5%85%B7/%E5%85%B6%E4%BB%96/%E5%9F%BA%E4%BA%8Ejmeter%E5%AE%8C%E6%88%90%E5%8E%8B%E6%B5%8B.html","title":"基于jmeter完成压测","lang":"zh-CN","frontmatter":{"description":"基于jmeter完成压测 前言 jmeter算是我们日常比较常用的压测工具，这篇文章笔者就介绍一下基于win10完成jmeter的安装及使用。 安装 下载 首先我们必须到达官网下载对应的安装包。 https://archive.apache.org/dist/jmeter/binaries/(opens new window) 注意下载的时候必须下载B...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/%E5%B7%A5%E5%85%B7/%E5%85%B6%E4%BB%96/%E5%9F%BA%E4%BA%8Ejmeter%E5%AE%8C%E6%88%90%E5%8E%8B%E6%B5%8B.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"基于jmeter完成压测"}],["meta",{"property":"og:description","content":"基于jmeter完成压测 前言 jmeter算是我们日常比较常用的压测工具，这篇文章笔者就介绍一下基于win10完成jmeter的安装及使用。 安装 下载 首先我们必须到达官网下载对应的安装包。 https://archive.apache.org/dist/jmeter/binaries/(opens new window) 注意下载的时候必须下载B..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801797.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-08-28T00:49:57.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"基于jmeter完成压测"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-08-28T00:49:57.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"基于jmeter完成压测\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801797.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801761.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837492.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837042.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837720.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837595.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837765.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837193.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837596.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837037.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801274.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801288.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801706.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837856.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801730.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801715.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801734.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801013.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280837092.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801120.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202307021801228.png\\"],\\"dateModified\\":\\"2023-08-28T00:49:57.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"安装","slug":"安装","link":"#安装","children":[{"level":3,"title":"下载","slug":"下载","link":"#下载","children":[]},{"level":3,"title":"配置环境变量","slug":"配置环境变量","link":"#配置环境变量","children":[]},{"level":3,"title":"启动测试","slug":"启动测试","link":"#启动测试","children":[]},{"level":3,"title":"调整为中文","slug":"调整为中文","link":"#调整为中文","children":[]}]},{"level":2,"title":"压测","slug":"压测","link":"#压测","children":[{"level":3,"title":"创建线程组","slug":"创建线程组","link":"#创建线程组","children":[]},{"level":3,"title":"创建压测地址","slug":"创建压测地址","link":"#创建压测地址","children":[]},{"level":3,"title":"添加结果树和聚合报告","slug":"添加结果树和聚合报告","link":"#添加结果树和聚合报告","children":[]},{"level":3,"title":"点击启动进行压测","slug":"点击启动进行压测","link":"#点击启动进行压测","children":[]}]},{"level":2,"title":"一些比较特殊的压测","slug":"一些比较特殊的压测","link":"#一些比较特殊的压测","children":[{"level":3,"title":"基于Jmeter测试POST请求","slug":"基于jmeter测试post请求","link":"#基于jmeter测试post请求","children":[]},{"level":3,"title":"基于jmeter压测UDP请求","slug":"基于jmeter压测udp请求","link":"#基于jmeter压测udp请求","children":[]}]}],"git":{"createdTime":1693183797000,"updatedTime":1693183797000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":1}]},"readingTime":{"minutes":4.67,"words":1400},"filePathRelative":"工具/其他/基于jmeter完成压测.md","localizedDate":"2023年8月28日","excerpt":"\\n<h2>前言</h2>\\n<p><code>jmeter</code>算是我们日常比较常用的压测工具，这篇文章笔者就介绍一下基于<code>win10</code>完成<code>jmeter</code>的安装及使用。</p>\\n<h2>安装</h2>\\n<h3>下载</h3>\\n<p>首先我们必须到达官网下载对应的安装包。</p>\\n<p><a href=\\"https://archive.apache.org/dist/jmeter/binaries/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://archive.apache.org/dist/jmeter/binaries/(opens new window)</a></p>","autoDesc":true}');export{P as comp,T as data};
