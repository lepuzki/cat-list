const express = require("express");

const app = require("../app");

const { Kitten } = require("../mongo/schema");

const router = express();

const kitten = require("../mongo/TestBackend");

/* GET home page. */

router.get("/", async function (req, res, next) {

    const list = await kitten.getAllKitties();

    console.log(list);

    res.json({ list });

});

/* POST home page || POST index root */

router.post("/", async function (req, res, next) {

    /* TASO 0 */

    try {

        const body = req.body;

        console.log("🚀 ~ file: index.js ~ line 33 ~ req.body", req.body);

        const test = await kitten.saveKitty({

            name: body.name,

        });

        console.log("Await save kitty", test);

        console.log("tulosti: " + JSON.stringify(body));

        res.json({ status: "ok", kitten: test });

    } catch (error) {

        console.error("error occured: ", error);

        res.status(500).json({ status: "ERROR 500" });

    }

});

/* router delete */

router.delete("/:id", async function (req, res, next) {

    try {

        const kittenId = req.params.id;

        console.log("🚀 ~ file: index.js ~ line 65 ~ kittenId", kittenId);

        const test = await kitten.deleteKitty(kittenId);

        res.json({ status: "ok" });

    } catch (error) {

        console.error("error occured: ", error);

        res.status(500).json({ status: "ERROR 500" });

    }

});

router.post("/:id/:kitten", async function (req, res, next) {
    try {
        const kittenId = req.params.id;
        const newName = req.params.kitten;
        
        const updatedKitty = await kitten.editKitty(kittenId, newName);

        res.json({ status: "ok" , updatedKitty });
    } catch (error) {
        console.error("error occurred: ", error);
        res.status(500).json({ status: "ERROR 500" });
    }
});

module.exports = router;