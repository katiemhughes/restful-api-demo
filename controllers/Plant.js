const { getPlant } = require("../models/Plant");
const Plant = require("../models/Plant");

exports.addPlant = function (req, res, next) {
    //get the name, type and size from the request body
    const { name, type, size } = req.body;
    //Search the database to see if plant already exists.
    Plant.findOne({name}, (err, plant) => {
        if(err) return next(err);
        //If user exists, return status 400 and a message saying that the plant already exists.
        if(plant)
            res.status(400).json({message: {msgBody: "Plant already exists", msgError: true}});
        else {
            //If plant doesn't exist, then create a new plant, passing in the name, type and size as arguments.
            const newPlant = new Plant({name, type, size});
            //save to database
            newPlant.save(err => {
                if(err) return next(err)
                else
                    //return happy status 201 with a JSON object containing a success message to be sent to client.
                    res.status(201).json({message: {msgBody: "Plant successfully added!", msgError: false}});
            });
        }
    });
}

exports.indexPlant = function (req, res, next) {
    Plant.get(function (err, plants) {
        if (err) return next(err);
        res.json({
            status: "success",
            message: "Plants retrieved successfully",
            data: "plants"
        });
    });
};

exports.sendPlant = function (req, res, next) {
    getPlant(req.params.name)
    .then(plant => {
        if (plant === null) {
            res.status(400).send({msg: "Plant does not exist"})
        } else {
            res.status(200).send({plant});
        }
    })
    .catch(next)
}