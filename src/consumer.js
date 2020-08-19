import Kafka from 'kafkajs'

export default async() => {
    const kafka = new Kafka.Kafka({
        clientId: process.env.CLIENT_NAME || 'kafka-js-course',
        brokers: [process.env.BROKERS || 'localhost:9092']
    })

    const consumer = kafka.consumer({ groupId: process.env.GROUP_NAME || 'my-group' })

    await consumer.connect()
    await consumer.subscribe({ topic: process.env.TOPIC_NAME || 'test-topic', fromBeginning: true })

    await consumer.run({
        eachMessage: async({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                topic,
                partition
            })
        },
    })

    process.on('SIGTERM', () => {
        consumer.stop()
        consumer.disconnect()
    })
}