// payment-service.js 消费者
const amqp = require('amqplib/callback_api');

// 连接 RabbitMQ 并创建一个频道
amqp.connect('amqp://localhost:5672', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        const queue = 'orderQueue';

        // 确保队列存在
        channel.assertQueue(queue, {
            durable: true // 队列和交换机的持久化
        });

        // 从队列中消费消息
        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
        channel.consume(queue, (msg) => {
            const order = JSON.parse(msg.content.toString());
            console.log('Received order:', order);

            // 假设支付处理逻辑
            setTimeout(() => {
                console.log('Payment processed for order:', order);
                channel.ack(msg); // 确认消息处理完成
            }, 1000);
        }, {
            noAck: false // 确保消息处理完成后才确认
        });
    });
});

