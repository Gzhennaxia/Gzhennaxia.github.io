---
title: Preparing for job interviews
description: 面试准备资料
date: 2019-03-06 16:55:09
top: true
---

<img src="https://www.insperity.com/wp-content/uploads/stay_interview_questions_640x302.jpg" width="100%"/>

<!-- more -->

## 数据类型

### Object

#### equals 方法和 hashcode 方法

Object 中的 hashcode 是根据对象的内存地址生成的，equals 使用 ‘==’ 直接比较对象的地址。

改写 equals 时总是要改写 hashcode，使得 equals 结果为 true 时，hashcode 结果也为 true，hashcode 结果为 false，equals 结果也为 false（即 hashcode 是 equals 的必要不充分条件）。因为在集合类（HashMap，HashSet 等）中的比较操作为了提高效率，一般都是先比较 hashcode 值，再比较 equals。可以利用 IDEA 快速生成 equals 和 hashcode 方法。

### Class







- 获取Class对象引用的方式有3种，Object类的getClass方法，Class类的静态方法forName以及字面常量的方式”.class”
- 实例类的getClass方法和Class类的静态方法forName都会触发类的初始化阶段，而字面常量获取Class对象的方式则不会触发初始化。
- 向Class引用添加泛型约束仅仅是为了提供编译期类型的检查从而避免将错误延续到运行时期。
- 在Java中，所有类型转换都是在运行时进行正确性检查的
- 一个类在 JVM 中只会有一个 Class 实例



### HashMap

#### 实现原理

基于哈希表这种数据结构实现的。哈希冲突（哈希碰撞）的解决方案有多种：开放定址法（发生冲突，继续寻找下一块未被占用的存储地址），再散列函数法，链地址法，HashMap采用了链地址法，也就是**数组+链表**的方式。

JDK 1.8对HashMap进行了比较大的优化，底层实现由之前的“数组+链表”改为**“数组+链表+红黑树”**，当链表节点较少时仍然是以链表存在，当链表节点较多时（大于8）会转为红黑树。

#### 源码分析

> [Java7/8 中的 HashMap 和 ConcurrentHashMap 全解析](http://www.importnew.com/28263.html)
>
> [Java集合：HashMap详解（JDK 1.8）](https://blog.csdn.net/v123411739/article/details/78996181)

- HashMap的主干是一个Entry（1.8是Node，不过，Node 只能用于链表的情况，红黑树的情况需要使用 TreeNode）数组。Entry是HashMap的基本组成单元，每一个Entry包含一个key-value键值对。

- HashMap有4个构造器，**在常规构造器中，没有为数组table分配内存空间（入参为指定Map的构造器例外），而是在执行put操作的时候才真正构建table数组**。

- JDK 1.8 中 key 的 hash 值取的是`(h = key.hashCode()) ^ (h >>> 16)`，就是把高16bit和低16bit异或了一下。因为当数组长度较小的时候，hash值参与运算只是低位的值，发生碰撞的可能性比较大。一般情况下，key的分布符合“局部性原理”，低比特位相同的概率大于高低位异或后仍然相同的概率，从而降低了碰撞的概率。[【1】](http://www.importnew.com/27043.html)

- 计算具体数组位置，使用 key 的 hash 值对数组长度进行取模就可以了。`hash & (length-1);`这个方法很简单，简单说就是取 hash 值的低 n 位。如在数组长度为 32 的时候，其实取的就是 key 的 hash 值的低 5 位，作为它在数组中的下标位置。如果key为null的话，hash值为0。

  **当 b = 2^n 时，a % b = a & (b - 1)** 例如 a = 18, b = 16 时：

  ```
  		1  0  0  1  0
      &   0  1  1  1  1
      __________________
          0  0  0  1  0    = 2
  ```

- 扩容就是用一个新的大数组替换原来的小数组，并将原来数组中的值迁移到新的数组中。

  由于是双倍扩容，迁移过程中，会将原来 table[i] 中的链表的所有节点，分拆到新的数组的 newTable[i] 和 newTable[i + oldLength] 位置上。如原来数组长度是 16，那么扩容后，原来 table[0] 处的链表中的所有元素会被分到新数组中 newTable[0] 和 newTable[16] 这两个位置。

  通过`Integer.highestOneBit((number - 1) << 1)`可以确保capacity为大于或等于 number 的最接近number 的二次幂。Integer.highestOneBit是用来获取最左边的bit（其他bit位为0）所代表的数值。

  Java7 是先扩容后插入新值的，Java8 先插值再扩容。

- HashMap的容量一定保持2的次幂的原因

  1. 减少扩容后数据位置的重新hash

     在移动元素的时候，不需要重新定位，只需要看原来的hash值新增的那个bit是1还是0就好了，是0的话位置没变，是1的话位置变成“原位置+oldCap”。[【2】](http://www.importnew.com/27043.html)

  2. 使用位运算代替取模运算，即保证了散列的均匀，同时也提升了效率

- 相对于 put 过程，get 过程是非常简单的。

  1. 根据 key 计算 hash 值。
  2. 找到相应的数组下标：hash & (length – 1)。
  3. 遍历该数组位置处的链表，直到找到相等(==或equals)的 key。

- 判断元素相等的设计比较经典，利用了bool表达式的短路特性：先比较hash值；如果hash值相等，就通过==比较；如果==不等，再通过equals方法比较。hash是提前计算好的；如果没有重载运算符（通常也不建议这样做），==一般直接比较引用值；equals方法最有可能耗费性能，如String的equals方法需要O(n)的时间，n是字符串长度。一定要记住这里的判断顺序，很能考察对碰撞处理源码的理解。

- put 流程：

  ![](https://img-blog.csdn.net/20180108094243335?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29nYTYxMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



1. HashMap 的 key 为什么一般用字符串比较多，能用其他对象，或者自定义的对象吗？为什么？

    在使用 String 类型的对象做 key 时我们可以只根据传入的字符串内容就能获得对应存在 map 中的 value 值。

    如果你想把自定义的对象作为 key，只需要重写 hashCode() 方法与 equals() 方法即可。

2. HashMap和Hashtable的区别

    > [HashMap和HashTable的理解与区别](https://blog.csdn.net/yu849893679/article/details/81530298)

    1. 父类不同

       HashMap是继承自AbstractMap类，而HashTable是继承自Dictionary（已被废弃，详情看源代码）。不过它们都同时实现了map、Cloneable、Serializable这三个接口。
       Hashtable比HashMap多提供了elments() 和contains() 两个方法。elments() 方法继承自Hashtable的父类Dictionnary，用于返回此Hashtable中value的枚举。contains()方法判断该Hashtable是否包含传入的value。它的作用与containsValue()一致。事实上，contansValue() 就只是调用了一下contains() 方法。HashMap去掉了contains方法，改成containsValue和containsKey了。

    2. null值问题

       Hashtable既不支持Null key也不支持Null value。Hashtable的put()方法的注释中有说明 。HashMap中，null可以作为键，这样的键只有一个；可以有一个或多个键所对应的值为null。当get()方法返回null值时，可能是 HashMap中没有该键，也可能使该键所对应的值为null。因此，在HashMap中不能由get()方法来判断HashMap中是否存在某个键， 而应该用containsKey()方法来判断。

    3. 线程安全性

       Hashtable是线程安全的，它的每个方法中都加入了Synchronize方法。在多线程并发的环境下，可以直接使用Hashtable，不需要自己为它的方法实现同步

       HashMap不是线程安全的，可以通过 `Map map = Collections.synchronizedMap(new HashMap())`来达到同步的效果。

       虽然HashMap不是线程安全的，但是它的效率会比Hashtable要好很多。这样设计是合理的。在我们的日常使用当中，大部分时间是单线程操作的。HashMap把这部分操作解放出来了。当需要多线程操作的时候可以使用线程安全的ConcurrentHashMap。ConcurrentHashMap虽然也是线程安全的，但是它的效率比Hashtable要高好多倍。因为ConcurrentHashMap使用了分段锁，并不对整个数据进行锁定。

    4. 遍历方式不同

       Hashtable、HashMap都使用了Iterator。而由于历史原因，Hashtable还使用了Enumeration的方式 。

       HashMap的Iterator是fail-fast迭代器。当有其它线程改变了HashMap的结构（增加，删除），将会抛出ConcurrentModificationException。不过，通过Iterator的remove()方法移除元素则不会抛出ConcurrentModificationException异常。但这并不是一个一定发生的行为，要看JVM。

       JDK8之前的版本中，Hashtable是没有fast-fail机制的。在JDK8及以后的版本中 ，Hashtable也是使用fast-fail的。（此处可以去看一下1.5和1.8JDK源码的对比）

    5. 初始容量不同

       Hashtable的初始长度是11，之后每次扩充容量变为之前的2n+1（n为上一次的长度），而HashMap的初始长度为16，之后每次扩充变为原来的两倍。

       创建时，如果给定了容量初始值，那么Hashtable会直接使用你给定的大小，而HashMap会将其扩充为2的幂次方大小。

    6. 计算哈希值的方法不同

       Hashtable直接使用对象的hashCode。hashCode是JDK根据对象的地址或者字符串或者数字算出来的int类型的数值。然后再使用除留余数发来获得最终的位置。 然而除法运算是非常耗费时间的。效率很低

       HashMap为了提高计算效率，将哈希表的大小固定为了2的幂，这样在取模预算时，不需要做除法，只需要做位运算。位运算比除法的效率要高很多。

3. ConcurrentHashMap和Hashtable的区别

    ConcurrentHashMap和CopyOnWriteArrayList保留了线程安全的同时，也提供了更高的并发性。

    当Hashtable的大小增加到一定的时候，性能会急剧下降，因为迭代时需要被锁定很长的时间。而ConcurrentHashMap引入了分割(segmentation)，不论它变得多么大，仅仅需要锁定map的某个部分，而其它的线程不需要等到迭代完成才能访问map。简而言之，在迭代的过程中，ConcurrentHashMap仅仅锁定map的某个部分，而Hashtable则会锁定整个map。

    简单理解，ConcurrentHashMap 是一个 Segment 数组，Segment 通过继承 ReentrantLock 来进行加锁，所以每次需要加锁的操作锁住的是一个 segment，这样只要保证每个 Segment 是线程安全的，也就实现了全局的线程安全。

    ![](https://javadoop.com/blogimages/map/3.png)

    ![](https://javadoop.com/blogimages/map/4.png)

- Hashtable 在 Java 诞生之初时就有了，HashMap 是 JDk1.2 之后有的，而在 JDK1.5 才有ConcurrentHashMap
- HashMap不能保证随着时间的推移Map中的元素次序是不变的

### int 和 Integer 的区别

> [java面试题之int和Integer的区别](https://www.cnblogs.com/guodongdidi/p/6953217.html)

- Integer是int的包装类，int则是java的一种基本数据类型 

- Integer变量必须实例化后才能使用，而int变量不需要 

- Integer实际是对象的引用，当new一个Integer时，实际上是生成一个指针指向此对象；而int则是直接存储数据值 

- Integer 的默认值是 null，int 的默认值是 0

- 由于Integer变量实际上是对一个Integer对象的引用，所以两个通过new生成的Integer变量永远是不相等的（因为new生成的是两个对象，其内存地址不同）。

- Integer变量和int变量比较时，只要两个变量的值是向等的，则结果为true（因为包装类Integer和基本数据类型int比较时，java会自动拆包装为int，然后进行比较，实际上就变为两个int变量的比较）

- 非new生成的Integer变量和new Integer()生成的变量比较时，结果为false。（因为非new生成的Integer变量指向的是java常量池中的对象，而new Integer()生成的变量指向堆中新建的对象，两者在内存中的地址不同）

  ```java
  Integer i = new Integer(100);
  Integer j = 100;
  System.out.print(i == j); //false
  ```

- 对于两个非new生成的Integer对象，进行比较时，如果两个变量的值在区间-128到127之间，则比较结果为true，如果两个变量的值不在此区间，则比较结果为false

  ```
  Integer i = 100;
  Integer j = 100;
  System.out.print(i == j); //true
  Integer i = 128;
  Integer j = 128;
  System.out.print(i == j); //false
  ```

  对于第4条的原因： 
  **java在编译Integer i = 100 ;时，会翻译成为Integer i = Integer.valueOf(100)；这就是自动装箱**，而java API中对Integer类型的valueOf的定义如下：

  ```
  public static Integer valueOf(int i){
      assert IntegerCache.high >= 127;
      if (i >= IntegerCache.low && i <= IntegerCache.high){
          return IntegerCache.cache[i + (-IntegerCache.low)];
      }
      return new Integer(i);
  }
  ```

  **java对于-128到127之间的数，会进行缓存，Integer i = 127时，会将127进行缓存，下次再写Integer j = 127时，就会直接从缓存中取，就不会new了**，简要的说就是在Integer类中有一个静态内部类IntegerCache，在IntegerCache类中有一个Integer数组，用以缓存当数值范围为-128~127时的Integer对象。

- 简单来讲：自动装箱就是`Integer.valueOf(int i);`自动拆箱就是` i.intValue();`

- 在java中包装类，比较多的用途是用在于各种数据类型的转化中。

### byte

两个byte类型相加，结果是int，也就是需要使用int接收。

## 泛型

> [Java泛型详解](http://www.importnew.com/24029.html)

### 定义

泛型是Java SE 1.5的新特性，**泛型的本质**是**参数化类型**，也就是说所操作的数据类型被指定为一个参数。这种参数类型可以用在类、接口和方法的创建中，分别称为泛型类、泛型接口、泛型方法。

### 语法

1. 泛型的类型参数只能是类类型（包括自定义类），不能是简单类型

2. 泛型的类型参数可以有多个

3. 不能创建一个确切的泛型类型的数组，但可以创建通配符类型的泛型数组

   编译错误：`List<String>[] list = new List<String>[10];`

   编译通过：`List<?>[] list = new List<?>[10];`

4. 不能利用类型参数直接创建实例（`E = new E();`）

5. 不能对确切的泛型类型使用`instanceof`关键字

   编译错误：`list instanceof ArrayList<Integer>`

   编译通过：`list instanceof ArrayList<?>`

6. 静态方法无法访问类上定义的泛型，所以静态方法要使用泛型的话，必须定义成泛型方法。

7. 多接口限制：`<T extends SomeClass & interface1 & interface2 & interface3>`

### 类型擦除

Java泛型只能用于在**编译期间的静态类型检查**，编译器生成的代码会擦除相应的类型信息，到了运行期间实际上JVM知道泛型所代表的具体类型。这样做的原因是因为Java泛型是1.5之后才被引入的，为了保持向下的兼容性，所以只能做类型擦除来兼容以前的非泛型代码。



对于泛型代码，Java编译器实际上还会帮我们实现一个Bridge method。



- 一条规律，”Producer Extends, Consumer Super”：
  - “Producer Extends” – 如果你需要一个只读List，用它来produce T，那么使用`? extends T`。
  - “Consumer Super” – 如果你需要一个只写List，用它来consume T，那么使用`? super T`。
  - 如果需要同时读取以及写入，那么我们就不能使用通配符了。

- 方法上是否定义泛型和类上是否定义没有必然的联系

- 在Java集合类框架中泛型被广泛应用

## 反射

### 什么是反射

JAVA反射机制是在运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为java语言的反射机制。

Java反射机制的实现要借助于4个类：Class，Constructor，Field，Method。

反射就是把java类中的各种成分映射成一个个的Java对象。

反射：程序在运行状态中，可以动态加载一个只有名称的类，加载完类之后，在堆内存中，就产生了一个 Class 类型的对象，这个对象就包含了这个类完整的结构信息，通过这个对象我们可以看到类的结构。这个对象就像一面镜子，所以我们形象的称之为——反射

### 反射能做什么？

代码可以在运行时装配，无需在组件之间进行源代码链接，降低代码的耦合度；还有动态代理的实现等等，JDBC原生代码注册驱动，hibernate 的实体类，Spring 的 AOP 等等都有反射的实现。通过反射运行配置文件内容，通过反射越过泛型检查。



- RTTI（Run-Time Type Identification 运行时类型识别）和反射之间的区别在于，RTTI 编译器在编译时打开和检查.class文件，反射在运行时打开和检查.class文件
- 获取 Class 类对象有三种方法，使用 Class.forName 静态方法、使用 .class 方法、使用类对象的 getClass() 方法。
- 通过反射创建类对象主要有两种方式：通过 Class 对象的 newInstance() 方法、通过 Constructor 对象的 newInstance() 方法。
- Method 类的 invoke 方法内部有两种实现方式，一种是 native 原生的实现方式，一种是 Java 实现方式Native 版本一开始启动快，但是随着运行时间变长，速度变慢。Java 版本一开始加载慢，但是随着运行时间变长，速度变快。正是因为两种存在这些问题，所以第一次加载的时候我们会发现使用的是NativeMethodAccessorImpl 的实现，而当反射调用次数超过 15 次之后，则使用 MethodAccessorGenerator 生成的 MethodAccessorImpl 对象去实现反射。

## 接口

### 接口设计规范

1. 字段类型统一使用 String 类型，参数和返回值都使用 String 类型。Boolean类型一律使用1/0来表示。

   使用此接口的用户，对方可能是Java，也可能是VB6，也可能是C#，不要使用某种编程语言的特定类型，比较好的一种方式是，参数和返回值都使用string类型，这样基本上的编程语言都能支持。

2. 响应数据统一格式：code、msg、data。

3. 接口路径中需要加入版本号信息（使用 v1、v2 依次递推）

4. 分页数据中必须包含：

   recordCount: 当前页记录数
   totalCount: 总记录数
   pageNo: 当前页码
   pageSize: 每页大小
   totalPage: 总页数

### 支付接口的设计

> [支付网关的设计](https://www.cnblogs.com/vianzhang/p/7603184.html)
>
> [聚合支付系统设计](https://blog.csdn.net/think2017/article/details/79820786)

聚合支付平台的核心，就是怎么合理的去管理接入的各种支付SDK，从官网下载的 SDK，不做任何逻辑修改，就直接放到项目的目录中使用，这样做虽然开发成本很低，但弊端颇多：

1. 首先要说的就是不易维护，各支付SDK代码结构、风格不一样，后期维护成本高；
2. 代码各自为政，没有统一的调用方法；
3. 配置分散，无法集中维护系统配置项；
4. 无法提供统一有效的日志数据等

因此，首先定义一个Interface，然后每次接入新的支付方式的过程，其实就是实现该Interface的过程。

通常情况下，一种支付方式有一个class来实现，但面对一种支付方式提供了多种支付场景，比如微信（提供了公众号支付、APP支付、扫码支付、H5支付、小程序支付、微信免密代扣等）、中国银联（提供了PC网关支付、WAP支付、APP支付、银联云闪付等），建议针对每种不同的支付场景，都有单独的class来实现，理由如下：

- 不同的支付场景，程序执行的流程也不一样，比如中国银联PC网关支付，是需要将支付报文通过客户端浏览器表单POST给银联支付网关，跳转至银联支付网页进行支付，而银联APP支付则是通过curl将支付报文提交给银联支付网关，再将其返回的tn码返回给商户APP，商户APP凭该tn码发起支付交易；
- 对订单系统的订单支付方式展示更加准确，分配给商户不同购物平台（PC端、H5端、APP）的支付方式id是唯一的。如果商户系统不同支付场景所申请的商户号不一样，则需要在推送至财务系统的支付方式也不能重复，否则无法对账；
- 支付类的代码逻辑只关注于自身的支付逻辑处理，不引入额外的判断流程。

那么这时候就有一个很头疼的问题，代码冗余。大部分第三方支付，虽然提供了不同支付场景，但基础接口都是一样的，只是部分参数不同，或支付流程上面的少许差别。这时候就要考虑好以第三方支付平台为单位来封装一个支付抽象类，实现对第三方支付平台的所有api对接，不涉及到商户系统的业务流程，比如微信支付，创建一个WechatDriver抽象类

有了支付抽象类，针对每一种支付方法，都可以继承该抽象类，并拥有自己的独立的支付流程，比如：微信app支付，可以创建一个 WechatAppDriver 支付子类，支付子类调用抽象类提供的各种底层api，来实现支付、查询、退款等功能。

支付Interface、支付抽象类、支付子类三种支付类，它们之间的关系如下：

![](https://img-blog.csdn.net/20180404181515932)

对上图做简要说明，PaymentHandlerInterface是所有支付类的接口，WechatPayment是所有微信支付类的基类，WechatAPPPayment、WechatJSAPIPayment、WechatNativePayment都是提供支付服务的支付类，都需要继承WechatPayment并实现PaymentHandlerInterface接口。同理，系统如果需要接入银联在线支付，那么就需要按照开发文档实现一个ChinaPayPayment做为银联在线支付的基类，然后分别开发出具体支付场景的支付类，比如ChinaPayAPPPayment(银联app支付)、ChinaPayWAPPayment(银联wap支付)、ChinaPayPCPayment(银联pc支付)，这三个支付类需要继承ChinaPayPayment并实现PaymentHandlerInterface接口。





## 数据库

### 数据库设计

#### 无限级数据库设计

> [mysql（多级分销）无限极数据库设计方法](https://www.phpbloger.com/index.php/article/50.html)
>
> [数据库表设计-邻接表、路径枚举、嵌套集、闭包表](http://www.php.cn/mysql-tutorials-369214.html)

##### 采用**邻接表**的设计方式

```sql
create table user(
    id int primary key auto_increment COMMENT '自增ID',
    parentid int COMMENT '父节点ID',
    username varchar(20) COMMENT '用户名',
    password varchar(20) COMMENT '密码'
    ……
);
```

- 查询一个节点的所有后代

  方式一：定义 SQL 函数递归查询

  > [MySQL递归查询树状表的子节点、父节点](https://www.cnblogs.com/franson-2016/p/6873233.html)

  ```sql
  CREATE FUNCTION `getChildList`(rootId INT)
  RETURNS VARCHAR(1000)
  BEGIN
    DECLARE idList VARCHAR(1000);
    DECLARE idTemp VARCHAR(1000);
    SET idTemp = CAST(rootId AS CHAR);
    WHILE idTemp IS NOT NULL DO
  	IF (idList IS NOT NULL) THEN
  	  SET idList = CONCAT(idList,',',idTemp);
  	ELSE
  	  SET idList = CONCAT(idTemp);
  	END IF;
  	SELECT GROUP_CONCAT(id) INTO idTemp FROM `user` WHERE FIND_IN_SET(parentid,idTemp)>0;
    END WHILE;
    RETURN idList;
  END;
  ```

  注意：

  > [mysql之使用find_in_set和group_concat组合递归函数时数据不全](https://blog.csdn.net/dream_broken/article/details/69554303)

  group_concat 是有长度限制的，超过限制时会导致数据不全。

  方式二：使用共用表表达式递归查询（8.0 的版本才支持 WITH）

  > [WITH语法（公用表表达式）](https://dev.mysql.com/doc/refman/8.0/en/with.html)

  ```sql
  WITH RECURSIVE cte(id, parentid, username, `level`) AS (
      SELECT id, parentid, username, 0 AS `level` FROM `user` WHERE parentid = 4
      UNION ALL
      SELECT u.id, u.parentid, u.username, ce.`level` + 1 FROM `user` AS u 
      INNER JOIN cte AS ce
      ON u.parentid = ce.id
  )SELECT * FROM cte；
  ```

- 查询一个节点的祖先节点

  方式一：定义 SQL 函数递归查询

  ```sql
  CREATE FUNCTION `getParentList`(rootId INT)
  	RETURNS varchar(1000)
  	BEGIN
  		DECLARE idList varchar(1000);
  		DECLARE idTemp varchar(1000);
  		SET idTemp = CAST(rootId as CHAR);
  		WHILE idTemp is not null DO
  			IF (idList is not null) THEN
  				SET idList = concat(idTemp,',',idList);
  			ELSE
  				SET idList = concat(idTemp);
  			END IF;
  			SELECT group_concat(parentid) INTO idTemp FROM user_role where FIND_IN_SET(id,idTemp)>0;
  		END WHILE;
  	  RETURN idList;
  	END;
  ```

  方式二：使用共用表表达式递归查询（8.0 的版本才支持 WITH）

  > [WITH语法（公用表表达式）](https://dev.mysql.com/doc/refman/8.0/en/with.html)

  ```sql
  WITH RECURSIVE RECURSIVE cte(id, parentid, username, `level`) AS (
      SELECT id, parentid, username, 0 AS `level` FROM `user` WHERE id = 6
      UNION ALL
      SELECT u.id, u.parentid, u.username, ce.`level` - 1  FROM `user` AS u 
      INNER JOIN COMMENT_CTE AS ce　　
  	ON ce.parentid = u.id where ce.id <> ce.parentid
  )SELECT * FROM cte;
  ```


##### 路径枚举

路径枚举是一个由连续的直接层级关系组成的完整路径。如"1/4/7",其中 1 是 4 的直接父亲，这也就意味着 1 是 7 的祖先。

```sql
create table user(
    id int primary key auto_increment COMMENT '自增ID',
    path int COMMENT '节点路径',
    username varchar(20) COMMENT '用户名',
    password varchar(20) COMMENT '密码'
    ……
);
```

- 查询一个节点的所有后代

  ```sql
  SELECT * FROM `user` AS u WHERE u.path LIKE '1/%';
  ```

- 查询一个节点的祖先节点

  ```sql
  SELECT * FROM `user` AS u WHERE '1/3/5/7/' LIKE u.path + '%';
  ```

**路径枚举的缺点:**

　　1、数据库不能确保路径的格式总是正确或者路径中的节点确实存在(中间节点被删除的情况，没外键约束)。

　　2、要依赖高级程序来维护路径中的字符串，并且验证字符串的正确性的开销很大。

　　3、VARCHAR的长度很难确定。无论VARCHAR的长度设为多大，都存在不能够无限扩展的情况。

**路径枚举的优点:**

​	1、 查询父子节点的 SQL 语句简单

​	2、 能够很方便地根据节点的层级排序，因为通过比较字符串长度就能知道层级的深浅

##### 嵌套集

嵌套集解决方案是存储子孙节点的信息，而不是节点的直接祖先。我们使用两个数字来编码每个节点，表示这个信息。可以将这两个数字称为nsleft和nsright。这些数字和 当前节点的主键ID 的值并没有任何关联。

nsleft值的确定：nsleft 的数值小于该节点所有后代的nsleft和nsright。

nsright值的确定：nsright 的值大于该节点所有后代的nsleft和nsright。

也就是当前节点的（nsleft，nsright）要包含其所有子孙节点的（nsleft，nsright）

确定值的方式是对树进行一次深度优先遍历，在逐层深入的过程中依次递增地分配nsleft的值，并在返回时依次递增地分配nsright的值。

- 查询一个节点的所有后代

  ```mysql
  SELECT u2.* FROM `user` AS u1 JOIN `user` AS u2 ON u2.neleft BETWEEN u1.nsleft AND u1.nsright WHERE u1.id = 1;
  ```

- 查询一个节点的祖先节点

  ```mysql
  SELECT u2.* FROM `user` AS u1 JOIN `user` AS u2 ON u1.nsleft BETWEEN u2.nsleft AND u2.nsright WHERE u1.id = 7;
  ```

**嵌套集的优点:**

​	1、 查询父子节点的 SQL 语句简单

​	2、 当删除一个节点造成数值不连续时，并不会对树的结构产生任何影响。

**嵌套集的缺点:**

　　1、插入操作比较麻烦

##### 闭包表

闭包表是解决分层存储一个简单而又优雅的解决方案，它记录了表中所有的节点关系，并不仅仅是直接的父子关系。在闭包表的设计中，额外创建了一张tree_paths的表(空间换取时间)，它包含祖先，后代两列。

可以优化闭包表来使它更方便地查询直接父亲节点或者子节点： 在 tree_paths 表中添加一个 path_length 字段。一个节点的自我引用的path_length 为0，到它直接子节点的path_length 为1，再下一层为2，以此类推。

```mysql
create table tree_paths (
	ancestor    int COMMENT '祖先ID',
　　descendant int COMMENT '后代ID',
	path_length int COMMENT '代际层数'
    ……
);
```

- 查询一个节点的所有后代

  ```mysql
  SELECT u.* FROM `user` AS u INNER JOIN tree_paths t on c.id = t.descendant WHERE t.ancestor = 4;
  ```

- 查询一个节点的祖先节点

  ```mysql
  SELECT u.* FROM `user` AS u INNER JOIN tree_paths t on c.id = t.ancestor WHERE t.descendant = 4;
  ```

- 插入新节点

  要插入一个新的叶子节点，比如 6 的一个子节点，应首先插入一条自己到自己的关系，然后搜索 tree_paths 表中后代是 6 的节点，增加这些节点和新插入节点的“祖先一后代”关系（假设新节点 ID 为8）。

  ```mysql
  INSERT INTO tree_paths (ancestor, descendant) SELECT t.ancestor, 8 FROM tree_paths AS t WHERE t.descendant = 6 UNION ALL SELECT 8, 8;
  ```

  要删除一颗完整的子树，比如 4 和它所有的后代，可删除所有在 tree_paths 表中后代为 4 的行，以及那些以4 的后代为后代的行。

##### 总结

| 设计     | 表数量 | 查询子 | 查询树 | 插入 | 删除 | 引用完整性 |
| -------- | ------ | ------ | ------ | ---- | ---- | ---------- |
| 邻接表   | 1      | 简单   | 简单   | 简单 | 简单 | 是         |
| 枚举路径 | 1      | 简单   | 简单   | 简单 | 简单 | 否         |
| 嵌套集   | 1      | 困难   | 简单   | 困难 | 困难 | 否         |
| 闭包表   | 2      | 简单   | 简单   | 简单 | 简单 | 是         |

　　1、邻接表是最方便的设计，并且很多软件开发者都了解它。并且在递归查询的帮助下，使得邻接表的查询更加高效。

　　2、枚举路径能够很直观地展示出祖先到后代之间的路径，但由于不能确保引用完整性，使得这个设计比较脆弱。枚举路径也使得数据的存储变得冗余。

　　3、嵌套集是一个聪明的解决方案，但不能确保引用完整性，并且只能使用于查询性能要求较高，而其他要求一般的场合使用它。

　　4、闭包表是最通用的设计，并且最灵活，易扩展，并且一个节点能属于多棵树，能减少冗余的计算时间。但它要求一张额外的表来存储关系，是一个空间换取时间的方案。

### MySQL中派生表、临时表、公共表、子查询的区别

1. 公用表表达式CTE(Common Table Expression)是一个命名的临时结果集，仅在单个SQL语句(例如SELECT，INSERT，UPDATE或DELETE)的执行范围内存在。

   ```sql
   WITH customers_in_usa AS (
       SELECT 
           customerName, state
       FROM
           customers
       WHERE
           country = 'USA'
   ) SELECT 
       customerName
    FROM
       customers_in_usa
    WHERE
       state = 'CA';
   ```

2. 派生表是从SELECT语句返回的虚拟表。与子查询不同，派生表必须具有别名，以便稍后在查询中引用其名称。

   ```sql
   SELECT 
       customerName
   FROM
       (SELECT 
           customerName, state
       FROM
           user
   	WHERE country = 'USA') customers_in_usa
   WHERE state = 'CA';
   ```

3. 临时表是一种特殊类型的表，它允许您存储一个临时结果集，可以在单个会话中多次重用。

   ```sql
   CREATE TEMPORARY TABLE customers_in_usa
   SELECT 
   	customerName, state
   FROM
   	user
   WHERE country = 'USA';
   
   DROP TEMPORARY TABLE customers_in_usa;
   ```

4. 子查询是嵌套在另一个查询(如SELECT，INSERT，UPDATE或DELETE)中的查询。

   ```sql
   SELECT 
       customerName
   FROM
   	customers
   WHERE state = 'CA' AND id IN (
   SELECT 
   	id
   FROM
   	customers
   WHERE country = 'USA');
   ```


### 事务

1. 什么是事务

   **事务是**数据库中的**一个**单独的**执行单元**。是指作为单个逻辑工作单元执行的一系列操作，要么完全地执行，要么完全地不执行。

2. 事务的四大特性 ACID

   - **原子性（Atomicity）**

     原子性是指**事务是一个不可分割的工作单位**，事务中的操作要么都发生，要么都不发生。

   - **一致性（Consistency）**

     > [怎么理解数据库事务的一致性](https://blog.csdn.net/qq_37997523/article/details/83188003)

     事务执行前后，数据库系统保持一致性状态。即系统从一个一致的状态转换到另一个一致状态。

     一致性是指**数据处于一种语义上的有意义且正确的状态**。一致性是对数据**可见性**的约束，保证在一个事务中的多次操作的数据中间状态对其他事务是不可见的。

     原子性和一致性的的侧重点不同：**原子性关注状态**，要么全部成功，要么全部失败，不存在部分成功的状态。而一致性**关注数据的可见性**，中间状态的数据对外部不可见，只有最初状态和最终状态的数据对外可见。

     在未提交读的隔离级别下，会造成脏读，这就是因为一个事务读到了另一个事务操作内部的数据。ACID中的一致性描述的是一个最理想的事务应该是怎样的，是一个强一致性状态，如果要做到这点，需要使用排它锁把事务排成一队，即 Serializable 的隔离级别，这样性能就大大降低了。现实是骨感的，所以使用不同隔离级别来破坏一致性，以获取更好的性能。

   - **隔离性（Isolation）**

     多个事务并发访问时，事务之间是隔离的，一个事务不影响其它事务的执行。

   - **持久性（Durability）**

     事务一旦提交，对数据库数据的修改便是永久性的。即使系统或介质发生故障时，其修改也将持久化保存在数据库中。

3. 事务的并发问题

   > [MySQL高并发事务问题及解决方案](https://segmentfault.com/a/1190000012626590)

   1. **赃读**（Dirty Read）

      一个事务读取到了另外一个事务没有提交的数据。

   2. **不可重复读**（Nonrepeatable Read）

      在同一事务中，两次读取同一数据，得到不同内容。

   3. **幻读**（Phantom Read）

      同一事务中，用同样的操作读取两次，得到的记录数不相同。

   4. **丢失更新**（Lost Update）

      1. 第一类丢失更新: A事务撤销时, 把已经提交的B事务的更新数据覆盖了。
      2. 第二类丢失更新: A事务覆盖B事务已经提交的数据，造成B事务所做跟新丢失。

   [不可重复读与幻读的区别](https://segmentfault.com/a/1190000012669504)：

   - 不可重复读的重点是修改，幻读的重点在于新增或者删除。

   - 不可重复读主要是说多次读取一条记录, 发现该记录中某些列值被修改过。

   - 幻读主要是说多次读取一个范围内的记录(包括直接查询所有记录结果或者做聚合统计), 发现结果不一致(标准档案一般指记录增多, 记录的减少应该也算是幻读)。(可以参考[MySQL官方文档对 Phantom Rows 的介绍](https://dev.mysql.com/doc/refman/5.7/en/innodb-next-key-locking.html))

4. 事务的隔离级别

   > [数据库并发事务中的问题与解决方案](https://blog.csdn.net/u012739535/article/details/76855728)
   >
   > [数据库并发事务详解](https://blog.csdn.net/qq_21993785/article/details/81077318)

   1. READ_UNCOMMITTED**（读未提交）**

      - 读事务不阻塞其他读事务和写事务，未提交的写事务阻塞其他写事务但不阻塞读事务。

      - 可以防止更新丢失，但不能防止脏读、不可重复读、幻读。
      - 可以通过“排他写锁”实现。

   2. READ_COMMITTED **（读已提交）**

      - 读事务不阻塞其他读事务和写事务，未提交的写事务阻塞其他读事务和写事务。
      - 可以防止更新丢失、脏读，但不能防止不可重复读、幻读。
      - 可以通过“瞬间共享读锁”和“排他写锁”实现。

   3. REPEATABLE_READ**（可重复读）**

      - 以操作同一行数据为前提，读事务阻塞其他写事务但不阻塞读事务，未提交的写事务阻塞其他读事务和写事务。
      - 可以防止更新丢失、脏读、不可重复读，但不能防止幻读。
      - 可以通过“共享读锁”和“排他写锁”实现。

   4. SERIALIZABLE**（可序列化）**

      - 事务序列化执行，只能一个接着一个地执行，不能并发执行。
      - 可以防止更新丢失、脏读、不可重复读、幻读。
      - 如果仅仅通过“行级锁”是无法实现事务序列化的，需使用“表级锁”。

   | 事务隔离级别 | 回滚覆盖 | 脏读     | 不可重复读 | 提交覆盖 | 幻读     |
   | ------------ | -------- | -------- | ---------- | -------- | -------- |
   | 读未提交     | x        | 可能发生 | 可能发生   | 可能发生 | 可能发生 |
   | 读已提交     | x        | x        | 可能发生   | 可能发生 | 可能发生 |
   | 可重复读     | x        | x        | x          | x        | 可能发生 |
   | 串行化       | x        | x        | x          | x        | x        |

   隔离级别越高，越能保证数据的完整性和一致性，但是对并发性能的影响也越大。对于多数应用程序，可以优先考虑把数据库系统的隔离级别设为Read Committed。它能够避免脏读，而且具有较好的并发性能。尽管它会导致不可重复读、幻读和第二类丢失更新这些并发问题，在可能出现这类问题的个别场合，可以由应用程序采用悲观锁或乐观锁来控制。

   大多数数据库的默认级别就是Read committed，比如Sql Server , Oracle。

   MySQL 默认的事务隔离级别为 REPEATABLE_READ

### Spring声明式事务管理

> [Spring声明式事务管理之一：五大属性分析](https://segmentfault.com/a/1190000011743233)
>
> [可能是最漂亮的Spring事务管理详解](https://segmentfault.com/a/1190000014957011)


#### Spring五个事务隔离级别

| 隔离级别                   | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| ISOLATION_DEFAULT          | 使用数据库默认的隔离级别，Mysql 默认采用的 REPEATABLE_READ隔离级别，Oracle 默认采用的 READ_COMMITTED隔离级别。 |
| ISOLATION_READ_UNCOMMITTED | 读未提交                                                     |
| ISOLATION_READ_COMMITTED   | 读已提交                                                     |
| ISOLATION_REPEATABLE_READ  | 可重复度                                                     |
| ISOLATION_SERIALIZABLE     | 序列化                                                       |



#### Spring七个事务传播行为

> [Spring事务传播行为详解](https://segmentfault.com/a/1190000013341344)
>
> [spring 事务传播行为实例分析](https://blog.csdn.net/pml18710973036/article/details/58607148)
>
> [【Spring学习34】Spring事务(4)：事务属性之7种传播行为](https://blog.csdn.net/soonfly/article/details/70305683)

| 事务传播行为类型          | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_REQUIRED      | 如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。这是最常见的选择。 |
| PROPAGATION_SUPPORTS      | 支持当前事务，如果当前没有事务，就以非事务方式执行。         |
| PROPAGATION_MANDATORY     | 使用当前的事务，如果当前没有事务，就抛出异常。               |
| PROPAGATION_REQUIRES_NEW  | 新建事务，如果当前存在事务，把当前事务挂起。                 |
| PROPAGATION_NOT_SUPPORTED | 以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。   |
| PROPAGATION_NEVER         | 以非事务方式执行，如果当前存在事务，则抛出异常。             |
| PROPAGATION_NESTED        | 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与PROPAGATION_REQUIRED类似的操作。 |

事务传播行为定义的是事务的控制范围，事务隔离级别定义的是事务在数据库读写方面的控制范围。

#### 超时时间

TransactionDefinition 接口中定义了1个表示超时时间的常量TIMEOUT_DEFAULT 默认是30秒，使用getTimeout()方法可以获取到超时时间，单位是秒。Spring事务超时时间，是指一个事务所允许执行的最长时间，如果超过该时间限制但事务还没有完成，则自动回滚事务。

#### 是否只读

事务管理的只读属性是指对事务性资源进行只读操作或者是可读写操作。所谓事务性资源就是指那些被事务管理的资源，如数据源、JMS 资源，以及自定义的事务性资源等。如果确定只对事务性资源进行只读操作，那么我们可以将事务标志为只读的，以提高事务处理的性能。在TransactionDefinition 中以 boolean 类型来表示该事务是否只读，使用方法isReadOnly()来判断事务是否是只读的。

#### 回滚规则

通常情况下，如果在事务中抛出了未检查异常（继承自 RuntimeException 的异常），则默认将回滚事务。如果没有抛出任何异常，或者抛出了已检查异常，则正常提交事务。我们可以根据需要人为控制事务在抛出某些未检查异常时仍然提交事务，或者在抛出某些已检查异常时回滚事务。
Transactional注解中有4个属性通过设置系统异常类和自定义异常类来自定义回滚规则。

- **@Transactional(rollbackFor=RuntimeException.class)**
  用于设置需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，则事务回滚。
- **@Transactional(rollbackForClassName="RuntimeException")**
  用于设置需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，则进行事务回滚
- **@Transactional(noRollbackFor=RuntimeException.class)**
  用于设置不需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，不进行事务回滚
- **@Transactional(noRollbackForClassName=RuntimeException.class)**
  用于设置不需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，不进行事务回滚

**其他**

- @Transactional 只能被应用到public方法上, 对于其它非public的方法,如果标记了@Transactional也不会报错,但方法没有事务功能

- 可以在接口上使用 @Transactional  注解，但是只有当你设置了基于接口的代理时它才生效。因为**注解是不能继承的**。

- 当你在Spring中配置了 `<aop:aspectj-autoproxy></aop:aspectj-autoproxy>` 时，那么代理类就是基于接口的代理。 

  当你在Spring中配置了 `<aop:aspectj-autoproxy proxy-target-class="true"/>` 时，那么代理类就是基于类的代理。

- 事务传播机制只适用于不同bean之间方法的调用，如果一个bean中的两个方法互相调用并不会使用到事务传播。

  原因解释：spring的事物管理通过AOP代理来实现， 根据aop的思想，不可能在具体类上直接处理事务，而是通过代理类来处理，代理类在调用具体类的方法来实现，methodA通过this调用methodB，那么此时相当于调用methodB时是没有经过代理类的调用，因此spring无法对事物的传播行为做处理。


### 数据库的锁机制

> [MySqL 事务与锁的深入学习笔记](https://blog.csdn.net/canot/article/details/53815294)

**分类**

按锁类型划分，可分为共享锁、排他锁
按锁的粒度划分，可分为表级锁、行级锁、页级锁
按使用机制划分，可分为乐观锁、悲观锁

**共享锁与排他锁**

共享锁（Shared locks, S-locks）
也叫读锁、S锁。在没有检测到排他锁时才可以加共享锁，其他事务可以并发读取该数据，但任何事务都不能对数据进行修改（获取数据上的排他锁），直到已释放所有共享锁。
用法：`SELECT ... LOCK IN SHARE MODE;`

排他锁（Exclusive locks, X-locks）
也叫写锁、X锁。在没有加任何锁时才可以加排他锁，加上排他锁后，其他事务不能再加任何类型的锁，直到已释放该排他锁。
用法：`SELECT ... FOR UPDATE;`

InnoDB还有两个表锁：
意向共享锁（IS）：表示事务准备给数据行加入共享锁，也就是说一个数据行加共享锁前必须先取得该表的IS锁。
意向排他锁（IX）：表示事务准备给数据行加入排他锁，事务在一个数据行加排他锁前必须先取得该表的IX锁。
意向锁是InnoDB自动加的，不需要用户干预。

**级锁、行级锁、页级锁**   

表级锁：直接锁定整张表，在锁定期间，其他进程无法对该表进行写操作。如果你是写锁，则其他进程读也不允许。特点是：开销小、加锁快，不会出现死锁。锁定粒度最大，发生锁冲突的概率最高，并发度最低。
MYISAM存储引擎采用的就是表级锁。

行级锁：仅对指定的记录进行加锁，这样其他进程还是可以对同一个表中的其他记录进行操作。特点：开销大，加锁慢，会出现死锁。锁定的粒度最小，发生锁冲突的概率最低，并发度也最高。
InnoDB存储引擎既支持行级锁，也支持表级锁，但默认情况下是采用行级锁。

页级锁：一次锁定相邻的一组记录。开销和加锁时间介于表级锁和行级锁之间；会出现死锁；锁定粒度也介于表级锁和行级锁之间，并发度一般。

**乐观锁、悲观锁**

无论是悲观锁还是乐观锁，都是人们定义出来的概念，可以认为是一种思想。不要把乐观并发控制和悲观并发控制狭义的理解为DBMS中的概念，更不要把他们和数据中提供的锁机制（行锁、表锁、排他锁、共享锁）混为一谈。其实，在DBMS中，悲观锁正是利用数据库本身提供的锁机制来实现的。

悲观并发控制（又名“悲观锁”，Pessimistic Concurrency Control，缩写“PCC”）是一种并发控制的方法。锁如其名，它指的是对数据被外界修改持悲观态度，即假定当前事务操纵数据资源时，肯定还会有其他事务同时访问该数据资源。因此，为了避免当前事务的操作受到干扰，先锁定资源。悲观锁需使用数据库的锁机制实现，如使用行级排他锁或表级排它锁。

悲观并发控制实际上是“先取锁再访问”的保守策略，为数据处理的安全提供了保证。但是在效率方面，处理加锁的机制会让数据库产生额外的开销，增加产生死锁的机会；另外，在只读型事务处理中由于不会产生冲突，也没必要使用锁，这样做只能增加系统负载；还会降低了并行性。

乐观并发控制（又名“乐观锁”，Optimistic Concurrency Control，缩写“OCC”）是一种并发控制的方法。它对数据被外界修改持乐观态度，即假定当前事务操纵数据资源时，不会有其他事务同时访问该数据资源，因此不在数据库层次上锁定，乐观锁使用由程序逻辑控制的技术来避免可能出现的并发问题。

乐观锁的实现方式有两种，第一种是使用版本号，第二种是使用时间戳。

基于**数据版本记录机制**的实现：即每行数据多一个版本字段，当读取数据时，将版本标识的值一同读出，数据每更新一次，同时对版本标识进行更新。当我们提交更新的时候，将数据库表对应记录的当前版本信息与第一次取出来的版本标识进行比对，如果数据库表当前版本号与第一次取出来的版本标识值相等，则予以更新，否则认为是过期数据。 

使用时间戳的实现：依然是为每条数据增加一个时间戳字段，在更新提交的时候，将当前数据库中数据的时间戳与第一次读取的时间戳进行比对，如果一致则更新，否则认为是过期数据。

乐观锁不能解决脏读的问题，因此仍需要数据库至少启用“读已提交”的事务隔离级别。

#### MVCC

MySQL InnoDB存储引擎，实现的是基于**多版本的并发控制协议**——MVCC (Multi-Version Concurrency Control) (注：与MVCC相对的，是基于锁的并发控制，Lock-Based Concurrency Control)。MVCC最大的好处，相信也是耳熟能详：读不加锁，读写不冲突。在读多写少的应用中，读写不冲突是非常重要的，极大的增加了系统的并发性能，这也是为什么现阶段，几乎所有的RDBMS，都支持了MVCC。

在MVCC并发控制中，读操作可以分成两类：快照读 (snapshot read)与当前读 (current read)。快照读，读取的是记录的可见版本 (有可能是历史版本)，不用加锁。当前读，读取的是记录的最新版本，并且，当前读返回的记录，都会加上锁，保证其他事务不会再并发修改这条记录。

在一个支持MVCC并发控制的系统中，哪些读操作是快照读？哪些操作又是当前读呢？以MySQL InnoDB为例：

快照读：简单的select操作，属于快照读，不加锁。

`select * from table where ?;`

当前读：特殊的读操作，插入/更新/删除操作，属于当前读，需要加锁。

```mysql
select * from table where ? lock in share mode;
select * from table where ? for update;
insert into table values (…);
update table set ? where ?;
delete from table where ?;
```

除了第一条语句，对读取记录加S锁 (共享锁)外，其他的操作，都加的是X锁 (排它锁)。

#### 三级加锁协议、两段锁协议

> [数据库并发事务中的问题与解决方案](https://blog.csdn.net/u012739535/article/details/76855728)

三级加锁协议也称为三级封锁协议，是为了保证正确的调度事务的并发操作，事务在对数据库对象加锁、解锁时必须遵守的一种规则。在运用X锁和S锁对数据对象加锁时，还需要约定一些规则 ，例如何时申请X锁或S锁、持锁时间、何时释放等。称这些规则为封锁协议（Locking Protocol）。对封锁方式规定不同的规则，就形成了各种不同的封锁协议。

**一级封锁协议**
事务T在修改数据R之前必须先对其加X锁，直到事务结束才释放。事务结束包括正常结束（COMMIT）和非正常结束（ROLLBACK）。
一级封锁协议可以防止丢失修改，并保证事务T是可恢复的。使用一级封锁协议可以解决丢失修改问题。
在一级封锁协议中，如果仅仅是读数据不对其进行修改，是不需要加锁的，它不能保证可重复读和不读“脏”数据。

**二级封锁协议**
一级封锁协议加上事务T在读取数据R之前必须先对其加S锁，读完后方可释放S锁。
二级封锁协议除防止了丢失修改，还可以进一步防止读“脏”数据。但在二级封锁协议中，由于读完数据后即可释放S锁，所以它不能保证可重复读。

**三级封锁协议**
一级封锁协议加上事务T在读取数据R之前必须先对其加S锁，直到事务结束才释放。
三级封锁协议除防止了丢失修改和不读“脏”数据外，还进一步防止了不可重复读。

上述三级协议的主要区别在于什么操作需要申请封锁，以及何时释放。

**两段锁协议**

可串行化调度是指，通过并发控制，使得并发执行的事务结果与某个串行执行的事务结果相同。

两段锁协议规定在对任何数据进行读写操作之前，事务首先要获得对该数据的封锁；而且在释放一个封锁之后，事务不再获得任何其他封锁。就是说加锁和解锁分为两个阶段进行。

> 事务遵循两段锁协议是保证可串行化调度的充分条件。例如以下操作满足两段锁协议，它是可串行化调度。
> Xlock(A)…Slock(B)…Slock(C)…unlock(A)…unlock(C)…unlock(B) 
> 但不是必要条件，例如以下操作不满足两段锁协议，但是它还是可串行化调度: 
> Xlock(A)…unlock(A)…Slock(B)…unlock(B)…Slock(C)…unlock(C)

| 事务隔离级别 | 加锁协议     |
| ------------ | ------------ |
| 读未提交     | 一级加锁协议 |
| 读已提交     | 二级加锁协议 |
| 可重复读     | 三级加锁协议 |
| 串行化       | 两段锁协议   |

注：封锁协议和隔离级别并不是严格对应的。

MySQL 的 InnoDB 存储引擎采用两段锁协议，会根据隔离级别在需要的时候自动加锁，并且所有的锁都是在同一时刻被释放，这被称为隐式锁定。

#### 死锁

**产生死锁的四个必要条件：**

（1） 互斥条件：一个资源每次只能被一个进程使用。
（2） 请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放。
（3） 不剥夺条件:进程已获得的资源，在末使用完之前，不能强行剥夺。
（4） 循环等待条件:若干进程之间形成一种头尾相接的循环等待资源关系。

**避免死锁**

（1） 按同一顺序访问对象。(注：避免出现循环)
（2） 避免事务中的用户交互。(注：减少持有资源的时间，较少锁竞争)
（3） 保持事务简短并处于一个批处理中。(注：减少持有资源的时间)
（4） 使用较低的隔离级别。(注：使用较低的隔离级别比使用较高的隔离级别持有共享锁的时间更短)
（5） 使用基于行版本控制的隔离级别。
（6） 使用绑定连接。

## 多线程

- CAS
- AQS
- 线程池

##  设计模式

> [JAVA设计模式总结之23种设计模式](https://www.cnblogs.com/pony1223/p/7608955.html)

![](https://images2017.cnblogs.com/blog/401339/201709/401339-20170928225241215-295252070.png)

### 单例模式

一般有 8 种：饿汉式（静态常量）、饿汉式（静态代码块）、懒汉式(线程不安全)、懒汉式(线程安全，同步方法)、懒汉式(线程安全，同步代码块)、双重校验锁、静态内部类、枚举

| 实现方式                     | 线程安全 | 延迟加载 | 抵御反射攻击 |
| ---------------------------- | -------- | -------- | ------------ |
| 饿汉式（静态常量）           | Y        | N        | N            |
| 饿汉式（静态代码块）         | Y        | N        | N            |
| 懒汉式(线程不安全)           | Y        | Y        | N            |
| 懒汉式(线程安全，同步方法)   | Y        | Y        | N            |
| 懒汉式(线程安全，同步代码块) | N        | Y        | N            |
| 双重校验锁                   | Y        | Y        | N            |
| 静态内部类                   | Y        | Y        | N            |
| 枚举                         | Y        | Y        | Y            |

#### 饿汉式（静态常量）

```java
public class Singleton {
    private static Singleton instance = new Singleton();
    private Singleton (){}
    public static Singleton getInstance() {
        return instance;
    }
}
```

优点：基于 classloader 机制避免了多线程的同步问题。没有加锁，执行效率会提高。
缺点：类加载时就初始化，浪费内存。

#### 饿汉式（静态代码块）

```java
public class Singleton {
    private static Singleton instance;
    static{
        instance = new Singleton();
    }
    private Singleton (){}
    public static Singleton getInstance() {
        return instance;
    }
}
```

优点：基于 classloader 机制避免了多线程的同步问题。没有加锁，执行效率会提高。
缺点：类加载时就初始化，浪费内存。

#### 懒汉式(线程不安全)

```java
public class Singleton {
    private static Singleton instance;
    private Singleton (){}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

优点：懒加载。
缺点：线程不安全。

#### 懒汉式(线程安全，同步方法)

```java
public class Singleton {
    private static Singleton instance;
    private Singleton (){}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

优点：懒加载， 线程安全。
缺点：加锁影响效率。

#### 懒汉式(线程安全，同步代码块)

```java
public class Singleton {
   private static Singleton singleton;
   private Singleton() {}

   public static Singleton getInstance() {
       if (singleton == null) {
           synchronized (Singleton.class) {
               singleton = new Singleton();
           }
       }
       return singleton;
   }
}
```

优点：懒加载， 解决效率问题。
缺点：存在线程安全问题。

#### 双重校验锁（DCL，即 double-checked locking）

```java
public class Singleton {
    private volatile static Singleton singleton;
    private Singleton (){}
    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```

优点：线程安全且在多线程情况下能保持高性能。

缺点：由于JVM编译器的[**指令重排**可能会导致线程不安全](https://mp.weixin.qq.com/s?src=11&timestamp=1552554141&ver=1483&signature=JmbsFEDRnIJQwueG2QuOMFjXqS20v5f46WEEXm-ihMO4T8xymNheoGhBuO*qCN67WlFP9SoQIntPMnWzrwtT6aEi*mYtz8XB6a*W4GrFa5Er6LF6RVjJnsAam3TQta6D&new=1)。使用 volatile 修饰 singleton 可避免此问题。

#### 静态内部类

```java
public class Singleton {
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    private Singleton (){}
    public static final Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

优点：利用类加载机制避免了线程不安全，相对饿汉式增加了延迟加载能力，效率高。

#### 枚举

```java
public enum Singleton {
    INSTANCE;
}
```

优点：利用 enum 语法糖，JVM 会阻止获取枚举类的私有构造方法。使用枚举实现的单例模式，不但可以防止利用反射强行构建单例对象，而且可以在枚举类对象被**反序列化**的时候，保证反序列的返回结果是同一对象

缺点：非懒加载。

### 工厂模式

> [图说设计模式](https://design-patterns.readthedocs.io/zh_CN/latest/index.html)

#### 简单工厂

**定义**

简单工厂模式(Simple Factory Pattern)：又称为静态工厂方法(Static Factory Method)模式，它属于类创建型模式。在简单工厂模式中，可以根据参数的不同返回不同类的实例。简单工厂模式专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类。

**实例**

> [简单工厂实例](https://segmentfault.com/a/1190000015050674#articleHeader9)

**应用**

1. JDK类库中广泛使用了简单工厂模式，如工具类java.text.DateFormat，它用于格式化一个本地日期或者时间。

    ```java
    public final static DateFormat getDateInstance();
    public final static DateFormat getDateInstance(int style);
    public final static DateFormat getDateInstance(int style,Locale
    locale);
    ```

1. Java加密技术

    获取不同加密算法的密钥生成器:

    ```java
    KeyGenerator keyGen=KeyGenerator.getInstance("DESede");
    ```

    创建密码器:

    ```java
    Cipher cp=Cipher.getInstance("DESede");
    ```

优点：

1、屏蔽产品的具体实现，调用者只关心产品的接口。

2、实现简单

缺点：

1、增加产品，需要修改工厂类，不符合开放-封闭原则

2、工厂类集中了所有实例的创建逻辑，违反了高内聚责任分配原则

#### 工厂方法

**定义**
工厂方法模式(Factory Method Pattern)又称为工厂模式，也叫虚拟构造器(Virtual Constructor)模式或者多态工厂(Polymorphic Factory)模式，它属于类创建型模式。在工厂方法模式中，工厂父类负责定义创建产品对象的公共接口，而工厂子类则负责生成具体的产品对象，这样做的目的是将产品类的实例化操作延迟到工厂子类中完成，即通过工厂子类来确定究竟应该实例化哪一个具体产品类。

在工厂方法模式中，核心的工厂类不再负责所有产品的创建，而是将具体创建工作交给子类去做。这个核心类仅仅负责给出具体工厂必须实现的接口，而不负责哪一个产品类被实例化这种细节，这使得工厂方法模式可以允许系统在不修改工厂角色的情况下引进新产品。这一特点无疑使得工厂方法模式具有超越简单工厂模式的优越性，更加符合“开闭原则”。

**实例**

> [工厂方法模式实例](https://segmentfault.com/a/1190000015050674#articleHeader15)

**应用**

> [设计模式（六）——JDK中的那些工厂方法](https://www.hollischuang.com/archives/1408)

1. Collection中的iterator方法

   `java.util.Collection`接口中定义了一个抽象的`iterator()`方法，该方法就是一个工厂方法。

   对于`iterator()`方法来说`Collection`就是一个根抽象工厂，下面还有`List`等接口作为抽象工厂，再往下有`ArrayList`等具体工厂。

   `java.util.Iterator`接口是根抽象产品，下面有`ListIterator`等抽象产品，还有`ArrayListIterator`等作为具体产品。

   使用不同的具体工厂类中的`iterator`方法能得到不同的具体产品的实例。

优点：

1、继承了简单工厂模式的优点

2、符合开放-封闭原则

缺点：

1、增加产品，需要增加新的工厂类，导致系统类的个数成对增加，在一定程度上增加了系统的复杂性。

#### 抽象工厂

**定义**
抽象工厂模式(Abstract Factory Pattern)：提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为Kit模式，属于对象创建型模式。

抽象工厂是生产一整套有产品的（至少要生产两个产品)，这些产品必须相互是有关系或有依赖的，而工厂方法中的工厂是生产单一产品的工厂。

**实例**

> [抽象工厂模式实例](https://segmentfault.com/a/1190000015050674#articleHeader21)

**应用**

1. jdk 中的数据库链接

   ![](http://hi.csdn.net/attachment/201101/3/0_1294058833piFB.gif)

   抽象工厂：Connection

   具体工厂：MysqlCollectionImpl

   抽象产品：Statement、PreparedStatement、CallableStatement、ResultSet

   具体产品：MysqlStatement、MysqlPreparedStatement、MysqlCallableStatement、MysqlResultSet

2. 在很多软件系统中需要更换界面主题，要求界面中的按钮、文本框、背景色等一起发生改变时，可以使用抽象工厂模式进行设计。例如**UIManager（swing外观）**

### 代理模式

#### 静态代理

#### 动态代理



## Spring

简单来说，Spring 是一个分层的 JavaSE/EE full-stack(一站式) 轻量级开源框架。

Spring有分层的体系结构，这意味着你能选择使用它孤立的任何部分，它的架构仍然是内在稳定的。例如，你可能选择仅仅使用Spring来简化JDBC的使用，或用来管理所有的业务对象。

spring 特征：

- **轻量**

  从大小与开销两方面而言Spring都是轻量的。完整的Spring框架可以在一个大小只有1MB多的JAR文件里发布。并且Spring所需的处理开销也是微不足道的。

- **控制反转**

  Spring通过一种称作控制反转的技术促进了低耦合。当应用了IoC，一个对象依赖的其它对象会通过被动的方式传递进来，而不是这个对象自己创建或者查找依赖对象。你可以认为IoC与JNDI相反——不是对象从容器中查找依赖，而是容器在对象初始化时不等对象请求就主动将依赖传递给它。

- **面向切面**

  Spring提供了[面向切面编程](https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%88%87%E9%9D%A2%E7%BC%96%E7%A8%8B)的丰富支持，允许通过分离应用的业务逻辑与系统级服务（例如审计（auditing）和[事务](https://baike.baidu.com/item/%E4%BA%8B%E5%8A%A1)（[transaction](https://baike.baidu.com/item/transaction)）管理）进行[内聚性](https://baike.baidu.com/item/%E5%86%85%E8%81%9A%E6%80%A7)的开发。[应用对象](https://baike.baidu.com/item/%E5%BA%94%E7%94%A8%E5%AF%B9%E8%B1%A1)只实现它们应该做的——完成业务逻辑——仅此而已。它们并不负责（甚至是意识）其它的系统级关注点，例如日志或事务支持。

- **容器**

  Spring包含并管理应用对象的配置和生命周期，在这个意义上它是一种容器，你可以配置你的每个bean如何被创建——基于一个可配置原型（[prototype](https://baike.baidu.com/item/prototype/14335188)），你的bean可以创建一个单独的实例或者每次需要时都生成一个新的实例——以及它们是如何相互关联的。然而，Spring不应该被混同于传统的重量级的EJB容器，它们经常是庞大与笨重的，难以使用。

- **框架**

  Spring可以将简单的[组件](https://baike.baidu.com/item/%E7%BB%84%E4%BB%B6)配置、组合成为复杂的应用。在Spring中，[应用对象](https://baike.baidu.com/item/%E5%BA%94%E7%94%A8%E5%AF%B9%E8%B1%A1)被声明式地组合，典型地是在一个XML文件里。Spring也提供了很多基础功能（[事务管理](https://baike.baidu.com/item/%E4%BA%8B%E5%8A%A1%E7%AE%A1%E7%90%86)、持久化框架集成等等），将应用逻辑的开发留给了你。

- **MVC**

  Spring的作用是整合，但不仅仅限于整合，Spring 框架可以被看做是一个企业解决方案级别的框架。客户端发送请求，服务器控制器（由DispatcherServlet实现的)完成请求的转发，控制器调用一个用于映射的类HandlerMapping，该类用于将请求映射到对应的处理器来处理请求。HandlerMapping 将请求映射到对应的处理器Controller（相当于Action）在Spring 当中如果写一些处理器组件，一般实现Controller 接口，在Controller 中就可以调用一些Service 或DAO 来进行数据操作 ModelAndView 用于存放从DAO 中取出的数据，还可以存放响应视图的一些数据。 如果想将处理结果返回给用户，那么在Spring 框架中还提供一个视图组件ViewResolver，该组件根据Controller 返回的标示，找到对应的视图，将响应response 返回给用户。

spring 特点

1. 方便解耦，简化开发
   通过Spring提供的IoC容器，我们可以将对象之间的依赖关系交由Spring进行控制，避免硬编码所造成的过度程序耦合。有了Spring，用户不必再为单实例模式类、属性文件解析等这些很底层的需求编写代码，可以更专注于上层的应用。
2. AOP编程的支持
   通过Spring提供的AOP功能，方便进行面向切面的编程，许多不容易用传统OOP实现的功能可以通过AOP轻松应付。
3. 声明式事务的支持
   在Spring中，我们可以从单调烦闷的事务管理代码中解脱出来，通过声明式方式灵活地进行事务的管理，提高开发效率和质量。
4. 方便程序的测试
   可以用非容器依赖的编程方式进行几乎所有的测试工作，在Spring里，测试不再是昂贵的操作，而是随手可做的事情。例如：Spring对Junit4支持，可以通过注解方便的测试Spring程序。
5. 方便集成各种优秀框架
   Spring不排斥各种优秀的开源框架，相反，Spring可以降低各种框架的使用难度，Spring提供了对各种优秀框架（如Struts,Hibernate、Hessian、Quartz）等的直接支持。
6. 降低Java EE API的使用难度
   Spring对很多难用的Java EE API（如JDBC，JavaMail，远程调用等）提供了一个薄薄的封装层，通过Spring的简易封装，这些Java EE API的使用难度大为降低。
7. Java 源码是经典学习范例
   Spring的源码设计精妙、结构清晰、匠心独运，处处体现着大师对Java设计模式灵活运用以及对Java技术的高深造诣。Spring框架源码无疑是Java技术的最佳实践范例。如果想在短时间内迅速提高自己的Java技术水平和应用开发水平，学习和研究Spring源码将会使你收到意想不到的效果。

Spring 优点

1. 低侵入式设计，代码污染极低
2. 独立于各种应用服务器，基于Spring框架的应用，可以真正实现Write Once,Run Anywhere的承诺
3. Spring的DI机制降低了业务对象替换的复杂性，提高了组件之间的解耦
4. Spring的AOP支持允许将一些通用任务如安全、事务、日志等进行集中式管理，从而提供了更好的复用
5. Spring的ORM和DAO提供了与第三方持久层框架的良好整合，并简化了底层的数据库访问
6. Spring并不强制应用完全依赖于Spring，开发者可自由选用Spring框架的部分或全部

基本框架
Spring 框架是一个分层架构，由 7 个定义良好的模块组成。Spring 模块构建在核心容器之上，核心容器定义了创建、配置和管理 bean 的方式。组成Spring框架的每个模块（或组件）都可以单独存在，或者与其他一个或多个模块联合实现。

![](http://www.cs.trincoll.edu/hfoss/images/4/42/Spring_framework.gif)

1. 核心容器：

   核心容器提供 Spring 框架的基本功能(Spring Core)。核心容器的主要组件是 BeanFactory，它是工厂模式的实现。BeanFactory 使用控制反转（IOC） 模式将应用程序的配置和依赖性规范与实际的应用程序代码分开。

2. Spring 上下文：

   Spring 上下文是一个配置文件，向 Spring框架提供上下文信息。Spring 上下文包括企业服务，例如JNDI、EJB、电子邮件、国际化、校验和调度功能。

3. Spring AOP：

   通过配置管理特性，Spring AOP 模块直接将面向切面的编程功能集成到了 Spring 框架中。所以，可以很容易地使 Spring 框架管理的任何对象支持AOP。Spring AOP 模块为基于 Spring 的应用程序中的对象提供了事务管理服务。通过使用 Spring AOP，不用依赖 EJB 组件，就可以将声明性事务管理集成到应用程序中。

4. Spring DAO：

   JDBCDAO抽象层提供了有意义的异常层次结构，可用该结构来管理异常处理和不同数据库供应商抛出的错误消息。异常层次结构简化了错误处理，并且极大地降低了需要编写的异常代码数量（例如打开和关闭连接）。Spring DAO 的面向 JDBC 的异常遵从通用的 DAO 异常层次结构。

5. Spring ORM：

   Spring 框架插入了若干个ORM框架，从而提供了 ORM 的对象关系工具，其中包括JDO、Hibernate和iBatisSQL Map。所有这些都遵从 Spring 的通用事务和 DAO 异常层次结构。

6. Spring Web 模块：

   Web 上下文模块建立在应用程序上下文模块之上，为基于 Web 的应用程序提供了上下文。所以，Spring框架支持与 Jakarta Struts 的集成。Web 模块还简化了处理多部分请求以及将请求参数绑定到域对象的工作。

7. Spring MVC 框架：

   MVC框架是一个全功能的构建 Web应用程序的 MVC 实现。通过策略接口，MVC框架变成为高度可配置的，MVC 容纳了大量视图技术，其中包括 JSP、Velocity、Tiles、iText 和 POI。模型由javabean构成，存放于Map；视图是一个接口，负责显示模型；控制器表示逻辑代码，是Controller的实现。Spring框架的功能可以用在任何J2EE服务器中，大多数功能也适用于不受管理的环境。Spring 的核心要点是：支持不绑定到特定 J2EE服务的可重用业务和数据访问对象。毫无疑问，这样的对象可以在不同J2EE 环境（Web 或EJB）、独立应用程序、测试环境之间重用。

### 控制反转和依赖注入

> [Spring IoC有什么好处呢？ - Mingqi的回答 - 知乎](https://www.zhihu.com/question/23277575/answer/169698662)

#### IOC

**什么是IOC**

Ioc—Inversion of Control，即“控制反转”，不是什么技术，而**是一种设计思想**。在Java开发中，Ioc意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。理解好Ioc的关键是要明确“谁控制谁，控制什么，为何是反转（有反转就应该有正转了），哪些方面反转了”。

- 谁控制谁，控制什么：

  传统Java SE程序设计，我们直接在对象内部通过new进行创建对象，是程序主动去创建依赖对象；而IoC是有专门一个容器来创建这些对象，即由Ioc容器来控制对象的创建；

  谁控制谁：IoC 容器控制了对象

  控制什么：主要控制了外部资源获取（不只是对象，包括比如文件等）。

- 为何是反转，哪些方面反转了：

  有反转就有正转，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；

  为何是反转：因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转

  哪些方面反转了：依赖对象的获取被反转了。

#### DI

**什么是DI**

DI—Dependency Injection，即“依赖注入”：是组件之间依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。理解DI的关键是：“谁依赖谁，为什么需要依赖，谁注入谁，注入了什么”。

- 谁依赖于谁：当然是应用程序依赖于IoC容器；

- 为什么需要依赖：应用程序需要IoC容器来提供对象需要的外部资源；

- 谁注入谁：很明显是IoC容器注入应用程序某个对象，应用程序依赖的对象；

- 注入了什么：就是注入某个对象所需要的外部资源（包括对象、资源、常量数据）。

IoC和DI由什么关系呢？其实它们是同一个概念不同角度的描述，由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以2004年大师级人物Martin Fowler又给出了一个新的名字：“依赖注入”，相对IoC 而言，“依赖注入”明确描述了“被注入对象依赖IoC容器配置依赖对象”。

**依赖注入的三种实现方式**

- 构造方法注入
- Setter方式注入 
- 接口注入

[Spring IoC有什么好处呢？ - Mingqi的回答 - 知乎](https://www.zhihu.com/question/23277575/answer/169698662)

依赖倒置原则——把原本的高层建筑依赖底层建筑“倒置”过来，变成底层建筑依赖高层建筑。高层建筑决定需要什么，底层去实现这样的需求，但是高层并不用管底层是怎么实现的。这样就不会出现“牵一发动全身”的情况。

**控制反转（Inversion of Control）** 就是依赖倒置原则的一种代码设计的思路。具体采用的方法就是所谓的**依赖注入（Dependency Injection）**。

![](https://pic1.zhimg.com/80/v2-ee924f8693cff51785ad6637ac5b21c1_hd.jpg)

### AOP

**什么是AOP**

AOP，Aspect Orient Programming，即面向切面编程。是对OOP（Object Orient Programming）的一种补充。

**AOP 术语**

1. 通知（Advice）

   通知是织入到目标类连接点上的一段程序代码，在Spring中，通知除用于描述一段程序代码外，还拥有另一个和连接点相关的信息，这便是执行点的方位。结合执行点方位信息和切点信息，我们就可以找到特定的连接点。

2. 连接点（JoinPoint）

   即通知具体执行的地方，Spring仅支持方法的连接点，即仅能在方法调用前、方法调用后、方法抛出异常时以及方法调用前后这些程序执行点织入通知。连接点由两个信息确定：第一是用方法表示的程序执行点；第二是用相对点表示的方位。

3. 切点（Pointcut）

   每个程序类都拥有多个连接点，如一个拥有两个方法的类，这两个方法都是连接点，即连接点是程序类中客观存在的事物。AOP通过“切点”定位特定的连接点。连接点相当于数据库中的记录，而切点相当于查询条件。切点和连接点不是一对一的关系，一个切点可以匹配多个连接点。在Spring中，切点通过org.springframework.aop.Pointcut接口进行描述，它使用类和方法作为连接点的查询条件，Spring AOP的规则解析引擎负责切点所设定的查询条件，找到对应的连接点。其实确切地说，不能称之为查询连接点，因为连接点是方法执行前、执行后等包括方位信息的具体程序执行点，而切点只定位到某个方法上，所以如果希望定位到具体连接点上，还需要提供方位信息。

4. 切面（Aspect）
   切面是通知和切点的结合。现在发现了吧，没连接点什么事情，连接点就是为了让你好理解切点，搞出来的，明白这个概念就行了。通知说明了干什么和什么时候干（什么时候通过方法名中的before,after，around等就能知道），而切点说明了在哪干（指定到底是哪个方法），这就是一个完整的切面定义。

5. 引入（introduction）
   引介是一种特殊的增强，它为类添加一些属性和方法。这样，即使一个业务类原本没有实现某个接口，通过AOP的引介功能，我们可以动态地为该业务类添加接口的实现逻辑，让业务类成为这个接口的实现类。

6. 目标（target）
   增强逻辑的织入目标类。如果没有AOP，目标业务类需要自己实现所有逻辑，而在AOP的帮助下，目标业务类只实现那些非横切逻辑的程序逻辑，而性能监视和事务管理等这些横切逻辑则可以使用AOP动态织入到特定的连接点上。

7. 代理(proxy)
   一个类被AOP织入增强后，就产出了一个结果类，它是融合了原类和增强逻辑的代理类。

8. 织入(weaving)

   织入是将增强添加到目标类具体连接点上的过程。AOP像一台织布机，将目标类、通知或引入通过AOP这台织布机天衣无缝地编织到一起。AOP有三种织入方式：

   ​    a、编译期织入，这要求使用特殊的Java编译器。

   ​    b、类装载期织入，这要求使用特殊的类装载器。

   ​    c、动态代理织入，在运行期为目标类添加增强生成子类的方式。

   ​    Spring采用动态代理织入，而AspectJ采用编译期织入和类装载期织入。

**五种通知类型**

1. 前置通知[Before advice]：在连接点前面执行，前置通知不会影响连接点的执行，除非此处抛出异常。 
2. 正常返回通知[After returning advice]：在连接点正常执行完成后执行，如果连接点抛出异常，则不会执行。 
3. 异常返回通知[After throwing advice]：在连接点抛出异常后执行。 
4. 返回通知[After (finally) advice]：在连接点执行完成后执行，不管是正常执行完成，还是抛出异常，都会执行返回通知中的内容。 
5. 环绕通知[Around advice]：环绕通知围绕在连接点前后，比如一个方法调用的前后。这是最强大的通知类型，能在方法调用前后自定义一些操作。环绕通知还需要负责决定是继续处理join point(调用ProceedingJoinPoint的proceed方法)还是中断执行。

**切点表达式**

> [Spring AOP切点表达式详解](https://my.oschina.net/zhangxufeng/blog/1824275)

标准的Aspectj Aop的pointcut的表达式类型是很丰富的，但是Spring Aop只支持其中的9种，外加Spring Aop自己扩充的一种一共是10种类型的表达式，分别如下。

1. execution：一般用于指定方法的执行，用的最多。
2. within：指定某些类型的全部方法执行，也可用来指定一个包。
3. this：Spring Aop是基于代理的，生成的bean也是一个代理对象，this就是这个代理对象，当这个对象可以转换为指定的类型时，对应的切入点就是它了，Spring Aop将生效。
4. target：当被代理的对象可以转换为指定的类型时，对应的切入点就是它了，Spring Aop将生效。
5. args：当执行的方法的参数是指定类型时生效。
6. @target：当代理的目标对象上拥有指定的注解时生效。
7. @args：当执行的方法参数类型上拥有指定的注解时生效。
8. @within：与@target类似，看官方文档和网上的说法都是@within只需要目标对象的类或者父类上有指定的注解，则@within会生效，而@target则是必须是目标对象的类上有指定的注解。而根据笔者的测试这两者都是只要目标类或父类上有指定的注解即可。
9. @annotation：当执行的方法上拥有指定的注解时生效。

10. bean：当调用的方法是指定的bean的方法时生效。

**execution**

由于Spring切面粒度最小是达到方法级别，而execution表达式可以用于明确指定方法返回类型，类名，方法名和参数名等与方法相关的部件，并且在Spring中，大部分需要使用AOP的业务场景也只需要达到方法级别即可，因而execution表达式的使用是最为广泛的。如下是execution表达式的语法：

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)

execution([可见性] 返回类型 [声明类型].方法名(参数) [异常])
```

​       这里问号表示当前项可以有也可以没有，其中各项的语义如下：

- modifiers-pattern：方法的可见性，如public，protected；
- ret-type-pattern：方法的返回值类型，如int，void等；
- declaring-type-pattern：方法所在类的全路径名，如com.spring.Aspect；
- name-pattern：方法名类型，如buisinessService()；
- param-pattern：方法的参数类型，如java.lang.String；
- throws-pattern：方法抛出的异常类型，如java.lang.Exception；

​        如下是一个使用execution表达式的例子：

```
execution(public * com.spring.service.BusinessObject.businessService(java.lang.String,..))
```

​       上述切点表达式将会匹配使用public修饰，返回值为任意类型，并且是com.spring.BusinessObject类中名称为businessService的方法，方法可以有多个参数，但是第一个参数必须是java.lang.String类型的方法。上述示例中我们使用了..通配符，关于通配符的类型，主要有两种：

- \* 通配符：该通配符主要用于匹配单个单词，或者是以某个词为前缀或后缀的单词。

  如下示例表示返回值为任意类型，在com.spring.service.BusinessObject类中，并且参数个数为零的方法：

```
execution(* com.spring.service.BusinessObject.*())
```

​       下述示例表示返回值为任意类型，在com.spring.service包中，以Business为前缀的类，并且是类中参数个数为零方法：

```
execution(* com.spring.service.Business*.*())
```

- .. 通配符：该通配符表示0个或多个项，主要用于declaring-type-pattern和param-pattern中，如果用于declaring-type-pattern中，则表示匹配当前包及其子包，如果用于param-pattern中，则表示匹配0个或多个参数。

​       如下示例表示匹配返回值为任意类型，并且是com.spring.service包及其子包下的任意类的名称为businessService的方法，而且该方法不能有任何参数：

```
execution(* com.spring.service..*.businessService())
```

​       这里需要说明的是，包路径service..*.businessService()中的..应该理解为延续前面的service路径，表示到service路径为止，或者继续延续service路径，从而包括其子包路径；后面的*.businessService()，这里的*表示匹配一个单词，因为是在方法名前，因而表示匹配任意的类。

​       如下示例是使用..表示任意个数的参数的示例，需要注意，表示参数的时候可以在括号中事先指定某些类型的参数，而其余的参数则由..进行匹配：

```
execution(* com.spring.service.BusinessObject.businessService(java.lang.String,..))
```

**AOP应用**

- 日志记录，跟踪，优化和监控
- 事务的处理
- 持久化
- 性能的优化
- 资源池，如数据库连接池的管理
- 系统统一的认证、权限管理等
- 应用系统的异常捕捉及处理

**AOP的实现**

> [Spring AOP的实现原理](http://listenzhangbin.com/post/2016/09/spring-aop-cglib/)
>
> [《Spring设计思想》AOP实现原理（基于JDK和基于CGLIB）](https://blog.csdn.net/luanlouis/article/details/51155821)

AOP 的实现技术主要有Spring AOP和AspectJ。

1. AspectJ

AspectJ的底层技术是静态代理，即用一种AspectJ支持的特定语言编写切面，通过一个命令来编译，生成一个新的代理类，该代理类增强了业务类，这是在编译时增强，相对于下面说的运行时增强，编译时增强的性能更好。

2. Spring AOP

Spring AOP采用的是动态代理，在运行期间对业务方法进行增强，所以不会生成新类，对于动态代理技术，Spring AOP提供了对JDK动态代理的支持以及CGLib的支持。

## 版本控制

### GIT 常用命令

> [常用Git 命令清单- 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

