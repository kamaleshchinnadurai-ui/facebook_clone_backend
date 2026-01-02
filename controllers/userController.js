// @desc    Get all users
// @route   GET /api/users
const getUsers = (req, res) => {
    // We are just sending a text message for now.
    // In Week 2, we will fetch real data from the database here.
    res.status(200).json({ message: "Get all users" });
}

// @desc    Register a user
// @route   POST /api/users
const registerUser = (req, res) => {
    // Logic to register user will go here later
    res.status(200).json({ message: "Register new user" });
}

// We export these functions so other files can use them
module.exports = { getUsers, registerUser };