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
    clientID: '4ed0100edb341c96d104',
    clientSecret: '4c4c444a2758c9f9eeeb088b9071412d14bc714d',
    callbackURL: "http://www.zhengzehao.top/auth/github/callback"
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
