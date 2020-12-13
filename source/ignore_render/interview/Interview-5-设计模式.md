## 设计模式

![](https://images2017.cnblogs.com/blog/401339/201709/401339-20170928225241215-295252070.png)

### [单例模式](https://libo9527.github.io/2020/10/22/Design-Pattern-Singleton/)

#### 实现方式

##### 饿汉模式

> Static initializers are run by the JVM at class initialization time, after class loading but before the class is used by any thread. Because the JVM acquires a lock during initialization [JLS 12.4.2] and this lock is acquired by each thread at least once to ensure that the class has been loaded, memory writes made during static initialization are automatically visible to all threads. Thus statically initialized objects require no explicit synchronization either during construction or when being referenced

```java
public class Singleton1 {

  private static Singleton1 instance = new Singleton1();

  private Singleton1() {
  }

  public static Singleton1 getInstance() {
    return instance;
  }
}
```

类加载机制保障了饿汉模式的线程安全。JVM 在类加载时会获取一把锁，这把锁在线程访问对象时也会先去争取，确保类已经被加载了。

##### 懒汉模式

```java
public class Singleton2 {

  private static Singleton2 instance;

  private Singleton2() {
  }

  public static Singleton2 getInstance() {
    if (instance == null) {
      instance = new Singleton2();
    }
    return instance;
  }
}
```

##### 线程安全的懒汉模式

```java
public class Singleton3 {

  private static Singleton3 instance;

  private Singleton3() {
  }

  public static synchronized Singleton3 getInstance() {
    if (instance == null) {
      instance = new Singleton3();
    }
    return instance;
  }
}
```

##### 双重校验锁模式（DCL，即 double-checked locking）

```java
public class Singleton4 {

  private volatile static Singleton4 instance;

  private Singleton4() {
  }

  public static Singleton4 getInstance() {
    if (instance == null) {
      synchronized (Singleton4.class) {
        if (instance == null) {
          instance = new Singleton4();
        }
      }
    }
    return instance;
  }
}
```

###### 为什么要两次判空？

第一次判空是为了减少无谓的抢夺锁，提升销量。

第二次判空是为了保障不会破坏单例，假设没有第二次判空，线程 1，线程 2 同时通过第一次判空，之后线程 1 获得了锁，并实例化了 instance，之后线程 2 获得锁，又会实例化一遍，破坏了单例模式。

###### 为什么要加 volatile 关键字？

> [彻头彻尾理解单例模式与多线程](https://blog.csdn.net/justloveyou_/article/details/64127789)

`instance = new Singleton4();` 可以被拆解为三条机器指令（伪代码）

```
memory = allocate();        //1:分配对象的内存空间
ctorInstance(memory);       //2:初始化对象
instance = memory;        //3:使 instance 引用指向刚分配的内存地址
```

由于存在指令重排序，上述三条指令的顺序可能会变成 1、3、2

如果没有使用 volatile，那假设线程 1 已经执行到创建对象的语句了，且刚好执行到重排序后到机器指令 3，此时 instance 已经不是 null 了，其他线程就会获取到一个没有完整初始化的 instance 对象，进而造成未知错误。

##### 静态内部类单例模式

```java
public class Singleton5 {

  private Singleton5() {
  }

  public static Singleton5 getInstance() {
    return InnerClass.instance;
  }

  private static class InnerClass {
    private static Singleton5 instance = new Singleton5();
  }
}
```

静态内部类模式综合了懒汉和饿汉模式，既满足线程安全，又满足延迟加载。

##### 枚举单例模式

> 《Effective Java》作者认为该模式是单例模式的最佳实践。

```java
public enum Singleton6 {
  INSTANCE;
}
```

#### 反射攻击

私有化构造器并不能阻止反射攻击。

```java
public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
  Singleton1 instance = Singleton1.getInstance();

  Constructor<Singleton1> declaredConstructor = Singleton1.class.getDeclaredConstructor();
  declaredConstructor.setAccessible(true);
  Singleton1 instance1 = declaredConstructor.newInstance();
  System.out.println(instance == instance1);
}
```
```
false

Process finished with exit code 0
```

反射攻击枚举单例模式

```java
public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
  Singleton6 instance = Singleton6.INSTANCE;

  Constructor<Singleton6> declaredConstructor = Singleton6.class.getDeclaredConstructor();
  declaredConstructor.setAccessible(true);
  Singleton6 instance2 = declaredConstructor.newInstance();
  System.out.println(instance == instance2);
}
```

```
Exception in thread "main" java.lang.NoSuchMethodException: com.gzhennaxia.demo.singleton.Singleton6.<init>()
	at java.lang.Class.getConstructor0(Class.java:3082)
	at java.lang.Class.getDeclaredConstructor(Class.java:2178)
```

报错说找不到空构造方法，但即使手动添加了空构造方法同样会报这个错，因为 Java 编译器会为每个构造器自动添加两个参数，这点从反编译文件中可以看出（只有一个 `com/gzhennaxia/demo/singleton/Singleton6."<init>":(Ljava/lang/String;I)V` 双参构造器）。

```java
public enum Singleton6 {
  INSTANCE;

  private Singleton6() {
  }
}
```
```java
Classfile /Users/libo/Documents/GitHub/projects/demo/src/main/java/com/gzhennaxia/demo/singleton/Singleton6.class
  Last modified 2020年10月22日; size 921 bytes
  MD5 checksum bf867cdc275213b5182d9e511c593cad
  Compiled from "Singleton6.java"
public final class com.gzhennaxia.demo.singleton.Singleton6 extends java.lang.Enum<com.gzhennaxia.demo.singleton.Singleton6>
  minor version: 0
  major version: 56
  flags: (0x4031) ACC_PUBLIC, ACC_FINAL, ACC_SUPER, ACC_ENUM
  this_class: #4                          // com/gzhennaxia/demo/singleton/Singleton6
  super_class: #10                        // java/lang/Enum
  interfaces: 0, fields: 2, methods: 4, attributes: 2
Constant pool:
   #1 = Fieldref           #4.#29         // com/gzhennaxia/demo/singleton/Singleton6.$VALUES:[Lcom/gzhennaxia/demo/singleton/Singleton6;
   #2 = Methodref          #30.#31        // "[Lcom/gzhennaxia/demo/singleton/Singleton6;".clone:()Ljava/lang/Object;
   #3 = Class              #14            // "[Lcom/gzhennaxia/demo/singleton/Singleton6;"
   #4 = Class              #32            // com/gzhennaxia/demo/singleton/Singleton6
   #5 = Methodref          #10.#33        // java/lang/Enum.valueOf:(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
   #6 = Methodref          #10.#34        // java/lang/Enum."<init>":(Ljava/lang/String;I)V
   #7 = String             #11            // INSTANCE
   #8 = Methodref          #4.#34         // com/gzhennaxia/demo/singleton/Singleton6."<init>":(Ljava/lang/String;I)V
   #9 = Fieldref           #4.#35         // com/gzhennaxia/demo/singleton/Singleton6.INSTANCE:Lcom/gzhennaxia/demo/singleton/Singleton6;
  #10 = Class              #36            // java/lang/Enum
  #11 = Utf8               INSTANCE
  #12 = Utf8               Lcom/gzhennaxia/demo/singleton/Singleton6;
  #13 = Utf8               $VALUES
  #14 = Utf8               [Lcom/gzhennaxia/demo/singleton/Singleton6;
  #15 = Utf8               values
  #16 = Utf8               ()[Lcom/gzhennaxia/demo/singleton/Singleton6;
  #17 = Utf8               Code
  #18 = Utf8               LineNumberTable
  #19 = Utf8               valueOf
  #20 = Utf8               (Ljava/lang/String;)Lcom/gzhennaxia/demo/singleton/Singleton6;
  #21 = Utf8               <init>
  #22 = Utf8               (Ljava/lang/String;I)V
  #23 = Utf8               Signature
  #24 = Utf8               ()V
  #25 = Utf8               <clinit>
  #26 = Utf8               Ljava/lang/Enum<Lcom/gzhennaxia/demo/singleton/Singleton6;>;
  #27 = Utf8               SourceFile
  #28 = Utf8               Singleton6.java
  #29 = NameAndType        #13:#14        // $VALUES:[Lcom/gzhennaxia/demo/singleton/Singleton6;
  #30 = Class              #14            // "[Lcom/gzhennaxia/demo/singleton/Singleton6;"
  #31 = NameAndType        #37:#38        // clone:()Ljava/lang/Object;
  #32 = Utf8               com/gzhennaxia/demo/singleton/Singleton6
  #33 = NameAndType        #19:#39        // valueOf:(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
  #34 = NameAndType        #21:#22        // "<init>":(Ljava/lang/String;I)V
  #35 = NameAndType        #11:#12        // INSTANCE:Lcom/gzhennaxia/demo/singleton/Singleton6;
  #36 = Utf8               java/lang/Enum
  #37 = Utf8               clone
  #38 = Utf8               ()Ljava/lang/Object;
  #39 = Utf8               (Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
{
  public static final com.gzhennaxia.demo.singleton.Singleton6 INSTANCE;
    descriptor: Lcom/gzhennaxia/demo/singleton/Singleton6;
    flags: (0x4019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL, ACC_ENUM

  public static com.gzhennaxia.demo.singleton.Singleton6[] values();
    descriptor: ()[Lcom/gzhennaxia/demo/singleton/Singleton6;
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=0, args_size=0
         0: getstatic     #1                  // Field $VALUES:[Lcom/gzhennaxia/demo/singleton/Singleton6;
         3: invokevirtual #2                  // Method "[Lcom/gzhennaxia/demo/singleton/Singleton6;".clone:()Ljava/lang/Object;
         6: checkcast     #3                  // class "[Lcom/gzhennaxia/demo/singleton/Singleton6;"
         9: areturn
      LineNumberTable:
        line 7: 0

  public static com.gzhennaxia.demo.singleton.Singleton6 valueOf(java.lang.String);
    descriptor: (Ljava/lang/String;)Lcom/gzhennaxia/demo/singleton/Singleton6;
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: ldc           #4                  // class com/gzhennaxia/demo/singleton/Singleton6
         2: aload_0
         3: invokestatic  #5                  // Method java/lang/Enum.valueOf:(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
         6: checkcast     #4                  // class com/gzhennaxia/demo/singleton/Singleton6
         9: areturn
      LineNumberTable:
        line 7: 0

  static {};
    descriptor: ()V
    flags: (0x0008) ACC_STATIC
    Code:
      stack=4, locals=0, args_size=0
         0: new           #4                  // class com/gzhennaxia/demo/singleton/Singleton6
         3: dup
         4: ldc           #7                  // String INSTANCE
         6: iconst_0
         7: invokespecial #8                  // Method "<init>":(Ljava/lang/String;I)V
        10: putstatic     #9                  // Field INSTANCE:Lcom/gzhennaxia/demo/singleton/Singleton6;
        13: iconst_1
        14: anewarray     #4                  // class com/gzhennaxia/demo/singleton/Singleton6
        17: dup
        18: iconst_0
        19: getstatic     #9                  // Field INSTANCE:Lcom/gzhennaxia/demo/singleton/Singleton6;
        22: aastore
        23: putstatic     #1                  // Field $VALUES:[Lcom/gzhennaxia/demo/singleton/Singleton6;
        26: return
      LineNumberTable:
        line 8: 0
        line 7: 13
}
Signature: #26                          // Ljava/lang/Enum<Lcom/gzhennaxia/demo/singleton/Singleton6;>;
SourceFile: "Singleton6.java"
```

从反编译结果可以看出枚举的实例化调用的是继承自 `java.lang.Enum` 的 `protected Enum(String var1, int var2)` 构造器，那是否可以反射调用该构造器来实例化 Singleton6 呢？

```java
public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
  Singleton6 instance = Singleton6.INSTANCE;

  Constructor<Singleton6> declaredConstructor = Singleton6.class.getDeclaredConstructor(String.class, int.class);
  declaredConstructor.setAccessible(true);
  Singleton6 instance2 = declaredConstructor.newInstance("", 0);
  System.out.println(instance == instance2);
}
```

```
Exception in thread "main" java.lang.IllegalArgumentException: Cannot reflectively create enum objects
	at java.lang.reflect.Constructor.newInstance(Constructor.java:417)
```

结果报错，查看 java.lang.reflect.Constructor.newInstance (Constructor.java:417)

```java
public T newInstance(Object ... initargs)
  throws InstantiationException, IllegalAccessException,
IllegalArgumentException, InvocationTargetException
{
  if (!override) {
    if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {
      Class<?> caller = Reflection.getCallerClass();
      checkAccess(caller, clazz, null, modifiers);
    }
  }
  if ((clazz.getModifiers() & Modifier.ENUM) != 0)
    ////////////  417  //////////// 
    throw new IllegalArgumentException("Cannot reflectively create enum objects");
  ConstructorAccessor ca = constructorAccessor;   // read volatile
  if (ca == null) {
    ca = acquireConstructorAccessor();
  }
  @SuppressWarnings("unchecked")
  T inst = (T) ca.newInstance(initargs);
  return inst;
}
```

可以看到反射创建实例的时候会判断类的修饰符中是否有 enum，如果有就抛出 `IllegalArgumentException` 异常。

因此，**枚举类型可以防止反射攻击**。

##### 非枚举的防守方法

在构造器中判断实例是否已经存在，存在就抛出异常，保证构造器只被调用一次！

```java
public class Singleton1 {

  private static Singleton1 instance = new Singleton1();

  private Singleton1() {
    if (instance != null)
      throw new RuntimeException("实例已存在，单例构造器只能被调用一次！");
  }

  public static Singleton1 getInstance() {
    return instance;
  }
}
```

#### 序列化攻击

一般类需要实现 `Serializable` 接口才能被序列化，但枚举类不用，因为枚举类本质是继承了 `java.lang.Enum` 的，而 Enum 已经声明实现了 `Serializable`。

一般的单例模式无法防止序列化攻击，经过序列化和反序列化后会创建出新的实例。

```java
public class SingletonTest2 {

  public static void main(String[] args) throws IOException, ClassNotFoundException {
    Singleton1 instance = Singleton1.getInstance();

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    ObjectOutputStream objectOutputStream = new ObjectOutputStream(outputStream);
    objectOutputStream.writeObject(instance);
    byte[] bytes = outputStream.toByteArray();

    ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
    ObjectInputStream objectInputStream = new ObjectInputStream(byteArrayInputStream);
    Singleton1 instance1 = (Singleton1) objectInputStream.readObject();

    System.out.println(instance == instance1);
  }
}
```

```
false

Process finished with exit code 0
```

但是对于枚举类来说，反序列化后还是原来的实例。

```java
public static void main(String[] args) throws IOException, ClassNotFoundException {
  Singleton6 instance = Singleton6.INSTANCE;

  ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
  ObjectOutputStream objectOutputStream = new ObjectOutputStream(outputStream);
  objectOutputStream.writeObject(instance);
  byte[] bytes = outputStream.toByteArray();

  ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
  ObjectInputStream objectInputStream = new ObjectInputStream(byteArrayInputStream);
  Singleton6 instance1 = (Singleton6) objectInputStream.readObject();

  System.out.println(instance == instance1);
}
```

```
true

Process finished with exit code 0
```

可以看到反序列化枚举后得到的实例和序列化之前的实例是同一个实例。查看 `ByteArrayOutputStream.writeObject()` 方法源码：

```java
public final void writeObject(Object obj) throws IOException {
  if (enableOverride) {
    writeObjectOverride(obj);
    return;
  }
  try {
    writeObject0(obj, false);
  } catch (IOException ex) {
    if (depth == 0) {
      writeFatalException(ex);
    }
    throw ex;
  }
}
```

`writeObject0()` 源码：

```java
private void writeObject0(Object obj, boolean unshared)
  throws IOException
{

  //  ...

  // remaining cases
  if (obj instanceof String) {
    writeString((String) obj, unshared);
  } else if (cl.isArray()) {
    writeArray(obj, desc, unshared);
  } else if (obj instanceof Enum) {
    writeEnum((Enum<?>) obj, desc, unshared);
  } else if (obj instanceof Serializable) {
    writeOrdinaryObject(obj, desc, unshared);
  } else {
    if (extendedDebugInfo) {
      throw new NotSerializableException(
        cl.getName() + "\n" + debugInfoStack.toString());
    } else {
      throw new NotSerializableException(cl.getName());
    }
  }
} finally {
  depth--;
  bout.setBlockDataMode(oldMode);
}
}
```

如果是枚举类型，会调用 `writeEnum()` 方法：

```java
private void writeEnum(Enum<?> en,
                       ObjectStreamClass desc,
                       boolean unshared)
  throws IOException
{
  /**
  * Enum 类型标记：129
     * new Enum constant.
     * @since 1.5
     */
  // final static byte TC_ENUM =         (byte)0x7E;
  bout.writeByte(TC_ENUM);
  ObjectStreamClass sdesc = desc.getSuperDesc();
  writeClassDesc((sdesc.forClass() == Enum.class) ? desc : sdesc, false);
  handles.assign(unshared ? null : en);
  writeString(en.name(), false);
}
```

接着再看 Enum 类型的反序列化，`ObjectInputStream.readObject()` 源码：

```java
public final Object readObject()
  throws IOException, ClassNotFoundException
{
  if (enableOverride) {
    return readObjectOverride();
  }

  // if nested read, passHandle contains handle of enclosing object
  int outerHandle = passHandle;
  try {
    Object obj = readObject0(false);
    handles.markDependency(outerHandle, passHandle);
    ClassNotFoundException ex = handles.lookupException(passHandle);
    if (ex != null) {
      throw ex;
    }
    if (depth == 0) {
      vlist.doCallbacks();
    }
    return obj;
  } finally {
    passHandle = outerHandle;
    if (closed && depth == 0) {
      clear();
    }
  }
}
```

`ObjectInputStream.readObject0()` 源码：

```java
private Object readObject0(boolean unshared) throws IOException {
  // ...

  try {
    switch (tc) {

        // ...
      case TC_ENUM:
        return checkResolve(readEnum(unshared));

      case TC_OBJECT:
        return checkResolve(readOrdinaryObject(unshared));

      case TC_EXCEPTION:
        IOException ex = readFatalException();
        throw new WriteAbortedException("writing aborted", ex);

      case TC_BLOCKDATA:
      case TC_BLOCKDATALONG:
        if (oldMode) {
          bin.setBlockDataMode(true);
          bin.peek();             // force header read
          throw new OptionalDataException(
            bin.currentBlockRemaining());
        } else {
          throw new StreamCorruptedException(
            "unexpected block data");
        }

      case TC_ENDBLOCKDATA:
        if (oldMode) {
          throw new OptionalDataException(true);
        } else {
          throw new StreamCorruptedException(
            "unexpected end of block data");
        }

      default:
        throw new StreamCorruptedException(
          String.format("invalid type code: %02X", tc));
    }
  } finally {
    depth--;
    bin.setBlockDataMode(oldMode);
  }
}
```

`ObjectInputStream.readEnum()` 源码：

```java
private Enum<?> readEnum(boolean unshared) throws IOException {

  // ...
  if (cl != null) {
    try {
      @SuppressWarnings("unchecked")
      Enum<?> en = Enum.valueOf((Class)cl, name);
      result = en;
    } catch (IllegalArgumentException ex) {
      throw (IOException) new InvalidObjectException(
        "enum constant " + name + " does not exist in " +
        cl).initCause(ex);
    }
    if (!unshared) {
      handles.setObject(enumHandle, result);
    }
  }

  handles.finish(enumHandle);
  passHandle = enumHandle;
  return result;
}
```

`Enum.valueOf()` 源码：

```java
public static <T extends Enum<T>> T valueOf(Class<T> enumType,
                                            String name) {
  T result = enumType.enumConstantDirectory().get(name);
  if (result != null)
    return result;
  if (name == null)
    throw new NullPointerException("Name is null");
  throw new IllegalArgumentException(
    "No enum constant " + enumType.getCanonicalName() + "." + name);
}
```

最终是根据 `name` 在枚举类实力数组里查找，所以返回的实例是已经存在的实例，并不会新建实例。

因此**枚举可以防止反序列化攻击**。

##### 非枚举的防守方法

增加 `readResolve()` 方法返回单例，反序列化时会判断对象是否存在该方法，存在则会调用该方法返回对象。

#### 总结

|                         | 饿汉模式 | 懒汉模式 | 线程安全的懒汉模式 | 双重校验锁模式 | 静态内部类单例模式 | 枚举单例模式 |
| :---------------------- | :------- | :------- | :----------------- | :------------- | :----------------- | :----------- |
| 延迟加载                | 否       | 是       | 是                 | 是             | 是                 | 否           |
| 线程安全                | 是       | 否       | 是                 | 是             | 是                 | 是           |
| 反射攻击 (能否抵御)     | 否       | 否       | 否                 | 否             | 否                 | 能           |
| 反序列化攻击 (能否抵御) | 否       | 否       | 否                 | 否             | 否                 | 能           |

### 工厂模式

### 策略模式

> 《大话设计模式》第2章 商场促销——策略模式

#### 现金收费抽象类

```java
public interface CashSuper {
  double acceptCash(double money);
}
```

#### 正常收费子类

```java
public class CashNormal implements CashSuper{
  @Override
  public double acceptCash(double money) {
    return money;
  }
}
```

#### 打折收费子类

```java
public class CashRebate implements CashSuper {

  private double moneyRebate = 1d;

  public CashRebate(double moneyRebate) {
    this.moneyRebate = moneyRebate;
  }

  @Override
  public double acceptCash(double money) {
    return money * moneyRebate;
  }
}
```

#### 返利收费子类

```java
public class CashReturn implements CashSuper {

  private double moneyCondition;

  private double moneyReturn;

  public CashReturn(double moneyCondition, double moneyReturn) {
    this.moneyCondition = moneyCondition;
    this.moneyReturn = moneyReturn;
  }

  @Override
  public double acceptCash(double money) {
    if (money > moneyCondition) {
      money -= (int) (money / moneyCondition) * moneyReturn;
    }
    return money;
  }
}
```

#### 简单工厂实现

##### 现金收费工厂类

```java
public class CashFactory {

  public static CashSuper createCashAccept(String type) {
    CashSuper cashSuper = null;
    switch (type) {
      case "正常收费":
        cashSuper = new CashNormal();
        break;
      case "满300减100":
        cashSuper = new CashReturn(300, 100);
        break;
      case "打8折":
        cashSuper = new CashRebate(0.8);
        break;
      default:
        break;
    }
    return cashSuper;
  }
}
```

##### 客户端

```java
public class Client {

  private final static double MONEY = 1000;

  public static void main(String[] args) {
    CashSuper cashSuper = CashFactory.createCashAccept("正常收费");
    System.out.println("Primary money="+MONEY+", Final money="+cashSuper.acceptCash(MONEY));

    CashSuper cashSuper2 = CashFactory.createCashAccept("满300减100");
    System.out.println("Primary money="+MONEY+", Final money="+cashSuper2.acceptCash(MONEY));

    CashSuper cashSuper3 = CashFactory.createCashAccept("打8折");
    System.out.println("Primary money="+MONEY+", Final money="+cashSuper3.acceptCash(MONEY));
  }
}
```

#### 策略与简单工厂结合

##### CashContext类

```java
public class CashContext {

  private CashSuper cashSuper;

  public CashContext(String type) {
    CashSuper cashSuper = null;
    switch (type) {
      case "正常收费":
        cashSuper = new CashNormal();
        break;
      case "满300减100":
        cashSuper = new CashReturn(300, 100);
        break;
      case "打8折":
        cashSuper = new CashRebate(0.8);
        break;
      default:
        break;
    }
    this.cashSuper = cashSuper;
  }

  public double getResult(double money) {
    return cashSuper.acceptCash(money);
  }
}
```

###### 如何消除switch语句？

通过反射

##### 客户端

```java
public class Client {
  private final static double MONEY = 1000;

  public static void main(String[] args) {
    CashContext cashContext = new CashContext("正常收费");
    System.out.println("Primary money=" + MONEY + ", Final money=" + cashContext.getResult(MONEY));

    CashContext cashContext2 = new CashContext("满300减100");
    System.out.println("Primary money=" + MONEY + ", Final money=" + cashContext2.getResult(MONEY));

    CashContext cashContext3 = new CashContext("打8折");
    System.out.println("Primary money=" + MONEY + ", Final money=" + cashContext3.getResult(MONEY));
  }
}
```

#### 简单工厂模式 VS 策略模式与简单工厂结合

```java
//简单工厂模式的用法
CashSuper cashSuper = CashFactory.createCashAccept(type);
cashSuper.acceptCash(MONEY);

//策略模式与简单工厂结合的用法
CashContext cashContext = new CashContext(type);
cashContext.getResult(MONEY);
```

1. 简单工厂模式需要让客户端认识两个类，CashSuper和CashFactory，而策略模式与简单工厂结合的用法，客户端就只需要认识一个类CashContext就可以了。耦合更加降低。
2. 策略模式与简单工厂结合的用法在客户端实例化的是CashContext的对象，调用的是CashContext的方法getResult，这使得具体的收费算法彻底地与客户端分离。连算法的父类CashSuper都不让客户端认识了。

#### 策略模式的优缺点

##### 优点

1. 低耦合

   策略模式是一种定义一系列算法的方法，所有算法完成相同的工作，只是实现不同，它可以以相同的方式调用所有的算法，减少了各种算法类与使用算法类之间的耦合。

2. 简化单元测试

   每个算法都有自己的类，可以通过自己的接口单独测试。

##### 缺点

1. 策略类需要对客户端透明：客户端必须知道所有的策略类，并自行决定哪一个策略类，也就是客户端需要理解这些算法的区别以便选择适当的算法
2. 策略类数量多：策略模式会造成系统产生很多具体策略类，任何细小的变化都会导致系统增加一个新的具体策略类
3. 客户端无法使用多个策略类：客户端每次只能使用一个策略类，不支持使用一个策略类完成部分功能后再使用另一个策略类来完成剩下的功能

#### 典型应用

##### JDK

###### 比较器接口 `java.util.Comparator`

通过 `Collections.sort(List,Comparator)` 和 `Arrays.sort(Object[],Comparator)` 对集合和数组进行排序。

`Comparator` 接口充当了**抽象策略**角色，`Collections` 和 `Arrays` 则是**环境**角色。

##### Spring

###### 实例化策略接口 `org.springframework.beans.factory.support.InstantiationStrategy`

Spring 在具体实例化Bean的过程中，先通过 `ConstructorResolver` 找到对应的实例化方法和参数，再通过实例化策略 `InstantiationStrategy` 进行实例化。

```java
public interface InstantiationStrategy {
  // 默认构造方法/无参构造方法
  Object instantiate(RootBeanDefinition beanDefinition, String beanName, BeanFactory owner) throws BeansException;

  // 指定构造方法/有参构造方法
  Object instantiate(RootBeanDefinition beanDefinition, String beanName, BeanFactory owner, Constructor<?> ctor,
                     Object[] args) throws BeansException;

  // 指定工厂方法
  Object instantiate(RootBeanDefinition beanDefinition, String beanName, BeanFactory owner, Object factoryBean,
                     Method factoryMethod, Object[] args) throws BeansException;
}
```

`InstantiationStrategy` 扮演**抽象策略**角色，有两种具体策略类，分别为 `SimpleInstantiationStrategy` 和 `CglibSubclassingInstantiationStrategy`

![Spring 实例化策略类图](http://image.laijianfeng.org/20181018_171946.png)

在 `SimpleInstantiationStrategy` 中对这三个方法做了简单实现，如果工厂方法实例化直接用反射创建对象，如果是构造方法实例化的则判断是否有 `MethodOverrides`，如果无 `MethodOverrides` 也是直接用反射，如果有 `MethodOverrides` 就需要用 `cglib` 实例化对象，`SimpleInstantiationStrategy` 把通过 `cglib` 实例化的任务交给了它的子类 `CglibSubclassingInstantiationStrategy`。

##### 项目

###### 应用世界：不同策略上下架应用

应用世界中上下架应用有不同的策略：过期时间、点击量、用户量等策略。

过期时间策略在应用到达过期时间时自动下架。

点击量在应用的点击次数到达阀值后自动下架。

用户量在应用的新用户数达到阀值后自动下架。

### 责任链模式

#### 模式结构

责任链模式包含如下角色：

- 处理器抽象类
- 具体处理器
- 处理器链维护器(可选)：维护了各个处理器的前后关系。可以由客户端再发送请求前生成链，或者动态地生成链。
- 客户端

#### 伪例

请假流程

![](https://user-gold-cdn.xitu.io/2018/10/31/166c90b174855416)

请假请求类：LeaveRequest

```java
public class LeaveRequest {

  int days;

  public LeaveRequest(int days) {
    this.days = days;
  }
}
```

处理器抽象类：LeaveRequestHandler

```java
public abstract class LeaveRequestHandler {
  int threshold;

  public LeaveRequestHandler(int threshold) {
    this.threshold = threshold;
  }

  public abstract Boolean handle(LeaveRequest leaveRequest);
}
```

处理器具体类：SupervisorHandler、ManagerHandler、GeneralManagerHandler

```java
public class SupervisorHandler extends LeaveRequestHandler {
  public SupervisorHandler(int threshold) {
    super(threshold);
  }

  @Override
  public Boolean handle(LeaveRequest leaveRequest) {
    if (leaveRequest.days <= threshold){
      return new Random().nextBoolean();
    }
    return null;
  }
}

public class ManagerHandler extends LeaveRequestHandler {
  public ManagerHandler(int threshold) {
    super(threshold);
  }

  @Override
  public Boolean handle(LeaveRequest leaveRequest) {
    if (leaveRequest.days <= threshold){
      return new Random().nextBoolean();
    }
    return null;
  }
}

public class GeneralManagerHandler extends LeaveRequestHandler {

  public GeneralManagerHandler(int threshold) {
    super(threshold);
  }

  @Override
  public Boolean handle(LeaveRequest leaveRequest) {
    if (leaveRequest.days <= threshold){
      return new Random().nextBoolean();
    }
    return null;
  }
}
```

客户端：Worker

```java
public class Worker {
  public static void main(String[] args) {
    int days = 3;
    Boolean response = requestLeave(days);
    System.out.println("申请" + days + "天," + (response ? "申请成功！" : "申请失败！"));
  }

  private static Boolean requestLeave(int days) {
    LeaveRequest leaveRequest = new LeaveRequest(days);
    SupervisorHandler supervisorHandler = new SupervisorHandler(3);
    ManagerHandler managerHandler = new ManagerHandler(7);
    GeneralManagerHandler generalManagerHandler = new GeneralManagerHandler(Integer.MAX_VALUE);
    LeaveRequestHandlerChain chain = new LeaveRequestHandlerChain();
    chain.addHandler(supervisorHandler);
    chain.addHandler(managerHandler);
    chain.addHandler(generalManagerHandler);
    return chain.process(leaveRequest);
  }
}
```

#### 典型应用

##### Tomcat 过滤器中的责任链模式

`Servlet` 过滤器是可用于 `Servlet` 编程的 Java 类，可以实现以下目的：在客户端的请求访问后端资源之前，拦截这些请求；在服务器的响应发送回客户端之前，处理这些响应。

##### Mybatis 中的 Plugin 机制

Mybatis 中的 Plugin 机制使用了责任链模式，配置各种官方或者自定义的 Plugin，与 Filter 类似，可以在执行 Sql 语句的时候做一些操作。

### 包装模式/装饰者模式

> 别称：包装模式、装饰器模式、Wrapper、Decorator

装饰器模式（Decorator Pattern）允许在**不改变其结构**的情况下向一个现有的对象添加新的功能。

#### 结构

1. **抽象构件** （Component）
2. **具体构件** （Concrete Component）
3. **抽象装饰类** （Decorator） 
4. **具体装饰类** （Concrete Decorators）

#### 简单示例

> [装饰器模式| 菜鸟教程](https://www.runoob.com/design-pattern/decorator-pattern.html)

画图形：图形有长方形、圆形；可以画红色的也可以画绿色的。

##### 抽象构件

```java
public interface Shape {
  void draw();
}
```

##### 具体构件

```java
public class Rectangle implements Shape {
  @Override
  public void draw() {
    System.out.print("Shape: rectangle\t");
  }
}
```

```java
public class Circle implements Shape {
  @Override
  public void draw() {
    System.out.print("Shape: circle\t");
  }
}
```

##### 抽象装饰类

```java
public abstract class ShapeDecorator implements Shape {
  protected Shape shape;

  public ShapeDecorator(Shape shape) {
    this.shape = shape;
  }
}
```

##### 具体装饰类

```java
public class RedShapeDecorator extends ShapeDecorator {
  public RedShapeDecorator(Shape shape) {
    super(shape);
  }

  @Override
  public void draw() {
    shape.draw();
    System.out.println("Color: red");
  }
}
```

```java
public class GreenShapeDecorator extends ShapeDecorator {
  public GreenShapeDecorator(Shape shape) {
    super(shape);
  }

  @Override
  public void draw() {
    shape.draw();
    System.out.println("Color: green");
  }
}
```

##### 客户端使用

```java
public static void main(String[] args) {
  Shape shape = new RedShapeDecorator(new Rectangle());
  shape.draw();

  shape = new GreenShapeDecorator(new Rectangle());
  shape.draw();

  shape = new RedShapeDecorator(new Circle());
  shape.draw();

  shape = new GreenShapeDecorator(new Circle());
  shape.draw();
}
```

```
Shape: rectangle	Color: red
Shape: rectangle	Color: green
Shape: circle	Color: red
Shape: circle	Color: green
```

#### 典型应用

> [设计模式| 装饰者模式及典型应用 - 掘金](https://juejin.im/post/6844903681322647566)

##### Java I/O

抽象构件：`java.io.InputStream`

具体构件：

- `java.io.FileInputStream`

- `java.io.ByteArrayInputStream`

- `java.io.PipedInputStream`

抽象装饰类：`java.io.FilterInputStream`

具体装饰类：

- `java.io.BufferedInputStream`

- `java.io.DataInputStream`

- `java.io.PushbackInputStream`

![](https://user-gold-cdn.xitu.io/2018/9/18/165ecd4e160d8682)

实例化一个具有缓存功能的字节流对象时，只需要在 FileInputStream 对象上再套一层 BufferedInputStream 对象即可。

```java
FileInputStream fileInputStream = new FileInputStream(filePath);
BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
```

DataInputStream 装饰者提供了对更多数据类型进行输入的操作，比如 int、double 等基本类型。

### 模版方法模式

### 代理模式

> [秒懂Java代理与动态代理模式](https://blog.csdn.net/shusheng0007/article/details/80864854)

用代理对象**代替**目标对象来实现某个目的（服务/主题/功能）。

#### 目的

1. 隐藏目标对象
2. 增强目标对象

#### 代理模式结构

> [代理模式 | **Refactoring.Guru**](https://refactoringguru.cn/design-patterns/proxy)

1. 服务接口

   声明了服务接口。 代理必须遵循该接口才能伪装成服务对象。

2. 服务类

   提供了一些实用的业务逻辑。

3. 代理类

   代理类包含一个指向服务对象的引用成员变量。 代理完成其任务 （例如延迟初始化、 记录日志、 访问控制和缓存等） 后会将请求传递给服务对象。 通常情况下， 代理会对其服务对象的整个生命周期进行管理。

4. 客户端

   客户端能通过同一接口与服务或代理进行交互，所以你可在一切需要服务对象的代码中使用代理。

#### 静态代理

劳动仲裁案例：代理律师代理讨薪员工索要工资。

##### 服务接口

> 代理主题：讨薪

```java
public interface AskAbility {

  public void askForPay();
}
```

##### 服务类

```java
public class ZhangSan implements AskAbility {
  @Override
  public void askForPay() {
    System.out.println("还钱！");
  }
}
```

##### 代理类

```java
public class Lawyer implements AskAbility {
  private ZhangSan zhangSan;

  public Lawyer(ZhangSan zhangSan) {
    this.zhangSan = zhangSan;
  }

  @Override
  public void askForPay() {
    zhangSan.askForPay();
    System.out.println("如果不还将承担法律责任！");
  }
}
```

##### 客户端

```java
public class Client {

  public static void main(String[] args) {
    ZhangSan zhangSan = new ZhangSan();
    AskAbility ask = new Lawyer(zhangSan);
    ask.askForPay();
  }
}
```

#### 动态代理

静态代理中代理类在编译期已经存在，一个服务类需要一个代理类与之对应，当服务类增多时，代理类随着增多，导致类数量太多。

动态代理就是为了减少类数量而产生。

动态代理有 JDK(基于接口、反射生成) 和 CGLIB(基于继承、字节码生成) 两种实现方式。

Spring AOP 就是基于动态代理实现的。

> [关于 Spring AOP (AspectJ) 你该知晓的一切](https://blog.csdn.net/javazejian/article/details/56267036)
>
> [Spring系列教材 （三）- 注解方式 IOC/DI](https://how2j.cn/k/spring/spring-annotation-ioc-di/1067.html)

##### JDK 动态代理

两个重要的元素：

1. InvocationHandler 接口

   `public Object invoke(Object proxy, Method method, Object[] args) throws Throwable;`

   - proxy：动态代理对象
   - method：正在执行的方法
   - args：当前执行方法传入的实参

2. Proxy 类

   `public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h) throws IllegalArgumentException`

```java
public class AskingHandler implements InvocationHandler {

  private Object target;

  public AskingHandler(Object target) {
    this.target = target;
  }

  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    Object invoke = method.invoke(target, args);
    System.out.println("如果不还将承担法律责任！");
    return invoke;
  }
}
```

```java
public class Client {

  public static void main(String[] args) {
    Employee employee = new Employee();
    InvocationHandler handler = new AskingHandler(employee);
    AskAbility proxy = (AskAbility) Proxy.newProxyInstance(employee.getClass().getClassLoader(), employee.getClass().getInterfaces(), handler);
    proxy.askForPay();
  }
}
```

##### CGLIB 动态代理

JDK 只能对实现了接口的类做动态代理，而不能对没有实现接口的类做动态代理，所以出现了 cgLib。

CGLib（Code Generation Library）是一个强大、高性能的 Code 生成类库，它可以在程序运行期间动态扩展类或接口，它的底层是使用 **java字节码操作框架** ASM 实现。

CGLIB 两个重要元素：

1. MethodInterceptor 方法拦截器

   `Object intercept(Object var1, Method var2, Object[] var3, MethodProxy var4) throws Throwable;`

2. Enhancer

   ```java
   public static Object create(Class type, Callback callback) {
     Enhancer e = new Enhancer();
     e.setSuperclass(type);
     e.setCallback(callback);
     return e.create();
   }
   ```

###### 服务类

```java
public class Employee {

  public void askForPay() {
    System.out.println("还钱！");
  }
}
```

###### 方法拦截器

```java
public class AskingMethodInterceptor implements MethodInterceptor {

  @Override
  public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
    Object result = methodProxy.invokeSuper(o, objects);
    if (method.getName().equals("askForPay"))
      System.out.println("如果不还将承担法律责任！");
    return result;
  }
}
```

###### 客户端

```java
public class Client {

  public static void main(String[] args) {
    Employee employee = new Employee();
    Employee proxy = (Employee) Enhancer.create(employee.getClass(), new AskingMethodInterceptor());

    proxy.askForPay();
  }
}
```

##### Spring 何时使用JDK/CGLIB

1. 目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP。

2. 目标对象没有实现了接口，采用 CGLIB 库。

##### 如何强制使用 CGLIB 实现 AOP

1. 在 Spring 配置文件中加入: 

   `<aop:aspectj-autoproxy proxy-target-class="true"/>`

2. Spring Boot 中是在主配置文件中添加：

   `spring.aop.proxy-target-class=true`

   或者在启动类上添加：

   `@EnableAspectJAutoProxy(proxyTargetClass = true)`

在 Spring Boot 2.x 已经默认使用 CGLIGB 生成代理了。

> [惊人！Spring5 AOP 默认使用Cglib ？从现象到源码深度分析](https://juejin.cn/post/6844903982721138696)

1. Spring 5.x 中 AOP 默认依旧使用 JDK 动态代理。

2. SpringBoot 2.x 开始，为了解决使用 JDK 动态代理可能导致的类型转化异常而默认使用 CGLIB。

3. 在 SpringBoot 2.x 中，如果需要默认使用 JDK 动态代理可以通过配置项`spring.aop.proxy-target-class=false`来进行修改，`proxyTargetClass`配置已无效。

强制使用 cglib 做动态代理有哪些好处？

> [spring 强制使用cglib做动态代理有哪些好处？](https://segmentfault.com/q/1010000010067944)

1. 如果不做特殊配置 spring 的 `@Transactional` 注解，放在类中非接口内的方法上时，是不起作用的。因为 spring 默认使用JDK的代理，被代理的类只能拦截接口中的方法，不能拦截非接口中的方法。

2. 如果注入时需要直接使用子类，那么启动时会报错

   ```java
   // 正常
   @Autowired
   UserService userService;
   
   // 报错：
   @Autowired
   UserServiceImpl userService;
   ```

   因为 JDK 动态代理是基于接口的，代理生成的对象只能赋值给接口变量。

   ![](https://user-gold-cdn.xitu.io/2019/10/29/16e14e77e77ccee0)

##### JDK 与 CGLIB 性能对比

> [Spring AOP 中 JDK 和 CGLib 动态代理哪个更快？](https://blog.csdn.net/xlgen157387/article/details/82497594)

1. JDK 在创建代理类的速度上要比 CGLIB 快大概8倍左右
2. JDK 1.6以前，CGLIB 代理类执行代理方法的速度要比 JDK 的大概高 10 倍。
3. JDK 1.6/1.7 时，JDK 动态代理的运行速度在调用次数比较少的情况下要比 CGLIB 快，调用次数多的情况下还是 CGLIB 更快一些。
4. JDK 1.8 时，JDK 动态代理的运行速度已经比 CGLIB 快了。

##### JDK 动态代理与 CGLIB 动态代理的区别

1. JDK 动态代理基于接口，CGLIB 动态代理基于继承
2. JDK 动态代理通过反射生成代理，CGLIB 通过操作字节码生成动态代理
3. JDK 生成动态代理比CGLIB快
4. JDK 动态代理执行代理方法时，需要通过反射机制进行回调，CGLIB 对方法的调用和直接调用普通类的方式一致，所以`CGLib`执行代理方法的效率要高于`JDK`的动态代理

### 迭代器模式

> [Design-Pattern-Iterator | libo9527](http://libo9527.github.io/2020/11/04/Design-Pattern-Iterator/)

#### 目的

在不暴露集合底层表现形式 （列表、 栈和树等） 的情况下遍历集合中所有的元素。

#### 主要思想

将集合的遍历行为抽取为单独的迭代器对象。

#### 结构

1. 抽象迭代器（Iterator）
2. 具体迭代器（Concrete Iterators）
3. 抽象集合（Collection）
4. 具体集合（Concrete Collections）

#### 简单示例

学生报数

##### 抽象迭代器

```java
public interface StudentIterator {
  boolean hashNext();

  Student next();
  
  int getPosition();
}
```

##### 具体迭代器

```java
public class ConcreteStudentIterator implements StudentIterator {

  private Student[] students;
  private int position = 0;

  public ConcreteStudentIterator(Student[] students) {
    this.students = students;
  }

  @Override
  public int getPosition() {
    return position;
  }

  @Override
  public boolean hashNext() {
    return position < students.length;
  }

  @Override
  public Student next() {
    return students[position++];
  }
}
```

##### 抽象集合

```java
public abstract class StudentCollection {

  abstract StudentIterator createIterator();
}
```

##### 具体集合

```java
public class ConcreteStudentCollection extends StudentCollection {
  private Student[] students;

  public ConcreteStudentCollection(Student[] students) {
    this.students = students;
  }

  @Override
  StudentIterator createIterator() {
    return new ConcreteStudentIterator(students);
  }
}
```

##### 客户端使用

```java
public static void main(String[] args) {
  StudentCollection studentCollection = new ConcreteStudentCollection(new Student[]{new Student("张三"), new Student("李四")});
  StudentIterator iterator = studentCollection.createIterator();
  while (iterator.hashNext()) {
    Student student = iterator.next();
    System.out.println("我是" + iterator.getPosition() + "号：" + student.getName());
  }
}
```

```
我是1号：张三
我是2号：李四

Process finished with exit code 0
```

#### 典型应用

##### Java 集合

![](../post_image/image_2020_11_04T11_06_19_787Z.png)

