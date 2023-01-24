const express = require('express');
const router = express.Router();

const {
    addcar,
    getcar,
    getcarbyid,
    updatecar,
    deletecar,
    getavailablecars,
    addbooking,
    getbooking
} = require('../controllers/rental.controller');

// Car ================================================================================================
router.post("/addcar", addcar);

router.get("/getcar", getcar);

router.get("/getcarbyid/:id", getcarbyid);

// router.put("/updatecar", updatecar);

router.post("/deletecar/:id", deletecar);

router.get("/getavailablecars", getavailablecars);

// Rental ================================================================================================
router.post("/addbooking", addbooking);

router.get("/getbooking", getbooking);

module.exports = router;