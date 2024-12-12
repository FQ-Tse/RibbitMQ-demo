const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const amqp = require('amqplib');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// RabbitMQ 配置
const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'socketio-messages';

// 提供静态文件服务
app.use(express.static('public'));

// Socket.IO 连接处理
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('sendMessage', async (message, ackCallback) => {
        console.log(`Received message from ${socket.id}:`, message);

        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(QUEUE_NAME, { durable: true });
            channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));

            console.log('Message pushed to RabbitMQ:', message);
            ackCallback('Message received and queued successfully');

            setTimeout(() => {
                channel.close();
                connection.close();
            }, 500);
        } catch (error) {
            console.error('Failed to push message to RabbitMQ:', error);
            ackCallback('Error while queuing the message');
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

async function consumeRabbitMQMessages() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log('RabbitMQ Consumer is ready, waiting for messages...');

        channel.consume(
            QUEUE_NAME,
            (msg) => {
                if (msg !== null) {
                    const message = JSON.parse(msg.content.toString());
                    console.log('Broadcasting message:', message);

                    io.emit('broadcastMessage', message);

                    channel.ack(msg);
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error('Failed to consume RabbitMQ messages:', error);
    }
}

consumeRabbitMQMessages();

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
