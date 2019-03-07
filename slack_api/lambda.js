let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');

exports.handler = function (event, context, callback) {
    if (event.challenge) {
        callback(null, { "challenge": event.challenge });
        return;
    }

    let messageId;
    let message;
    let messageInLowerCase

    switch (event.event.subtype) {
        case "message_changed":
            messageId = event.event.message.client_msg_id;
            message = event.event.message.text;
            messageInLowerCase = event.event.message.text.toLocaleLowerCase();
            ddb.update({
                TableName: 'slack_messages',
                Key: {
                    'message_id': messageId
                },
                ExpressionAttributeNames: {
                    '#message': 'message',
                    '#messageInLowerCase': 'messageInLowerCase',
                    // '#messageId': 'message_Id'
                },
                ExpressionAttributeValues: {
                    ':message': message,
                    ':messageInLowerCase': messageInLowerCase,
                    // ':messageId': messageId
                },
                UpdateExpression: 'set #message = :message , #messageInLowerCase = :messageInLowerCase',
                // ConditionExpression: '#messageId = :messageId'
            }).promise().then(function (data) {
                //your logic goes here
                console.log(data);
            }).catch(function (err) {
                //handle error
                console.log(err);
            });
            break;
        case ("message_deleted"):
            messageId = event.event.previous_message.client_msg_id;
            ddb.delete({
                TableName: 'slack_messages',
                Key: { 'message_id': messageId }
            }).promise().then(function (data) {
                //your logic goes here
                console.log(data);
            }).catch(function (err) {
                //handle error
                console.log(err);
            });

            break;
        default:
            console.log(event.event);
            messageId = event.event.client_msg_id;
            message = event.event.text !== '' ? event.event.text : "-";
            let senderId = event.event.user;
            let timestamp = event.event.ts;
            let channelId = event.event.channel;
            let messageInLowerCase = event.event.text !== '' ? event.event.text.toLocaleLowerCase() : "-";
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
    }

    callback(null, { "message": "Success" })
}