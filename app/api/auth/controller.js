const User = require("../users/model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../errors");
const { createJWT , createTokenUser} = require("../../utils");


const signinAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomAPI.BadRequestError("Please provide email and password");
    }

    const result = await User.findOne({
      email: email,
    });

    if (!result) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }
    if(result.role !== "admin"){
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }
    if(result.isActive === false){
      throw new CustomAPI.UnauthorizedError("Account disabled by ADMIN");
    }

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }

    const token = createJWT({ payload: createTokenUser(result) });

    return res.status(StatusCodes.OK).json({
      message: "Login Success",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { username, email, password, no_telpon } = req.body;
  

    const resCreate = await User.create({
      email,
      username,
      password,
      no_telpon,
      role : "admin"
    });


    const result = {
      email: resCreate.email,
      username: resCreate.username,
      no_telpon: resCreate.no_telpon,
      role: resCreate.role,
      avatar: resCreate.avatar,
    };

    return res.status(StatusCodes.OK).json({
      message: "success create account,",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
    signup,
    signinAdmin
}