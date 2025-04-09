import prisma from "../config/prisma";
import { ErrorHandler, TryCatch } from "../utils/error";

/**
 * @description Create a new post
 * @route POST /api/v1/posts/
 */
export const createPost = TryCatch(async (req, res, next) => {
  const { caption } = req.body ?? {};

  if (!caption || !req.file) {
    return next(new ErrorHandler("Image URL and caption are required", 400));
  }

  const image_url = req.file.filename;
  const post = await prisma.post.create({
    data: {
      caption,
      image_url,
      user_id: req?.user?.id as number,
    },
  });

  return res.status(201).json({
    success: true,
    post,
  });
});

/**
 * @description Get all posts from followed users
 * @route GET /api/v1/posts/
 */

export const getPosts = TryCatch(async (req, res, next) => {
  const following = await prisma.follow.findMany({
    where: {
      follower_id: req.user?.id as number,
    },
    select: {
      following_id: true,
    },
  });

  const followedUserIds = following.map((follower) => follower.following_id);

  const posts = await prisma.post.findMany({
    where: {
      user_id: {
        in: followedUserIds,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          profile_picture_url: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              username: true,
              profile_picture_url: true,
            },
          },
        },
      },
      likes: {
        include: {
          user: {
            select: {
              username: true,
              profile_picture_url: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!posts || posts.length === 0) {
    return next(new ErrorHandler("No posts found", 404));
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

/**
 * @description Get a single post
 * @route GET /api/v1/posts/:id
 */

export const getSinglePost = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Post ID is required", 400));
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          username: true,
          profile_picture_url: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              username: true,
              profile_picture_url: true,
            },
          },
        },
      },
      likes: {
        include: {
          user: {
            select: {
              username: true,
              profile_picture_url: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});

/**
 * @description Delete a post
 * @route DELETE api/posts/:id
 */

export const deletePost = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Post ID is required", 400));
  }

  let userWithPost = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!userWithPost) {
    return next(new ErrorHandler("Post not found", 404));
  }

  if (userWithPost.user_id !== (req.user?.id as number)) {
    return next(new ErrorHandler("You are not authorized to delete this post", 403));
  }

  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});
