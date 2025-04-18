import prisma from "../../config/prisma";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { generateUsername } from "../../utils/helper";
import { generateToken } from "../../utils/jwt";
import fs from "fs";

const userResolver = {
  Query: {
    fetchProfile: async (_: unknown, args: { id: string }) => {
      const { id } = args;
      return await prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createUser: async (_: unknown, { input }) => {
      const {
        username,
        email,
        password,
        name,
        bio,
        gender,
        date_of_birth,
        interests,
        geo_location,
        hometown,
      } = input;

      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new Error("User already exists with this email.");
      }

      const finalUsername = username || generateUsername(name);

      const password_hash = await bcrypt.hash(password, 10);

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          username: finalUsername,
          email,
          password_hash,
          name,
          bio,
          gender,
          date_of_birth: new Date(date_of_birth),
          interests,
          geo_location,
          hometown,
          profile_picture_url: "",
        },
      });

      const token = generateToken(newUser.id);

      return {
        user: newUser,
        token,
      };
    },

    updateUser: async (_: unknown, { input }, { user }) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      const { name, bio, interests, geo_location, hometown } = input;

      const data: {
        name?: string;
        bio?: string;
        interests?: string[];
        geo_location?: string;
        hometown?: string;
        profile_picture_url?: string;
        photos?: string[];
      } = {};

      if (name) data.name = name;
      if (bio) data.bio = bio;
      if (interests) data.interests = interests;
      if (geo_location) data.geo_location = geo_location;
      if (hometown) data.hometown = hometown;

      // Update user information
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data,
      });

      return updatedUser;
    },
    deleteUser: async (_: unknown, __: unknown, { user }) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      const profileImage = user.profile_picture_url || "";
      const images = user.photos || [];

      const currentFilePath = process.cwd() + "/src/uploads/" + profileImage;

      if (profileImage) {
        fs.unlink(currentFilePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
          console.log(`${profileImage}(profile) deleted successfully`);
        });
      }

      if (images.length > 0) {
        images.forEach((image) => {
          const currentFilePath = process.cwd() + "/src/uploads/" + image;
          fs.unlink(currentFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
            console.log(`${image} deleted successfully`);
          });
        });
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: user.id },
      });

      return {
        success: true,
        message: "User deleted successfully",
      };
    },
  },
};

export default userResolver;
