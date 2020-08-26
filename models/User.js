const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 1,
        max: 15,
        unique: true
    },
    password: {
        type: String,
        required: true,
        //setting the password to not be sent back for extra security.
        select: false,
        bcrypt: true
    }
});
//the following code will automatically run when we try to save a new user to the database.
userSchema.pre("save", function(next) {
    if(!this.isModified("password"))
        return next();
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
        if(err)
            return next(err);
        this.password = hashedPassword;
        next();
    });
});

// userSchema.methods.comparePassword = function(password, cb) {
//     bcrypt.compare(password, this.password, (err, isMatch) => {
//         if (err) 
//             return cb(err);
//         else {
//             if(!isMatch)
//                 return cb(null, isMatch);
//             return cb(null, this);
//         }
//     });
// }

const User = (module.exports = mongoose.model("User", userSchema));

module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
};

module.exports.getUser = function (username) {
    return User.findOne({username})
        .then((user) => {
            return user;
        });
};
