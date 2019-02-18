let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
    if (event.challenge) {
        callback(null, { "challenge": event.challenge });
        return;
    }
    console.log(event);
    let messageId = event.event.client_msg_id;
    let message = event.event.text;
    let senderId = event.event.user;
    let timestamp = event.event.ts
    ddb.put({
        TableName: 'slack_messages',
        Item: { 'message_id': messageId, 'message': message, 'sender_Id': senderId, 'timestamp': timestamp }
    }).promise().then(function (data) {
        //your logic goes here
        console.log(data);
    }).catch(function (err) {
        //handle error
        console.log(err)
    });


    callback(null, { "message": "Success" })
}