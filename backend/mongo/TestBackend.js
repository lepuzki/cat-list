const mongoose = require("mongoose");
const { Kitten } = require("./schema");


async function getAllKitties(params) {
    const allKitties = await Kitten.find();
    return allKitties.map((k) => {
        return {
            id: k._id.toHexString(),
            name: k.name,
            time: k.time,
        };
    });
}

/ SAVE /
async function saveKitty(kitten) {
    console.log("saving", JSON.stringify(kitten));
    const birthday = new Date().getTime();
    const saveKitty = await Kitten.create({
        name: kitten.name,
        time: birthday,
    });
    console.log(saveKitty);
    const kittenId = saveKitty._id.toHexString();
    return {
        id: kittenId,
        name: kitten.name,
        time: birthday,
    };
}

/* DELETE */
/* TASO 1 */
async function deleteKitty(id) {
    try {
        const x = await Kitten.deleteOne({ _id: id });
        if (x && !x.deletedCount) {
            throw new Error("yhtää kissaa ei poistettu");
        }
        console.log("poistettiin: ", x);
      } catch (error) {
        console.error("Objektin poistaminen epäonnistui!: ", error);
        throw error;
    }
}

async function editKitty(id, newName) {
    try {
        const updatedKitty = await Kitten.findByIdAndUpdate(id, { name: newName }, { new: true });

        if (!updatedKitty) {
            throw new Error("Kissaa ei ole");
        }
        console.log("Päivitettiin: ", updatedKitty);
    } catch (error) {
        console.error("Kissan muokkaaminen epäonnistui: ", error);

        throw error;
    }
}

module.exports = { getAllKitties, saveKitty, deleteKitty, editKitty };