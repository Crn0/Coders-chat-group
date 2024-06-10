import User from "../models/user.mjs";

const usernameExist = async (val) => {
  try {
    const userExist = await User.findOne({ username: val })
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (userExist) return Promise.reject("Username already in use");

    return Promise.resolve();
  } catch (error) {
    return error;
  }
};

export default usernameExist;
