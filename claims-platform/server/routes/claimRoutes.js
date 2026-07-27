const express = require('express');
const router = express.Router();
const {
  submitClaim,
  getMyClaims,
  getClaimDetails,
  getAllClaims,
  updateClaim
} = require('../controllers/claimController');
const { verifyToken, verifyRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Patient routes
router.post('/', verifyToken, verifyRole('patient'), upload.single('document'), submitClaim);
router.get('/my', verifyToken, verifyRole('patient'), getMyClaims);

// Patient and Insurer details route
router.get('/:id', verifyToken, verifyRole('patient', 'insurer'), getClaimDetails);

// Insurer routes
router.get('/', verifyToken, verifyRole('insurer'), getAllClaims);
router.put('/:id', verifyToken, verifyRole('insurer'), updateClaim);

module.exports = router;