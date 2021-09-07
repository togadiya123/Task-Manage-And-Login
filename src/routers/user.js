const express = require('express')
const auth = require('../middleware/auth')
const User = require('../model/user')
const multer = require('multer')
const passport = require('passport')
const router = new express.Router()

router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        console.log(user)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.send('Error : ' + error.message)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})


// Google
router.get('/user/login/google', passport.authenticate('google', {
    scope: ['profile']
}))

router.get('/user/login/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
})

//Facebook
router.get('/user/login/facebook', passport.authenticate('facebook'))

router.get('/user/login/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/');
})

//Instagram
router.get('/user/login/instagram',passport.authenticate('instagram', {
    scope: ['user_profile', 'user_media']
}))

router.get('/user/login/instagram/callback', passport.authenticate('instagram'), (req, res) => {
    res.redirect('/');
})

//Twitter
router.get('/user/login/twitter', passport.authenticate('twitter'))

router.get('/user/login/twitter/callback', passport.authenticate('twitter'), (req, res) => {
    res.redirect('/');
})

router.get('/', (req, res) => {
    res.send('Hello, you have been Authenticate !')
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})

router.get('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) { return res.status(404).send('User Not Found !') }
        res.send(user)
    } catch (error) {
        res.send(error).status(500)
    }
})

router.patch('/user/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOpration = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOpration) { return res.status(404).send('Error : You are trying to invalid data update!') }
    try {
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true, useFindAndModify: true })
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        if (!user) {
            return res.send(`User not Found ! `).status(404)
        }
        res.send(user).status(200)
    } catch (error) {
        res.send(`Error : ${error}`).status(500)
    }
})

router.delete('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.send(`User not Found ! `).status(404)
        }
        res.send(user).status(200)
    } catch (error) {
        res.send(`Error : ${error}`).status(500)
    }
})
const upload = multer({
    storage: multer.memoryStorage(),
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callBack) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { return callBack(new Error('Only images is Allowed !')) }
        callBack(undefined, true)
    }
})

router.post('/user/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => res.status(5000).send({ error: error.message })
)

router.delete('/user/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => res.status(5000).send({ error: error.message })
)

router.get('/user/avatar', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            throw new Error('Image is not avlabel')
        }
        res.set('Content-type', 'image/jpg')
        res.send(req.user.avatar)
    } catch (error) {
        res.status(404)
    }
})

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user.avatar || !user) {
            throw new Error('Image is not avlabel')
        }
        res.set('Content-type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(404)
    }
})

module.exports = router