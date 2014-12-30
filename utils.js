var utils = module.exports = {
    underscored(str, sep="_") {
        return str.replace(/([a-z])([A-Z])/g, "$1" + sep + "$2").toLowerCase();
    }
};
