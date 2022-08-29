import express from 'express';
import cors from 'cors';

const server = express();

server.use(cors());
server.use(express.json());

const users = [];
const tweets = [];

function validateUser (username, avatar) {
    const validUserName = Boolean(username);
    let validAvatar = false;
    if (avatar) {
        validAvatar = avatar.indexOf("https://") === 0 || avatar.indexOf("http://") === 0;
    }
    return (validUserName && validAvatar);
}

function validateTweet (username, tweet) {
    const validUserName = Boolean(username);
    const validTweet = Boolean(tweet);
    return (validUserName && validTweet);
}

function validatePage (page) {
    const validPage = page >= 1 && page % 1 === 0 && !isNaN(page);
    return validPage;
}

function anyTenTweets(page) {
    const completeTweets = [];
    for (let i = tweets.length +9 - 10*page; i > tweets.length -1 - 10*page && i >= 0; i--) {
        const avatar = users.find(item => item.username === tweets[i].username).avatar;
        const tweet = {...tweets[i], avatar};
        completeTweets.push(tweet);
    }
    return completeTweets;
}

function allUserTweets (username) {
    const filteredTweets = tweets.filter(item => item.username === username).reverse();
    const avatar = users.find(item => item.username === username).avatar;
    const completeTweets = filteredTweets.map(item => ({...item, avatar}));
    return completeTweets;
}

server.post("/sign-up", (request, response) => {
    const {username, avatar} = request.body;
    if (validateUser(username, avatar)) {
        users.push({username, avatar});
        response.status(201).send("OK");
    } else {
        response.status(400).send("Todos os campos são obrigatórios!");
    }
});

server.post("/tweets", (request, response) => {
    const tweet = request.body.tweet;
    const username = request.headers.user ? request.headers.user : request.body.username;
    if (validateTweet(username, tweet)) {
        tweets.push({username, tweet});
        response.status(201).send("OK");
    } else {
        response.status(400).send("Todos os campos são obrigatórios!");
    }
});

server.get("/tweets", (request, response) => {
    const page = request.query.page;
    if (page === undefined) {
        response.send(anyTenTweets(1));
    } else if (validatePage(page)) {
        response.send(anyTenTweets(page));
    } else {
        response.status(400).send("Informe uma página válida!")
    }
})

server.get("/tweets/:username", (request, response) => {
    const allTweets = allUserTweets(request.params.username);
    response.send(allTweets);
})

server.listen(5000);