let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');

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
    console.log(process.env.slack_token);
    axios.get("https://slack.com/api/users.list?token="+process.env.slack_token)
        .then(data => console.log(data))
        .catch(err => console.log(err))
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