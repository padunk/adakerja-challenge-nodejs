const bent = require("bent");
const {
    calculateNextBirthday,
    validateDate,
    validateYesNo,
} = require("./helpers.js");

const initialValue = {
    isFirst: true,
    key: 0,
    firstName: "",
    birthDate: "",
    daysTillNextBirthday: 0,
};

const messageBySender = {};

const responses = {
    1: { text: "Hi! What is your name?" },
    2: {
        text:
            "What is your birthday? Please reply with this format: YYYY-MM-DD",
    },
    3: { text: "Do you want to know how many days till your next birthday?" },
};

function handleMessage(sender_psid, received_message) {
    let response = { text: "" };
    if (!messageBySender.hasOwnProperty(sender_psid)) {
        messageBySender[sender_psid] = initialValue;
    } else {
        switch (messageBySender[sender_psid].key) {
            case 1:
                messageBySender[
                    sender_psid
                ].firstName = received_message.text.trim();
                break;
            case 2:
                if (!validateDate(received_message.text)) {
                    response.text = "Please reply with this format: YYYY-MM-DD";
                } else {
                    messageBySender[sender_psid].birthDate =
                        received_message.text;
                }
                break;
            case 3:
                if (!validateYesNo(received_message.text)) {
                    response.text = "Goodbye 👋";
                } else {
                    messageBySender[
                        sender_psid
                    ].daysTillNextBirthday = calculateNextBirthday(
                        messageBySender[sender_psid].birthDate
                    );
                }
                break;
            default:
                response.text = "Goodbye 👋";
                callSendAPI(sender_psid, response);
                return;
        }
    }
    messageBySender[sender_psid].key++;
    if (messageBySender[sender_psid].key > 3) {
        response.text = messageBySender[sender_psid].daysTillNextBirthday;
    } else {
        response.text = responses[messageBySender[sender_psid].key].text;
    }
    console.log(messageBySender);
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {}

async function callSendAPI(sender_psid, response) {
    const request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };
    try {
        const post = bent(
            "https://graph.facebook.com/v2.6/me/messages",
            "json",
            "POST",
            200
        );
        await post(
            `?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
            request_body
        );
        console.log("message sent");
    } catch (error) {
        console.log("unable to send message: ", error);
    }
}

module.exports = {
    handleMessage,
    handlePostback,
};
