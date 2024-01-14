<center>
    <img src="./images/fairymq.png" width="200" />

</center>

************
### fairyMQ Node.JS Consumer
************

``` 
import Consumer from 'fairymq-consumer-nodejs'

let consumer = new Consumer("privatekey.pem") // Startomg a new consumer


    Consumer.Listen() // Start listening

    consumer.events.on('event', (data) => {
        // do something magical with data!
    })
}
```

If you want to restrict what messages one consumer can intake by key:
``` 
consumer.ConfigureKey("banana")
```

Now regardless of what's enqueued the listener will only accept messages with the key of `banana`

To change the port of a consumer; So you can have multiple:
``` 
consumer.SetPort("9992")
```