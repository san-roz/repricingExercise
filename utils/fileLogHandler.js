const CronJob =     require('cron').CronJob;
const config =      require('../config');
const file =        require('./file');
const errors =      require('../utils/errors')
let lastPrices =    require('../data/lastPrices'); 

let amountOfFiles = 0;
let amountOfRecordsInLastFile = 0;
const path = config.urls.repricingResults;
const maxRecordsInFile = config.file.maxRecordsInFile;

const logRequestTofile = (body) => {
    let filePath;
    amountOfRecordsInLastFile++;
    if (amountOfRecordsInLastFile < maxRecordsInFile) {
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
    if(lastPrices[productId] == undefined) return Promise.reject(errors.NOT_FOUND("product"))
    let productInfo = {"productId" : productId, ...lastPrices[productId]}
    return Promise.resolve(productInfo);
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
    logRequestTofile,
    searchForProductPrice
}