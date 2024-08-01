var express = require('express');

var router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.json("hello")
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})

module.exports = router;
