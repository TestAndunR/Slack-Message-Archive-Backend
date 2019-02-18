exports.handler = function (event, context, callback) {
    if (event.challenge) {
       callback(null, {"challenge": event.challenge});
       return;
   }
   console.log(event)
   callback(null, {"message":"Success"})
}