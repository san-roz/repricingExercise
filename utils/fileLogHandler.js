const CronJob =     require('cron').CronJob;
const config =      require('../config');
const file =        require('./file');
const errors =      require('../utils/errors')
let lastPrices =    require('../data/lastPrices'); 

let amountOfFiles = 0;
let amountOfRecordsInLastFile = 0;
const PATH = config.urls.repricingResults;
const MAX_RECORDS_IN_FILE = config.file.maxRecordsInFile;

const logRequestTofile = (body) => {
    let filePath;

    amountOfRecordsInLastFile++;

    if (amountOfRecordsInLastFile < MAX_RECORDS_IN_FILE) {
        filePath = getRecentFilePath();
        return updatePrice(filePath, body)
        .catch(error => Promise.reject(error))
    } else {
        filePath = getNewFilePath();
        return file.openNewFile(filePath)
        .then(() => {
            amountOfRecordsInLastFile = 0; 
            return updatePrice(filePath, body);
        })
        .catch(error => Promise.reject(error))
    }
}

const updatePrice = (filePath, body) => {
    const lastPrice = lastPrices[body.productId] ? lastPrices[body.productId].price : null;
    const newPrice = body.price;
    const lastUpdatedDate = new Date();
    let productInfo = {
        "productId" : body.productId,
        "previousPrice" : lastPrice,
        "newPrice" : newPrice,
        "timestamp" : lastUpdatedDate
    }

    return file.writeToFile(filePath, productInfo)
    .then(() => {
        lastPrices[body.productId] = {
            "price" : body.price
        };
        Promise.resolve();
    })
}

const searchForProductPrice = (productId) => {
    if(lastPrices[productId] == undefined) return Promise.reject(errors.NOT_FOUND("product"));
    let productInfo = {"productId" : productId, ...lastPrices[productId]};
    return Promise.resolve(productInfo);
}

// open new file every second
new CronJob('* * * * * *', () => {
    file.openNewFile(getNewFilePath());
}, null, true);

const getNewFilePath = () => {
    amountOfFiles++;
    return (PATH + amountOfFiles);
} 

const getRecentFilePath = () => {
    return (PATH + amountOfFiles);
}

module.exports = {
    logRequestTofile,
    searchForProductPrice
}
