import Express from "express";
import JWT from "jsonwebtoken";
import BC from "bcryptjs";
import Passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as VKStrategy } from "passport-vkontakte";

import { UserController } from "../controllers";
import config from "../config";

const Router = Express.Router();

Router.post("/auth", (req, res) => {
    let user = UserController.getUser(req.body.username, req.body.password);

    if (user) {
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
            "message": "Not Found",
            "data": {}
        });
    }
});

Router.post("/passport/auth/local", Passport.authenticate("local", { session: false }), (req, res) => {
    res.json({id: req.user.id, token: `TOKEN-${req.user.id}`});
});

Router.get("/passport/auth/vkontakte", Passport.authenticate("vkontakte", { scope: ['status', 'email', 'friends', 'notify', 'wall'] }));
Router.get(
    "/passport/auth/vkontakte/callback",
    Passport.authenticate("vkontakte", { successRedirect: "/index", failureRedirect: "/error" }),
    (req, res) => {
        console.log("VK authentication done and callback invoked...");
        res.end("done");
    }
);

Router.get("/passport/auth/facebook", Passport.authenticate("facebook"));
Router.get("/passport/auth/facebook/callback", Passport.authenticate("facebook", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});

Router.get("/passport/auth/twitter", Passport.authenticate("twitter"));
Router.get("/passport/auth/twitter/callback", Passport.authenticate("twitter", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});

Router.get("/passport/auth/google", Passport.authenticate("google", { scope: ["profile"] }));
Router.get("/passport/auth/google/callback", Passport.authenticate("google", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});

Passport.use("local", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    session: false
}, (username, password, done) => {
    let user = UserController.getUser(username, password);

    if (!user) {
        done(null, false, "Invalid username or password.");
    } else {
        done(null, user);
    }
}));

Passport.use(new VKStrategy({
        clientID: "6612357",
        clientSecret: "36mG66VS3nBX8MVuFRle",
        callbackURL:  "http://localhost:8080/passport/auth/vkontakte/callback"
    },
    (accessToken, refreshToken, params, profile, done) => {

        console.log("1", accessToken);
        console.log("2", refreshToken);
        console.log("3", params);
        console.log("4", profile);

        done(null);
    }
));

Passport.use(new FacebookStrategy({
        clientID: "FACEBOOK_APP_ID",
        clientSecret: config.secret,
        callbackURL: "http://localhost:8080/passport/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        
    }
));

Passport.use(new TwitterStrategy({
        consumerKey: "TWITTER_CONSUMER_KEY",
        consumerSecret: config.secret,
        callbackURL: "http://localhost:8080/passport/auth/twitter/callback"
    },
    (token, tokenSecret, profile, cb) => {
        
    }
));

Passport.use(new GoogleStrategy({
        clientID: "GOOGLE_CLIENT_ID",
        clientSecret: config.secret,
        callbackURL: "http://localhost:8080/passport/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        
    }
));

module.exports = Router;
