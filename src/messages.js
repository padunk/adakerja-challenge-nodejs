const bent = require("bent");
const {
    calculateNextBirthday,
    validateDate,
    validateYes,
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
    // 3: { text: "Do you want to know how many days till your next birthday?" },
    3: {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title:
                            "Do you want to know how many days till your next birthday?",
                        subtitle: "Tap a button to answer.",
                        buttons: [
                            { type: "postback", title: "Yes!", payload: "yes" },
                            { type: "postback", title: "No", payload: "no" },
                        ],
                    },
                ],
            },
        },
    },
};

/**
 * handle message function from user
 * @param {string} sender_psid - sender id
 * @param {object} received_message - {text: string}
 * @returns void | undefined
 */
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
                    callSendAPI(sender_psid, response);
                    return;
                } else {
                    messageBySender[sender_psid].birthDate =
                        received_message.text;
                }
                break;
            case 3:
                if (!validateYes(received_message.text)) {
                    response.text = "Goodbye 👋";
                    callSendAPI(sender_psid, response);
                    return;
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
        response = responses[messageBySender[sender_psid].key];
    }
    console.log(messageBySender);
    callSendAPI(sender_psid, response);
}

/**
 * handle postback value from user
 * @param {string} sender_psid - sender string
 * @param {object} received_postback : {payload: string}
 * @returns void | undefined
 */
function handlePostback(sender_psid, received_postback) {
    let response = { text: "" };
    if (!validateYes(received_postback.payload)) {
        response.text = "Goodbye 👋";
        callSendAPI(sender_psid, response);
        return;
    }

    messageBySender[sender_psid].daysTillNextBirthday = calculateNextBirthday(
        messageBySender[sender_psid].birthDate
    );
    messageBySender[sender_psid].key++;
    if (messageBySender[sender_psid].key > 3) {
        response.text = messageBySender[sender_psid].daysTillNextBirthday;
    } else {
        response = responses[messageBySender[sender_psid].key];
    }
    callSendAPI(sender_psid, response);
}

/**
 *
 * @param {string} sender_psid - sender id
 * @param {object} response - response object
 */
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
