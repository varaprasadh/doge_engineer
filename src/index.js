const Twit = require('twit');

const quotes = require("./data/quotes.json");


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

const BOSS_USERNAME = `consious_coder`
const MY_HANDLE = `@doge_engineer`;
const MY_SCREEN_NAME = `doge_engineer`;


const hashtags = [
    "#javascript"
];


const log = message =>{
    console.log(message);
}

const stream = T.stream('statuses/filter', { track: hashtags.join() });
// var mentionStream = T.stream('statuses/filter', { track: [MY_HANDLE] });




const handleMention  = async tweet => {
   try{
    //    await replyToTweet(tweet);
   }catch(error){
       console.log("who cares,");
   }
}


const handleTweet = async tweet => {
    // retweet

    log(`incoming tweet by ${tweet.user.screen_name}`);

    // const { screen_name } = tweet.user;
    // if (screen_name === MY_SCREEN_NAME) {
    //     console.log(screen_name, MY_SCREEN_NAME);
    //     return;
    // }

    log(`proceeding with above tweet`);

    try {
        if (Math.random() < 0.7) {
            await reTweet(tweet);
        } else {
            // await replyToTweet(tweet);
        }
    } catch (error) {
        // reply to tweet 
        log("cant retweet/reply", error);
    }

    try {
        // like
          await likeTweet(tweet)
    } catch (err) {
        log("error, cant like at this moment");
    }

}


const reTweet = async (tweet) => {
    const tweetId = tweet.id_str;

   return new Promise((resolve,reject)=>{
       T.post('statuses/retweet/:id', { id: tweetId }, (err, data, response) => {
           if (err) {
               return reject(err);
           }
           log("retweeted");
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
            log("tweet liked");
            resolve(data);
        })
    })
}

const replyToTweet = async tweet => {
    const tweetId = tweet.id_str;
    const screen_name = tweet.user.screen_name;
    // const replies = [
    //     `👋 hey @${screen_name}, Keep Going! 🐶 `,
    //     `👋 hey @${screen_name}, You are doing great  👌 `,
    //     `👋 hey @${screen_name}, All the best 🤞 `,
    //     `👋 hey @${screen_name}, Wonderful, Good luck  🥤 `,
    //     `👋 hey @${screen_name}, Wonderful, You AWESOME  🎉 `,
    // ]     

    const replies = [
        `JavaScript is the only language that I'm aware of that people feel they don't need to learn before they start using it.`,
        `Any app that can be written in JavaScript, will eventually be written in JavaScript.`,
        `JavaScript is the world's most misunderstood programming language.`,
        `JavaScript: Don't judge me by my bad parts, learn the good stuff and stick with that!`,
        `Javascript is the duct tape of the Internet.`,
        `JS will be a real functional language.`,
        `Java is to JavaScript as ham is to hamster.`,
        `The strength of JavaScript is that you can do anything. The weakness is that you will.`,
        `Java is to JavaScript what car is to carpet.`,

    ]     

    let randIndex = Math.floor(Math.random() * replies.length);
    let message = replies[randIndex];

    const reply = {
        in_reply_to_status_id: tweetId,
        status: message
    };

   
    return new Promise((resolve,reject)=>{
        T.post('statuses/update', reply , (err, data, response) => {
            if (err) {
                return reject(err);
            }
            log(`replied to ${screen_name}`);
            resolve(data);
        })
    })
}



try {

    log("bot is running");

    // mentionStream.on('tweet', handleMention)

    // event handler
    stream.on('tweet', handleTweet);



} catch (err) {
    log("error, but i don't care")
}

