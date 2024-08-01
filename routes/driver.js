var express = require('express');
const knex = require("../utils/knex");
const {compare} = require("bcrypt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {jwtKey, jwtExpTime, jwtSecretKey} = require("../utils/config");
const {createHasuraJWT, generateDriverId} = require("../utils/helper");
const {authenticateUserToken} = require("../utils/userMiddleware");
var router = express.Router();

router.post("/signin", async (req, res) => {
    try {
        const {phone, password, fcm_token} = req.body.input;
        if (phone && password) {
            const existingUser = await knex('drivers').where('phone', phone)
            if (existingUser.length === 0) {
                return res.status(400).json({message: "driver doesn't exists"})
            } else {
                if (existingUser[0].disabled === true) {
                    return res.status(401).json({message: "account is disabled"});
                } else {
                    const match = await compare(password, existingUser[0].password)
                    if (!match) {
                        return res.status(401).json({message: "invalid password"});
                    } else {
                        await knex('drivers').update({
                            fcm_token
                        }).where('id', existingUser[0].id)
                        const token = createHasuraJWT(existingUser[0].id, existingUser[0].role)
                        return res.status(200).json({token})
                    }
                }
            }
        } else {
            return res.status(400).json({message: "missing required fields"})
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})

router.post("/signup", async (req, res) => {
    try {
        const {name, phone, password} = req.body.input;
        if (name && phone && password) {
            const existingUser = await knex('drivers').where('phone', phone)
            if (existingUser.length !== 0) {
                return res.status(401).json({message: "driver already exists"})
            } else {
                const existingDriverId = await knex('drivers').orderBy('driver_id', 'desc').limit(1).select('driver_id').first()
                const hashedPassword = await bcrypt.hash(password, 10)
                const createdUser = await knex('drivers').insert({
                    ...req.body.input,
                    driver_id: generateDriverId(existingDriverId.driver_id),
                    password: hashedPassword,
                }).returning('id')
                const token = createHasuraJWT(createdUser[0].id, 'driver')
                return res.status(201).json({token})
            }
        } else {
            return res.status(400).json({message: "missing required fields"})
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})

router.post("/update-password", authenticateUserToken, async (req, res) => {
    try {
        const {oldPassword, newPassword, confirmNewPassword} = req.body.input;
        const user_id = req.user_id

        if (oldPassword && newPassword && confirmNewPassword) {
            if (newPassword !== confirmNewPassword) {
                return res.status(401).json({message: "confirm password doesn't match"})
            } else {
                const exisingUser = await knex('drivers').where('id', user_id)
                const match = await compare(oldPassword, exisingUser[0].password)
                if (!match) {
                    return res.status(401).json({message: "invalid old password"});
                } else {
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
                    await knex('drivers').update({
                        password: hashedNewPassword,
                    }).where('id', user_id)
                    return res.status(200).json({message: "password updated successfully"})
                }
            }
        } else {
            return res.status(400).json({message: "missing required fields"})
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})


module.exports = router;
