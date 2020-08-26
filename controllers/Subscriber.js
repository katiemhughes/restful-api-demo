const { getSubscriber, updateSubscriber, insertPlants, extractPlants } = require("../models/Subscriber");
const Subscriber = require("../models/Subscriber");

exports.addSubscriber = function (req, res, next) {
    //Get the username and password from the request body
    const { username, password } = req.body;
    //Search the database to see if username already exists
    Subscriber.findOne({username}, (err, subscriber) => {
        if(err) return next(err);
        //If user exists, return status 400 and a message saying that the username already exists.
        if(subscriber) 
            res.status(400).json({message: {msgBody: "Username already exists", msgError: true}});
        else {
            //if username doesn't exist, then create a new user, passing in the username and password as arguments.
            const newSubscriber = new Subscriber({username, password});
            //save to database
            newSubscriber.save(err => {
                if(err) return next(err)
                else
                //console.log the password just to check whether the hashing and salting process has worked - delete afterwards
                console.log(newSubscriber.password)
                //return happy status 201 with a json object containing a success message to be sent to client.
                res.status(201).json({message: {msgBody: "Account successfully created!", msgError: false}});
            });
        }
    });
}

exports.indexSub = function (req, res, next) {
    Subscriber.get(function (err, subscribers) {
        if (err) return next(err);
        res.json({
            status: "Success",
            message: "Subscribers retrieved successfully",
            data: subscribers
        });
    });
};

exports.sendSubscriber = function (req, res, next) {
    getSubscriber(req.params.username)
    .then(subscriber => {
        if (subscriber === null) {
            res.status(400).send({msg: "Invalid username"})
        } else {
            res.status(200).send({subscriber});
        }
    })
    .catch(next)
}

exports.sendSubscriber = function (req, res, next) {
    getSubscriber(req.params.username)
    .then(subscriber => {
        if (subscriber === null) {
            res.status(400).send({msg: "Invalid username"})
        } else {
            res.status(200).send({subscriber});
        }
    })
    .catch(next)
}

exports.removeSubscriber = async (req, res, next) => {
    const subscriberExists = await Subscriber.exists({ username: req.params.username})
    if (!subscriberExists) {
        res.status(400).send({msg: "User does not exist"})
    } else {
        Subscriber.findOneAndRemove({username: req.params.username}, function (err) {
            if (err) return res.status(400).send({msg: "Invalid username"});
            res.json({
                status: "Success",
                message: "User successfully deleted"
            });
        });
    }
};

exports.updateSubscriberStatus = function (req, res, next) {
    const username = req.params.username;
    updateSubscriber(username, req.body, res)
    .then((subscriber) => {
        if (subscriber === null) {
            res.status(400).send({ msg: "Invalid username" });
        } else {
            res.status(200).send({ subscriber });
        }
    })
    .catch(next);
};


exports.addPlantsToSubscriber = function (req, res, next) {
    const username = req.params.username;
    const plant = req.body.plant_id;

    if ("plant_id" in req.body) {
        insertPlants(username, plant)
        .then((subscriber) => {
            if (subscriber === null) {
                res.status(400).send({ msg: "Error when trying to add plants" });
            } else {
                res.status(200).send({ msg: "Plants successfully added", data: subscriber });
            }
        })
        .catch(next);
    } else {
        res.status(400).send({ msg: "No plants included" });
    }
};

exports.removePlantFromSubscriber = function (req, res, next) {
    const username = req.params.username;
    const plant = req.body.plant_id;

    if ("plant_id" in req.body) {
        extractPlants(username, plant)
        .then((subscriber) => {
            if (subscriber === null) {
                res.status(400).send({ msg: "Error when trying to add plants" });
            } else {
                res.status(200).send({ msg: "Plants successfully added", data: subscriber });
            }
        })
        .catch(next);
    } else {
        res.status(400).send({ msg: "No plants included" });
    }
};

// module.exports.getSubscriber = function (username) {
//     return Subscriber.findOne({ username }).populate({path:'plants', model: 'Plant'})
//     .then((subscriber) => {
//         return subscriber;
//     });
// 