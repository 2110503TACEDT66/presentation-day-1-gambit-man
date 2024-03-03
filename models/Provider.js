const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please add a name'],
      maxlength: [50, 'name can not be more than 50 characters'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    tel: {
      type: String,
      required: [true, 'Please add a telephone number'],
      match: [
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtrual
ProviderSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'provider',
  justOne: false,
});

//caseade delect Provider and Booking
ProviderSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    console.log(`Booking being remove from provider ${this._id}`);
    await this.model(`Booking`).deleteMany({ provider: this._id });
    next();
  }
);

module.exports = mongoose.model('Provider', ProviderSchema);
