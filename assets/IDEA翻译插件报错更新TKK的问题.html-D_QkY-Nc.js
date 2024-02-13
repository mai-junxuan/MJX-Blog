import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as t,a as n}from"./app-DITNE2eT.js";const s={},o=n(`<h1 id="问题描述" tabindex="-1"><a class="header-anchor" href="#问题描述"><span>问题描述</span></a></h1><p>使用翻译插件翻译源码注释时，idea插件translation经过长时间等待后抛出一个<code>更新 TKK 失败，请检查网络连接</code>。无论重启还是科学上网都无法解决问题。</p><h1 id="原因" tabindex="-1"><a class="header-anchor" href="#原因"><span>原因</span></a></h1><p>经过查阅网上资料得知，是谷歌翻译网站抽风了，读者可以使用下面这段命令确定一下自己的网络能否访问该网站</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">ping</span> translate.googleapis.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案"><span>解决方案</span></a></h1><h2 id="获取谷歌翻译ip地址" tabindex="-1"><a class="header-anchor" href="#获取谷歌翻译ip地址"><span>获取谷歌翻译ip地址</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">ping</span> translate.google.cn
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="编辑hosts文件-使用谷歌翻译地址绑定translate-googleapis-com的地址" tabindex="-1"><a class="header-anchor" href="#编辑hosts文件-使用谷歌翻译地址绑定translate-googleapis-com的地址"><span>编辑hosts文件，使用谷歌翻译地址绑定translate.googleapis.com的地址</span></a></h2><p>以笔者为例，<code>ping translate.google.cn</code>得到得到的ip为<code>114.250.66.34</code>，所以我们就通过在hosts配置下面这段配置避免idea更新ttk时通过dns解析<code>translate.googleapis.com</code></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">114.250</span>.66.34   translate.googleapis.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="测试" tabindex="-1"><a class="header-anchor" href="#测试"><span>测试</span></a></h2><p>可以看到问题得以解决</p><p><img src="https://s2.loli.net/2023/06/14/Ym2LzgKuUovqiBf.png" alt="在这里插入图片描述"></p>`,14),i=[o];function l(r,c){return a(),t("div",null,i)}const h=e(s,[["render",l],["__file","IDEA翻译插件报错更新TKK的问题.html.vue"]]),m=JSON.parse('{"path":"/%E6%97%A5%E5%B8%B8/IDEA%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%E6%8A%A5%E9%94%99%E6%9B%B4%E6%96%B0TKK%E7%9A%84%E9%97%AE%E9%A2%98.html","title":"问题描述","lang":"zh-CN","frontmatter":{"description":"问题描述 使用翻译插件翻译源码注释时，idea插件translation经过长时间等待后抛出一个更新 TKK 失败，请检查网络连接。无论重启还是科学上网都无法解决问题。 原因 经过查阅网上资料得知，是谷歌翻译网站抽风了，读者可以使用下面这段命令确定一下自己的网络能否访问该网站 解决方案 获取谷歌翻译ip地址 编辑hosts文件，使用谷歌翻译地址绑定tr...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/%E6%97%A5%E5%B8%B8/IDEA%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%E6%8A%A5%E9%94%99%E6%9B%B4%E6%96%B0TKK%E7%9A%84%E9%97%AE%E9%A2%98.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"问题描述"}],["meta",{"property":"og:description","content":"问题描述 使用翻译插件翻译源码注释时，idea插件translation经过长时间等待后抛出一个更新 TKK 失败，请检查网络连接。无论重启还是科学上网都无法解决问题。 原因 经过查阅网上资料得知，是谷歌翻译网站抽风了，读者可以使用下面这段命令确定一下自己的网络能否访问该网站 解决方案 获取谷歌翻译ip地址 编辑hosts文件，使用谷歌翻译地址绑定tr..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://s2.loli.net/2023/06/14/Ym2LzgKuUovqiBf.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"问题描述"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"问题描述\\",\\"image\\":[\\"https://s2.loli.net/2023/06/14/Ym2LzgKuUovqiBf.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"获取谷歌翻译ip地址","slug":"获取谷歌翻译ip地址","link":"#获取谷歌翻译ip地址","children":[]},{"level":2,"title":"编辑hosts文件，使用谷歌翻译地址绑定translate.googleapis.com的地址","slug":"编辑hosts文件-使用谷歌翻译地址绑定translate-googleapis-com的地址","link":"#编辑hosts文件-使用谷歌翻译地址绑定translate-googleapis-com的地址","children":[]},{"level":2,"title":"测试","slug":"测试","link":"#测试","children":[]}],"git":{"createdTime":1665339673000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":0.74,"words":221},"filePathRelative":"日常/IDEA翻译插件报错更新TKK的问题.md","localizedDate":"2022年10月9日","excerpt":"\\n<p>使用翻译插件翻译源码注释时，idea插件translation经过长时间等待后抛出一个<code>更新 TKK 失败，请检查网络连接</code>。无论重启还是科学上网都无法解决问题。</p>\\n<h1>原因</h1>\\n<p>经过查阅网上资料得知，是谷歌翻译网站抽风了，读者可以使用下面这段命令确定一下自己的网络能否访问该网站</p>\\n<div class=\\"language-bash\\" data-ext=\\"sh\\" data-title=\\"sh\\"><pre class=\\"language-bash\\"><code><span class=\\"token function\\">ping</span> translate.googleapis.com\\n</code></pre></div>","autoDesc":true}');export{h as comp,m as data};
