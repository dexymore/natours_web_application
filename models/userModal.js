const mongoose = require('mongoose');
// validator is a library used for validating
const validator = require('validator');
const crypto = require('crypto');

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a user must have a name'],

    trim: true,
  },
  email: {
    type: String,
    required: [true, 'a user must have email'],
    unique: true,
    lowercase: true,
    vlaidate: [validator.isEmail, 'please enter a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },


  password: {
    type: 'string',
    required: [true, 'a user must have a password'],
    minlength: [8, 'a user password must be more or equal to 8 chars'],
    select: false,
  },
  
  passwordConfirm: {
    type: 'string',
    required: [true, 'a user must have a password'],
    minlength: [8, 'a user password must be more or equal to 8 chars'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not matched ',
    },
  },
  passwordchangedat: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{type:Boolean,default:true,select:false},
});

userSchema.pre('save', async function (next) {
  //only run the function if passwoed is modified
  if (!this.isModified('password')) return next();
  //hash the password with cost of twelve
  this.password = await bcrypt.hash(this.password, 14);
  //deleting the password confirm feild becaue its nod needed in the database
  this.passwordConfirm = undefined;
  // finally calling next
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // This function takes in two arguments: the candidate password and the user password
  // The candidate password is the password entered by the user attempting to log in
  // The user password is the hashed password stored in the database for the corresponding user

  return await bcrypt.compare(candidatePassword, userPassword);
  // The bcrypt.compare method compares the candidate password with the user password
  // It returns a Promise that resolves to a boolean value indicating whether the passwords match
  // If the passwords match, the Promise resolves to true; otherwise, it resolves to false
  // The Promise is returned by the function, allowing the caller to handle the result appropriately
};
userSchema.methods.changedAasswordAfter = function (JWTTimestamp) {
  if (this.passwordchangedat) {
    const changedTimestamp = parseInt(
      this.passwordchangedat.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
 const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre('save',function (next) {
if(!this.isModified('password') || this.isNew) return next()
this.passwordchangedat=Date.now()-1000;
next();
});

userSchema.pre(/^find/,function(next){
//this point to the current querry
this.find({active:{$ne:false}})
next()
})
const User = mongoose.model('User', userSchema);


module.exports = User;
