# RibbitMQ-demo
This is a practice demo of ribbitMQ


## 使用 RabbitMQ 避免数据库服务崩溃的风险

通过使用 RabbitMQ 作为缓冲，可以有效避免数据库服务崩溃的风险。生产者将消息放入队列，消费者从队列中读取消息并进行处理，随后确认消息已被处理。在应用之间存在一对多的关系时，可以使用 Exchange 交换机根据不同的规则将消息转发到相应的队列：

### 交换机类型

1. **直连交换机（Direct Exchange）**:
    - 根据消息的路由键（routing key）将消息直接转发到特定队列。

2. **主题交换机（Topic Exchange）**:
    - 根据消息的路由键进行模糊匹配，将消息转发到符合条件的队列。

3. **头部交换机（Headers Exchange）**:
    - 根据消息的头部信息进行转发。

4. **广播交换机（Fanout Exchange）**:
    - 将消息广播到交换机下的所有队列。
