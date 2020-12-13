## 框架

### Spring

#### IoC

##### @Autowaire 和 @Resource 有什么区别？

1. @Autowired 注解是按类型装配依赖对象，默认情况下它要求依赖对象必须存在，如果允许null值，可以设置它的required属性为false
2. @Resource 默认按名称装配，放在 setter 方法上则按属性名装配。可以通过配置其 type 属性来按类型装配。
3. @Autowired 结合@Qualifier 可以实现按名称装配。
4. @Resources 是 JDK 的注解，@Autowired 是 Spring的注解。

| 注解对比 | `@Resource` | `@Autowire` |
| -------- | ----------- | ----------- |
| 注解来源 | JDK         | Spring      |
| 装配方式 | 优先按名称  | 优先按类型  |
| 属性     | name、type  | required    |

##### @Autowaire 放在成员变量上和放在set方法上的区别是什么？

放在 setter 上可以对注入的 Bean 做其他的操作，除此之外并无其他区别。

例如：

```java
class DaoDemo{

  private JdbcTemplate jdbcTemplate;

  @Autowired
  public void setDataSource(DataSource dataSource){
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }
}
```



#### AOP

##### Spring AOP和AspectJ是什么关系？

其实AOP并不是Spring的专属，AOP最开始是一种编程模型，后来大佬们为了探讨AOP的标准化，统一AOP规范，成立了一个AOP联盟。除了Spring外，AOP的框架有很多，比如AspectJ, AspectWerkz, JBoss-AOP。

最开始，Spring AOP和AspectJ是完全独立的，Spring有自己的实现和使用语法。但是Spring的AOP使用起来太麻烦了，深受大家吐槽。于是Spring支持了广受大家好评的AspectJ语法，通过在配置类上添加`@EnableAspectJAutoProxy`这个注解来开启对AspectJ的语法。

但Spring**仅仅是支持了AspectJ的部分语法（有些语法是不支持的），但底层实现还是自己的一套东西**。而且两个框架的目标不同，AspectJ是一套完整的AOP解决方案，更为健壮，但使用起来比较复杂，还需要使用特殊的语法和编译器。而Spring的目的是想要把AOP和IoC框架结合起来，让Spring管理的Bean能够很方便地使用AOP的功能。

所以Spring AOP和AspectJ没啥关系，只是Spring借鉴了Aspect的声明语法。

#### 循环依赖/三级缓存

三级缓存：

1. singletonFactories ： 进入实例化阶段的单例对象工厂的cache （三级缓存）
2. earlySingletonObjects ：完成实例化但是尚未初始化的，提前暴光的单例对象的Cache （二级缓存）
3. singletonObjects：完成初始化的单例对象的cache（一级缓存）

A，B相互依赖的两个类的创建过程：

1. 使用`context.getBean(A.class)`，旨在获取容器内的单例A(若A不存在，就会走A这个Bean的创建流程)，显然初次获取A是不存在的，因此走**A的创建之路~**
2. `实例化`A（注意此处仅仅是实例化），并将它放进`缓存`（此时A已经实例化完成，已经可以被引用了）
3. `初始化`A：`@Autowired`依赖注入B（此时需要去容器内获取B）
4. 为了完成依赖注入B，会通过`getBean(B)`去容器内找B。但此时B在容器内不存在，就走向**B的创建之路~**
5. `实例化`B，并将其放入缓存。（此时B也能够被引用了）
6. `初始化`B，`@Autowired`依赖注入A（此时需要去容器内获取A）
7. `此处重要`：初始化B时会调用`getBean(A)`去容器内找到A，上面我们已经说过了此时候因为A已经实例化完成了并且放进了缓存里，所以这个时候去看缓存里是已经存在A的引用了的，所以`getBean(A)`能够正常返回
8. **B初始化成功**（此时已经注入A成功了，已成功持有A的引用了），return（注意此处return相当于是返回最上面的`getBean(B)`这句代码，回到了初始化A的流程中~）。
9. 因为B实例已经成功返回了，因此最终**A也初始化成功**
10. **到此，B持有的已经是初始化完成的A，A持有的也是初始化完成的B**

##### 为什么需要三级缓存，二级缓存不行吗？

如果没有AOP，其实Spring使用二级缓存就可以解决循环依赖的问题。若使用二级缓存，在AOP情形下，注入到其他Bean的，不是最终的代理对象，而是原始目标对象。

因为Spring对Bean有一个生命周期的定义，而代理对象是在Bean初始化完成后，执行后置处理器的时候生成的。所以不能在二级缓存的时候就直接生成代理对象，放进缓存。

### Spring Boot

#### Spring Boot的主要优点

1. 开发基于 Spring 的应用程序很容易。
2. Spring Boot 项目所需的开发或工程时间明显减少，通常会提高整体生产力。
3. Spring Boot不需要编写大量样板代码、XML配置和注释。
4. Spring引导应用程序可以很容易地与Spring生态系统集成，如Spring JDBC、Spring ORM、Spring Data、Spring Security等。
5. Spring Boot遵循“固执己见的默认配置”，以减少开发工作（默认配置可以修改）。
6. Spring Boot 应用程序提供嵌入式HTTP服务器，如Tomcat和Jetty，可以轻松地开发和测试web应用程序。（这点很赞！普通运行Java程序的方式就能运行基于Spring Boot web 项目，省事很多）
7. Spring Boot提供命令行接口(CLI)工具，用于开发和测试Spring Boot应用程序，如Java或Groovy。
8. Spring Boot提供了多种插件，可以使用内置工具(如Maven和Gradle)开发和测试Spring Boot应用程序。

#### Spring Boot 最大的优势是什么？

Spring Boot 的最大的优势是“约定优于配置“。“约定优于配置“是一种软件设计范式，开发人员按照约定的方式来进行编程，可以减少软件开发人员需做决定的数量，获得简单的好处，而又不失灵活性。

#### Spring Boot 中 “约定优于配置“的具体产品体现在哪里？

Spring Boot Starter、Spring Boot Jpa 都是“约定优于配置“的一种体现。都是通过“约定优于配置“的设计思路来设计的，

Spring Boot Starter 在启动的过程中会根据约定的信息对资源进行初始化；Spring Boot Jpa 通过约定的方式来自动生成 Sql ，避免大量无效代码编写。

#### Spring Boot Starter 的工作原理是什么？

1. Spring Boot 在启动时会去依赖的 Starter 包中寻找 resources/META-INF/spring.factories 文件
2. 根据 spring.factories 配置加载 AutoConfigure 类
3. 根据 @Conditional 注解的条件，进行自动配置并将 Bean 注入 Spring Context

Spring Boot 在启动的时候，按照约定去读取 Spring Boot Starter 的配置信息，再根据配置信息对资源进行初始化，并注入到 Spring 容器中。这样 Spring Boot 启动完毕后，就已经准备好了一切资源，使用过程中直接注入对应 Bean 资源即可。

#### Starter

##### 什么是 Spring Boot Starters?

Spring Boot Starters 是一系列依赖关系的集合，因为它的存在，项目的依赖之间的关系对我们来说变的更加简单了。举个例子：在没有Spring Boot Starters之前，我们开发REST服务或Web应用程序时; 我们需要使用像Spring MVC，Tomcat和Jackson这样的库，这些依赖我们需要手动一个一个添加。但是，有了 Spring Boot Starters 我们只需要一个只需添加一个**spring-boot-starter-web**一个依赖就可以了，这个依赖包含的字依赖中包含了我们开发REST 服务需要的所有依赖。

Spring Boot 的 Starter 有两个作用：

1. 将某个功能/领域所需的依赖集中到一起，可以认为是一个组合依赖。

   例如 `spring-boot-starter-web` 就组合了`spring-web`、`spring-webmvc`、`spring-boot-starter-tomcat` 等依赖。

2. 提供自动配置类给 Spring 完成自动配置

##### 自定义 Starter

> [实战|如何自定义SpringBoot Starter？](https://objcoding.com/2018/02/02/Costom-SpringBoot-Starter/)

1. 引入 SpringBoot 自动化配置依赖：

   `spring-boot-autoconfigure`

2. 创建一个 HelloworldService，并定义 sayHello() 方法打印。

   ```java
   public class HelloworldService {
   
     private String words;
   
     public String sayHello() {
       return "hello, " + words;
     }
   }
   ```

3. 创建属性类，指定配置前缀，读取项目配置文件中的属性。

   ```java
   @ConfigurationProperties(prefix = "helloworld")
   public class HelloworldProperties {
     public static final String DEFAULT_WORDS = "world";
   
     private String words = DEFAULT_WORDS;
   }
   ```

4. 创建自动化配置类

   ```java
   // 相当于一个普通的 java 配置类
   @Configuration
   // 当 HelloworldService 在类路径的条件下
   @ConditionalOnClass({HelloworldService.class})
   // 将 application.properties 的相关的属性字段与该类一一对应，并生成 Bean
   @EnableConfigurationProperties(HelloworldProperties.class)
   public class HelloworldAutoConfiguration {
   
     // 注入属性类
     @Autowired
     private HelloworldProperties hellowordProperties;
   
     @Bean
     // 当容器没有这个 Bean 的时候才创建这个 Bean
     @ConditionalOnMissingBean(HelloworldService.class)
     public HelloworldService helloworldService() {
       HelloworldService helloworldService = new HelloworldService();
       helloworldService.setWords(hellowordProperties.getWords());
       return helloworldService;
     }
   }
   ```

5. 在 META-INF 目录下创建 spring.factories，指定自动配置类。

   ```properties
   # Auto Configure
   org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.objcoding.starters.helloworld.HelloworldAutoConfiguration
   ```

6. 使用

   引用自定义的 Starter

   在主配置文件中配置响应的配置属性。

   在需要的地方通过 `@Autowired` 注入 HelloworldService，然后调用它的 `sayHello()` 方法。

#### 自动配置

Spring Boot 项目启动时会扫描所有所有依赖 jar 包下的 `spring.factories` 文件，将其中的自动配置类注册到 Spring IoC 容器中。

Spring Boot 项目的启动注解@SpringBootApplication 由下面三个注解组成：

- @Configuration
- @ComponentScan
- @EnableAutoConfiguration

其中 `@EnableAutoConfiguration` 是实现自动配置的入口，该注解又通过 `@Import` 注解导入了`AutoConfigurationImportSelector`，在该类中 `getCandidateConfigurations` 方法会通过 `SpringFactoriesLoader.loadFactoryNames()` 加载所有 `spring.factories` 文件中指定的自动配置类。

这些自动配置类中会使用 `@EnableConfigurationProperties` 注解指定相应的配置属性类，配置属性类中通过 `@ConfigurationProperties(prefix = "xxx")` 读取主配置文件中相应前缀的配置选项。通过 Conditional 相关注解指定加载相关的服务类(例如 RedisTemplate，RestTemplate)，并将配置类中的配置设置到服务类中，最终通过 `@Bean` 实例化服务类并注入到容器中。

#### 启动流程

#### 过滤器

过滤器的配置比较简单，直接实现`Filter` 接口即可，也可以通过`@WebFilter`注解实现对特定`URL`拦截，看到`Filter` 接口中定义了三个方法。

- `init()` ：该方法在容器启动初始化过滤器时被调用，它在 `Filter` 的整个生命周期只会被调用一次。**注意**：这个方法必须执行成功，否则过滤器会不起作用。
- `doFilter()` ：容器中的每一次请求都会调用该方法， `FilterChain` 用来调用下一个过滤器 `Filter`。
- `destroy()`： 当容器销毁 过滤器实例时调用该方法，一般在方法中销毁或关闭资源，在过滤器 `Filter` 的整个生命周期也只会被调用一次

```js
@Component
public class MyFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

        System.out.println("Filter 前置");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        System.out.println("Filter 处理中");
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

        System.out.println("Filter 后置");
    }
}
```

##### 执行顺序

过滤器用`@Order`注解控制执行顺序，通过`@Order`控制过滤器的级别，值越小级别越高越先执行。

#### 拦截器

拦截器它是链式调用，一个应用中可以同时存在多个拦截器`Interceptor`， 一个请求也可以触发多个拦截器 ，而每个拦截器的调用会依据它的声明顺序依次执行。

首先编写一个简单的拦截器处理类，请求的拦截是通过`HandlerInterceptor` 来实现，看到`HandlerInterceptor` 接口中也定义了三个方法。

- `preHandle()` ：这个方法将在请求处理之前进行调用。**注意**：如果该方法的返回值为`false` ，将视为当前请求结束，不仅自身的拦截器会失效，还会导致其他的拦截器也不再执行。
- `postHandle()`：只有在 `preHandle()` 方法返回值为`true` 时才会执行。会在Controller 中的方法调用之后，DispatcherServlet 返回渲染视图之前被调用。 **有意思的是**：`postHandle()` 方法被调用的顺序跟 `preHandle()` 是相反的，先声明的拦截器  `preHandle()` 方法先执行，而`postHandle()`方法反而会后执行。
- `afterCompletion()`：只有在 `preHandle()` 方法返回值为`true` 时才会执行。在整个请求结束之后，  DispatcherServlet 渲染了对应的视图之后执行。

```js
@Component
public class MyInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        System.out.println("Interceptor 前置");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        System.out.println("Interceptor 处理中");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

        System.out.println("Interceptor 后置");
    }
}
```

将自定义好的拦截器处理类进行注册，并通过`addPathPatterns`、`excludePathPatterns`等属性设置需要拦截或需要排除的 `URL`。

```js
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor()).addPathPatterns("/**");
        registry.addInterceptor(new MyInterceptor1()).addPathPatterns("/**");
    }
}
```

##### 执行顺序

拦截器默认的执行顺序，就是它的注册顺序，可以通过`order`属性手动设置控制，值越小越先执行。

```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
  registry.addInterceptor(new MyInterceptor2()).addPathPatterns("/**").order(2);
  registry.addInterceptor(new MyInterceptor1()).addPathPatterns("/**").order(1);
  registry.addInterceptor(new MyInterceptor()).addPathPatterns("/**").order(3);
}
```

##### 过滤器与拦截器的区别

- Filter是基于函数回调的，而Interceptor则是基于Java反射的。
- Filter依赖于Servlet容器，因此只能在web环境使用，而Interceptor不依赖于Servlet容器。不仅能应用在`web`程序中，也可以用于`Application`、`Swing`等程序中。
- Filter对几乎所有的请求起作用，而Interceptor只能对action请求起作用。
- Interceptor可以访问Action的上下文，值栈里的对象，而Filter不能。
- 在action的生命周期里，Interceptor可以被多次调用，而Filter只能在容器初始化时调用一次。

##### 过滤器与拦截器的顺序

过滤前-拦截前-action执行-拦截后-过滤后

过滤器`Filter`是在请求进入容器后，但在进入`servlet`之前进行预处理，请求结束是在`servlet`处理完以后。

拦截器 `Interceptor` 是在请求进入`servlet`后，在进入`Controller`之前进行预处理的，`Controller` 中渲染了对应的视图之后请求结束。

### MyBatis

#### 多数据源

> [搞定SpringBoot多数据源(1)：多套源策略](https://juejin.cn/post/6844904047158411277)
>
> [搞定SpringBoot多数据源(2)：动态数据源](https://juejin.cn/post/6844904050262016007)
>
> [搞定SpringBoot多数据源(3)：参数化变更源](https://juejin.cn/post/6844904052380139528)

在开发过程中，避免不了需要同时操作多个数据库的情况，通常的应用场景如下 ：

- 数据库高性能场景：

  主从，包括一主一从，一主多从等，在主库进行增删改操作，在从库进行读操作。

- 数据库高可用场景：

  主备，包括一往一备，多主多备等，在数据库无法访问时可以切换。

- 同构或异构数据的业务处理：

  需要处理的数据存储在不同的数据库中，包括同构（如都是 MySQL ），异构（如一个 MySQL ，另外是 PG 或者 Oracle ）。

多数据源一般有三个策略：

> 重点看动态数据源就可以了

1. 多套数据源：

   即针对每个数据库建立一套数据处理逻辑，每套数据库都包括数据源配置、会话工厂（ sessionFactory ）、连接、SQL 操作、实体。各套数据库相互独立。

2. **动态数据源**：

   确定数量的多个数据源共用一个会话工厂，根据条件动态选取数据源进行连接、SQL 操作。

3. 参数化变更数据源：

   根据参数添加数据源，并进行数据源切换，数据源数量不确定。通常用于对多个数据库的管理工作。

##### 多套数据源

###### 配置数据库连接信息

```properties
# master
spring.datasource.master.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.master.jdbc-url=jdbc:mysql://localhost:3306/mytest?useSSL=false&serverTimezone=GMT%2B8&characterEncoding=UTF-8
spring.datasource.master.username=root
spring.datasource.master.password=111111

# slave
spring.datasource.slave.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.slave.jdbc-url=jdbc:mysql://localhost:3306/my_test1?useSSL=false&serverTimezone=GMT%2B8&characterEncoding=UTF-8
spring.datasource.slave.username=root
spring.datasource.slave.password=111111
```

###### 配置数据源

```java
@Configuration
@PropertySource("classpath:config/jdbc.properties")
publicclass DatasourceConfig {
  @Bean("master")
  @ConfigurationProperties(prefix = "spring.datasource.master")
  public DataSource masterDataSource(){
    return DataSourceBuilder.create().build();
  }

  @Bean("slave")
  @ConfigurationProperties(prefix = "spring.datasource.slave")
  public DataSource slaveDataSource(){
    return DataSourceBuilder.create().build();
  }
}
```

###### 配置 session 工厂

```java
@Configuration
@MapperScan(basePackages = "me.mason.demo.basicmultidatasource.mapper.master", sqlSessionFactoryRef = "masterSqlSessionFactory")
publicclass MasterMybatisConfig {
  /**
     * 注意，此处需要使用MybatisSqlSessionFactoryBean，不是SqlSessionFactoryBean，
     * 否则，使用mybatis-plus的内置函数时就会报invalid bound statement (not found)异常
     */
  @Bean("masterSqlSessionFactory")
  public SqlSessionFactory masterSqlSessionFactory(@Qualifier("master") DataSource dataSource) throws Exception {
    // 设置数据源
    MybatisSqlSessionFactoryBean mybatisSqlSessionFactoryBean = new MybatisSqlSessionFactoryBean();
    mybatisSqlSessionFactoryBean.setDataSource(dataSource);
    //mapper的xml文件位置
    PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
    String locationPattern = "classpath*:/mapper/master/*.xml";
    mybatisSqlSessionFactoryBean.setMapperLocations(resolver.getResources(locationPattern));
    //对应数据库的entity位置
    String typeAliasesPackage = "me.mason.demo.basicmultidatasource.entity.master";
    mybatisSqlSessionFactoryBean.setTypeAliasesPackage(typeAliasesPackage);
    return mybatisSqlSessionFactoryBean.getObject();
  }
}
```

###### 多套实体类、DAO、Mapper

对应创建多套实体类，DAO接口类，Mapper.xml 文件。

###### 使用

客户端要操作哪个数据库，就选取对应的 Dao 接口进行操作就可以了。

###### 优点

- 简单、直接：

  一个库对应一套处理方式，很好理解。

- 符合开闭原则（ OCP ）：

  设计模式告诉我们，对扩展开放，对修改关闭，添加多一个数据库，原来的那一套不需要改动，只添加即可。

###### 缺点

- 资源浪费：

  针对每一个数据源写一套操作，连接数据库的资源也是独立的，分别占用同样多的资源。`SqlSessionFactory` 是一个工厂，建议是使用单例，完全可以重用，不需要建立多个，只需要更改数据源即可，跟多线程，使用线程池减少资源消耗是同一道理。

- 代码冗余：

  在前面的多数据源配置中可以看出，其实 master 和 slave 的很多操作是一样的，只是改个名称而已，因此会造成代码冗余。

- 缺乏灵活：

  所有需要使用的地方都需要引入对应的 mapper，对于很多操作，只是选择的数据源不一样，代码逻辑是一致的。另外，对于一主多从的情况，若需要对多个从库进行负载均衡，相对比较麻烦。

正因为有上述的缺点，所以还有改进的空间。于是就有了动态数据源。

##### 动态数据源

###### 配置数据库连接信息

```properties
# master
spring.datasource.master.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.master.jdbc-url=jdbc:mysql://localhost:3306/mytest?useSSL=false&serverTimezone=GMT%2B8&characterEncoding=UTF-8
spring.datasource.master.username=root
spring.datasource.master.password=111111

# slave
spring.datasource.slave.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.slave.jdbc-url=jdbc:mysql://localhost:3306/my_test1?useSSL=false&serverTimezone=GMT%2B8&characterEncoding=UTF-8
spring.datasource.slave.username=root
spring.datasource.slave.password=111111
```

###### 配置数据源

```java
@Configuration
@PropertySource("classpath:config/jdbc.properties")
@MapperScan(basePackages = "me.mason.demo.dynamicdatasource.mapper")
public class DynamicDataSourceConfig {
  @Bean(DataSourceConstants.DS_KEY_MASTER)
  @ConfigurationProperties(prefix = "spring.datasource.master")
  public DataSource masterDataSource() {
    return DataSourceBuilder.create().build();
  }

  @Bean(DataSourceConstants.DS_KEY_SLAVE)
  @ConfigurationProperties(prefix = "spring.datasource.slave")
  public DataSource slaveDataSource() {
    return DataSourceBuilder.create().build();
  }
}
```

###### 配置动态数据源

1. **添加动态数据源类**

   ```java
   public class DynamicDataSource extends AbstractRoutingDataSource {
     @Override
     protected Object determineCurrentLookupKey() {
       // 此处暂时返回固定 master 数据源, 后面按动态策略修改
       return DataSourceConstants.DS_KEY_MASTER;
     }
   }
   ```

2. **设置动态数据源为主数据源**

   ```java
   @Bean
   @Primary
   public DataSource dynamicDataSource() {
     Map<Object, Object> dataSourceMap = new HashMap<>(2);
     dataSourceMap.put(DataSourceConstants.DS_KEY_MASTER, masterDataSource());
     dataSourceMap.put(DataSourceConstants.DS_KEY_SLAVE, slaveDataSource());
     //设置动态数据源
     DynamicDataSource dynamicDataSource = new DynamicDataSource();
     dynamicDataSource.setTargetDataSources(dataSourceMap);
     dynamicDataSource.setDefaultTargetDataSource(masterDataSource());
   
     return dynamicDataSource;
   }
   ```

   **注意**，需要在 `DynamicDataSourceConfig` 中，排除 `DataSourceAutoConfiguration` 的自动配置，否则会出现`The dependencies of some of the beans in the application context form a cycle`的错误。

   ```java
   @EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class })
   ```

###### 动态数据源切换器

前面固定写了一个数据源路由策略，总是返回 master，显然不是我们想要的。我们想要的是在需要的地方，想切换就切换。因此，需要有一个动态获取数据源 key 的地方（我们称为上下文），对于 web 应用，访问以线程为单位，使用 ThreadLocal 就比较合适，如下：

```java
public class DynamicDataSourceContextHolder {
  /**
* 动态数据源名称上下文
*/
  private static final ThreadLocal<String> DATASOURCE_CONTEXT_KEY_HOLDER = new ThreadLocal<>();
  /**
* 设置/切换数据源
*/
  public static void setContextKey(String key){
    DATASOURCE_CONTEXT_KEY_HOLDER.set(key);
  }
  /**
* 获取数据源名称
*/
  public static String getContextKey(){
    String key = DATASOURCE_CONTEXT_KEY_HOLDER.get();
    return key == null?DataSourceConstants.DS_KEY_MASTER:key;
  }

  /**
* 删除当前数据源名称
*/
  public static void removeContextKey(){
    DATASOURCE_CONTEXT_KEY_HOLDER.remove();
  }
}
```

**设置动态数据源 `DynamicDataSource` 路由策略**

修改前面 `DynamicDataSource` 的 `determineCurrentLookupKey` 方法如下：

```java
@Override
protected Object determineCurrentLookupKey() {
  return DynamicDataSourceContextHolder.getContextKey();
}
```

###### 直接使用切换器切换数据源

```java
@GetMapping("/listall")
public Object listAll() {
  int initSize = 2;
  Map<String, Object> result = new HashMap<>(initSize);
  //默认master查询
  QueryWrapper<TestUser> queryWrapper = new QueryWrapper<>();
  List<TestUser> resultData = testUserMapper.selectAll(queryWrapper.isNotNull("name"));
  result.put(DataSourceConstants.DS_KEY_MASTER, resultData);

  //切换数据源，在slave查询
  DynamicDataSourceContextHolder.setContextKey(DataSourceConstants.DS_KEY_SLAVE);
  List<TestUser> resultDataSlave = testUserMapper.selectList(null);
  result.put(DataSourceConstants.DS_KEY_SLAVE, resultDataSlave);
  //恢复数据源
  DynamicDataSourceContextHolder.removeContextKey();
  //返回数据
  return ResponseResult.success(result);
}
```

###### 使用自定义注解切换数据源

**自定义注解 `DS`**

```java
@Target({ElementType.METHOD,ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface DS {
/**
* 数据源名称
*/
String value() default DataSourceConstants.DS_KEY_MASTER;
}
```

**定义切面**

```java
@Aspect
@Component
public class DynamicDataSourceAspect {
  @Pointcut("@annotation(me.mason.demo.dynamicdatasource.annotation.DS)")
  public void dataSourcePointCut(){

  }

  @Around("dataSourcePointCut()")
  public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
    String dsKey = getDSAnnotation(joinPoint).value();
    DynamicDataSourceContextHolder.setContextKey(dsKey);
    try{
      return joinPoint.proceed();
    }finally {
      DynamicDataSourceContextHolder.removeContextKey();
    }
  }

  /**
     * 根据类或方法获取数据源注解
     */
  private DS getDSAnnotation(ProceedingJoinPoint joinPoint){
    Class<?> targetClass = joinPoint.getTarget().getClass();
    DS dsAnnotation = targetClass.getAnnotation(DS.class);
    // 先判断类的注解，再判断方法注解
    if(Objects.nonNull(dsAnnotation)){
      return dsAnnotation;
    }else{
      MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();
      return methodSignature.getMethod().getAnnotation(DS.class);
    }
  }
}
```

**在方法/类上使用自定义注解**

```java
/**
 * 查询master库User
 */
@DS(DataSourceConstants.DS_KEY_MASTER)
public List<TestUser> getMasterUser(){
  QueryWrapper<TestUser> queryWrapper = new QueryWrapper<>();
  return testUserMapper.selectAll(queryWrapper.isNotNull("name"));
}

/**
 * 查询slave库User
 */
@DS(DataSourceConstants.DS_KEY_SLAVE)
public List<TestUser> getSlaveUser(){ return testUserMapper.selectList(null); }
```

###### 缺点

对于动态数据源，还有哪些地方需要考虑或者说值得改进的地方呢？

- 事务如何处理？其实在开发中应该尽量避免跨库事务，但如果避免不了，则需要使用分布式事务。
- 对于当前的动态数据源，相对来说还是固定的数据源（如一主一从，一主多从等），即在编码时已经确定的数据库数量，只是在具体使用哪一个时进行动态处理。如果数据源本身并不确定，或者说需要根据用户输入来连接数据库，这时，如何处理呢？这种情况出现得比较多的是在对多个数据库进行管理时的处理。这种情况，我将在下一篇文章中进行讲解，我把它叫做"参数化变更数据源"。

#### #{}和${}的区别是什么？

`#{value}` 会将value添加上双引号，而 `${}` 则是原封不动的插入 sql，会导致 sql 注入问题。

#### Xml 映射文件中，除了常见的 select|insert|updae|delete 标签之外，还有哪些标签？

`<resultMap>`、`<parameterMap>`、`<sql>`、`<include>`、`<selectKey>`，加上动态 sql 的 9 个标签，`trim|where|set|foreach|if|choose|when|otherwise|bind`等，其中为 sql 片段标签，通过`<include>`标签引入 sql 片段，`<selectKey>`为不支持自增的主键生成策略标签。

#### MyBatis 是否支持延迟加载？如果支持，它的实现原理是什么？

MyBatis 仅支持 association 关联对象和 collection 关联集合对象的延迟加载，association 指的就是一对一，collection 指的就是一对多查询。在 MyBatis 配置文件中，可以配置是否启用延迟加载 `lazyLoadingEnabled=true|false。`

它的原理是，使用` CGLIB` 创建目标对象的代理对象，当调用目标方法时，进入拦截器方法，比如调用 `a.getB().getName()`，拦截器 `invoke()`方法发现 `a.getB()`是 null 值，那么就会单独发送事先保存好的查询关联 B 对象的 sql，把 B 查询上来，然后调用 a.setB(b)，于是 a 的对象 b 属性就有值了，接着完成 `a.getB().getName()`方法的调用。这就是延迟加载的基本原理。

#### 为什么说 MyBatis 是半自动 ORM 映射工具？它与全自动的区别在哪里？

Hibernate 属于全自动 ORM 映射工具，使用 Hibernate 查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。而 MyBatis 在查询关联对象或关联集合对象时，需要手动编写 sql 来完成，所以，称之为半自动 ORM 映射工具。

### Spring Cloud

#### 什么是 Spring Cloud

> Spring Cloud provides tools for developers to quickly build some of the common patterns in distributed systems.
>
> Spring Cloud 为开发人员提供了在分布式系统中快速构建一些常见模式的工具。

Spring Cloud 就是微服务系统架构的一站式解决方案，在构建微服务的过程中需要做注册中心 、配置中心 、服务网关 、数据监控等等，而 Spring Cloud 为我们提供了一套简易的编程模型，使我们能在 Spring Boot 的基础上轻松地实现微服务项目的构建。

#### 重要组件

- `Eureka` 服务发现框架
- `Ribbon` 进程内负载均衡器
- `Open Feign` 服务调用映射
- `Hystrix` 服务降级熔断器
- `Zuul` 微服务网关
- `Config` 微服务统一配置中心
- `Bus` 消息总线

#### 服务注册管理中心 Eureka

Eureka 就是一个服务发现框架。主要提供服务注册和服务发现两大功能。

其实就是服务提供者和服务消费者之间的“桥梁/中介”，服务提供者可以把自己注册到服务中介那里，而服务消费者如需要消费一些服务就可以在服务中介中寻找注册在服务中介的服务提供者。

##### 服务注册

当 `Eureka` 客户端向 `Eureka Server` 注册时，它提供自身的**元数据**，比如IP地址、端口，运行状况指示符URL，主页等。

##### 心跳连接

Eureka 客户端默认情况下会每隔30秒发送一次心跳连接。用来告知 Eureka Server 该 Eureka 客户仍然存活，没有出现问题。 

正常情况下，如果 Eureka Server 在90秒没有收到 Eureka 客户的续约，它会将实例从其注册表中删除。

##### 服务发现

Eureka 客户端从服务器获取注册表信息，并将其缓存在本地。客户端会使用该信息查找其他服务，从而进行远程调用。该注册列表信息定期（每30秒钟）更新一次。

##### 服务下线

Eureka 客户端在程序关闭时向Eureka服务器发送取消请求。发送请求后，该客户端实例信息将从服务器的实例注册表中删除。

该下线请求不会自动完成，它需要调用以下内容：`DiscoveryManager.getInstance().shutdownComponent();`

##### 自我保护机制

如果在15分钟内超过85%的节点都没有正常的心跳，那么Eureka就认为客户端与注册中心出现了网络故障，此时：

1. Eureka不再从注册列表中移除因为长时间没收到心跳而应该过期的服务
2. Eureka仍然能够接受新服务的注册和查询请求，但是不会被同步到其它节点上(即保证当前节点依然可用)
3. 当网络稳定时，当前实例新的注册信息会被同步到其它节点中

##### 与 zookeeper 的区别

CAP 理论指出，一个分布式系统不可能同时满足C(一致性)、A(可用性)和P(分区容错性)。由于分区容错性在是分布式系统中必须要保证的，因此我们只能在A和C之间进行权衡。在此Zookeeper保证的是CP, 而Eureka则是AP。

>  CAP:
>
> - Consistency（一致性）
> - Availability（可用性）
> - Partition tolerance（分区容错性）
>
> BASE：
>
> - Basically Available（基本可用）
> - Soft state（软状态）
> - Eventually consistent（最终一致性）

###### Zookeeper保证CP

zk 会出现这样的情况，当master节点因为网络故障与其他节点失去联系时，剩余节点会重新进行leader选举。

选举leader的时间太长，30 ~ 120s, 且选举期间整个zk集群都是不可用的，这就导致在选举期间注册服务瘫痪。

###### Eureka保证AP

Eureka各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。

而Eureka的客户端在向某个Eureka注册或时如果发现连接失败，则会自动切换至其它节点，只要有一台Eureka还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的(不保证强一致性)。

除此之外，Eureka还有一种自我保护机制。

因此， Eureka可以很好的应对因网络故障导致部分节点失去联系的情况，而不会像zookeeper那样使整个注册服务瘫痪。

#### 负载均衡器 Ribbon

> **`RestTemplate`是`Spring`提供的一个访问Http服务的客户端类**，微服务之间的调用是使用的 `RestTemplate` 。

`Ribbon` 是一个客户端内的负载均衡器，**运行在消费者端**。

###### 负载均衡算法

- **`RoundRobinRule`**：轮询策略。`Ribbon` 默认采用的策略。若经过一轮轮询没有找到可用的 `provider`，其最多轮询 10 轮。若最终还没有找到，则返回 `null`。
- **`RandomRule`**: 随机策略，从所有可用的 `provider` 中随机选择一个。
- **`RetryRule`**: 重试策略。先按照 `RoundRobinRule` 策略获取 `provider`，若获取失败，则在指定的时限内重试。默认的时限为 500 毫秒。

###### Nginx 和 Ribbon 的对比

提到 **负载均衡** 就不得不提到大名鼎鼎的 `Nignx` 了，而和 `Ribbon` 不同的是，Nginx 是一种**集中式**的负载均衡器。

何为集中式呢？简单理解就是 **将所有请求都集中起来，然后再进行负载均衡**。

在 `Nginx` 中请求是先进入负载均衡器，而在 `Ribbon` 中是先在客户端进行负载均衡才进行请求的。

#### 服务调用 OpenFeign

> `OpenFeign` 运行在消费者端，使用 `Ribbon` 进行负载均衡，所以 `OpenFeign` 直接内置了 `Ribbon`。

Spring Cloud OpenFeign 是基于Ribbon和Hystrix的**声明式**服务调用组件，可以动态创建基于Spring MVC注解的接口实现用于服务调用，在Spring Cloud 2.0中已经取代Feign成为了一等公民。

#### Hystrix

`Hystrix` 就是一个能进行 **熔断** 和 **降级** 的库，通过使用它能提高整个系统的弹性。

##### 服务熔断

**熔断** 是指的 `Hystrix` 中的 **断路器模式** ，你可以使用简单的 `@HystrixCommand` 注解来标注某个服务调用接口，这样 `Hystrix` 就会使用 **断路器** 来“包装”这个方法，每当调用时间超过指定时间时(默认为1000ms)，断路器将会中断对这个方法的调用。

```java
@HystrixCommand(
  commandProperties = {@HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",value = "1200")}
)
public List<Xxx> getXxxx() {
  // ...省略代码逻辑
}
```

##### 服务降级

**降级是为了更好的用户体验，当一个服务调用异常时，通过执行另一种代码逻辑来给用户友好的回复**。这也就对应着 `Hystrix` 的 **后备处理** 模式。你可以通过设置 `fallbackMethod` 来给一个方法设置备用的代码逻辑。

比如有一个热点新闻，大量用户同时访问可能会导致系统崩溃，那么我们就进行 **服务降级** ，一些请求会做一些降级处理比如当前人数太多请稍后查看等等。

```java
// 指定了后备方法调用
@HystrixCommand(fallbackMethod = "getHystrixNews")
@GetMapping("/get/news")
public News getNews(@PathVariable("id") int id) {
  // 调用新闻系统的获取新闻api 代码逻辑省略
}
// 
public News getHystrixNews(@PathVariable("id") int id) {
  // 做服务降级
  // 返回当前人数太多，请稍后查看
}
```

#### 服务网关 Zuul

网关是系统唯一对外的入口，介于客户端与服务器端之间，用于对请求进行**鉴权**、**限流**、 **路由**、**监控**等功能。

`Zuul` 中最关键的就是 **路由和过滤器**

`Zuul` 需要向 `Eureka` 进行注册，然后在启动类上加入 `@EnableZuulProxy` 注解。

##### 路由

###### 统一前缀

```yaml
zuul:
  prefix: /zuul
```

###### 服务别名

```yaml
zuul:
  routes:
    consumer1: /FrancisQ1/**
    consumer2: /FrancisQ2/**
```

###### 服务名屏蔽

在配置完路由策略之后使用微服务名称还是可以访问的，这个时候需要将服务名屏蔽。

```yaml
zuul:
  ignore-services: "*"
```

###### 路径屏蔽

`Zuul` 还可以指定屏蔽掉的路径 URI，即只要用户请求中包含指定的 URI 路径，那么该请求将无法访问到指定的服务。通过该方式可以限制用户的权限。

```yaml
zuul:
  ignore-patterns: **/auto/**
```

###### 敏感请求头屏蔽

默认情况下，像 `Cookie`、`Set-Cookie` 等敏感请求头信息会被 `zuul` 屏蔽掉，我们可以将这些默认屏蔽去掉，当然，也可以添加要屏蔽的请求头。

##### 过滤

如果说路由功能是 `Zuul` 的基操的话，那么**过滤器**就是 `Zuul`的利器了。可以进行各种过滤，这样我们就能实现 **限流**，**灰度发布**，**权限控制** 等等。

要实现自己的 `Filter` 只需要继承 `ZuulFilter` 然后将这个过滤器类以 `@Component` 注解加入 Spring 容器中就行了。

###### 令牌桶限流

首先会有个令牌桶，如果里面没有满那么就会以一定 **固定的速率** 会往里面放令牌，一个请求过来首先要从桶中获取令牌，如果没有获取到，那么就拒绝，如果获取到那么就放行。

#### 配置中心 Config

##### 什么是 Spring Cloud Config

> `Spring Cloud Config` 为分布式系统中的外部化配置提供服务器和客户端支持。使用 `Config` 服务器，可以在中心位置管理所有环境中应用程序的外部属性。

`Spring Cloud Config` 就是能将各个 服务/应用/系统/模块 的配置文件存放到 **统一的地方(e.g. Git)然后进行管理**。

应用只有启动的时候才会进行配置文件的加载，那么我们的 `Spring Cloud Config` 就暴露出一个接口给启动应用来获取它所想要的配置文件，应用获取到配置文件然后再进行它的初始化工作。

如果应用运行时去更改远程配置仓库(Git)中的对应配置文件，那么依赖于这个配置文件的已启动的应用会不会进行其相应配置的更改呢？答案是不会的。

可以使用 `Webhooks` ，这是 `github` 提供的功能，它能确保远程库的配置文件更新后客户端中的配置信息也得到更新。

但是生产环境不会使用。一般会使用 `Bus` 消息总线 + `Spring Cloud Config` 进行配置的动态刷新。

#### 消息总线 Bus

> 用于将服务和服务实例与分布式消息系统链接在一起的事件总线。

`Spring Cloud Bus` 的作用就是**管理和广播分布式系统中的消息**，也就是消息引擎系统中的广播模式。

### Spring Cloud 与 Spring Cloud Alibaba 的区别

我们平常说的 Spring Cloud 其实是指 Spring Cloud 其中的一种实现方式，即 Spring Cloud Netflix，而 Spring Cloud Alibaba 则是另一套实现方式。

![](https://segmentfault.com/img/remote/1460000021497456)

