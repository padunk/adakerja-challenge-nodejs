"use strict";

require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const verifyWebhook = require("./verify-webhook");
const { handleMessage, handlePostback } = require("./messages");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database("./db/messages.db", (err) => {
    if (err) {
        console.error(err.message);
        return;
    }

    // db.serialize(() => {
    //     db.run(
    //         "CREATE TABLE messages (user TEXT NOT NULL, message TEXT NOT NULL)"
    //     );
    // });

    // let query = `SELECT * FROM messages`;
    // db.all(query, [], (err, rows) => {
    //     if (err) {
    //         throw err;
    //     }
    //     rows.forEach((row) => {
    //         console.log(row);
    //     });
    // });
});

app.get("/webhook", verifyWebhook);

app.post("/webhook", (req, res) => {
    const body = req.body;

    if (body.object === "page") {
        body.entry.forEach((entry) => {
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);
            const sender_psid = webhook_event.sender.id;
            console.log("Sender PSID:", sender_psid);

            let query = `INSERT INTO messages (user, message) VALUES (?, ?);`;

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
                db.run(query, [sender_psid, webhook_event.message.text]);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
                db.run(query, [sender_psid, webhook_event.postback.payload]);
            }

            res.status(200).send("EVENT_RECEIVED");
        });
    } else {
        res.sendStatus(404);
    }
});

app.get("/messages", (req, res) => {
    let query = `SELECT * FROM messages`;
    const result = [];
    db.all(query, [], (err, rows) => {
        if (err) {
            console.log(err);
            res.send(err.message);
            return;
        }

        console.log("rows:", rows);
        rows.forEach((row) => {
            result.push({
                user: row.user,
                message: row.message,
            });
        });
        res.send(JSON.stringify(result));
    });
});

app.get("/messages/:id", (req, res) => {
    let query = `SELECT * FROM messages WHERE rowid = ?`;
    const result = [];
    db.get(query, req.params.id, (err, row) => {
        if (err) {
            console.log(err);
            res.send(err.message);
            return;
        }
        result.push(row);
        res.send(JSON.stringify(result));
    });
});

app.delete("/messages/:id", (req, res) => {
    let query = `DELETE FROM messages WHERE rowid = ?`;

    db.run(query, req.params.id, (err, row) => {
        if (err) {
            console.log(err);
            res.send(err.message);
            return;
        }

        res.send(`Successfully delete message with id: ${req.params.id}`);
    });
});

app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`);
});
