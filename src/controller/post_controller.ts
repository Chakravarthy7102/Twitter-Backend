import { Request } from "express";
import { User } from "../entities/User";
import { source } from "../config/connectDB";
import { CookieType } from "../types/cookieType";
import { CustomResponse } from "../types/response.type";
import { Post } from "../entities/Post";
import { Like } from "../entities/Like";
import { Retweet } from "../entities/Retweet";

class PostController {
  createPost = async (
    req: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const { content } = req.body;

      const post = new Post();

      const user = await source.getRepository(User).findOne({
        where: {
          id: req.session.userId,
        },
      });

      post.content = content;
      post.user = user;
      post.likes = [];

      const newPost = await source.getRepository(Post).save(post);

      return res.status(200).json({
        status: "ok",
        data: newPost,
        message: "post created succesfully!",
      });
    } catch (error) {
      console.log("ERR", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };

  getUserPosts = async (
    req: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const posts = await source
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.posts", "posts")
        .select(["user.username", "posts", "user.id", "user.profilePic"])
        .where("user.id = :userId", { userId: req.session.userId })
        .orderBy("posts.created_at", "DESC")
        .getOne();

      return res.status(200).json({
        status: "ok",
        data: { posts },
        message: "results!",
      });
    } catch (error) {
      console.log("ERR", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };

  feed = async (
    _: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const feed = await source
        .getRepository(Post)
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.user", "user")
        .leftJoinAndSelect("post.likes", "likes")
        .orderBy("post.created_at", "DESC")
        .select([
          "user.username",
          "user.id",
          "user.profilePic",
          "post.id",
          "post.content",
          "likes",
        ])
        .getMany();

      //Select array_length(array[1,2,3], 1);

      return res.status(200).json({
        status: "ok",
        data: { feed },
        message: "results!",
      });
    } catch (error) {
      console.log("ERR", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };

  deletePost = async (
    req: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const { postId } = req.params;
      const { userId } = req.session;

      const post = await source
        .getRepository(Post)
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.user", "user")
        .where("post.id = :postId", { postId })
        .select(["post.id", "post.user", "user.id"])
        .getOne();

      if (post.user.id !== userId) {
        return res.status(403).json({
          status: "error",
          data: null,
          message: "You are not authorized to do this action!!",
        });
      }

      await post.remove();

      return res.status(201).json({
        status: "ok",
        data: null,
        message: "Post deleted!",
      });
    } catch (error) {
      console.error("err", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };

  like = async (
    req: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const { postId } = <{ postId: string }>req.query;
      console.log("POST", postId);
      const { userId } = req.session;

      const like = await source
        .getRepository(Like)
        .createQueryBuilder("like")
        .leftJoinAndSelect("like.user", "user")
        .leftJoinAndSelect("like.post", "post")
        .where("user.id = :userId AND post.id = :postId", { userId, postId })
        .getOne();

      if (like) {
        await source.getRepository(Like).remove(like);
        console.log("Already Liked the post!!");
        return res.status(200).json({
          data: null,
          message: "Like removed",
          status: "ok",
        });
      }

      const post = await source.getRepository(Post).findOne({
        where: {
          id: postId,
        },
        select: ["id"],
      });

      const user = await source.getRepository(User).findOne({
        where: {
          id: userId,
        },
        select: ["id"],
      });

      if (!post || !user) {
        return res.status(404).json({
          data: null,
          message: "Not found",
          status: "error",
        });
      }

      const newLike = new Like();

      newLike.post = post;
      newLike.user = user;

      await source.getRepository(Like).save(newLike);

      return res.status(201).json({
        status: "ok",
        data: newLike,
        message: "Liked!",
      });
    } catch (error) {
      console.error("err", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };

  retweet = async (
    req: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const { postId } = <{ postId: string }>req.query;
      console.log("POST", postId);
      const { userId } = req.session;

      const retweet = await source
        .getRepository(Retweet)
        .createQueryBuilder("retweet")
        .leftJoinAndSelect("retweet.retweeter", "retweeter")
        .leftJoinAndSelect("retweet.post", "post")
        .where("retweeter.id = :userId AND post.id = :postId", {
          userId,
          postId,
        })
        .getOne();

      if (retweet) {
        await source.getRepository(Retweet).remove(retweet);
        console.log("Already Retweeted the post!!");
        return res.status(200).json({
          data: null,
          message: "Retweet removed",
          status: "ok",
        });
      }

      const post = await source.getRepository(Post).findOne({
        where: {
          id: postId,
        },
        select: ["id", "user"],
      });

      const user = await source.getRepository(User).findOne({
        where: {
          id: userId,
        },
        select: ["id"],
      });

      if (!post || !user) {
        return res.status(404).json({
          data: null,
          message: "Not found",
          status: "error",
        });
      }

      const newRetweet = new Retweet();

      newRetweet.post = post;
      newRetweet.retweeter = user;
      newRetweet.tweeter = post.user;

      await source.getRepository(Retweet).save(newRetweet);

      return res.status(201).json({
        status: "ok",
        data: newRetweet,
        message: "Retweeted!",
      });
    } catch (error) {
      console.error("err", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };

  getUsersRetweets = async (
    req: Request & CookieType,
    res: CustomResponse
  ): Promise<CustomResponse> => {
    try {
      const { userId } = req.session;

      const user = await source.getRepository(User).findOne({
        where: {
          id: userId,
        },
        select: ["id"],
      });

      if (!user) {
        return res.status(404).json({
          data: null,
          message: "Not found",
          status: "error",
        });
      }

      const retweets = await source
        .getRepository(Retweet)
        .createQueryBuilder("retweet")
        .leftJoinAndSelect("retweet.retweeter", "retweeter")
        .leftJoinAndSelect("retweet.post", "post")
        .leftJoinAndSelect("post.retweets", "retweets")
        .where("retweet.retweeter = :userId", { userId })
        .getMany();

      return res.status(200).json({
        status: "ok",
        data: retweets,
        message: "Here are your retweets!",
      });
    } catch (error) {
      console.error("err", error);
      return res.status(409).json({
        status: "error",
        data: null,
        message: "Something went wrong!!",
      });
    }
  };
}

export default PostController;
