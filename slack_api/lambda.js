exports.handler = function (event, context, callback) {
    console.log(event);
    let response = {
        "isBase64Encoded": true,
        "statusCode": 200,
        "body": { "challenge": event.challenge }
    }
    callback(null, response);
}