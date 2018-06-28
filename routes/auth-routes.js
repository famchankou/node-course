import Express from "express";
import JWT from "jsonwebtoken";
import BC from "bcryptjs";
import Passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as VKStrategy } from "passport-vkontakte";

import DB from "../database/models";
import { UserController } from "../controllers";
import config from "../config";

const Router = Express.Router();

Router.post("/auth", (req, res) => {
    DB.User.find({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (user && BC.compareSync(req.body.password, user.password)) {
            let token = JWT.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

            res.status(200).send({
                "code": 200,
                "message": "OK",
                "data": {
                    "user": {
                        "email": user.email,
                        "username": user.username
                    }
                },
                "token": token
            });
        } else {
            res.status(404).send({
                "code": 404,
                "message": "User Not Found",
                "data": {}
            });
        }
    })
    .catch(error => res.status(400).send(error));
});


Router.post("/passport/auth/local", Passport.authenticate("local", { session: false }), (req, res) => {
    let token = JWT.sign({ id: req.user.id }, config.secret, { expiresIn: 86400 });

    res.status(200).send({
        "code": 200,
        "message": "OK",
        "token": token
    });
});
Passport.use("local", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    session: false
}, (username, password, done) => {
    DB.User.find({
        where: {
            username: username
        }
    })
    .then(user => {
        if (user && BC.compareSync(password, user.password)) {
            done(null, user);
        } else {
            done(null, false, "Invalid username or password.");
        }
    })
    .catch(error => res.status(400).send(error));
}));

Router.get("/passport/auth/vkontakte", Passport.authenticate("vkontakte", { scope: ['status', 'email', 'friends', 'notify', 'wall'] }));
Router.get("/passport/auth/vkontakte/callback", Passport.authenticate("vkontakte", { failureRedirect: "/error" }), (req, res) => {
    res.status(200).send({
        "code": 200,
        "message": "OK",
        "data": {
            "user": req.user
        },
        "token": req.user.token
    });
});
Passport.use(new VKStrategy({
        clientID: "VK_CLIENT_ID",
        clientSecret: config.secret,
        callbackURL:  "http://localhost:8080/passport/auth/vkontakte/callback"
    },
    (accessToken, refreshToken, params, profile, done) => {
        if (profile) {
            let token = JWT.sign({ id: profile.id }, config.secret, { expiresIn: 86400 });

            done(null, {
                id: profile.id,
                name: profile.name,
                profileUrl: profile.profileUrl,
                token: token
            });
        } else {
            done("No such user...");
        }
    }
));
Passport.serializeUser((user, done) => {
    done(null, user);
});
Passport.deserializeUser(function (data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (error) {
        done(error);
    }
});


Router.get("/passport/auth/facebook", Passport.authenticate("facebook"));
Router.get("/passport/auth/facebook/callback", Passport.authenticate("facebook", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});
Passport.use(new FacebookStrategy({
        clientID: "FACEBOOK_APP_ID",
        clientSecret: config.secret,
        callbackURL: "http://localhost:8080/passport/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        
    }
));


Router.get("/passport/auth/twitter", Passport.authenticate("twitter"));
Router.get("/passport/auth/twitter/callback", Passport.authenticate("twitter", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});
Passport.use(new TwitterStrategy({
        consumerKey: "TWITTER_CONSUMER_KEY",
        consumerSecret: config.secret,
        callbackURL: "http://localhost:8080/passport/auth/twitter/callback"
    },
    (token, tokenSecret, profile, cb) => {
        
    }
));


Router.get("/passport/auth/google", Passport.authenticate("google", { scope: ["profile"] }));
Router.get("/passport/auth/google/callback", Passport.authenticate("google", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});
Passport.use(new GoogleStrategy({
        clientID: "GOOGLE_CLIENT_ID",
        clientSecret: config.secret,
        callbackURL: "http://localhost:8080/passport/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        
    }
));

module.exports = Router;
