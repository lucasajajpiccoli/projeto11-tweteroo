import express from 'express';
import cors from 'cors';

const server = express();

server.use(cors());
server.use(express.json());

const users = [];
const tweets = [];

function lastTenTweets() {
    const completeTweets = [];
    for (let i = tweets.length-1; i > tweets.length-11 && i >= 0; i--) {
        const avatar = users.find(item => item.username === tweets[i].username).avatar;
        const tweet = {...tweets[i], avatar};
        completeTweets.push(tweet);
    }
    return completeTweets;
}

server.post("/sign-up", (request, response) => {
    const {username, avatar} = request.body;
    users.push({username, avatar});
    response.send("OK");
});

server.post("/tweets", (request, response) => {
    const {username, tweet} = request.body;
    tweets.push({username, tweet});
    response.send("OK");
});

server.get("/tweets", (request, response) => {
    response.send(lastTenTweets());
})

server.listen(5000);