const Claim = require('../models/Claim');

// @desc    Submit a new claim
// @route   POST /api/claims
// @access  Private (Patient)
exports.submitClaim = async (req, res, next) => {
  try {
    const { name, email, claimAmount, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a supporting document'
      });
    }

    if (!name || !email || !claimAmount || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, claimAmount, description) are required'
      });
    }

    const claimAmtNum = parseFloat(claimAmount);
    if (isNaN(claimAmtNum) || claimAmtNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Claim amount must be a positive number'
      });
    }

    const claim = await Claim.create({
      patient: req.user.id,
      name,
      email,
      claimAmount: claimAmtNum,
      description,
      document: req.file.filename
    });

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      data: claim
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in patient's claims
// @route   GET /api/claims/my
// @access  Private (Patient)
exports.getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ patient: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get details of a specific claim
// @route   GET /api/claims/:id
// @access  Private (Patient or Insurer)
exports.getClaimDetails = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Authorization: User must be either the patient who created the claim or an insurer
    if (req.user.role !== 'insurer' && claim.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this claim'
      });
    }

    res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims
// @route   GET /api/claims
// @access  Private (Insurer)
exports.getAllClaims = async (req, res, next) => {
  try {
    // Basic filter & search options can be added here or later.
    // For now, retrieve all.
    const claims = await Claim.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim status (Approve / Reject)
// @route   PATCH /api/claims/:id
// @access  Private (Insurer)
exports.updateClaim = async (req, res, next) => {
  try {
    const { status, approvedAmount, insurerComments } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (Approved or Rejected)'
      });
    }

    let claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Rules
    // Approved: status becomes Approved, approved amount required
    if (status === 'Approved') {
      const appAmt = parseFloat(approvedAmount);
      if (isNaN(appAmt) || appAmt <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Approved amount must be a positive number for approved status'
        });
      }
      if (appAmt > claim.claimAmount) {
        return res.status(400).json({
          success: false,
          message: 'Approved amount cannot exceed the requested claim amount'
        });
      }
      claim.approvedAmount = appAmt;
      claim.insurerComments = insurerComments || '';
    }

    // Rejected: approved amount optional, comments required
    if (status === 'Rejected') {
      if (!insurerComments || insurerComments.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Comments are required for rejected claims'
        });
      }
      claim.approvedAmount = 0;
      claim.insurerComments = insurerComments;
    }

    claim.status = status;
    await claim.save();

    res.status(200).json({
      success: true,
      message: `Claim status updated to ${status}`,
      data: claim
    });
  } catch (error) {
    next(error);
  }
};
