const fs = require('fs');

const dotenv = require('dotenv');

const mongoose = require('mongoose');

const User = require('../../models/userModal');

const Tour = require('../../models/tourModal');

const Review = require('../../models/reviewModal');
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATBASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log('connected to db');
});
//reading data from json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const importdata = async () => {
  try {
    await Tour.create(tours);
    await User.create(users,{validateBeforeSave:false});
    await Review.create(reviews);
      console.log('data imported successfully');
      process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
      console.log('data deleted successfully');
      process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === '--import') {
    importdata();
}
else if (process.argv[2] === '--delete') { 
    deleteData();
}