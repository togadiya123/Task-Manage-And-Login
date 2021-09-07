const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../model/task')

router.patch('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOpration = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOpration) { return res.status(404).send('Error : You are trying to invalid data update!') }
    try {
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true, useFindAndModify: true })
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.send(`task not Found ! `).status(404)
        }
        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task).status(200)
    } catch (error) {
        res.send(`Error : ${error}`).status(500)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.send(`task not Found ! `).status(404)
        }
        res.send(task).status(200)
    } catch (error) {
        res.send(`Error : ${error}`).status(500)
    }
})

router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.send(error)
    }
})

router.get('/task', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({owner:req.user._id})
        await req.user.populate('tasks').execPopulate()
        // res.send(tasks)
        res.send(req.user.tasks)
    } catch (error) {
        res.send(error)
    }
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const tasks = await Task.findOne({ _id, owner: user._id })
        if (!tasks) { return res.status(404).send('task Not Found !') }
        res.send(tasks)
    } catch (error) {
        res.send(error).status(500)
    }
})

module.exports = router;