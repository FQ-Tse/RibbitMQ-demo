// 消息订阅
import amqplib from 'amqplib'
const connection = await amqplib.connect('amqp://127.0.0.1:5672')
const channel = await connection.createChannel() //创建一个频道
await channel.assertExchange('fanout', 'fanout')

//添加一个队列
const { queue } = await channel.assertQueue('queue1')
//绑定交换机
/**
 * @param {String} queue 队列名称
 * @param {String} exchange 交换机名称
 * @param {String} routingKey 路由键 *匹配一个单词 #匹配多个单词
 */
await channel.bindQueue(queue, 'fanout', '')
//接收消息
channel.consume(queue, (msg) => {
    console.log(msg.content.toString());
}, {
    noAck: true
})
