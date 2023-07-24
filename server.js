const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('dotenv').config();

// Add a listener for any unchaught expections  events
process.on('uncaughtException', err => {
  // Log the error name and message to the console
   console.log("🔴",err.name, err.message);

  // Log that the server is shutting down
  console.log('uncaughtException','shutting down..');

  // Close the server and exit the process
  
    process.exit(1);

});

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATBASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log('connected to db');
});

const app = require('./app');

const port = process.env.PORT || 3000;
// Start the server and listen for incoming requests on the specified port
const server = app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// Add a listener for any unhandled rejection events
process.on('unhndledRejction', (err) => {
  // Log the error name and message to the console
  console.log("🔴",err.name, err.message);

  // Log that the server is shutting down
  console.log('unhndledRejction','shutting down..');

  // Close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});

