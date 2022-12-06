// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('./auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        try {
          const foundUser = await User.findOne({ _id: context.user._id });

          if (!foundUser) {
            return res.status(400).json({ message: 'Cannot find a user with this id!' });
          }

          return foundUser;
        } catch (err) {
          console.log(error);
        }
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        const checkPassword = await user.isCorrectPassword(password);
        if(!checkPassword) throw new Error('Incorrect password');
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },

    saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
      try {
        const updateUserBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { authors, description, bookId, image, link, title } } },
          { new: true, runValidators: true }
        )

        return updateUserBooks;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = resolvers;