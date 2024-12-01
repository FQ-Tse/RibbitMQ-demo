// 消息发布
import amqplib from 'amqplib'
const connection = await amqplib.connect('amqp://localhost:5672')
//创建一个频道
const channel = await connection.createChannel()
//声明一个交换机
/**
 * @param {String} exchange 交换机的名称
 * @param {String} type "direct" | "topic" | "headers" | "fanout" | "match" | 使用广播模式
 * @param {Object} options {durable: true} //开启消息持久化
 */
await channel.assertExchange('fanout', 'fanout',true)
//发送消息
/**
 * @param {String} exchange 交换机的名称
 * @param {String} routingKey 路由键
 * @param {Buffer} content 消息内容
 */
channel.publish('fanout', '', Buffer.from('fanout模式发送的消息'))

//断开
await channel.close()
await connection.close()
process.exit(0)
