const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedMockUsers = async () => {
  try {
    // Check if patient exists
    const patientExists = await User.findOne({ email: 'patient@test.com' });
    if (!patientExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('patient123', salt);
      await User.create({
        name: 'John Patient',
        email: 'patient@test.com',
        password: hashedPassword,
        role: 'patient'
      });
      console.log('Seeded mock patient user.');
    }

    // Check if insurer exists
    const insurerExists = await User.findOne({ email: 'insurer@test.com' });
    if (!insurerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('insurer123', salt);
      await User.create({
        name: 'Jane Insurer',
        email: 'insurer@test.com',
        password: hashedPassword,
        role: 'insurer'
      });
      console.log('Seeded mock insurer user.');
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};

module.exports = seedMockUsers;
