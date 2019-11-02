const fs = require('fs').promises;

const writeToFile = (filePath, body) => {
    return fs.appendFile(filePath + '.txt', JSON.stringify(body))
};

const openNewFile = (filePath) => {
    return fs.open(filePath + '.txt', 'a')
};

module.exports = {
    writeToFile,
    openNewFile
}