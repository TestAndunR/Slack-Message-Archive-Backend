let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');

exports.handler = function (event, context, callback) {
    if (event.challenge) {
        callback(null, { "challenge": event.challenge });
        return;
    }
    console.log(event.event);
    let messageId = event.event.client_msg_id;
    let message = event.event.text !== ''? event.event.text : "no";
    let senderId = event.event.user;
    let timestamp = event.event.ts;
    let channelId = event.event.channel;
    let messageInLowerCase = event.event.text !== ''? event.event.text.toLocaleLowerCase() : "no";
    let files = event.event.files.lenth !== 0 || undefined ? JSON.stringify(event.event.files) : JSON.stringify([]);
    console.log(message, messageInLowerCase, messageId, senderId, timestamp, channelId, files);
    ddb.put({
        TableName: 'slack_messages',
        Item: {
            'message_id': messageId,
            'message': message,
            'sender_Id': senderId,
            'timestamp': timestamp,
            'channel_Id': channelId,
            'messageInLowerCase': messageInLowerCase,
            'files': files
        }
    }).promise().then(function (data) {
        //your logic goes here
        console.log(data);
    }).catch(function (err) {
        //handle error
        console.log(err)
    });


    callback(null, { "message": "Success" })
}