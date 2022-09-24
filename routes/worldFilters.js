const express = require('express')
const router = express.Router()
const WorldElement = require('../models/worldElement')

router.get('/:category', async (req, res) => {
    if(req.params.category != CATEGORY_TYPES.LOCATION & 
        req.params.category != CATEGORY_TYPES.PERSON  &
        req.params.category != CATEGORY_TYPES.ITEM){
            return res.status(400).json({ message:  'Not a valid Category'})
    }
    try {
        const elements = await WorldElement.find({"category":  req.params.category})
        res.json(elements)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

const CATEGORY_TYPES = {
    LOCATION: 'location',
    PERSON: 'person',
    ITEM: 'item'
}

module.exports = router