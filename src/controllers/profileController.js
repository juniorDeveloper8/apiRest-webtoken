
import db from '../db/db.js';

const profileController = {};

profileController.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.query(`SELECT id, username, email FROM users WHERE id=${userId}`);

    res.json(user[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

export default profileController;
