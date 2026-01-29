import amqp from "amqplib";

async function send() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello_queue";

    await channel.assertQueue(queue, { durable: true });

    const message = "Hello RabbitMQ";

    channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true
    });

    console.log("Sent:", message);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

send();
