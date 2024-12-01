const express = require('express');
const amqp = require('amqplib/callback_api');
const app = express();
app.use(express.json());

let channel = null;

// 连接 RabbitMQ 并创建一个频道
amqp.connect('amqp://localhost:5672', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((err, ch) => {
        if (err) {
            throw err;
        }
        channel = ch;
        // 创建队列
        const queue = 'orderQueue';//
     /**
      *  durable: true：确保消息在服务器重启时不会丢失，将队列设置为持久性。
      *  队列的结构和属性仍然会被保留，底层原理是，存储在磁盘。 缺点占用磁盘空间
      *  优点：
      *  持久性队列：适合需要确保队列结构不丢失的场景。
      *  持久性消息：适合需要保证消息在系统崩溃时不丢失的场景
      *  缺点：
      *  每条消息都需要写入磁盘，可能导致延迟增加
      *  持久性消息会占用更多的磁盘空间
      *  */
        channel.assertQueue(queue, { durable: true });
    });
});


// 订单服务 API
app.post('/order', (req, res) => {
    const order = { userId: req.body.userId, productId: req.body.productId };

    // 将订单发送到 RabbitMQ 队列
    channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify(order)), {
        persistent: true // 持久化消息(避免服务器宕机) 底层原理是 存储在磁盘
    });
    console.log("Order sent to queue:", order);

    res.status(201).json({ message: 'Order placed successfully!' });
});

// 启动订单服务
app.listen(3003, () => {
    console.log('Order service is running on port 3001');
});

