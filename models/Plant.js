const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 30,
        unique: true
    },
    type: {
        type: String,
        enum: ["bedding", "outdoor", "indoor"],
        required: true
    },
    size: {
        type: String,
        enum: ["small", "medium", "large"],
    }
});

const Plant = (module.exports = mongoose.model("Plant", plantSchema));

module.exports.get = function (callback, limit) {
    Plant.find(callback).limit(limit);
};

module.exports.getPlant = function (name) {
    return Plant.findOne({ name })
    .then((plant) => {
        return plant;
    });
};

//need this code