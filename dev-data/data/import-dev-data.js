const fs = require('fs');

const dotenv = require('dotenv');

const mongoose = require('mongoose');

const tour = require('../../models/tourModal');

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
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const importdata = async () => {
  try {
    await tour.create(tours);
      console.log('data imported successfully');
      process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    await tour.deleteMany();
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