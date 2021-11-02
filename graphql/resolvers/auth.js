const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPW = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPW,
      });

      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Incorrect credentials!");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "supersecretkeyforhash",
        {
          expiresIn: "1h",
        }
      );

      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1,
      };
    } catch (err) {
      throw err;
    }
  },
};
