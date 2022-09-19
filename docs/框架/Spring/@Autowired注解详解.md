# @Autowired注解详解

## **1. @Autowired的默认装配**

​		我们都知道在spring中@Autowired注解，是用来自动装配对象的。默认情况下spring是按照类型装配的，也就是我们所说的`byType`方式。

此外，@Autowired注解的`required`参数默认是true，表示开启自动装配，有些时候我们不想使用自动装配功能，可以将该参数设置成false。

## **2. 相同类型的对象不只一个时**

上面`byType`方式主要针对相同类型的对象只有一个的情况，此时对象类型是唯一的，可以找到正确的对象。

但如果相同类型的对象不只一个时，会发生什么？

结果报错了，报类类名称有冲突，直接导致项目启动不来。

## **3. @Qualifier和@Primary**

显然在spring中，按照Autowired默认的装配方式：`byType`，是无法解决上面的问题的，这时可以改用按名称装配：`byName`。

只需在代码上加上`@Qualifier("xxx")`注解即可

> Qualifier意思是合格者，一般跟Autowired配合使用，需要指定一个bean的名称，通过bean名称就能找到需要装配的bean。

除了上面的`@Qualifier`注解之外，还能使用`@Primary`注解解决上面的问题。在其中一个Bean上面加上@Primary注解则会优先被注入

> 当我们使用自动配置的方式装配Bean时，如果这个Bean有多个候选者，假如其中一个候选者具有@Primary注解修饰，该候选者会被选中，作为自动配置的值。

## **4. @Autowired的使用范围**

上面的实例中@Autowired注解，都是使用在成员变量上，但@Autowired的强大之处，远非如此。

该注解我们平常使用最多的地方可能是在成员变量上。接下来，我们重点看看在其他地方该怎么用？

### **4.1 成员变量**

在成员变量上使用@Autowired注解：

```java
@Service
public class UserService {

    @Autowired
    private User user;
}
```

### **4.2 构造器**

在构造器上使用@Autowired注解：

```java
@Service
public class UserService {

    private IUser user;

    @Autowired
    public UserService(IUser user) {
        this.user = user;
        System.out.println("user:" + user);
    }
}
```

> 如果类只有一个构造方法，那么 `@Autowired` 注解可以省略；如果类中有多个构造方法，那么需要添加上 `@Autowired` 来明确指定到底使用哪个构造方法。

### **4.3 方法**

在普通方法上加Autowired注解：

```java
@Service
public class UserService {

    @Autowired
    public void test(IUser user) {
       user.say();
    }
}
```

Spring会在项目启动的过程中，自动调用一次加了@Autowired注解的方法，我们可以在该方法做一些初始化的工作。

也可以在setter方法上@Autowired注解：

```java
@Service
public class UserService {

    private IUser user;

    @Autowired
    public void setUser(IUser user) {
        this.user = user;
    }
}
```

### **4.4 参数**

可以在构造器的入参上加Autowired注解：

```java
@Service
public class UserService {

    private IUser user;

    public UserService(@Autowired IUser user) {
        this.user = user;
        System.out.println("user:" + user);
    }
}
```

也可以在非静态方法的入参上加Autowired注解：

```java
@Service
public class UserService {

    public void test(@Autowired IUser user) {
       user.say();
    }
}
```

## **5. @Autowired的高端玩法**

其实上面举的例子都是通过@Autowired自动装配单个实例，但这里我会告诉你，它也能自动装配多个实例，怎么回事呢？

将UserService方法调整一下，用一个List集合接收IUser类型的参数：

```text
@Service
public class UserService {

    @Autowired
    private List<IUser> userList;

    @Autowired
    private Set<IUser> userSet;

    @Autowired
    private Map<String, IUser> userMap;

    public void test() {
        System.out.println("userList:" + userList);
        System.out.println("userSet:" + userSet);
        System.out.println("userMap:" + userMap);
    }
}
```

@Autowired会自动把相同类型的IUser对象收集到集合中。

## **6. @Autowired一定能装配成功？**

前面介绍了@Autowired注解这么多牛逼之处，其实有些情况下，即使使用了@Autowired装配的对象还是null，到底是什么原因呢？

### **6.1 没有加入容器**

在类上面忘了加@Controller、@Service、@Component、@Repository等注解，Spring就无法完成自动装配的功能

### **6.2 注入Filter或Listener**

web应用启动的顺序是：`Listener`->`Filter`->`Servlet`。

如果项目当中真的需要这样做，我们该如何解决这个问题呢？

答案是使用WebApplicationContextUtils.getWebApplicationContext获取当前的ApplicationContext，再通过它获取到bean实例。

### **6.3 循环依赖问题**

如果A依赖于B，B依赖于C，C又依赖于A，这样就形成了一个死循环。

Spring的bean默认是单例的，如果单例bean使用@Autowired自动装配，大多数情况，能解决循环依赖问题。

但是如果bean是多例的，会出现循环依赖问题，导致bean自动装配不了。

还有有些情况下，如果创建了代理对象，即使bean是单例的，依然会出现循环依赖问题。

## **7. @Autowired和@Resouce的区别**

@Autowired功能虽说非常强大，但是也有些不足之处。比如：比如它跟spring强耦合了，如果换成了JFinal等其他框架，功能就会失效。而@Resource是JSR-250提供的，它是Java标准，绝大部分框架都支持。

除此之外，有些场景使用@Autowired无法满足的要求，改成@Resource却能解决问题。接下来，我们重点看看@Autowired和@Resource的区别。

- @Autowired默认按byType自动装配，而@Resource默认byName自动装配。
- @Autowired只包含一个参数：required，表示是否开启自动准入，默认是true。而@Resource包含七个参数，其中最重要的两个参数是：name 和 type。
- @Autowired如果要使用byName，需要使用@Qualifier一起配合。而@Resource如果指定了name，则用byName自动装配，如果指定了type，则用byType自动装配。
- @Autowired能够用在：构造器、方法、参数、成员变量和注解上，而@Resource能用在：类、成员变量和方法上。
- @Autowired是Spring定义的注解，而@Resource是JSR-250定义的注解。