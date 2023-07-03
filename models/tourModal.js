const mongoose = require('mongoose');

const User= require('./userModal.js')

const slugify = require('slugify');



const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'a tour name must be less or equal to 40 chars'],
      minlength: [10, 'a tour name must be more or equal to 40 chars'],
      //validate:[validator.isAlpha,"tour name must only contain alpha characters"]
    }, 
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a diffculit  y'],
      enum: ['easy', 'medium', 'difficult'],
      message: 'difficulty must be EASY,MEDIUM,DIFFICULT ',
    },
    ratingsAverage: {
      type: Number,

      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be less  5.0'],
    },
    ratingsQuantity: {
      type: Number,

      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'Please enter a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this validator function runs oonly when creating a new document but doesnt run on update documents (moongose restrictions)
          return value < this.price;
        },
        message: `the discount price ({VALUE}) should be blew the price `,
      },
    },
    summary: {
      required: [true, 'a tour must have a summary'],
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have an image'],
    },
    imgaes: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //geojson property
      type:{
        type:String ,
        default:'Point',
        enum:['Point'],
    
      },
      coordinates:[Number],
      address:String,
      description:String,
        },
        
   locations:[ {
          //geojson property
          type:{
            type:String ,
            default:'Point',
            enum:['Point'],
        
          },
          coordinates:[Number],
          address:String,
          description:String,
        day:Number   
        }],
      guides:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
      }]
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// this middleware run s on saving and creating a new document but doesont run on updating  the document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log('query took:', Date.now() - this.start, 'milliseconds');

  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
