const Twit = require('twit');

const { 
    API_KEY,
    API_SECRET_KEY,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET,
 } = require("../config");


const  T = new Twit({
    consumer_key: API_KEY,
    consumer_secret: API_SECRET_KEY,
    access_token:ACCESS_TOKEN,
    access_token_secret:ACCESS_TOKEN_SECRET
});


// start stream and track tweets

const hashtags = [
    "#Doge"
];

const log = message =>{
    console.log(message);

}

try{

    console.log("bot is running");

    const stream = T.stream('statuses/filter', { track: hashtags.join() });


    // use this to log errors from requests
    function responseCallback(err, data, response) {
        console.log(err.message);
    }


    // event handler
    stream.on('tweet', async tweet => {
        // retweet
        console.log(`incoming tweet by ${tweet.user.screen_name}`);
        // console.log(tweet);
        if (tweet.retweeted_status) {
            log("ignoring retweeted tweet");
            return;
        }

        try {
            if (Math.random() < 0.4) {
                await reTweet(tweet);
            } else {
                await replyToTweet(tweet);
            }
        } catch (error) {
            // reply to tweet 
            console.log("cant retweet/reply,trying to reply to tweet");
        }

       try{
           // like
          await likeTweet(tweet)
       }catch(err){
           log("error, cant like at this moment");
       }

    });
}catch(err){
    log("error, but i don't care")
}

const reTweet = async (tweet) => {
    const tweetId = tweet.id_str;

   return new Promise((resolve,reject)=>{
       T.post('statuses/retweet/:id', { id: tweetId }, (err, data, response) => {
           if (err) {
               reject(err);
           }
           resolve(data);
       })
   })
}

const likeTweet = async tweet => {
    const tweetId = tweet.id_str;

    return new Promise((resolve, reject) => {
        T.post('favorites/create', { id: tweetId }, (err, data, response) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

const replyToTweet = async tweet => {
    const tweetId = tweet.id_str;
    const screen_name = tweet.user.screen_name;
          
    const message = `👋 hey @${screen_name}, do you likes doges 🐶? `
    const reply = {
        in_reply_to_status_id: tweetId,
        status: message
    };

   
    return new Promise((resolve,reject)=>{
        T.post('statuses/update', reply , (err, data, response) => {
            if (err) {
                reject(err);
            }
            console.log(`replied to ${screen_name}`);
            resolve(data);
        })
    })
}