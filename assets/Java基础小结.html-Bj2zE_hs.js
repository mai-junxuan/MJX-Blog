import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,a as e}from"./app-DITNE2eT.js";const t={},p=e(`<h1 id="标识符" tabindex="-1"><a class="header-anchor" href="#标识符"><span>标识符</span></a></h1><h2 id="标识符和关键字的区别是什么" tabindex="-1"><a class="header-anchor" href="#标识符和关键字的区别是什么"><span>标识符和关键字的区别是什么？</span></a></h2><p>标识符就是我们使用的对象或者变量的名字，关键字就是被Java作为特殊标识的单词。</p><h2 id="java语言的关键字" tabindex="-1"><a class="header-anchor" href="#java语言的关键字"><span>Java语言的关键字</span></a></h2><h3 id="访问控制" tabindex="-1"><a class="header-anchor" href="#访问控制"><span>访问控制</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. private:仅本类可以访问    
2. protected:对本包或者子类都可见
3. public:所有类可见
4. default:不修饰访问级别就是default，访问级别仅仅是本包的成员可以访问
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="类-方法和变量修饰符" tabindex="-1"><a class="header-anchor" href="#类-方法和变量修饰符"><span>类，方法和变量修饰符</span></a></h3><h4 id="关键字" tabindex="-1"><a class="header-anchor" href="#关键字"><span>关键字</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. abstract    
2. class    
3. extends    
4. final    
5. implements    
6. interface    
7. native:该修饰符修饰的方法说明该方法不一定是Java实现的而是一个原生态的方法，是用其他的语言实现的，Java仅仅是通过JNI接口调用而已。
8. new    
9. static    
10. strictfp    
11. synchronized    
12. transient    
13. volatile    
14. enum
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="final" tabindex="-1"><a class="header-anchor" href="#final"><span>final</span></a></h4><p>这几个关键字中我们还需要注意的是，final关键字修饰的变量是不可变的，但是对于引用类型来说，他代表的意思是引用的指向不变，但是引用指向的对象的值是可变的，参见以下代码</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * final对于引用来说代表仅代表引用指向不可变，不代表指向的对象不可变
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Employee</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">StringBuilder</span> evaluations<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">Employee</span><span class="token punctuation">(</span><span class="token class-name">StringBuilder</span> evaluations<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>evaluations <span class="token operator">=</span> evaluations<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">giveGoldStar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        evaluations<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token class-name">LocalDate</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;：Gold star&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="transient" tabindex="-1"><a class="header-anchor" href="#transient"><span>transient</span></a></h4><p>transient使得我们的关键字不会被序列化</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * transient关键字防止序列化 注意该类需要实现Serializable 否则会报错
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">User</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">transient</span> <span class="token class-name">String</span> password<span class="token punctuation">;</span>


    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> password<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setPassword</span><span class="token punctuation">(</span><span class="token class-name">String</span> password<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>password <span class="token operator">=</span> password<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token class-name">User</span> user <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">User</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        user<span class="token punctuation">.</span><span class="token function">setName</span><span class="token punctuation">(</span><span class="token string">&quot;Jackson&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        user<span class="token punctuation">.</span><span class="token function">setPassword</span><span class="token punctuation">(</span><span class="token string">&quot;password123&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;User: &quot;</span> <span class="token operator">+</span> user<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//begin serializing</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">ObjectOutputStream</span> fos <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ObjectOutputStream</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">FileOutputStream</span><span class="token punctuation">(</span><span class="token string">&quot;bean.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            fos<span class="token punctuation">.</span><span class="token function">writeObject</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span>
            fos<span class="token punctuation">.</span><span class="token function">flush</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            fos<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;local serialized done&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token punctuation">}</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;de-serialzing...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">ObjectInputStream</span> fis <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ObjectInputStream</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span><span class="token string">&quot;bean.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            user <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span> fis<span class="token punctuation">.</span><span class="token function">readObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            fis<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;User name: &quot;</span> <span class="token operator">+</span> user<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;  password:&quot;</span> <span class="token operator">+</span> user<span class="token punctuation">.</span><span class="token function">getPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="new关键字使用注意事项-使用clone提高创建速度" tabindex="-1"><a class="header-anchor" href="#new关键字使用注意事项-使用clone提高创建速度"><span>new关键字使用注意事项(使用clone提高创建速度)</span></a></h4><p>Java的new关键字对轻量级对象非常支持，可以非常光速的new一个对象。但是对于那些重量级对象，构造函数存在大量的对象创建可能就非常耗时，所有我们建议使用clone方法。</p><p>如下所示，new 关键字对调用无参构造方法，需要3秒，对此我们可以使用clone方法绕过构造方法创建一个对象，但是clone出来的对象存在一个浅拷贝的问题，所以我们需要自行解决一下。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>zsy<span class="token punctuation">.</span>javatuning<span class="token punctuation">.</span>tech</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Vector</span></span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Student</span> <span class="token keyword">implements</span> <span class="token class-name">Cloneable</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> id<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Vector</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> vector<span class="token punctuation">;</span>


    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> id<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setId</span><span class="token punctuation">(</span><span class="token class-name">String</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> id<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">Vector</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">getVector</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> vector<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setVector</span><span class="token punctuation">(</span><span class="token class-name">Vector</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> vector<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>vector <span class="token operator">=</span> vector<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token keyword">public</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;创建对象需要三秒......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>


    <span class="token keyword">public</span> <span class="token class-name">Student</span> <span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Student</span><span class="token punctuation">)</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">CloneNotSupportedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token class-name">Object</span> <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">CloneNotSupportedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">Student</span> clone <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Student</span><span class="token punctuation">)</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//避免clone导致浅拷贝问题</span>
        <span class="token class-name">Vector</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> srcVector <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getVector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">Vector</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> dstVector <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vector</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">String</span> v <span class="token operator">:</span> srcVector<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            dstVector<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>v<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        clone<span class="token punctuation">.</span><span class="token function">setVector</span><span class="token punctuation">(</span>dstVector<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">return</span> clone<span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试代码</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> @Test
    public void cloneTest() throws CloneNotSupportedException {

        long start,end;
        start=System.currentTimeMillis();
        Student student=new Student();
        end=System.currentTimeMillis();
        System.out.println(&quot;学生1创建时间长 &quot;+(end-start));


        student.setId(&quot;1&quot;);
        student.setName(&quot;小明&quot;);
        Vector&lt;String&gt; v = new Vector&lt;&gt;();
        v.add(&quot;000000&quot;);
        v.add(&quot;000001&quot;);
        student.setVector(v);

        start=System.currentTimeMillis();
        Student student2= student.newInstance();
        end=System.currentTimeMillis();
        System.out.println(&quot;学生2创建时间长 &quot;+(end-start));


        for (String s : student2.getVector()) {
            System.out.println(s);
        }
//        false则说明深拷贝成功
        System.out.println(student.getVector()==student2.getVector());
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>创建对象需要三秒......
学生1创建时间长 3013
学生2创建时间长 0
000000
000001
false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="程序控制" tabindex="-1"><a class="header-anchor" href="#程序控制"><span>程序控制</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. break    
2. continue    
3. return    
4. do    
5. while    
6. if    
7. else
8. for    
9. instanceof:在 Java 中可以使用 instanceof 关键字判断一个对象是否为一个类（或接口、抽象类、父类）的实例
10. switch    
11. case    
12. default    
13. assert
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="错误处理" tabindex="-1"><a class="header-anchor" href="#错误处理"><span>错误处理</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. try    
2. catch    
3. throw    
4. throws    
5. finally
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="包相关" tabindex="-1"><a class="header-anchor" href="#包相关"><span>包相关</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. import    
2. package
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基本类型" tabindex="-1"><a class="header-anchor" href="#基本类型"><span>基本类型</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. boolean    
2. byte    
3. char    
4. double    
5. float    
6. int    
7. long
8. short
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变量引用" tabindex="-1"><a class="header-anchor" href="#变量引用"><span>变量引用</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. super    
2. this    
3. void    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="保留字" tabindex="-1"><a class="header-anchor" href="#保留字"><span>保留字</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. goto    
2. const
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="java注释有哪几种形式" tabindex="-1"><a class="header-anchor" href="#java注释有哪几种形式"><span>Java注释有哪几种形式</span></a></h1><ol><li>单行注释 格式：</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> //注释文字
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol><li>多行注释 格式：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code> /* 
 注释文字
*/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>文档注释 格式</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>/** 
注释文字 
*/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>例：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>/**
这是我的Hello World程序。
@author 开发者名字
*/
class Demo
<span class="token punctuation">{</span>
/*
这是主函数，是程序的入口
它的出现可以保证程序的独立运行，
*/
public static void main<span class="token punctuation">(</span>String<span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
//这是输出语句用于将括号内的数据打印到控制台。
System.out.println<span class="token punctuation">(</span><span class="token string">&quot;Hello World&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="进制数" tabindex="-1"><a class="header-anchor" href="#进制数"><span>进制数</span></a></h1><h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念"><span>概念</span></a></h2><p>在计算机中数据都是以2进制存储的，但为了更方便的表述数据，又出现了八进制、十六进制。</p><h2 id="进制间的转换" tabindex="-1"><a class="header-anchor" href="#进制间的转换"><span>进制间的转换</span></a></h2><h3 id="十进制转二进制" tabindex="-1"><a class="header-anchor" href="#十进制转二进制"><span>十进制转二进制</span></a></h3><p>如下图二进制转为十进制的结果</p><p><img src="https://s2.loli.net/2023/06/14/iwfF56St18QRBx2.png" alt="在这里插入图片描述"></p><h3 id="二进制转十进制" tabindex="-1"><a class="header-anchor" href="#二进制转十进制"><span>二进制转十进制</span></a></h3><p>如下图将二进制转为十进制</p><p><img src="https://s2.loli.net/2023/06/14/FtW746kQlPvBfYZ.png" alt="在这里插入图片描述"></p><h3 id="其他进制间的转换" tabindex="-1"><a class="header-anchor" href="#其他进制间的转换"><span>其他进制间的转换</span></a></h3><p>二进制转十六进制，如下图二进制的4个位相当于一个十六进制，所以我们可以4个位置先换算成十进制再转为十六进制即可。八进制同理不多赘述。</p><p><img src="https://s2.loli.net/2023/06/14/NcFYQ5V8gTeGKxz.png" alt="在这里插入图片描述"></p><h3 id="负数的二进制表现形式" tabindex="-1"><a class="header-anchor" href="#负数的二进制表现形式"><span>负数的二进制表现形式</span></a></h3><p><strong>规律</strong>：正数的最高位为0，负数则为1</p><p><img src="https://s2.loli.net/2023/06/14/elH6ADIzM45Epgq.png" alt="在这里插入图片描述"></p><h1 id="变量" tabindex="-1"><a class="header-anchor" href="#变量"><span>变量</span></a></h1><h2 id="变量的概念" tabindex="-1"><a class="header-anchor" href="#变量的概念"><span>变量的概念</span></a></h2><ol><li>内存中的一个存储区域</li><li>该区域有自己的名称（变量名）和类型（数据类型）</li><li>该区域的数据可以在同一类型范围内不断变化</li></ol><h2 id="类型" tabindex="-1"><a class="header-anchor" href="#类型"><span>类型</span></a></h2><p>java是一门<strong>强类型语言</strong>，所有对数据类型区分的很明显</p><h2 id="种类" tabindex="-1"><a class="header-anchor" href="#种类"><span>种类</span></a></h2><h3 id="数值型-常量整数默认为int" tabindex="-1"><a class="header-anchor" href="#数值型-常量整数默认为int"><span>数值型(常量整数默认为int)</span></a></h3><ol><li>byte：1个字节，-128~128 (-2 ^ 7 ~ 2^7)</li><li>short: 2个字节， -32768 ~ 32767 (-2 ^ 15 ~ 2^15)</li><li>int : 4个字节，用高位表示符号，( - 2 ^ 32 ~ 2^32)</li><li>long:8个字节</li></ol><h3 id="浮点型" tabindex="-1"><a class="header-anchor" href="#浮点型"><span>浮点型</span></a></h3><ol><li>float(单精度浮点型)：<code>float f=2.3f //不加f编译会认为可能会出现精度丢失，而编译不通过</code></li><li>double(双精度浮点型)</li></ol><h3 id="字符集" tabindex="-1"><a class="header-anchor" href="#字符集"><span>字符集</span></a></h3><p>char： 1个字节，0 ~ 65535</p><h3 id="布尔型" tabindex="-1"><a class="header-anchor" href="#布尔型"><span>布尔型</span></a></h3><p>boolean:1个字节，true或false</p><h2 id="精度丢失问题" tabindex="-1"><a class="header-anchor" href="#精度丢失问题"><span>精度丢失问题</span></a></h2><p><img src="https://s2.loli.net/2023/06/14/2SnpYjVkmcqUP3g.png" alt="在这里插入图片描述"></p><p><img src="https://s2.loli.net/2023/06/14/WcDXsPeq7Jyx8GR.png" alt="在这里插入图片描述"></p><p>那为何byte b=3可以通过呢？</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>答：在赋值时编译器会检查赋的值的取值范围是否在数据类型以内，题目中值的范围符合要求。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>解决方案</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>byte <span class="token assign-left variable">b</span><span class="token operator">=</span><span class="token punctuation">(</span>byte<span class="token punctuation">)</span><span class="token punctuation">(</span>b+2<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="成员变量和局部变量的区别" tabindex="-1"><a class="header-anchor" href="#成员变量和局部变量的区别"><span>成员变量和局部变量的区别</span></a></h2><h3 id="语法上" tabindex="-1"><a class="header-anchor" href="#语法上"><span>语法上</span></a></h3><p>成员变量：可被访问修饰符以及static修饰 局部变量:不可被访问修饰符以及static等修饰</p><h3 id="存储" tabindex="-1"><a class="header-anchor" href="#存储"><span>存储</span></a></h3><p>成员变量在堆内存 局部变量是在栈内存</p><h3 id="生存时间" tabindex="-1"><a class="header-anchor" href="#生存时间"><span>生存时间</span></a></h3><p>成员变量若为static则随着类存在而存在，若无static则随着对象存在而存在 局部变量则随着方法调用结束</p><h3 id="默认值" tabindex="-1"><a class="header-anchor" href="#默认值"><span>默认值</span></a></h3><p>成员变量有默认值</p><h2 id="静态变量有什么作用" tabindex="-1"><a class="header-anchor" href="#静态变量有什么作用"><span>静态变量有什么作用</span></a></h2><p>可被多个类共享，无论创建多少个类，使用static修饰的变量永远只有这一个 若static再加一个final，这个变量就相当于一个常量</p><h2 id="字符型常量和字符串常量的区别" tabindex="-1"><a class="header-anchor" href="#字符型常量和字符串常量的区别"><span>字符型常量和字符串常量的区别</span></a></h2><ol><li>字符串在Java中占用两个字节，字符串若干个字节</li><li>字符用单引号，字符串用双引号</li></ol><h2 id="变量调优技巧" tabindex="-1"><a class="header-anchor" href="#变量调优技巧"><span>变量调优技巧</span></a></h2><h3 id="将常用变量局部化-可提升代码执行性能" tabindex="-1"><a class="header-anchor" href="#将常用变量局部化-可提升代码执行性能"><span>将常用变量局部化，可提升代码执行性能</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package com.optimize.java;

import org.junit.Test;

//使用局部变量优化程序性能

/**
 * testLocalVar:1
 * testStaticVar:10
 * testInstanceVar:10
 */
public class Var {

    /**
     * 使用本地变量耗时
     */
    @Test
    public void testLocalVar() {
        int a = 0;
        long start = System.currentTimeMillis();
        for (int i = 0; i &lt; 100000000; i++) {
            a++;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;testLocalVar:&quot; + (end - start));
    }



    private static int ta=0;
    /**
     * 使用静态变量耗时
     */
    @Test
    public void testStaticVar() {
        long start = System.currentTimeMillis();
        for (int i = 0; i &lt; 100000000; i++) {
            ta++;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;testStaticVar:&quot; + (end - start));
    }


    private int instanceA=0;

    /**
     * 使用示例变量耗时
     */
    @Test
    public void testInstanceVar() {
        long start = System.currentTimeMillis();
        for (int i = 0; i &lt; 100000000; i++) {
            instanceA++;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;testInstanceVar:&quot; + (end - start));
    }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数组拷贝使用arraycopy" tabindex="-1"><a class="header-anchor" href="#数组拷贝使用arraycopy"><span>数组拷贝使用arrayCopy</span></a></h3><p>在容量极大的情况下，使用native暴露的api可提升执行效率</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>java</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>junit<span class="token punctuation">.</span></span><span class="token class-name">Test</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 1000大小的数组
 * testArrayCopyNormal;17
 * testArrayCopySystem;40
 *
 * 100w
 *
 * testArrayCopyNormal;17005
 * testArrayCopySystem;15705
 */</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ArrayCopy</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">testArrayCopyNormal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> size<span class="token operator">=</span><span class="token number">1000000</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> srcArr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> dstArr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            srcArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                dstArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> srcArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;testArrayCopyNormal;&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">testArrayCopySystem</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> size<span class="token operator">=</span><span class="token number">1000000</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> srcArr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> dstArr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            srcArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>srcArr<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> dstArr<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;testArrayCopySystem;&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="包装类" tabindex="-1"><a class="header-anchor" href="#包装类"><span>包装类</span></a></h1><h2 id="基本类型和包装类型的区别" tabindex="-1"><a class="header-anchor" href="#基本类型和包装类型的区别"><span>基本类型和包装类型的区别</span></a></h2><ol><li>包装类型成员变量默认为null，成员变量默认为该类型默认值，例如int成员变量默认为0</li><li>基本类型的局部变量会被存放在虚拟机栈的局部变量表中，而非static的借本类型成员变量都是存放在堆中。而包装类型在HotSpot 逃逸分析发现并没有逃逸的外部时会避免分配在堆上，其他情况都会分配上堆区。</li><li>包装类型可以作为泛型，基本类型不可</li></ol><h2 id="包装类型的缓存机制" tabindex="-1"><a class="header-anchor" href="#包装类型的缓存机制"><span>包装类型的缓存机制</span></a></h2><h3 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h3><p>Java会对4种基本整数类型(short int long byte)设置缓存数据，如下源码所示</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Integer</span> <span class="token function">valueOf</span><span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;=</span> <span class="token class-name">IntegerCache</span><span class="token punctuation">.</span>low <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;=</span> <span class="token class-name">IntegerCache</span><span class="token punctuation">.</span>high<span class="token punctuation">)</span>
            <span class="token keyword">return</span> <span class="token class-name">IntegerCache</span><span class="token punctuation">.</span>cache<span class="token punctuation">[</span>i <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token operator">-</span><span class="token class-name">IntegerCache</span><span class="token punctuation">.</span>low<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意byte的缓存范围是0-127</p><h3 id="float和double没有实现缓存机制" tabindex="-1"><a class="header-anchor" href="#float和double没有实现缓存机制"><span>float和double没有实现缓存机制</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doubleTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//        float double 没有实现缓存机制</span>
        <span class="token class-name">Double</span> d <span class="token operator">=</span> <span class="token number">1.2</span><span class="token punctuation">;</span>
        <span class="token class-name">Double</span> d2 <span class="token operator">=</span> <span class="token number">1.2</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>d <span class="token operator">==</span> d2<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="包装类使用注意事项" tabindex="-1"><a class="header-anchor" href="#包装类使用注意事项"><span>包装类使用注意事项</span></a></h3><p>正是因为这种范围机制，在缓存范围内的对象比较结果都是true，反之使用false，这正是为什么在对包装类比较时，我们都需要使用<code>equals</code></p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">integerValueTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token doc-comment comment">/**
         * public static Integer valueOf(int i) <span class="token punctuation">{</span>
         *         if (i &gt;= IntegerCache.low &amp;&amp; i &lt;= IntegerCache.high)
         *             return IntegerCache.cache[i + (-IntegerCache.low)];
         *         return new Integer(i);
         *     <span class="token punctuation">}</span>
         */</span>
        <span class="token class-name">Integer</span> i <span class="token operator">=</span> <span class="token number">123</span><span class="token punctuation">;</span>
        <span class="token class-name">Integer</span> i2 <span class="token operator">=</span> <span class="token number">123</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>i <span class="token operator">==</span> i2<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//true</span>

        <span class="token class-name">Integer</span> integer <span class="token operator">=</span> <span class="token number">129</span><span class="token punctuation">;</span>
        <span class="token class-name">Integer</span> integer2 <span class="token operator">=</span> <span class="token number">129</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>integer<span class="token operator">==</span>integer2<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//false</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="自动装箱和自动拆箱" tabindex="-1"><a class="header-anchor" href="#自动装箱和自动拆箱"><span>自动装箱和自动拆箱</span></a></h2><h3 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1"><span>简介</span></a></h3><p>如下所示，将基本类型赋值给包装类型会触发自动装箱，调用valueOf返回一个对象实例。而自动拆箱则是调用xxxValue将包装类的值取出赋值给基本类型</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">baseTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token doc-comment comment">/**
         * 装箱字节码查看
         * 装箱操作，相当于调用valueOf从返回一个对象实例
         * 字节码核心代码:INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;
         */</span>
        <span class="token class-name">Integer</span> i <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>
        <span class="token doc-comment comment">/**
         * 自动拆箱
         * 查看字节码相当于调用了intValue
         *  INVOKEVIRTUAL java/lang/Integer.intValue ()I
         */</span>
        <span class="token keyword">int</span> i2 <span class="token operator">=</span> i<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="包装类的比较" tabindex="-1"><a class="header-anchor" href="#包装类的比较"><span>包装类的比较</span></a></h3><p>如下代码i是通过装箱通过valueOf从缓存中取得，而i2则是自己从堆区创建的一个对象，所以两者返回false，要想比较数值必须使用equals</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">integerQuestion</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Integer</span> i <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span><span class="token comment">//相当于Integer.valueOf(10) 从缓存中拿值</span>
        <span class="token class-name">Integer</span> i2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 创建一个新的对象，所以两者值不相等</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>i <span class="token operator">==</span> i2<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//false</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>i<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>i2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//true</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个比较器也是同理，因为new Integer做的是在堆区创建一个对象，==比较的是两个引用的地址，所以返回1</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token class-name">BoxedCompareTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Comparator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> naturalOrder <span class="token operator">=</span> <span class="token punctuation">(</span>i<span class="token punctuation">,</span> j<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> j<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> <span class="token punctuation">(</span>i <span class="token operator">==</span> j <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> compare <span class="token operator">=</span> naturalOrder<span class="token punctuation">.</span><span class="token function">compare</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>compare<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//返回1 因为integer new出来的对象比较的是地址值</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正确做法是将传入的Integer对象进行拆箱进行比较</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token doc-comment comment">/**
     * 正确比较包装对象做法是进行手动拆箱
     */</span>
    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token class-name">BoxedCompareTest2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Comparator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> naturalOrder <span class="token operator">=</span> <span class="token punctuation">(</span>i<span class="token punctuation">,</span> j<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> compaer1 <span class="token operator">=</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">int</span> compaer2 <span class="token operator">=</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span>compaer1 <span class="token operator">&lt;</span> compaer2<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> <span class="token punctuation">(</span>compaer1 <span class="token operator">==</span> compaer2 <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> compare <span class="token operator">=</span> naturalOrder<span class="token punctuation">.</span><span class="token function">compare</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>compare<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//返回1 因为integer new出来的对象比较的是地址值</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="性能问题" tabindex="-1"><a class="header-anchor" href="#性能问题"><span>性能问题</span></a></h3><p>使用包装类和基本类型运算会会导致频繁拆装箱，通过查看字节码，我们可以看到第一段 <code>sum += i;</code>实际上会进行<code>INVOKESTATIC java/lang/Long.valueOf (J)Ljava/lang/Long;</code>进行装箱操作。所以我们应该避免这种情况，在进行大量的数值计算时尽量使用基本类型</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
     * 频繁拆装箱会导致性能问题
     */</span>
    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">boxedSum</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Long</span> sum <span class="token operator">=</span> <span class="token number">0l</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">//会导致频繁装箱</span>
<span class="token comment">//            INVOKESTATIC java/lang/Long.valueOf (J)Ljava/lang/Long;</span>
            sum <span class="token operator">+=</span> i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//4723</span>

        <span class="token keyword">long</span> sum1 <span class="token operator">=</span> <span class="token number">0l</span><span class="token punctuation">;</span>
        start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            sum1 <span class="token operator">+=</span> i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//519</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="空指针问题" tabindex="-1"><a class="header-anchor" href="#空指针问题"><span>空指针问题</span></a></h3><p>由于自动拆装箱机制，下面这段代码会进行自动拆箱，进而导致空指针异常</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Unbelievable</span> <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token class-name">Integer</span> unbelievable<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token comment">//        包装类型会进行自动拆箱 调用valueOf</span>
        <span class="token comment">// INVOKEVIRTUAL java/lang/Integer.intValue ()I</span>
<span class="token comment">//  所以很可能导致空指针</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>unbelievable <span class="token operator">==</span> <span class="token number">12</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Unbelievable&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="精度高要求的运算" tabindex="-1"><a class="header-anchor" href="#精度高要求的运算"><span>精度高要求的运算</span></a></h1><h2 id="浮点数运算错误" tabindex="-1"><a class="header-anchor" href="#浮点数运算错误"><span>浮点数运算错误</span></a></h2><p>如下代码所示，计算机使用二进制表示小数时可能会出现计算循环，由于精度截断很可能导致计算结果错误</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">bug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token doc-comment comment">/**
         * 小数精度丢失原因
         *  0.2 转换为二进制数的过程为，不断乘以 2，直到不存在小数为止，
         * 在这个计算过程中，得到的整数部分从上到下排列就是二进制的结果。
         * 0.2 * 2 = 0.4 -&gt; 0
         * 0.4 * 2 = 0.8 -&gt; 0
         * 0.8 * 2 = 1.6 -&gt; 1
         * 0.6 * 2 = 1.2 -&gt; 1
         * 0.2 * 2 = 0.4 -&gt; 0（发生循环）
         * ...
         */</span>
        <span class="token keyword">float</span> result1 <span class="token operator">=</span> <span class="token number">3.0f</span> <span class="token operator">-</span> <span class="token number">2.9f</span><span class="token punctuation">;</span>
        <span class="token keyword">float</span> result2 <span class="token operator">=</span> <span class="token number">2.9f</span> <span class="token operator">-</span> <span class="token number">2.8f</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>result1<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>result2<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>result1 <span class="token operator">==</span> result2<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="如何解决浮点数精度丢失问题" tabindex="-1"><a class="header-anchor" href="#如何解决浮点数精度丢失问题"><span>如何解决浮点数精度丢失问题</span></a></h2><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">accurateCacl</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">BigDecimal</span> num1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">(</span><span class="token string">&quot;3.0&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BigDecimal</span> num2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">(</span><span class="token string">&quot;2.9&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BigDecimal</span> num3 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">(</span><span class="token string">&quot;2.8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BigDecimal</span> result1 <span class="token operator">=</span> num1<span class="token punctuation">.</span><span class="token function">subtract</span><span class="token punctuation">(</span>num2<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BigDecimal</span> result2 <span class="token operator">=</span> num2<span class="token punctuation">.</span><span class="token function">subtract</span><span class="token punctuation">(</span>num3<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>result1<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//0.1</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>result2<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//0.1</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>result1<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>result2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//true</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="超过long类型的整数如何标识" tabindex="-1"><a class="header-anchor" href="#超过long类型的整数如何标识"><span>超过long类型的整数如何标识</span></a></h2><p>如下所示，使用常规类型计算超过long的值会造成计算错误，所以我们可以使用bigInteger解决问题</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">maxLong</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> maxVal <span class="token operator">=</span> <span class="token class-name">Long</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>maxVal<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 加1后高位变1成为负数
         */</span>
        <span class="token keyword">long</span> maxValAdd <span class="token operator">=</span> maxVal <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>maxValAdd<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>maxValAdd <span class="token operator">==</span> <span class="token class-name">Long</span><span class="token punctuation">.</span><span class="token constant">MIN_VALUE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//超过long类型的计算方式</span>
        <span class="token class-name">BigInteger</span> bigInteger <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BigInteger</span><span class="token punctuation">(</span><span class="token string">&quot;9223372036854775807&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>bigInteger<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">BigInteger</span><span class="token punctuation">(</span><span class="token string">&quot;1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="高性能精度运算技巧" tabindex="-1"><a class="header-anchor" href="#高性能精度运算技巧"><span>高性能精度运算技巧</span></a></h2><p>我们来看一个例子，代码如下所示，我们想看看一块钱可以把多少块糖果，注意糖果每次循环结果会涨0.1元</p><h3 id="代码段1" tabindex="-1"><a class="header-anchor" href="#代码段1"><span>代码段1</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">bugBuySugar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">double</span> funds <span class="token operator">=</span> <span class="token number">1.00</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> itemCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">double</span> price <span class="token operator">=</span> <span class="token number">0.10</span><span class="token punctuation">;</span> funds <span class="token operator">&gt;=</span> price<span class="token punctuation">;</span> price <span class="token operator">+=</span> <span class="token number">0.10</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;funds:&quot;</span> <span class="token operator">+</span> funds <span class="token operator">+</span> <span class="token string">&quot;     price:&quot;</span> <span class="token operator">+</span> price<span class="token punctuation">)</span><span class="token punctuation">;</span>
            funds <span class="token operator">-=</span> price<span class="token punctuation">;</span>
            itemCount<span class="token operator">++</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;remain:&quot;</span> <span class="token operator">+</span> funds <span class="token operator">+</span> <span class="token string">&quot;   itemCount:&quot;</span> <span class="token operator">+</span> itemCount<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果，可以看到精度计算异常了</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>funds:1.0     price:0.1
remain:0.9   itemCount:1
funds:0.9     price:0.2
remain:0.7   itemCount:2
funds:0.7     price:0.30000000000000004
remain:0.3999999999999999   itemCount:3

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码段2" tabindex="-1"><a class="header-anchor" href="#代码段2"><span>代码段2</span></a></h3><p>使用BigDecimal 可以解决问题，但是性能差、操作不便</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
     * 缺点
     * 1. 不方便
     * 2. 处理速度较慢
     */</span>
    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token class-name">BuySugar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">final</span> <span class="token class-name">BigDecimal</span> <span class="token constant">TEN_CENT</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">(</span><span class="token string">&quot;0.10&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BigDecimal</span> funds <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">(</span><span class="token string">&quot;1.00&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> itemCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">BigDecimal</span> price <span class="token operator">=</span> <span class="token constant">TEN_CENT</span><span class="token punctuation">;</span>
             funds<span class="token punctuation">.</span><span class="token function">compareTo</span><span class="token punctuation">(</span>price<span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span>
             price <span class="token operator">=</span> price<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">(</span><span class="token string">&quot;0.10&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;funds:&quot;</span> <span class="token operator">+</span> funds <span class="token operator">+</span> <span class="token string">&quot;     price:&quot;</span> <span class="token operator">+</span> price<span class="token punctuation">)</span><span class="token punctuation">;</span>
            funds <span class="token operator">=</span> funds<span class="token punctuation">.</span><span class="token function">subtract</span><span class="token punctuation">(</span>price<span class="token punctuation">)</span><span class="token punctuation">;</span>
            itemCount<span class="token operator">++</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;remain:&quot;</span> <span class="token operator">+</span> funds <span class="token operator">+</span> <span class="token string">&quot;   itemCount:&quot;</span> <span class="token operator">+</span> itemCount<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码段3" tabindex="-1"><a class="header-anchor" href="#代码段3"><span>代码段3</span></a></h3><p>代码如下所示，我们完全可以结合业务场景决定将这段代码转为整数完成计算，从而避免BigDecimal 运算的开销</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code> <span class="token doc-comment comment">/**
     * 最佳解决方案 *100
     */</span>
    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">bestBuySugar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> funds <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> itemCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">double</span> price <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span> funds <span class="token operator">&gt;=</span> price<span class="token punctuation">;</span> price <span class="token operator">+=</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;funds:&quot;</span> <span class="token operator">+</span> funds <span class="token operator">+</span> <span class="token string">&quot;     price:&quot;</span> <span class="token operator">+</span> price<span class="token punctuation">)</span><span class="token punctuation">;</span>
            funds <span class="token operator">-=</span> price<span class="token punctuation">;</span>
            itemCount<span class="token operator">++</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;remain:&quot;</span> <span class="token operator">+</span> funds <span class="token operator">+</span> <span class="token string">&quot;   itemCount:&quot;</span> <span class="token operator">+</span> itemCount<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="运算符" tabindex="-1"><a class="header-anchor" href="#运算符"><span>运算符</span></a></h1><h2 id="算术运算符" tabindex="-1"><a class="header-anchor" href="#算术运算符"><span>算术运算符</span></a></h2><h3 id="算数运算符种类" tabindex="-1"><a class="header-anchor" href="#算数运算符种类"><span>算数运算符种类</span></a></h3><p><img src="https://s2.loli.net/2023/06/14/MaN1JgwVFD6xjmS.png" alt="在这里插入图片描述"></p><h3 id="算数运算符使用技巧" tabindex="-1"><a class="header-anchor" href="#算数运算符使用技巧"><span>算数运算符使用技巧</span></a></h3><p>常用表达式提取可提高代码执行效率</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package com.optimize.java;

import org.junit.Test;

/**
 * 提取公共表达式提升性能
 * withExpression:3
 * withoutExpression:4
 */
public class ExtractExpression {

    @Test
    public void withoutExpression() {
        double d = Math.random();
        double a = Math.random();
        double b = Math.random();
        double e = Math.random();
        double x, y;
        long start = System.currentTimeMillis();
        for (int i = 0; i &lt; Integer.MAX_VALUE; i++) {
            x = d * a * b / 3 * 4 * a;
            y = e * a * b / 3 * 4 * a;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;withoutExpression:&quot; + (end - start));
    }


    @Test
    public void withExpression() {
        double d = Math.random();
        double a = Math.random();
        double b = Math.random();
        double e = Math.random();
        double x, y;
        double t = a * b / 3 * 4 * a;
        long start = System.currentTimeMillis();
        for (int i = 0; i &lt; Integer.MAX_VALUE; i++) {
            x = d * t;
            y = e * t;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;withExpression:&quot; + (end - start));
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="算数运算符面试题" tabindex="-1"><a class="header-anchor" href="#算数运算符面试题"><span>算数运算符面试题</span></a></h2><ol><li>以下两个代码的输出结果</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>System.out.println<span class="token punctuation">(</span><span class="token string">&quot;5+5=&quot;</span>+5+5<span class="token punctuation">)</span><span class="token punctuation">;</span>//5+5<span class="token operator">=</span><span class="token number">55</span>
System.out.println<span class="token punctuation">(</span><span class="token string">&quot;5+5=&quot;</span>+<span class="token punctuation">(</span><span class="token number">5</span>+5<span class="token punctuation">))</span><span class="token punctuation">;</span>//5+5<span class="token operator">=</span><span class="token number">10</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol><li><p>以下两个输出结果</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>System.out.println<span class="token punctuation">(</span><span class="token number">1</span>%-5<span class="token punctuation">)</span><span class="token punctuation">;</span>
System.out.println<span class="token punctuation">(</span>-1%5<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>答:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>取模运算的符号以左边符号为主，所以输出结果为
1
-1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>转义字符的注意点</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Linux回车符：\\n
Windows回车符：\\r\\n
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>char c=&#39;你&#39; 报错的原因</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>汉字占两个字节
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="赋值运算符" tabindex="-1"><a class="header-anchor" href="#赋值运算符"><span>赋值运算符</span></a></h1><h2 id="种类-1" tabindex="-1"><a class="header-anchor" href="#种类-1"><span>种类</span></a></h2><p>= , +=, -=, *=, /=, %=</p><h2 id="含义" tabindex="-1"><a class="header-anchor" href="#含义"><span>含义</span></a></h2><p>s+=2 =&gt; s=s+2</p><h2 id="面试题" tabindex="-1"><a class="header-anchor" href="#面试题"><span>面试题</span></a></h2><p>short s=4; s=s+5;//会报错 s+=5;//不报错</p><p>原因：s+=5做完计算会做自动类型转换，原理和赋值运算一样</p><h1 id="比较运算符" tabindex="-1"><a class="header-anchor" href="#比较运算符"><span>比较运算符</span></a></h1><p><img src="https://s2.loli.net/2023/06/14/leDd9RZB7y3xTwI.png" alt="在这里插入图片描述"></p><h1 id="逻辑运算符" tabindex="-1"><a class="header-anchor" href="#逻辑运算符"><span>逻辑运算符</span></a></h1><p><img src="https://s2.loli.net/2023/06/14/br9IyBUS5iPxZcA.png" alt="在这里插入图片描述"></p><p>注意事项</p><ol><li><p>逻辑运算符用于连接boolean类型的表达式</p></li><li><p>&amp; : 只要两边的boolean表达式结果，有一个为false。那么结果就是false。只有两边都为true，结果为true。</p></li><li><p>| : 两边只要有一个为true，结果为true。只有两边都有false，结果为false。</p></li><li><p>^ : 异或；就是和|有点不一样。当true ^ true = false;</p></li><li><p>&amp;和&amp;&amp;的特点：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> &amp;:无论左边是true是false。右边都运算。
 &amp;&amp;:当左边为false时，右边不运算。从而提高运算效率
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>|：两边都参与运算。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> ||：当左边为true。右边不运算。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ol><h1 id="位运算" tabindex="-1"><a class="header-anchor" href="#位运算"><span>位运算</span></a></h1><h2 id="位运算符简介" tabindex="-1"><a class="header-anchor" href="#位运算符简介"><span>位运算符简介</span></a></h2><p><img src="https://s2.loli.net/2023/06/14/pzLf7TjGv385brU.png" alt="在这里插入图片描述"></p><h2 id="左移右移运算" tabindex="-1"><a class="header-anchor" href="#左移右移运算"><span>左移右移运算</span></a></h2><ol><li>左移&lt;&lt;，左移为乘，移几位就乘2的几次方</li></ol><p><img src="https://s2.loli.net/2023/06/14/solgcYSJPe3InFD.png" alt="在这里插入图片描述">2.</p><p>右移&gt;&gt; 右移为除，移几位就除2的几次方</p><p><img src="https://s2.loli.net/2023/06/14/Nc2kIl1gouO4Yvr.png" alt="在这里插入图片描述"></p><ol><li>无符号右移&gt; &gt; &gt; 和 &gt;&gt;的区别</li></ol><p><img src="https://s2.loli.net/2023/06/14/G1jKclp2n6AJh4T.png" alt="在这里插入图片描述"></p><h2 id="取反运算符和负数的关系" tabindex="-1"><a class="header-anchor" href="#取反运算符和负数的关系"><span>取反运算符和负数的关系</span></a></h2><ol><li>如何得出负数：即正数的值取反再+1</li><li>算法二进制数的负数值为多少：即先加1再取反得到正数，再加负号</li></ol><h2 id="亦或运算的实用场景" tabindex="-1"><a class="header-anchor" href="#亦或运算的实用场景"><span>亦或运算的实用场景</span></a></h2><p>因为1 ^2 ^2=1,5 ^3 ^3=5 所以 当一个数亦或两次相同的数值时，数值不变</p><p><strong>用途</strong>：加密，有个数据要给别人，先亦或一下，当别人收到时，再亦或一遍还原</p><h2 id="使用位运算替换乘除法" tabindex="-1"><a class="header-anchor" href="#使用位运算替换乘除法"><span>使用位运算替换乘除法</span></a></h2><p>位运算可提高代码执行效率，使用位运算可大大提高代码执行效率</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>package com.optimize.java;

import org.junit.Test;

/**
 * 使用位运算替代乘除法计算
 * testMultiplyBit:9
 * testMultiply:93
 */
public class MathOp {

    @Test
    public void testMultiply() {
        long start = System.currentTimeMillis();
        int a = 100;
        for (int i = 0; i &lt; 100000000; i++) {
            a *= 2;
            a /= 2;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;testMultiply:&quot; + (end - start));
    }


    @Test
    public void testMultiplyBit() {
        long start = System.currentTimeMillis();
        int a = 100;
        for (int i = 0; i &lt; 100000000; i++) {
            a &lt;&lt;= 1;
            a &gt;&gt;= 1;
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot;testMultiplyBit:&quot; + (end - start));
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="综合练习1-变量交换" tabindex="-1"><a class="header-anchor" href="#综合练习1-变量交换"><span>综合练习1(变量交换)</span></a></h1><p>不使用第三个变量交换两个变量的值</p><ol><li>倒水法</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>public static void main(String[] args) {
//        倒水法解决变量交换
        int m=3;
        int n=8;
        m=m+n;//将两个变量混在一起
        n=m-n;//n从混在一起的值中减去自己，得到m的值
        m=m-n;//此时n的值就是m原先的值，让m减去自己原先的值，得到n的值

        System.out.println(m);
        System.out.println(n);
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>位运算法</li></ol><p><strong>原理</strong>：n ^ m ^ m=n 即两次异或运算就会还原被异或运算的值</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>     public static void main<span class="token punctuation">(</span>String<span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>



//        亦或法解决变量交换
        int m <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
        int n <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span>
        m <span class="token operator">=</span> m ^ n<span class="token punctuation">;</span>
        n <span class="token operator">=</span> m ^ n<span class="token punctuation">;</span>//要想让n变成m的值，我们就得做到 <span class="token assign-left variable">n</span><span class="token operator">=</span>m^n^n<span class="token operator">==</span><span class="token operator">&gt;</span>所以这里赋值的值就是m^n
        m <span class="token operator">=</span> n ^ m<span class="token punctuation">;</span>//要想让m变成n 我们就得做到m<span class="token operator">=</span>n^m^m<span class="token operator">==</span><span class="token operator">=</span><span class="token operator">&gt;</span>所以这里就是n^m
        System.out.println<span class="token punctuation">(</span>m<span class="token punctuation">)</span><span class="token punctuation">;</span>
        System.out.println<span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="综合练习2-高效率计算2-8" tabindex="-1"><a class="header-anchor" href="#综合练习2-高效率计算2-8"><span>综合练习2(高效率计算2*8)</span></a></h1><ol><li>传统二进制计算2*8 ，一位位乘过去</li></ol><p><img src="https://s2.loli.net/2023/06/14/7VRw46BHMjfEnWL.png" alt="在这里插入图片描述"></p><ol><li>使用位运算 2&lt;&lt;3，提高效率</li></ol><p><img src="https://s2.loli.net/2023/06/14/ovmTHge3aAKFduw.png" alt="在这里插入图片描述"></p><h1 id="程序流程控制" tabindex="-1"><a class="header-anchor" href="#程序流程控制"><span>程序流程控制</span></a></h1><h2 id="if" tabindex="-1"><a class="header-anchor" href="#if"><span>if</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>// 基本用法
int x <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>

        if<span class="token punctuation">(</span>x<span class="token operator">&gt;</span><span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;yes&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">else</span>
        <span class="token punctuation">{</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意事项，同样if逻辑，使用if else 逻辑比全if效率高</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>        int n <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>

        if<span class="token punctuation">(</span>n<span class="token operator">&gt;</span><span class="token number">1</span><span class="token punctuation">)</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">else</span> if<span class="token punctuation">(</span>n<span class="token operator">&gt;</span><span class="token number">2</span><span class="token punctuation">)</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;b&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">else</span> if<span class="token punctuation">(</span>n<span class="token operator">&gt;</span><span class="token number">3</span><span class="token punctuation">)</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;c&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">else</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;d&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        /*
        if<span class="token punctuation">(</span>n<span class="token operator">&gt;</span><span class="token number">1</span><span class="token punctuation">)</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        if<span class="token punctuation">(</span>n<span class="token operator">&gt;</span><span class="token number">2</span><span class="token punctuation">)</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;b&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        if<span class="token punctuation">(</span>n<span class="token operator">&gt;</span><span class="token number">3</span><span class="token punctuation">)</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;c&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">else</span>
            System.out.println<span class="token punctuation">(</span><span class="token string">&quot;d&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="switch" tabindex="-1"><a class="header-anchor" href="#switch"><span>switch</span></a></h2><ol><li>常规用法</li></ol><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>int x <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>

        switch<span class="token punctuation">(</span>x<span class="token punctuation">)</span>//byte short int char
        <span class="token punctuation">{</span>
            default:
                System.out.println<span class="token punctuation">(</span><span class="token string">&quot;d&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                //break<span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">4</span>:
                System.out.println<span class="token punctuation">(</span><span class="token string">&quot;a&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                //break<span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">6</span>:
                System.out.println<span class="token punctuation">(</span><span class="token string">&quot;b&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token builtin class-name">break</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">2</span>:
                System.out.println<span class="token punctuation">(</span><span class="token string">&quot;c&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token builtin class-name">break</span><span class="token punctuation">;</span>


        <span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li><p>注意事项 if和switch语句很像。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> 具体什么场景下，应用哪个语句呢？
 如果判断的具体数值不多，而是符合byte short int char这四种类型。
 虽然两个语句都可以使用，建议使用swtich语句。因为效率稍高。
 **其他情况**：对区间判断，对结果为boolean类型判断，使用if，if的使用范围更广。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="使用if-else替代switch提高执行效率" tabindex="-1"><a class="header-anchor" href="#使用if-else替代switch提高执行效率"><span>使用if else替代switch提高执行效率</span></a></h2><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * jdk7使用数组等可以一定程度提高判断性能
 * 但是jdk8 使用if else性能最佳
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ReplaceSwitch</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">testSwitchInt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span>Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span>Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100000000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">switchInt</span><span class="token punctuation">(</span>random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;testSwitchInt:&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token function">switchInt</span><span class="token punctuation">(</span><span class="token keyword">int</span> idx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">switch</span> <span class="token punctuation">(</span>idx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">case</span> <span class="token number">1</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">1</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">2</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">2</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">3</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">3</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">4</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">4</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">5</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">5</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">6</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">6</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">7</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">7</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token number">8</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token number">8</span><span class="token punctuation">;</span>
            <span class="token keyword">default</span><span class="token operator">:</span>
                <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>


    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">testArrayInt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span>Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span>Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> answer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100000000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">arrayInt</span><span class="token punctuation">(</span>random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> answer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;testArrayInt:&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token function">arrayInt</span><span class="token punctuation">(</span><span class="token keyword">int</span> idx<span class="token punctuation">,</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> answer<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">&lt;</span> <span class="token number">1</span> <span class="token operator">||</span> idx <span class="token operator">&gt;</span> <span class="token number">8</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> answer<span class="token punctuation">[</span>idx<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>



    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">testIfElse</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span>Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span>Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100000000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">IfElseInt</span><span class="token punctuation">(</span>random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;testIfElse:&quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token class-name">IfElseInt</span><span class="token punctuation">(</span><span class="token keyword">int</span> idx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">2</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">3</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">4</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">4</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">5</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">5</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">6</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">6</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">7</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">7</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>idx <span class="token operator">==</span> <span class="token number">8</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">8</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="计算密集型避免使用stream" tabindex="-1"><a class="header-anchor" href="#计算密集型避免使用stream"><span>计算密集型避免使用stream</span></a></h2><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 对于计算密集型流式编程需要构造stream对象并对流中每个对象生成管理对象，开销极大，所以性能极低，并行流更是灾难
 * withStream 81
 * withparallelStream 711
 * withoutStream 4
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TestStream</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">withoutStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">100000</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;withoutStream &quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">withStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">100000</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>d <span class="token operator">-&gt;</span> d <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;withStream &quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>


    <span class="token annotation punctuation">@Test</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">withparallelStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> start <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">100000</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">parallel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>d <span class="token operator">-&gt;</span> d <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;withparallelStream &quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> start<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="综合练习3-十进制转十六进制" tabindex="-1"><a class="header-anchor" href="#综合练习3-十进制转十六进制"><span>综合练习3(十进制转十六进制)</span></a></h1><p>使用位运算 2&lt;&lt;3，提高效率</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 十进制转十六进制
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TenConvertSixteen</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token function">convert</span><span class="token punctuation">(</span><span class="token number">65036</span> <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 除16取余数得最低1位，然后把商继续除得第2位，直到商等于0
     * <span class="token keyword">@param</span> <span class="token parameter">num</span>
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">convert</span><span class="token punctuation">(</span><span class="token keyword">int</span> num<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">StringBuilder</span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">int</span> temp<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>num <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            temp <span class="token operator">=</span> num <span class="token operator">%</span> <span class="token number">16</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>temp <span class="token operator">&gt;=</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                result<span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token keyword">char</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token char">&#39;A&#39;</span> <span class="token operator">+</span> <span class="token punctuation">(</span>temp <span class="token operator">-</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                result<span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> temp<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            num <span class="token operator">=</span> num <span class="token operator">/</span> <span class="token number">16</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> result<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,228),l=[p];function i(c,o){return s(),a("div",null,l)}const d=n(t,[["render",i],["__file","Java基础小结.html.vue"]]),k=JSON.parse('{"path":"/Java/Java%E5%9F%BA%E7%A1%80%E5%B0%8F%E7%BB%93.html","title":"标识符","lang":"zh-CN","frontmatter":{"description":"标识符 标识符和关键字的区别是什么？ 标识符就是我们使用的对象或者变量的名字，关键字就是被Java作为特殊标识的单词。 Java语言的关键字 访问控制 类，方法和变量修饰符 关键字 final 这几个关键字中我们还需要注意的是，final关键字修饰的变量是不可变的，但是对于引用类型来说，他代表的意思是引用的指向不变，但是引用指向的对象的值是可变的，参见...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Java/Java%E5%9F%BA%E7%A1%80%E5%B0%8F%E7%BB%93.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"标识符"}],["meta",{"property":"og:description","content":"标识符 标识符和关键字的区别是什么？ 标识符就是我们使用的对象或者变量的名字，关键字就是被Java作为特殊标识的单词。 Java语言的关键字 访问控制 类，方法和变量修饰符 关键字 final 这几个关键字中我们还需要注意的是，final关键字修饰的变量是不可变的，但是对于引用类型来说，他代表的意思是引用的指向不变，但是引用指向的对象的值是可变的，参见..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://s2.loli.net/2023/06/14/iwfF56St18QRBx2.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"标识符"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"标识符\\",\\"image\\":[\\"https://s2.loli.net/2023/06/14/iwfF56St18QRBx2.png\\",\\"https://s2.loli.net/2023/06/14/FtW746kQlPvBfYZ.png\\",\\"https://s2.loli.net/2023/06/14/NcFYQ5V8gTeGKxz.png\\",\\"https://s2.loli.net/2023/06/14/elH6ADIzM45Epgq.png\\",\\"https://s2.loli.net/2023/06/14/2SnpYjVkmcqUP3g.png\\",\\"https://s2.loli.net/2023/06/14/WcDXsPeq7Jyx8GR.png\\",\\"https://s2.loli.net/2023/06/14/MaN1JgwVFD6xjmS.png\\",\\"https://s2.loli.net/2023/06/14/leDd9RZB7y3xTwI.png\\",\\"https://s2.loli.net/2023/06/14/br9IyBUS5iPxZcA.png\\",\\"https://s2.loli.net/2023/06/14/pzLf7TjGv385brU.png\\",\\"https://s2.loli.net/2023/06/14/solgcYSJPe3InFD.png\\",\\"https://s2.loli.net/2023/06/14/Nc2kIl1gouO4Yvr.png\\",\\"https://s2.loli.net/2023/06/14/G1jKclp2n6AJh4T.png\\",\\"https://s2.loli.net/2023/06/14/7VRw46BHMjfEnWL.png\\",\\"https://s2.loli.net/2023/06/14/ovmTHge3aAKFduw.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"标识符和关键字的区别是什么？","slug":"标识符和关键字的区别是什么","link":"#标识符和关键字的区别是什么","children":[]},{"level":2,"title":"Java语言的关键字","slug":"java语言的关键字","link":"#java语言的关键字","children":[{"level":3,"title":"访问控制","slug":"访问控制","link":"#访问控制","children":[]},{"level":3,"title":"类，方法和变量修饰符","slug":"类-方法和变量修饰符","link":"#类-方法和变量修饰符","children":[]},{"level":3,"title":"程序控制","slug":"程序控制","link":"#程序控制","children":[]},{"level":3,"title":"错误处理","slug":"错误处理","link":"#错误处理","children":[]},{"level":3,"title":"包相关","slug":"包相关","link":"#包相关","children":[]},{"level":3,"title":"基本类型","slug":"基本类型","link":"#基本类型","children":[]},{"level":3,"title":"变量引用","slug":"变量引用","link":"#变量引用","children":[]},{"level":3,"title":"保留字","slug":"保留字","link":"#保留字","children":[]}]},{"level":2,"title":"概念","slug":"概念","link":"#概念","children":[]},{"level":2,"title":"进制间的转换","slug":"进制间的转换","link":"#进制间的转换","children":[{"level":3,"title":"十进制转二进制","slug":"十进制转二进制","link":"#十进制转二进制","children":[]},{"level":3,"title":"二进制转十进制","slug":"二进制转十进制","link":"#二进制转十进制","children":[]},{"level":3,"title":"其他进制间的转换","slug":"其他进制间的转换","link":"#其他进制间的转换","children":[]},{"level":3,"title":"负数的二进制表现形式","slug":"负数的二进制表现形式","link":"#负数的二进制表现形式","children":[]}]},{"level":2,"title":"变量的概念","slug":"变量的概念","link":"#变量的概念","children":[]},{"level":2,"title":"类型","slug":"类型","link":"#类型","children":[]},{"level":2,"title":"种类","slug":"种类","link":"#种类","children":[{"level":3,"title":"数值型(常量整数默认为int)","slug":"数值型-常量整数默认为int","link":"#数值型-常量整数默认为int","children":[]},{"level":3,"title":"浮点型","slug":"浮点型","link":"#浮点型","children":[]},{"level":3,"title":"字符集","slug":"字符集","link":"#字符集","children":[]},{"level":3,"title":"布尔型","slug":"布尔型","link":"#布尔型","children":[]}]},{"level":2,"title":"精度丢失问题","slug":"精度丢失问题","link":"#精度丢失问题","children":[]},{"level":2,"title":"成员变量和局部变量的区别","slug":"成员变量和局部变量的区别","link":"#成员变量和局部变量的区别","children":[{"level":3,"title":"语法上","slug":"语法上","link":"#语法上","children":[]},{"level":3,"title":"存储","slug":"存储","link":"#存储","children":[]},{"level":3,"title":"生存时间","slug":"生存时间","link":"#生存时间","children":[]},{"level":3,"title":"默认值","slug":"默认值","link":"#默认值","children":[]}]},{"level":2,"title":"静态变量有什么作用","slug":"静态变量有什么作用","link":"#静态变量有什么作用","children":[]},{"level":2,"title":"字符型常量和字符串常量的区别","slug":"字符型常量和字符串常量的区别","link":"#字符型常量和字符串常量的区别","children":[]},{"level":2,"title":"变量调优技巧","slug":"变量调优技巧","link":"#变量调优技巧","children":[{"level":3,"title":"将常用变量局部化，可提升代码执行性能","slug":"将常用变量局部化-可提升代码执行性能","link":"#将常用变量局部化-可提升代码执行性能","children":[]},{"level":3,"title":"数组拷贝使用arrayCopy","slug":"数组拷贝使用arraycopy","link":"#数组拷贝使用arraycopy","children":[]}]},{"level":2,"title":"基本类型和包装类型的区别","slug":"基本类型和包装类型的区别","link":"#基本类型和包装类型的区别","children":[]},{"level":2,"title":"包装类型的缓存机制","slug":"包装类型的缓存机制","link":"#包装类型的缓存机制","children":[{"level":3,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":3,"title":"float和double没有实现缓存机制","slug":"float和double没有实现缓存机制","link":"#float和double没有实现缓存机制","children":[]},{"level":3,"title":"包装类使用注意事项","slug":"包装类使用注意事项","link":"#包装类使用注意事项","children":[]}]},{"level":2,"title":"自动装箱和自动拆箱","slug":"自动装箱和自动拆箱","link":"#自动装箱和自动拆箱","children":[{"level":3,"title":"简介","slug":"简介-1","link":"#简介-1","children":[]},{"level":3,"title":"包装类的比较","slug":"包装类的比较","link":"#包装类的比较","children":[]},{"level":3,"title":"性能问题","slug":"性能问题","link":"#性能问题","children":[]},{"level":3,"title":"空指针问题","slug":"空指针问题","link":"#空指针问题","children":[]}]},{"level":2,"title":"浮点数运算错误","slug":"浮点数运算错误","link":"#浮点数运算错误","children":[]},{"level":2,"title":"如何解决浮点数精度丢失问题","slug":"如何解决浮点数精度丢失问题","link":"#如何解决浮点数精度丢失问题","children":[]},{"level":2,"title":"超过long类型的整数如何标识","slug":"超过long类型的整数如何标识","link":"#超过long类型的整数如何标识","children":[]},{"level":2,"title":"高性能精度运算技巧","slug":"高性能精度运算技巧","link":"#高性能精度运算技巧","children":[{"level":3,"title":"代码段1","slug":"代码段1","link":"#代码段1","children":[]},{"level":3,"title":"代码段2","slug":"代码段2","link":"#代码段2","children":[]},{"level":3,"title":"代码段3","slug":"代码段3","link":"#代码段3","children":[]}]},{"level":2,"title":"算术运算符","slug":"算术运算符","link":"#算术运算符","children":[{"level":3,"title":"算数运算符种类","slug":"算数运算符种类","link":"#算数运算符种类","children":[]},{"level":3,"title":"算数运算符使用技巧","slug":"算数运算符使用技巧","link":"#算数运算符使用技巧","children":[]}]},{"level":2,"title":"算数运算符面试题","slug":"算数运算符面试题","link":"#算数运算符面试题","children":[]},{"level":2,"title":"种类","slug":"种类-1","link":"#种类-1","children":[]},{"level":2,"title":"含义","slug":"含义","link":"#含义","children":[]},{"level":2,"title":"面试题","slug":"面试题","link":"#面试题","children":[]},{"level":2,"title":"位运算符简介","slug":"位运算符简介","link":"#位运算符简介","children":[]},{"level":2,"title":"左移右移运算","slug":"左移右移运算","link":"#左移右移运算","children":[]},{"level":2,"title":"取反运算符和负数的关系","slug":"取反运算符和负数的关系","link":"#取反运算符和负数的关系","children":[]},{"level":2,"title":"亦或运算的实用场景","slug":"亦或运算的实用场景","link":"#亦或运算的实用场景","children":[]},{"level":2,"title":"使用位运算替换乘除法","slug":"使用位运算替换乘除法","link":"#使用位运算替换乘除法","children":[]},{"level":2,"title":"if","slug":"if","link":"#if","children":[]},{"level":2,"title":"switch","slug":"switch","link":"#switch","children":[]},{"level":2,"title":"使用if else替代switch提高执行效率","slug":"使用if-else替代switch提高执行效率","link":"#使用if-else替代switch提高执行效率","children":[]},{"level":2,"title":"计算密集型避免使用stream","slug":"计算密集型避免使用stream","link":"#计算密集型避免使用stream","children":[]}],"git":{"createdTime":1664114083000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":4}]},"readingTime":{"minutes":19.64,"words":5893},"filePathRelative":"Java/Java基础小结.md","localizedDate":"2022年9月25日","excerpt":"\\n<h2>标识符和关键字的区别是什么？</h2>\\n<p>标识符就是我们使用的对象或者变量的名字，关键字就是被Java作为特殊标识的单词。</p>\\n<h2>Java语言的关键字</h2>\\n<h3>访问控制</h3>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code>1. private:仅本类可以访问    \\n2. protected:对本包或者子类都可见\\n3. public:所有类可见\\n4. default:不修饰访问级别就是default，访问级别仅仅是本包的成员可以访问\\n</code></pre></div>","autoDesc":true}');export{d as comp,k as data};
