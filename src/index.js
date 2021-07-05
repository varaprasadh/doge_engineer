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

const MY_USERNAME = `consious_coder`

const hashtags = [
    // "#Doge"
    "#Elon"
];

const log = message =>{
    console.log(message);

}

try{

    console.log("bot is running");

    const stream = T.stream('statuses/filter', { track: hashtags.join() });

    // event handler
    stream.on('tweet', async tweet => {
        // retweet
        // console.log(tweet);

        console.log(`incoming tweet by ${tweet.user.screen_name}`);

        if (tweet.retweeted_status) {
            // log("ignoring retweeted tweet");
            return;
        }

        console.log(`proceeding with above tweet`);

        try {
            if (Math.random() < 0.4) {
                await reTweet(tweet);
            } else {
                await replyToTweet(tweet);
            }
        } catch (error) {
            // reply to tweet 
            console.log("cant retweet/reply,trying to reply to tweet", error);
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
               return reject(err);
           }
           console.log("retweeted");
           resolve(data);
       })
   })
}

const likeTweet = async tweet => {
    const tweetId = tweet.id_str;

    return new Promise((resolve, reject) => {
        T.post('favorites/create', { id: tweetId }, (err, data, response) => {
            if (err) {
                return reject(err);
            }
            console.log("tweet liked");
            resolve(data);
        })
    })
}

const replyToTweet = async tweet => {
    const tweetId = tweet.id_str;
    const screen_name = tweet.user.screen_name;
          
    let message = `👋 hey @${screen_name}, do you likes doges 🐶? `

    const random = Math.random();
    
    if (random < 0.3) {
        message = `yay, you are in my list to get a chance to win few doges 🐶`
    }else if (random < 0.5){
        message = `looks like you love doges 🐶, do you want some ?`;
    }else{
        message += `if yes then follow me and my boss @${MY_USERNAME}`
    }
    
    const reply = {
        in_reply_to_status_id: tweetId,
        status: message
    };

   
    return new Promise((resolve,reject)=>{
        T.post('statuses/update', reply , (err, data, response) => {
            if (err) {
                return reject(err);
            }
            console.log(`replied to ${screen_name}`);
            resolve(data);
        })
    })
}