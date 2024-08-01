var express = require('express');
const knex = require("../utils/knex");
const {authenticateUserToken} = require("../utils/userMiddleware");
var router = express.Router();

router.post("/start-trip", authenticateUserToken, async (req, res) => {
    try {
        const user_id = req.user_id
        const createdTrip = await knex('trips').insert({
            ...req.body.input,
            driver_id: user_id
        }).returning('id')

        return res.status(201).json(createdTrip)
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})

router.post("/end-trip", authenticateUserToken, async (req, res) => {
    try {
        const {tripId} = req.body.input;
        if (tripId) {
            const createdTrip = await knex('trips').update({
                ...req.body.input
            }).where('id', tripId).returning('id')

            return res.status(201).json(createdTrip)
        } else {
            return res.status(400).json({message: "tripId is required"})
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})


module.exports = router;
