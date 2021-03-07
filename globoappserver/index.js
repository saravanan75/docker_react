const express = require('express')
const redis = require('redis')
const { Pool } = require('pg')
const cors = require('cors')
const parser = require('body-parser')
const proc = require('process')

const server = express();
server.use(cors());
server.use(parser.json());

const db = new Pool({
    user:'postgres',
    host:'postgres',
    database:'postgres',
    password: 'password',
    port:5432,
});

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

client.set('inventorycount', 0);
server.get('/bug', () => {
    proc.nextTick( () => {
        throw new Error;
    })
})
server.get('/api/get', (req, res) => {
    client.get('inventorycount', (err, count) => {
        console.log("Items in inventory "+count);
        count = parseInt(count)+1;
        client.set('inventorycount', count)
        const amount = count*10;
        console.log("Updating price to DB "+amount)
        db.query('UPDATE inventory SET amount='+amount+' WHERE sku=0001')
        let response = {
            "count": count,
            "amount": amount
        };
        res.json(response);   
    });
});

server.get('/api/check', async (req, res) => {
    const amount = await db.query('SELECT amount as AMOUNT FROM inventory where sku=1');
    console.log("Amount ", amount.rows[0].amount)
    
    client.get("inventorycount", function (err, count) {
        console.log("Count ", count)
        let response = {
            "count": count,
            "amount": amount.rows[0].amount
        };
        res.json(response);
    });
    
});

server.get('/api/sell', (req, res) => {
    client.get('inventorycount', (err, count) => {
        console.log("Items in inventory "+count);
        count = parseInt(count)-1;
        client.set('inventorycount', count)
        const amount = count*10;
        console.log("Updating price to DB "+amount)
        db.query('UPDATE inventory SET amount='+amount+' WHERE sku=0001')
        let response = {
            "count": count,
            "amount": amount
        };
        res.json(response);   
    });
});

server.listen(8080, () => {
    console.log("Globoapp server listening on port 8080");
});
