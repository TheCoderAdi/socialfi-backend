import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";

import { ErrorHandler, TryCatch } from "../utils/error";

/**
 * @description Add a comment to a post
 * @route POST /api/v1/posts/:id/comments
 */
export const addComment = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body ?? {};

  if (!text) {
    return next(new ErrorHandler("Comment text is required", 400));
  }

  if (!id) {
    return next(new ErrorHandler("Post id is required", 400));
  }

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const comment = await prisma.comment.create({
    data: {
      id: uuidv4(),
      text,
      post_id: id,
      user_id: req.user?.id as string,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: comment,
  });
});

/**
 * @description Get all comments for a post
 * @route GET /api/v1/posts/:id/comments
 */

export const getComments = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Post id is required", 400));
  }

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const comments = await prisma.comment.findMany({
    where: {
      post_id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    data: comments,
  });
});
