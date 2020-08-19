import Kafka from 'kafkajs'
import { v4 as uuid } from 'uuid'

export default async() => {
    const kafka = new Kafka.Kafka({
        clientId: process.env.CLIENT_NAME || 'kafka-js-course',
        brokers: [process.env.BROKERS || 'localhost:9092']
    })

    const producer = kafka.producer()

    await producer.connect()

    const interval = setInterval(async() => {
        await producer.send({
            topic: process.env.TOPIC_NAME || 'test-topic',
            messages: [
                { key: 'key', value: uuid() },
            ],
        })
    }, 2000)

    process.on('SIGTERM', () => {
        clearInterval(interval)
        producer.disconnect()
    })
}