const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please add claimant name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add claimant email'],
      trim: true,
      lowercase: true
    },
    claimAmount: {
      type: Number,
      required: [true, 'Please add claim amount'],
      min: [0.01, 'Claim amount must be a positive number']
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
      trim: true
    },
    document: {
      type: String,
      required: [true, 'Please upload a supporting document']
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    approvedAmount: {
      type: Number,
      default: 0
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    insurerComments: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Claim', ClaimSchema);
