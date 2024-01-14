<center>
    <img src="./images/fairymq.png" width="200" />

</center>

************
### fairyMQ Node.JS Consumer
************

``` 
import Consumer from 'fairymq-consumer-nodejs'

let consumer = new Consumer("privatekey.pem")


    Consumer.Listen() // Start listening

    consumer.events.on('event', (data) => {
        // do something magical with data!
    });
}

```