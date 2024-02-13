import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,a as e}from"./app-DITNE2eT.js";const t={},i=e(`<h1 id="autowired注解详解" tabindex="-1"><a class="header-anchor" href="#autowired注解详解"><span>@Autowired注解详解</span></a></h1><h2 id="_1-autowired的默认装配" tabindex="-1"><a class="header-anchor" href="#_1-autowired的默认装配"><span><strong>1. @Autowired的默认装配</strong></span></a></h2><p>​ 我们都知道在spring中@Autowired注解，是用来自动装配对象的。默认情况下spring是按照类型装配的，也就是我们所说的<code>byType</code>方式。</p><p>此外，@Autowired注解的<code>required</code>参数默认是true，表示开启自动装配，有些时候我们不想使用自动装配功能，可以将该参数设置成false。</p><h2 id="_2-相同类型的对象不只一个时" tabindex="-1"><a class="header-anchor" href="#_2-相同类型的对象不只一个时"><span><strong>2. 相同类型的对象不只一个时</strong></span></a></h2><p>上面<code>byType</code>方式主要针对相同类型的对象只有一个的情况，此时对象类型是唯一的，可以找到正确的对象。</p><p>但如果相同类型的对象不只一个时，会发生什么？</p><p>结果报错了，报类类名称有冲突，直接导致项目启动不来。</p><h2 id="_3-qualifier和-primary" tabindex="-1"><a class="header-anchor" href="#_3-qualifier和-primary"><span><strong>3. @Qualifier和@Primary</strong></span></a></h2><p>显然在spring中，按照Autowired默认的装配方式：<code>byType</code>，是无法解决上面的问题的，这时可以改用按名称装配：<code>byName</code>。</p><p>只需在代码上加上<code>@Qualifier(&quot;xxx&quot;)</code>注解即可</p><blockquote><p>Qualifier意思是合格者，一般跟Autowired配合使用，需要指定一个bean的名称，通过bean名称就能找到需要装配的bean。</p></blockquote><p>除了上面的<code>@Qualifier</code>注解之外，还能使用<code>@Primary</code>注解解决上面的问题。在其中一个Bean上面加上@Primary注解则会优先被注入</p><blockquote><p>当我们使用自动配置的方式装配Bean时，如果这个Bean有多个候选者，假如其中一个候选者具有@Primary注解修饰，该候选者会被选中，作为自动配置的值。</p></blockquote><h2 id="_4-autowired的使用范围" tabindex="-1"><a class="header-anchor" href="#_4-autowired的使用范围"><span><strong>4. @Autowired的使用范围</strong></span></a></h2><p>上面的实例中@Autowired注解，都是使用在成员变量上，但@Autowired的强大之处，远非如此。</p><p>该注解我们平常使用最多的地方可能是在成员变量上。接下来，我们重点看看在其他地方该怎么用？</p><h3 id="_4-1-成员变量" tabindex="-1"><a class="header-anchor" href="#_4-1-成员变量"><span><strong>4.1 成员变量</strong></span></a></h3><p>在成员变量上使用@Autowired注解：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">User</span> user<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-构造器" tabindex="-1"><a class="header-anchor" href="#_4-2-构造器"><span><strong>4.2 构造器</strong></span></a></h3><p>在构造器上使用@Autowired注解：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">IUser</span> user<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">public</span> <span class="token class-name">UserService</span><span class="token punctuation">(</span><span class="token class-name">IUser</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>user <span class="token operator">=</span> user<span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;user:&quot;</span> <span class="token operator">+</span> user<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>如果类只有一个构造方法，那么 <code>@Autowired</code> 注解可以省略；如果类中有多个构造方法，那么需要添加上 <code>@Autowired</code> 来明确指定到底使用哪个构造方法。</p></blockquote><h3 id="_4-3-方法" tabindex="-1"><a class="header-anchor" href="#_4-3-方法"><span><strong>4.3 方法</strong></span></a></h3><p>在普通方法上加Autowired注解：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token class-name">IUser</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       user<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Spring会在项目启动的过程中，自动调用一次加了@Autowired注解的方法，我们可以在该方法做一些初始化的工作。</p><p>也可以在setter方法上@Autowired注解：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">IUser</span> user<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setUser</span><span class="token punctuation">(</span><span class="token class-name">IUser</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>user <span class="token operator">=</span> user<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-参数" tabindex="-1"><a class="header-anchor" href="#_4-4-参数"><span><strong>4.4 参数</strong></span></a></h3><p>可以在构造器的入参上加Autowired注解：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">IUser</span> user<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">UserService</span><span class="token punctuation">(</span><span class="token annotation punctuation">@Autowired</span> <span class="token class-name">IUser</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>user <span class="token operator">=</span> user<span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;user:&quot;</span> <span class="token operator">+</span> user<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以在非静态方法的入参上加Autowired注解：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token annotation punctuation">@Autowired</span> <span class="token class-name">IUser</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       user<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-autowired的高端玩法" tabindex="-1"><a class="header-anchor" href="#_5-autowired的高端玩法"><span><strong>5. @Autowired的高端玩法</strong></span></a></h2><p>其实上面举的例子都是通过@Autowired自动装配单个实例，但这里我会告诉你，它也能自动装配多个实例，怎么回事呢？</p><p>将UserService方法调整一下，用一个List集合接收IUser类型的参数：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>@Service
public class UserService {

    @Autowired
    private List&lt;IUser&gt; userList;

    @Autowired
    private Set&lt;IUser&gt; userSet;

    @Autowired
    private Map&lt;String, IUser&gt; userMap;

    public void test() {
        System.out.println(&quot;userList:&quot; + userList);
        System.out.println(&quot;userSet:&quot; + userSet);
        System.out.println(&quot;userMap:&quot; + userMap);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@Autowired会自动把相同类型的IUser对象收集到集合中。</p><h2 id="_6-autowired一定能装配成功" tabindex="-1"><a class="header-anchor" href="#_6-autowired一定能装配成功"><span><strong>6. @Autowired一定能装配成功？</strong></span></a></h2><p>前面介绍了@Autowired注解这么多牛逼之处，其实有些情况下，即使使用了@Autowired装配的对象还是null，到底是什么原因呢？</p><h3 id="_6-1-没有加入容器" tabindex="-1"><a class="header-anchor" href="#_6-1-没有加入容器"><span><strong>6.1 没有加入容器</strong></span></a></h3><p>在类上面忘了加@Controller、@Service、@Component、@Repository等注解，Spring就无法完成自动装配的功能</p><h3 id="_6-2-注入filter或listener" tabindex="-1"><a class="header-anchor" href="#_6-2-注入filter或listener"><span><strong>6.2 注入Filter或Listener</strong></span></a></h3><p>web应用启动的顺序是：<code>Listener</code>-&gt;<code>Filter</code>-&gt;<code>Servlet</code>。</p><p>如果项目当中真的需要这样做，我们该如何解决这个问题呢？</p><p>答案是使用WebApplicationContextUtils.getWebApplicationContext获取当前的ApplicationContext，再通过它获取到bean实例。</p><h3 id="_6-3-循环依赖问题" tabindex="-1"><a class="header-anchor" href="#_6-3-循环依赖问题"><span><strong>6.3 循环依赖问题</strong></span></a></h3><p>如果A依赖于B，B依赖于C，C又依赖于A，这样就形成了一个死循环。</p><p>Spring的bean默认是单例的，如果单例bean使用@Autowired自动装配，大多数情况，能解决循环依赖问题。</p><p>但是如果bean是多例的，会出现循环依赖问题，导致bean自动装配不了。</p><p>还有有些情况下，如果创建了代理对象，即使bean是单例的，依然会出现循环依赖问题。</p><h2 id="_7-autowired和-resouce的区别" tabindex="-1"><a class="header-anchor" href="#_7-autowired和-resouce的区别"><span><strong>7. @Autowired和@Resouce的区别</strong></span></a></h2><p>@Autowired功能虽说非常强大，但是也有些不足之处。比如：比如它跟spring强耦合了，如果换成了JFinal等其他框架，功能就会失效。而@Resource是JSR-250提供的，它是Java标准，绝大部分框架都支持。</p><p>除此之外，有些场景使用@Autowired无法满足的要求，改成@Resource却能解决问题。接下来，我们重点看看@Autowired和@Resource的区别。</p><ul><li>@Autowired默认按byType自动装配，而@Resource默认byName自动装配。</li><li>@Autowired只包含一个参数：required，表示是否开启自动准入，默认是true。而@Resource包含七个参数，其中最重要的两个参数是：name 和 type。</li><li>@Autowired如果要使用byName，需要使用@Qualifier一起配合。而@Resource如果指定了name，则用byName自动装配，如果指定了type，则用byType自动装配。</li><li>@Autowired能够用在：构造器、方法、参数、成员变量和注解上，而@Resource能用在：类、成员变量和方法上。</li><li>@Autowired是Spring定义的注解，而@Resource是JSR-250定义的注解。</li></ul>`,57),o=[i];function p(r,l){return s(),a("div",null,o)}const d=n(t,[["render",p],["__file","@Autowired注解详解.html.vue"]]),v=JSON.parse('{"path":"/%E6%A1%86%E6%9E%B6/Spring/@Autowired%E6%B3%A8%E8%A7%A3%E8%AF%A6%E8%A7%A3.html","title":"@Autowired注解详解","lang":"zh-CN","frontmatter":{"description":"@Autowired注解详解 1. @Autowired的默认装配 ​ 我们都知道在spring中@Autowired注解，是用来自动装配对象的。默认情况下spring是按照类型装配的，也就是我们所说的byType方式。 此外，@Autowired注解的required参数默认是true，表示开启自动装配，有些时候我们不想使用自动装配功能，可以将该参数...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/%E6%A1%86%E6%9E%B6/Spring/@Autowired%E6%B3%A8%E8%A7%A3%E8%AF%A6%E8%A7%A3.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"@Autowired注解详解"}],["meta",{"property":"og:description","content":"@Autowired注解详解 1. @Autowired的默认装配 ​ 我们都知道在spring中@Autowired注解，是用来自动装配对象的。默认情况下spring是按照类型装配的，也就是我们所说的byType方式。 此外，@Autowired注解的required参数默认是true，表示开启自动装配，有些时候我们不想使用自动装配功能，可以将该参数..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2022-09-19T15:32:06.000Z"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2022-09-19T15:32:06.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"@Autowired注解详解\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2022-09-19T15:32:06.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"1. @Autowired的默认装配","slug":"_1-autowired的默认装配","link":"#_1-autowired的默认装配","children":[]},{"level":2,"title":"2. 相同类型的对象不只一个时","slug":"_2-相同类型的对象不只一个时","link":"#_2-相同类型的对象不只一个时","children":[]},{"level":2,"title":"3. @Qualifier和@Primary","slug":"_3-qualifier和-primary","link":"#_3-qualifier和-primary","children":[]},{"level":2,"title":"4. @Autowired的使用范围","slug":"_4-autowired的使用范围","link":"#_4-autowired的使用范围","children":[{"level":3,"title":"4.1 成员变量","slug":"_4-1-成员变量","link":"#_4-1-成员变量","children":[]},{"level":3,"title":"4.2 构造器","slug":"_4-2-构造器","link":"#_4-2-构造器","children":[]},{"level":3,"title":"4.3 方法","slug":"_4-3-方法","link":"#_4-3-方法","children":[]},{"level":3,"title":"4.4 参数","slug":"_4-4-参数","link":"#_4-4-参数","children":[]}]},{"level":2,"title":"5. @Autowired的高端玩法","slug":"_5-autowired的高端玩法","link":"#_5-autowired的高端玩法","children":[]},{"level":2,"title":"6. @Autowired一定能装配成功？","slug":"_6-autowired一定能装配成功","link":"#_6-autowired一定能装配成功","children":[{"level":3,"title":"6.1 没有加入容器","slug":"_6-1-没有加入容器","link":"#_6-1-没有加入容器","children":[]},{"level":3,"title":"6.2 注入Filter或Listener","slug":"_6-2-注入filter或listener","link":"#_6-2-注入filter或listener","children":[]},{"level":3,"title":"6.3 循环依赖问题","slug":"_6-3-循环依赖问题","link":"#_6-3-循环依赖问题","children":[]}]},{"level":2,"title":"7. @Autowired和@Resouce的区别","slug":"_7-autowired和-resouce的区别","link":"#_7-autowired和-resouce的区别","children":[]}],"git":{"createdTime":1663601526000,"updatedTime":1663601526000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":1}]},"readingTime":{"minutes":4.79,"words":1436},"filePathRelative":"框架/Spring/@Autowired注解详解.md","localizedDate":"2022年9月19日","excerpt":"\\n<h2><strong>1. @Autowired的默认装配</strong></h2>\\n<p>​\\t\\t我们都知道在spring中@Autowired注解，是用来自动装配对象的。默认情况下spring是按照类型装配的，也就是我们所说的<code>byType</code>方式。</p>\\n<p>此外，@Autowired注解的<code>required</code>参数默认是true，表示开启自动装配，有些时候我们不想使用自动装配功能，可以将该参数设置成false。</p>\\n<h2><strong>2. 相同类型的对象不只一个时</strong></h2>\\n<p>上面<code>byType</code>方式主要针对相同类型的对象只有一个的情况，此时对象类型是唯一的，可以找到正确的对象。</p>","autoDesc":true}');export{d as comp,v as data};
