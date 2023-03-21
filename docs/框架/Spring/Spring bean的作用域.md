### Spring bean的作用域

阅读了一下`Spring`官方文档中，关于`bean`的作用域这一块的内容。`Spring5`官方文档中，共介绍了六种`bean`作用域，这篇文章来简单介绍一下这六种作用域的含义。



#### 1.Bean作用域的种类

  在`Spring`官方文档中，共提到了`6`种不同的`Bean`作用域，分别是：

![image-20220715175906301](http://rrmrwrjnu.hn-bkt.clouddn.com/202207151759375.png)

  需要注意的是，前两种是`Spring`中`bean`的基本作用域，而后四种，算是扩展的作用域，只能在`web`应用中使用。下面我就来分别介绍一下这`6`种不同的作用域。

##### 1.1 singleton作用域



  **singleton（单例）是Spring中，bean默认的作用域**。若一个`bean`的作用域是单例的，那么每个`IoC`容器只会创建这个`bean`的一个实例对象。所有对这个`bean`的依赖，以及获取这个`bean`的代码，拿到的都是同一个`bean`实例。`Spring`容器在创建这个`bean`后，会将它缓存在容器中（实际上是放在一个`ConcurrentHashMap`中）。**Spring中的bean不是线程安全的，所以只有在我们只关注bean能够提供的功能，而不在意它的状态（属性）时，才应该使用这个作用域**。

  需要注意的一点是，这里所说的单例，和设计模式中所提到的单例模式不同。设计模式中的单例，是强制一个类有且只有一个对象，我们如果不通过特殊的手段，将无法为这个单例类创建多个对象。而`Spring`中的单例作用域不同，这里的单例指的是在一个`Spring`容器中，只会缓存`bean`的唯一对象，所有通过容器获取这个`bean`的方式，最终拿到的都是同一个对象。但是在不同的`Spring`容器中，每一个`Spring`容器都可以拥有单例`bean`的一个实例对象，也就是说，这里的单例限定在一个`Spring`容器中，而不是整个应用程序。并且我们依然可以通过`new`的方式去自己创建`bean`。



##### 1.2 prototype作用域

  `prototype`可以理解为多例。若一个`bean`的作用域是`prototype`，那么`Spring`容器并不会缓存创建的`bean`，程序中对这个`bean`的每一次获取，容器都会重新实例化一个`bean`对象。**通常，如果我们需要使用bean的状态（属性），且这个状态是会改变的，那么我们就可以将它配置为这个作用域，以解决线程安全的问题**。因为对于单例`bean`来说，多个线程共享它的可变属性，会存在线程安全问题。

  前面也提过，如果`bean`的作用域是`prototype`的，那么容器在创建完这个`bean`后，并不会将它保存在容器中，这也就意味着，`Spring`容器并不能为我们做这个对象的销毁工作（比如资源释放）。此时我们可以通过`Spring`提供的接口，自定义一个后处理器，然后将这些`bean`的引用存储在这个后处理器中，当容器回调这个后处理器的方法时，我们可以在方法中通过提前存储的`bean`的引用，将它们销毁。



##### 1.3 request作用域

  `request`作用域将`bean`的使用范围限定在一个`http`请求中，对于每一个请求，都会单独创建一个`bean`，若请求结束，`bean`也会随之销毁。使用`request`作用域一般不会存在线程安全问题，因为在`Web`应用中，每个请求都是由一个单独的线程进行处理，所有线程之间并不会共享`bean`，从而不会存在线程安全的问题。

  这个作用域只能使用在`Web`应用中。如果使用的是注解扫描配置`bean`，那么在`bean`所属的类上使用`@RequestScope`注解即可使用此作用域，若是基于`xml`文件，则通过`bean`的`scope`配置项：



```
<bean id="userPreferences" class="com.foo.UserPreferences" scope="request"/>
```



##### 1.4 session作用域

  `session`作用域将`bean`的使用范围一次在一次`http会话`中，对于每一个会话，`Spring`容器都会创建一个单独的`bean`，若`session`被销毁，则`bean`也随之销毁。我们可以修改`bean`的状态，这个修改只对当前会话可见，但是是否线程安全呢？`Spring`文档中并未提及，但我认为不是线程安全的，因为每一个`session`可以对应于多个`request`，这些请求不一定就是串行执行的，比如说用户打开多个界面，同时进行多次操作，那后台将同时处理同一个`session`的多个`request`，此时并不能保证`bean`的线程安全。

  与`request`作用域一样，`session`作用域只能使用在`Web`应用中。我们可以使用`@SessionScope`将`bean`指定为`session`作用域，也可以使用`xml`配置方式：



```
<bean id="userPreferences" class="com.foo.UserPreferences" scope="session"/>
```

##### 1.5 application作用域

  学过`Servlet`的应该对`application`作用域有所了解，在`Servlet`程序中，有一个全局的`ServletContext`对象，这个对象被整个`web`应用所共享，我们可以通过`setAttribute`方法向其中添加全局共享的数据。而`Spring`中，`application`作用域就是这么实现的，作用域为`application`的`bean`，将会被作为`ServletContext`的属性，存储在其中，然后可以被全局访问，而且一个`ServletContext`只会存储这个`bean`的一个实例对象。`ServletContext`被销毁，这个`bean`自然也跟着被销毁。我们发现，这好像有点类似于`singleton`这个作用域，确实非常类似，但是也有一些区别。单例`bean`是一个`Spring`只会创建一个，而这里的却是每个`ServletContext`包含一个，不论有多少`Spring`容器，`bean`的数量只取决于`ServletContext`，而且单例`bean`只能通过容器去获取，是隐式的，而这种作用域的`bean`却是公开的，存储在`ServletContext`中，可直接通过`ServletContext`获取。

  `application`作用域也只能用于`web`应用中。使用方式和之前几种类似，可以通过`@ApplicationScope`注解，也可以使用`xml`配置文件：



```
<bean id="appPreferences" class="com.foo.AppPreferences" scope="application"/>
```



##### 1.5 websocket作用域

  `websocket`是一种应用层的通信协议，它提供应用层的全双工通信，而`Spring`提供对`websocket`协议的支持，于是就有了这么一个作用域。在我看的这个`Spring`官方文档中。若一个`bean`的作用域为`websocket`，则只作用于一次`websocket`通信，若连接被释放，则`bean`自然也会被销毁。需要注意的一点是需要对 WebSocket 作用域的 Bean 使用作用域代理模式

```java
@Component
@Scope(scopeName = "websocket", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MyBean {

    @PostConstruct
    public void init() {
        // Invoked after dependencies injected
    }

    // ...

    @PreDestroy
    public void destroy() {
        // Invoked when the WebSocket session ends
    }
}

@Controller
public class MyController {

    private final MyBean myBean;

    @Autowired
    public MyController(MyBean myBean) {
        this.myBean = myBean;
    }

    @MessageMapping("/action")
    public void handle() {
        // this.myBean from the current WebSocket session
    }
}
```



#### 2. 为什么global session没有了？

​	在其他的文章中，我们常常可以看到会有global session这个作用域，但是为什么我们从刚刚的官方文档没有看到呢？

##### global session作用域是什么

  这个作用域就比较特殊了，`globalSession`作用域的效果与`session`作用域类似，但是只适用于基于`portlet`的`web`应用程序中。`Portlet`规范定义了`globalSession`的概念，该概念在组成单个`Portlet Web`应用程序的所有`Portlet`之间共享（引用自`Spring`文档）。说实话，在看到这里之前，我从来没听说过`portlet`。我现在所学的，基本上都是基于`Servlet`的`web`应用程序，所有关于这个作用域，我也不理解。但是`Spring`文档中有提到一点，那就是**如果我们在基于Servlet的web应用程序中使用globalSession作用域，实际上容器使用session作用域进行处理**。

##### spring5 去掉了global session

​		从StackOverFlow的一篇文章中找到了答案[java - Were GlobalSession scoped beans removed from spring 5? Why? - Stack Overflow](http://stackoverflow.com/questions/54742157/were-globalsession-scoped-beans-removed-from-spring-5-why)，其中说到从Spring5开始停止了对Portlet的支持，从而去除掉了global session

​	