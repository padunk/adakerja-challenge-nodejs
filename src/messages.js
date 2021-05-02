const bent = require('bent')

function handleMessage(sender_psid, received_message) {
    let response = {text: ''};
    callSendAPI(sender_psid, response)
}

function handlePostback(sender_psid, received_postback) {

}

async function callSendAPI(sender_psid, response) {
    const request_body = {
        "recipient": {
            "id": sender_psid
        },
        message: response
    }
    try {
        const post = bent('https://graph.facebook.com/v2.6/me/messages', 'json', 'POST', 200)
        await post(`?access_token=${process.env.PAGE_ACCESS_TOKEN}`, request_body)
        console.log('message sent')
    } catch (error) {
        console.log('unable to send message: ', error)
    }
}

module.exports = {
    handleMessage, handlePostback
}