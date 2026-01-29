import amqp from "amqplib";

async function receive() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello_queue";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
        console.log("Received:", msg.content.toString());
        channel.ack(msg);
    });
}

receive();
