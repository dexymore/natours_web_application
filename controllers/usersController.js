const catchAsync = require('../utils/catchAsync');
// eslint-disable-next-line import/extensions
const AppError = require('../utils/appError');

const User = require('../models/userModal');

const multer = require('multer');

const factory=require('./handlerFactory')

const sharp=require('sharp')

// this is used to upload photos to the server
// const multerStorage = multer.diskStorage({
// destination: (req, file, cb) => {
// cb(null, 'public/img/users');

// },
// filename: (req, file, cb) => {
// const ext = file.mimetype.split('/')[1];
// cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);

// }
// });
// this is used to upload photos to the memory
const multerStorage=multer.memoryStorage()

const multerFilter = (req, file, cb) => {
if(file.mimetype.startsWith('image')){
cb(null, true);
}
else{
cb(new AppError('please upload only images',400),false);

}

};
exports.resizePhoto=catchAsync(async(req,res,next)=>{
if(!req.file) return next()
//here we are using the sharp module to resize the image and to convert it to jpeg format and finally to save it to the server 
req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`

await sharp(req.file.buffer).resize(650,650).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
next()
})


const upload=multer({storage:multerStorage,fileFilter:multerFilter})
exports.uploadUserPhoto=upload.single('photo')

const filteredObj = function (obj, ...objkeys) {
  const filteredobject = {};
  Object.keys(obj).forEach((el) => {
    if (objkeys.includes(el)) filteredobject[el] = obj[el];
  });
  return filteredobject;
};
exports.getme=(req,res,next)=>{
  req.params.id=req.user.id
next()
}

exports.updateme = catchAsync(async (req, res, next) => {


  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for password update please use update my password',
        400
      )
    );
  }
  const filteredBody = filteredObj(req.body, 'name', 'email');
if(req.file) filteredBody.photo=req.file.filename

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteme = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
  next()
});



exports.createuser = (req, res) => {
  res.status(500).json({ statusbar: 'error', message: 'this route is not defined and please use sign up instead' });
};
exports.getAllusers = factory.getAlldocs(User)
exports.getuser = factory.getOne(User)
// this is not used to update passowrds
exports.updateuser = factory.updateOne(User )

exports.delteuser=factory.deleteOne(User)