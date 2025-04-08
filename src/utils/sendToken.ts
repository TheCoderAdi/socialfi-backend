import { SendToken } from "../types/types";
import { generateToken } from "./jwt";

/**
 *
 * @description This function generates a token for the user, sets it as a cookie in the response,
 * and sends the user information along with a success message.
 */
export const sendToken = ({ user, res, message, statusCode }: SendToken) => {
  const token = generateToken(user.id);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...safeUser } = user;

  return res
    .status(statusCode)
    .cookie("token", token, {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message,
      safeUser,
    });
};
