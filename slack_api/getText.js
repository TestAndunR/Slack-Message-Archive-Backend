let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {

    let text = event.queryStringParameters.text;
    console.log("event",text);

    switch (text) {
        case ("@" + text.slice(1)):
            let sender_id = event.queryStringParameters.text.slice(1);
            console.log(sender_id);
            ddb.scan({
                TableName: 'slack_messages',
                ExpressionAttributeValues: {
                    ':text': sender_id
                },
                FilterExpression: 'sender_Id = :text'
            }).promise().then(function (data) {
                //your logic goes here
                console.log(data);
                let reponse = {
                    "isBase64Encoded": true,
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": JSON.stringify(data.Items)
                }
                callback(null, reponse)
            }).catch(function (err) {
                //handle error
                console.log(err);
                let response = {
                    "isBase64Encoded": true,
                    "statusCode": 502,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": JSON.stringify({ "err": "data not found" })
                }
                callback(response, null)
            });
            break;
        case ("_" + text.slice(1)):
            let channel_id = event.queryStringParameters.text.slice(1);
            console.log("aaaaaa",channel_id);
            ddb.scan({
                TableName: 'slack_messages',
                ExpressionAttributeValues: {
                    ':text': channel_id
                },
                FilterExpression: 'channel_Id = :text'
            }).promise().then(function (data) {
                //your logic goes here
                console.log(data);
                let reponse = {
                    "isBase64Encoded": true,
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": JSON.stringify(data.Items)
                }
                callback(null, reponse)
            }).catch(function (err) {
                //handle error
                console.log("error", err);
                let response = {
                    "isBase64Encoded": true,
                    "statusCode": 502,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": JSON.stringify({ "err": "data not found" })
                }
                callback(response, null)
            });
            break;
        default: 
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
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(data.Items)
            }
            callback(null, reponse)
        }).catch(function (err) {
            //handle error
            console.log(err);
            let response = {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify({ "err": "data not found" })
            }
            callback(response, null)
        });
    }
}