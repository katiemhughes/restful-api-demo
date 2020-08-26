const { getUser } = require("../models/User");
const User = require("../models/User");

exports.addUser = function (req, res, next) {
    //get the username and password from the request body
    const { username, password } = req.body;
    //search the database to see if the username already exists.
    User.findOne({username}, (err, user) => {
        if(err) return next(err);
        //If user exists, return status 400 and a message saying that the username already exists.
        if(user)
            res.status(400).json({message: {msgBody: "Username is already taken", msgError: true}})
        else {
            //If username doesn't exist, then create a new user, passing in the username and password as arguments.
            const newUser = new User({username, password});

            newUser.save(err => {
                if (err) return next(err)
                else
                    //console.log the password just to check whether the hashing and salting process has worked - delete afterwards.
                    console.log(newUser.password)
                    //return happy status 201 with a JSON object containing a success message to be sent to client.
                    res.status(201).json({message: {msgBody: "User successfully created", msgError: false}});
            });
        }
    });
}

exports.index = function (req, res, next) {
    User.get(function (err, users) {
        if(err) return next(err);
        res.json({
            status: "Success",
            message: "Users retrieved successfully",
            data: users
        });
    });
};

exports.sendUser = function (req, res, next) {
    getUser(req.params.username)
    .then(user => {
        if (user === null) {
            res.status(400).send({msg: "Invalid username"})
        } else {
            res.status(200).send({user});
        }
    })
    .catch(next)
}

exports.removeUser = async (req, res, next) => {
    const userExists = await User.exists({ username: req.params.username })
    if (!userExists) {
        res.status(400).send({msg: "User does not exist"})
    } else {
        User.findOneAndRemove({username: req.params.username}, function (err) {
            if (err) return res.status(400).send({msg: "Invalid username"});
            res.json({
                status: "Success",
                message: "User successfully deleted"
            });
        });
    }
}