## 循环依赖

所谓的`循环依赖`，就是两个或则两个以上的`bean`互相依赖对方，最终形成`闭环`。比如“A对象依赖B对象，而B对象也依赖A对象”，或者“A对象依赖B对象，B对象依赖C对象，C对象依赖A对象”；类似以下代码：

```java
public class A {
    private B b;
}

public class B {
    private A a;
}
```

常规情况下，会出现以下情况：

1. 通过构建函数创建A对象（A对象是半成品，还没注入属性和调用init方法）。
2. A对象需要注入B对象，发现对象池（缓存）里还没有B对象（对象在创建并且注入属性和初始化完成之后，会放入对象缓存里）。
3. 通过构建函数创建B对象（B对象是半成品，还没注入属性和调用init方法）。
4. B对象需要注入A对象，发现对象池里还没有A对象。
5. 创建A对象，循环以上步骤。

## 三级缓存

`Spring`解决`循环依赖`的核心思想在于`提前曝光`：

1. 通过构建函数创建A对象（A对象是半成品，还没注入属性和调用init方法）。
2. A对象需要注入B对象，发现缓存里还没有B对象，将`半成品对象A`放入`半成品缓存`。
3. 通过构建函数创建B对象（B对象是半成品，还没注入属性和调用init方法）。
4. B对象需要注入A对象，从`半成品缓存`里取到`半成品对象A`。
5. B对象继续注入其他属性和初始化，之后将`完成品B对象`放入`完成品缓存`。
6. A对象继续注入属性，从`完成品缓存`中取到`完成品B对象`并注入。
7. A对象继续注入其他属性和初始化，之后将`完成品A对象`放入`完成品缓存`。

其中缓存有三级：

```java
/** Cache of singleton objects: bean name to bean instance. */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

/** Cache of early singleton objects: bean name to bean instance. */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);


/** Cache of singleton factories: bean name to ObjectFactory. */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
```

| 缓存                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| singletonObjects      | 第一级缓存，存放可用的`成品Bean`。                           |
| earlySingletonObjects | 第二级缓存，存放`半成品的Bean`，`半成品的Bean`是已创建对象，但是未注入属性和初始化。用以解决循环依赖。 |
| singletonFactories    | 第三级缓存，存的是`Bean工厂对象`，用来生成`半成品的Bean`并放入到二级缓存中。用以解决循环依赖。 |

要了解原理，最好的方法就是阅读源码，从创建Bean的方法`AbstractAutowireCapableBeanFactor.doCreateBean`入手。

#### 1. 在构造`Bean`对象之后，将对象提前`曝光`到缓存中，这时候`曝光`的对象仅仅是`构造完成`，还没`注入属性`和`初始化`。

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory
        implements AutowireCapableBeanFactory {
    protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
            throws BeanCreationException {            
        ……
        // 是否提前曝光
        boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
                isSingletonCurrentlyInCreation(beanName));
        if (earlySingletonExposure) {
            if (logger.isTraceEnabled()) {
                logger.trace("Eagerly caching bean '" + beanName +
                        "' to allow for resolving potential circular references");
            }
            addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
        }
        ……
    }   
}     
```

#### 2. 提前曝光的对象被放入`Map<String, ObjectFactory<?>> singletonFactories`缓存中，这里并不是直接将`Bean`放入缓存，而是包装成`ObjectFactory`对象再放入。

```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
    protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
        Assert.notNull(singletonFactory, "Singleton factory must not be null");
        synchronized (this.singletonObjects) {
            // 一级缓存
            if (!this.singletonObjects.containsKey(beanName)) {
                // 三级缓存
                this.singletonFactories.put(beanName, singletonFactory);
                // 二级缓存
                this.earlySingletonObjects.remove(beanName);
                this.registeredSingletons.add(beanName);
            }
        }
    }
}
public interface ObjectFactory<T> {
    T getObject() throws BeansException;
}    
```

#### 3. 为什么要包装一层`ObjectFactory`对象？

如果创建的`Bean`有对应的`代理`，那其他对象注入时，注入的应该是对应的`代理对象`；但是`Spring`无法提前知道这个对象是不是有`循环依赖`的情况，而`正常情况`下（没有`循环依赖`情况），`Spring`都是在创建好`完成品Bean`之后才创建对应的`代理`。这时候`Spring`有两个选择：

1. 不管有没有`循环依赖`，都`提前`创建好`代理对象`，并将`代理对象`放入缓存，出现`循环依赖`时，其他对象直接就可以取到代理对象并注入。
2. 不提前创建好代理对象，在出现`循环依赖`被其他对象注入时，才实时生成`代理对象`。这样在没有`循环依赖`的情况下，`Bean`就可以按着`Spring设计原则`的步骤来创建。

`Spring`选择了第二种方式，那怎么做到提前曝光对象而又不生成代理呢？
Spring就是在对象外面包一层`ObjectFactory`，提前曝光的是`ObjectFactory`对象，在被注入时才在`ObjectFactory.getObject`方式内实时生成代理对象，并将生成好的代理对象放入到第二级缓存`Map<String, Object> earlySingletonObjects`。
`addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));`：

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory
        implements AutowireCapableBeanFactory {

    protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {
        Object exposedObject = bean;
        if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
            for (BeanPostProcessor bp : getBeanPostProcessors()) {
                if (bp instanceof SmartInstantiationAwareBeanPostProcessor) {
                    SmartInstantiationAwareBeanPostProcessor ibp = (SmartInstantiationAwareBeanPostProcessor) bp;
                    exposedObject = ibp.getEarlyBeanReference(exposedObject, beanName);
                }
            }
        }
        return exposedObject;
    }
}
```

为了防止对象在后面的`初始化（init）`时重复`代理`，在创建代理时，`earlyProxyReferences`缓存会记录已代理的对象。

```java
public abstract class AbstractAutoProxyCreator extends ProxyProcessorSupport
        implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware {
    private final Map<Object, Object> earlyProxyReferences = new ConcurrentHashMap<>(16);
            
    @Override
    public Object getEarlyBeanReference(Object bean, String beanName) {
        Object cacheKey = getCacheKey(bean.getClass(), beanName);
        this.earlyProxyReferences.put(cacheKey, bean);
        return wrapIfNecessary(bean, beanName, cacheKey);
    }        
}        
```

#### 4. 注入属性和初始化

提前曝光之后：

1. 通过`populateBean`方法注入属性，在注入其他`Bean`对象时，会先去缓存里取，如果缓存没有，就创建该对象并注入。
2. 通过`initializeBean`方法初始化对象，包含创建代理。

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory
        implements AutowireCapableBeanFactory {
    protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
            throws BeanCreationException {
        ……
        // Initialize the bean instance.
        Object exposedObject = bean;
        try {
            populateBean(beanName, mbd, instanceWrapper);
            exposedObject = initializeBean(beanName, exposedObject, mbd);
        }
        catch (Throwable ex) {
            if (ex instanceof BeanCreationException && beanName.equals(((BeanCreationException) ex).getBeanName())) {
                throw (BeanCreationException) ex;
            }
            else {
                throw new BeanCreationException(
                        mbd.getResourceDescription(), beanName, "Initialization of bean failed", ex);
            }
        }
        ……
    }        
}    
// 获取要注入的对象
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
    protected Object getSingleton(String beanName, boolean allowEarlyReference) {
        // 一级缓存
        Object singletonObject = this.singletonObjects.get(beanName);
        if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
            synchronized (this.singletonObjects) {
                // 二级缓存
                singletonObject = this.earlySingletonObjects.get(beanName);
                if (singletonObject == null && allowEarlyReference) {
                    // 三级缓存
                    ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                    if (singletonFactory != null) {
                        singletonObject = singletonFactory.getObject();
                        this.earlySingletonObjects.put(beanName, singletonObject);
                        this.singletonFactories.remove(beanName);
                    }
                }
            }
        }
        return singletonObject;
    }
}    
```

#### 5. 放入已完成创建的单例缓存

在经历了以下步骤之后，最终通过`addSingleton`方法将最终生成的可用的`Bean`放入到`单例缓存`里。

1. AbstractBeanFactory.doGetBean ->
2. DefaultSingletonBeanRegistry.getSingleton ->
3. AbstractAutowireCapableBeanFactory.createBean ->
4. AbstractAutowireCapableBeanFactory.doCreateBean ->
5. DefaultSingletonBeanRegistry.addSingleton

```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {

    /** Cache of singleton objects: bean name to bean instance. */
    private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

    /** Cache of singleton factories: bean name to ObjectFactory. */
    private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);

    /** Cache of early singleton objects: bean name to bean instance. */
    private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);

    protected void addSingleton(String beanName, Object singletonObject) {
        synchronized (this.singletonObjects) {
            this.singletonObjects.put(beanName, singletonObject);
            this.singletonFactories.remove(beanName);
            this.earlySingletonObjects.remove(beanName);
            this.registeredSingletons.add(beanName);
        }
    }
}    
```

## 二级缓存

上面第三步**`《为什么要包装一层ObjectFactory对象？》`**里讲到有两种选择：

1. 不管有没有`循环依赖`，都`提前`创建好`代理对象`，并将`代理对象`放入缓存，出现`循环依赖`时，其他对象直接就可以取到代理对象并注入。
2. 不提前创建好代理对象，在出现`循环依赖`被其他对象注入时，才实时生成`代理对象`。这样在没有`循环依赖`的情况下，`Bean`就可以按着`Spring设计原则`的步骤来创建。

`Sping`选择了`第二种`，如果是`第一种`，就会有以下不同的处理逻辑：

1. 在`提前曝光半成品`时，直接执行`getEarlyBeanReference`创建到代理，并放入到缓存`earlySingletonObjects`中，这时候`earlySingletonObjects`里放的不再是`实际对象`，而是`代理对象`，代理对象的`target(即实际对象)`是`半成品`。
2. 有了上一步，那就不需要通过`ObjectFactory`来`延迟`执行`getEarlyBeanReference`，也就不需要`singletonFactories`这一级缓存。

这种处理方式可行吗？
这里做个试验，对`AbstractAutowireCapableBeanFactory`做个小改造，在放入`三级缓存`之后立刻取出并放入`二级缓存`，这样`三级缓存`的作用就完全被忽略掉，就相当于只有`二级缓存`。
![image](https://segmentfault.com/img/bVbLnSZ)

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory
        implements AutowireCapableBeanFactory {
    protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
            throws BeanCreationException {            
        ……
        // 是否提前曝光
        boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
                isSingletonCurrentlyInCreation(beanName));
        if (earlySingletonExposure) {
            if (logger.isTraceEnabled()) {
                logger.trace("Eagerly caching bean '" + beanName +
                        "' to allow for resolving potential circular references");
            }
            addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
            // 立刻从三级缓存取出放入二级缓存
            getSingleton(beanName, true);
        }
        ……
    }   
}     
```

测试结果是可以的，并且从源码上分析可以得出两种方式性能是一样的，并不会影响到`Sping`启动速度。那为什么`Sping`不选择`二级缓存`方式，而是要额外加一层缓存？
**如果要使用`二级缓存`解决`循环依赖`，意味着Bean在`构造`完后就创建`代理对象`，这样违背了`Spring设计原则`。Spring结合AOP跟Bean的生命周期，是在`Bean创建完全`之后通过`AnnotationAwareAspectJAutoProxyCreator`这个后置处理器来完成的，在这个后置处理的`postProcessAfterInitialization`方法中对初始化后的Bean完成AOP代理。如果出现了`循环依赖`，那没有办法，只有给Bean先创建代理，但是没有出现循环依赖的情况下，设计之初就是让Bean在生命周期的最后一步完成代理而不是在实例化后就立马完成代理。**

## 都有代理怎么办?

如果`对象A`和`对象B`循环依赖，且都有代理的话，那创建的顺序就是

1. `A半成品`加入`第三级缓存`
2. `A`填充属性注入`B` -> 创建`B对象` -> `B半成品`加入`第三级缓存`
3. `B`填充属性注入`A` -> 创建`A代理对象`，从`第三级缓存`移除`A对象`，`A代理对象`加入`第二级缓存`（此时`A`还是半成品，`B`注入的是`A代理对象`）
4. 创建`B代理对象`（此时`B`是完成品） -> 从`第三级缓存`移除`B对象`，`B代理对象`加入`第一级缓存`
5. `A半成品`注入`B代理对象`
6. 从`第二级缓存`移除`A代理对象`，`A代理对象`加入`第一级缓存`