describe("utils.underscored", function () {
    var {underscored} = require("/utils");

    var inputs = [
        "something", "anything", "c3po"
    ];

    it("converts a given string into the same alphabets but lowercase and underscore-spaced one", function () {
        expect(underscored("ApplePie")).toBe("apple_pie");
        expect(underscored("XmlHttpRequest")).toBe("xml_http_request");
    });

    it("should be a same result if the input consist of lowercase alphabets", function () {
        inputs.forEach(text => {
            expect(underscored(text)).toBe(text);
        });
    });

    it("should not be include any underscore character if the input was a capitalized word", function () {
        inputs.forEach(text => {
            var capitalized = text.charAt(0).toUpperCase() + text.slice(1);
            expect(underscored(capitalized)).toBe(text);
        });
    });

    it("should convert an uppercase word to a lowercase one, not to add any underscore", function () {
        inputs.forEach(text => {
            expect(underscored(text.toUpperCase())).toBe(text);
        });
    });

    it("can be change a separator", function () {
        expect(underscored("XmlHttpRequest", "-")).toBe("xml-http-request");
    });
});
