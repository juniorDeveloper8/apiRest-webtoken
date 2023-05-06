
import bcrypt from 'bcryptjs';
import db from '../db/db.js';

const userController = {};

userController.updateProfile = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    let user = await db.query(`SELECT * FROM users WHERE email='${email}' AND id != ${req.user.id}`);
    if (user[0]) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // Update user in database
    const updateUser = {
      username,
      email
    }

    if (password) {
      updateUser.password = await bcrypt.hash(password, 10);
    }

    await db.query(`UPDATE users SET ? WHERE id=${req.user.id}`, updateUser);

    // Return updated user object
    user = {
      id: req.user.id,
      username,
      email
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

export default userController;
