let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {

    let text = event.queryStringParameters.text;
    console.log(text);
    
    ddb.scan({
        TableName: 'slack_messages',
        ExpressionAttributeValues: {
            ':text': text
        },
        FilterExpression: "contains(message, :text)"
    }).promise().then(function (data) {
        //your logic goes here
        console.log(data);
        let reponse = {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": {
                "headerName": "headerValue"
            },
            "body": JSON.stringify(data.Items)
        }
        callback(null, reponse)
    }).catch(function (err) {
        //handle error
        console.log(err);
    });
}