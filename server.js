var express = require('express');
// var gulp = require('gulp');
// require('./gulpfile.js');
const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey('AIzaSyDklV5OfUERFzBEaZb0qsS7sA-fcvOHEDc');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
    endpoint:"https://android.googleapis.com/gcm/send/flWUJ90oJbI:APA91bGfm_H4SYPOyT0G5Oe…0ZD6X4SV2cxJQ_0zJAIEPX0aesGkHdksEk5euFj0jvOCozja8NgPQEEkBo7wcHb4w_9Wh8OkI-",
    keys:{
        p256dh:"BE4jltiKL0rV5AJnz_qz4LvSU4ufpYlGNVrNO1oRIDOM3mGsIr0mGpRQLi9EcGvqYr9Qb9a8WINGmliA912kNUM=",
        auth:"4LBQEwSOavLqzkNoWkW1KA=="
    }
};

webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
var proxy = require('http-proxy-middleware');


var app = express();
// gulp.start("watch");
app.use('/api/*', proxy({target: 'https://www.swiggy.com', changeOrigin: true}));

app.use(express.static('www'));
app.set('port', process.env.PORT || 7010);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});