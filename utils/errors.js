const NOT_FOUND = (item) => {
    let error = {
        status: 404,
        message : `${item} not found`
    };
    return error;
} 

module.exports = {
    NOT_FOUND
}