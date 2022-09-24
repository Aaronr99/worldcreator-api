const express = require('express')
const router = express.Router()
const WorldElement = require('../models/worldElement')

const multer = require('multer')
const fs = require('fs')
const path = require('node:path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname) //Appending extension
    }
})

var upload = multer({ storage });

// Getting all
router.get('/', async (req, res) => {
    try {
        const element = await WorldElement.find()
        res.json(element)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one by id
router.get('/:id', getElement, async (req, res) => {
    res.json(res.element)
})

// Getting childs by id
router.get('/:id/childs', getElement, async (req, res) => {
    const childs = await WorldElement.find({ "parent": req.params.id })
    res.json(childs);
})

// Creating one
router.post('/', upload.single("image"), async (req, res) => {
    const element = new WorldElement({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
    })
    if (req.body.parent != null && req.body.parent != 'root') {
        const findParent = await WorldElement.findById(req.body.parent)
        if (findParent != null)
            element.parent = req.body.parent
    }
    try {
        if (req.file) {
            const { filename } = req.file
            element.setImgUrl(filename)
        }
        const newElement = await element.save()
        res.status(201).json(newElement)
    } catch (err) {
        res.status(400).json({ message: err.message })

    }
})

// Updating one
router.patch('/:id', upload.single("image"), getElement, async (req, res) => {
    if (req.body.title != null) {
        res.element.title = req.body.title
    }
    if (req.body.description != null) {
        res.element.description = req.body.description
    }
    if (req.body.category != null) {
        res.element.category = req.body.category
    }
    if (req.body.parent != null) {
        res.element.parent = req.body.parent
    }
    if (req.file) {
        const imgUrl = res.element.imageUrl
            .replace('localhost:50000/public', path.join(__dirname, '../images'))
        const imageName = imgUrl.split("/")
        if (imageName[imageName.length - 1] != 'questionMark.jpg') {
            fs.unlink(imgUrl, (err) => {
                if (err)
                    console.log(err)
            })
        }

        const { filename } = req.file
        res.element.setImgUrl(filename)
    }
    try {
        const updatedElement = await res.element.save()
        res.json(updatedElement)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete('/:id', getElement, async (req, res) => {
    try {
        await res.element.remove()
        res.json({ message: 'Deleted Element' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

    const imgUrl = res.element.imageUrl
        .replace('localhost:50000/public', path.join(__dirname, '../images'))
    const imageName = imgUrl.split("/")
    if (imageName[imageName.length - 1] != 'questionMark.jpg') {
        fs.unlink(imgUrl, (err) => {
            if (err)
                console.log(err)
        })
    }
})

async function getElement(req, res, next) {
    let element
    try {
        element = await WorldElement.findById(req.params.id)
        if (element == null) {
            return res.status(404).json({ message: 'Cannot find element' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.element = element
    next()
}

module.exports = router