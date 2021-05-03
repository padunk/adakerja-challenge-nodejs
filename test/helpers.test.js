const {
    calculateNextBirthday,
    validateDate,
    validateYes,
} = require("../src/helpers");

// Validate Date
describe("validate date string", () => {
    test("should reject string", () => {
        expect(validateDate("a")).toBe(false);
        expect(validateDate("abc")).toBe(false);
    });
    test("should reject not formatted date", () => {
        // expect uuuu-uu-uu
        expect(validateDate("01-01-2021")).toBe(false);
        expect(validateDate("20-201-2021")).toBe(false);
        expect(validateDate("201-201-2021")).toBe(false);
        expect(validateDate("201-2021-2021")).toBe(false);
        expect(validateDate("2012-2021-2021")).toBe(false);
        expect(validateDate("2012-2021-202")).toBe(false);
        expect(validateDate("2012-202-202")).toBe(false);
        expect(validateDate("2012-202-20")).toBe(false);
        expect(validateDate("201-202-20")).toBe(false);
        expect(validateDate("201-20-20")).toBe(false);
        expect(validateDate("20-20-20")).toBe(false);
        expect(validateDate("2021-2-2")).toBe(false);
    });
    test("should reject letter formatted date", () => {
        // expect uuuu-uu-uu
        expect(validateDate("abcd-ab-ab")).toBe(false);
    });
    test("should reject invalid formatted date", () => {
        // expect yyyy-mm-dd
        expect(validateDate("2021-13-01")).toBe(false);
    });
    test("should accept valid formatted date", () => {
        // expect yyyy-mm-dd
        expect(validateDate("3000-01-01")).toBe(true);
        expect(validateDate("2020-02-29")).toBe(true);
        expect(validateDate("2021-02-01")).toBe(true);
    });
});

describe("validate yes string", () => {
    test('should reject string except "y"', () => {
        expect(validateYes("a")).toBe(false);
        expect(validateYes("b")).toBe(false);
        expect(validateYes("y")).toBe(true);
    });
});

describe("calculate next birthday", () => {
    test("should reject not string type", () => {
        expect(calculateNextBirthday(20)).toBeUndefined();
        expect(calculateNextBirthday(() => {})).toBeUndefined();
        expect(calculateNextBirthday(true)).toBeUndefined();
    });
    test("should return correct days", () => {
        const date = ["1998-05-03", "3001-05-02", "2008-10-03"];
        expect(calculateNextBirthday(date[0])).toMatch("365 days");
        expect(calculateNextBirthday(date[1])).toMatch("364 days");
        expect(calculateNextBirthday(date[2])).toMatch("153 days");
    });
});
