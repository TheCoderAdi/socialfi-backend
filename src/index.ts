import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";
import likeRoutes from "./routes/like";
import imageRoutes from "./routes/image";

// Error handling middleware
import { errorMiddleware } from "./middlewares/error";

// Apollo Server
import userSchema from "./module/user/userSchema";
import userResolver from "./module/user/userResolver";
import { ApolloServer } from "apollo-server-express";
import prisma from "./config/prisma";

async function startServer() {
  const server = new ApolloServer({
    typeDefs: userSchema,
    resolvers: userResolver,
    csrfPrevention: false,
    cache: "bounded",
    context: async ({ req, res }) => {
      const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";
      let user = null;

      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

          user = await prisma.user.findUnique({
            where: {
              id: decoded.id,
            },
          });
        }
      } catch (error) {
        console.log("Error verifying token:", error);
      }

      return {
        req,
        res,
        user,
      };
    },
  });
  await server.start();

  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));

  server.applyMiddleware({ app });
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Welcome to socialfi media API");
  });

  app.use("/", imageRoutes);
  app.use("/uploads", express.static(path.resolve("src/uploads")));
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app
    .use("/api/v1/posts", postRoutes)
    .use("/api/v1/posts", commentRoutes)
    .use("/api/v1/posts", likeRoutes);

  app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
  app.use(errorMiddleware);
}

startServer();
