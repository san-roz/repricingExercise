const CronJob = require('cron').CronJob;
const config =  require('../config');
const file =    require('./file')

let amountOfFiles = 0;
let amountOfRecordsInLastFile = 0;
const path = config.urls.repricingResults;
const maxRecordsInFile = config.file.maxRecordsInFile;

const logRequestTofile = (body) => {
    let filePath = getRecentFilePath();

    if (amountOfRecordsInLastFile < maxRecordsInFile) {
        return file.writeToFile(filePath, body) 
        .then(() => {amountOfRecordsInLastFile++;})
        .catch(error => Promise.reject(error))
    } else {
        filePath = getNewFilePath();
        return file.openNewFile(filePath)
        .then(() => {
            amountOfRecordsInLastFile = 0; 
            file.writeToFile(filePath, body)
        })
        .catch(error => Promise.reject(error))
    }
}

new CronJob('* * * * * *', () => {
    file.openNewFile(getNewFilePath());
}, null, true);

const getNewFilePath = () => {
    amountOfFiles++;
    return (path + amountOfFiles);
} 

const getRecentFilePath = () => {
    return (path + amountOfFiles);
}

module.exports = {
    logRequestTofile
}