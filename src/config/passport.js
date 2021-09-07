const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const facebookStrategy = require('passport-facebook')
const instagramStrategy = require('passport-instagram')
const twitterStrategy = require('passport-twitter')
const User = require('../model/userSocialMedia')

passport.serializeUser((user, callback) => {
    callback(null, user.id)
})

passport.deserializeUser((id, callBack) => {
    User.findById(id).then(user => callBack(null, user))
})

const stratergy = async (accessToken, refreshToken, profile, callBack) => {
    try {
        let user = new User()
        const findUser = await User.findOne({ providerUserId: profile.id, providerName: profile.provider })
        if (!findUser) {
            user.name = profile.provider === 'instagram' ? profile.username : profile.displayName
            user.providerUserId = profile.id
            user.providerName = profile.provider
            user.tokens = [{ token: accessToken, tokenUsedTime: [{ time: Date.now() }] }]
            user.avatar = profile.provider === 'google' ? profile.photos[0].value : profile.profile === 'facebook' ? profile.profileUrl || null : null
        } else {
            user = findUser
            user.tokens = user.tokens.concat({ token: accessToken, tokenUsedTime: [{ time: Date.now() }] })
        }
        await user.save()
        callBack(null, user)
    } catch (error) {
        console.log(error.message)
    }
}

passport.use(
    new GoogleStrategy({
        clientID: '642307541093-gglb5aac38u769k0orqoiucm20hkmbg6.apps.googleusercontent.com',
        clientSecret: 'qAKs3MBTNQ4X-PkQAak58CQu',
        callbackURL: 'https://localhost:3000/user/login/google/callback/'
    }, stratergy
    )
)

passport.use(
    new facebookStrategy({
        clientID: '350610186728879',
        clientSecret: '52211f9b3ec198f8973e1995cacab299',
        callbackURL: 'https://localhost:3000/user/login/facebook/callback/'
    }, stratergy)
)

passport.use(
    new instagramStrategy({
        clientID: '851471409075459',
        clientSecret: '448e948694233b9da29d97169862b03d',
        callbackURL: 'https://localhost:3000/user/login/instagram/callback/'
    }, stratergy)
)

passport.use(
    new twitterStrategy({
        consumerKey: '851471409075459',
        consumerSecret: '448e948694233b9da29d97169862b03d',
        callbackURL: 'https://localhost:3000/user/login/twitter/callback/'
    }, stratergy)
)