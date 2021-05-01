'use strict'

require('dotenv').config()
const express = require('express')
const verifyWebhook = require('./verify-webhook')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/webhook', verifyWebhook)

app.post('/webhook', (req, res) => {
    const body = req.body

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhook_event = entry.messaging[0]
            console.log(webhook_event)
            const sender_psid = webhook_event.sender.id
            console.log("Sender PSID:", sender_psid)
            res.status(200).send('EVENT_RECEIVED')
        })
    }else {
        res.sendStatus(404)
    }
})

app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`)
})
