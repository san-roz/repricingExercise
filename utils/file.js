const fs = require('fs').promises;

const writeToFile = (filePath, body) => {
    return fs.appendFile(filePath, body)
};

const openNewFile = (filePath) => {
    return fs.open(filePath, 'a')
};

module.exports = {
    writeToFile,
    openNewFile
}