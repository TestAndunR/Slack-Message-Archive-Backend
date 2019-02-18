exports.handler = function(event, context, callback) {
    console.log(event);
    callback(null, {"message": "Successfully executed"});
}