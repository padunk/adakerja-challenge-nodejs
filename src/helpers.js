const isMatch = require("date-fns/isMatch");
const formatDistanceToNowStrict = require("date-fns/formatDistanceToNowStrict");
const getDate = require("date-fns/getDate");
const getMonth = require("date-fns/getMonth");
const getYear = require("date-fns/getYear");

/**
 * Validate birth date
 * @param {string} date - in YYYY-MM-DD format
 * @returns boolean
 */
function validateDate(date) {
    if (typeof date !== "string") {
        return false;
    }
    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    if (date.length !== 10 || !dateRegex.test(date)) {
        return false;
    }
    return isMatch(date, "yyyy-MM-dd");
}

/**
 * check user reply text
 * @param {string} reply - user reply text
 * @returns boolean
 */
function validateYes(reply) {
    if (typeof date !== "string") {
        return false;
    }
    const valid = ["y, ok, yeah", "yes", "yup"];

    let filterReply = reply.trim().toLowerCase();
    filterReply = filterReply.replace(/\W/, "");
    return valid.includes(reply);
}

/**
 * calculate next birthday in days
 * @param {string} date - in YYYY-MM-DD format
 * @returns string
 */
function calculateNextBirthday(date) {
    if (typeof date !== "string") {
        return false;
    }
    const year = getYear(Date.now());
    let nowMonth = getMonth(Date.now());
    let nowDate = getDate(Date.now());
    let birthmonth = getMonth(new Date(date));
    let birthdate = getDate(new Date(date));
    let nextDate;

    if (birthmonth < nowMonth) {
        nextDate = new Date(`${year + 1}${date.slice(4)}`);
    } else if (birthmonth === nowMonth) {
        if (birthdate > nowDate) {
            nextDate = new Date(`${year}${date.slice(4)}`);
        } else {
            nextDate = new Date(`${year + 1}${date.slice(4)}`);
        }
    } else {
        nextDate = new Date(`${year}${date.slice(4)}`);
    }

    return formatDistanceToNowStrict(new Date(nextDate), { unit: "day" });
}

module.exports = {
    validateDate,
    validateYes,
    calculateNextBirthday,
};
