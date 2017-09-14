var express = require('express');
var router = express.Router();

//passport可以做认证相关内容
var passport = require('passport');
//在passport基础上对协议进行封装
var GitHubStrategy = require('passport-github').Strategy;


passport.serializeUser(function (user, done) {
    console.log('---serializeUser---')
    console.log(user)
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log('---deserializeUser---')
    done(null, obj);
});

passport.use(new GitHubStrategy({
    //阿里服务器设置
    clientID: 'f73b4d8e041c12f52afd',
    clientSecret: '1e67ed8848c988512fa42103142ab43c734ebc58',
    callbackURL: "http://www.zhengzehao.top/auth/github/callback"

    //本地localhost设置
    // clientID:"1371ae3a7ea81a9b2b7e",
    // clientSecret:"18ca5fdf164d0c76e3313e1e7ffe3f38bcefef45",
    // callbackURL:"http://localhost:8484/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        // });
        done(null, profile);
    }
));


router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
})

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
    });
module.exports = router;
