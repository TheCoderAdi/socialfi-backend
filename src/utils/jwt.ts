import jwt from "jsonwebtoken";

/**
    generateToken
    @param {number} userId - The ID of the user to generate a token for.
    @returns {string} - The generated JWT token.
    @throws {Error} - Throws an error if JWT_SECRET is not defined in the environment variables.
*/

export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
