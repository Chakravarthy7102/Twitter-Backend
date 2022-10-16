import { Request } from "express";
import { CustomResponse } from "../types/response.type";
import { source } from "../config/connectDB";
import { CookieType } from "../types/cookieType";
import { Profile } from "../entities/Profile";
import { User } from "../entities/User";
import { Follow } from "../entities/Follow";

class UserController {
  updateProfile = async (req: Request & CookieType, res: CustomResponse) => {
    try {
      const { userId } = req.session;
      const profile = await source
        .getRepository(Profile)
        .createQueryBuilder("profile")
        .where("profile.userId = :userId", { userId })
        .getOne();

      if (profile) {
        //update profile
        const updatedProfile = await source
          .createQueryBuilder()
          .update(Profile)
          .set({ ...req.body })
          .where("userId = :userId", { userId })
          .execute();

        return res.status(200).json({
          status: "ok",
          data: updatedProfile,
          message: "profile updated!",
        });
      }

      const newProfile = new Profile();

      newProfile.about = req.body?.about;
      newProfile.dob = new Date(req.body.dob);
      //   profile.followers = 0;
      //   profile.following = 0;
      newProfile.location = req.body.location || "";
      newProfile.userId = userId as unknown as string;

      await source.getRepository(Profile).save(newProfile);

      return res.status(201).json({
        status: "ok",
        data: newProfile,
        message: "profile updated | created",
      });
    } catch (error) {
      console.error("ERR", error);

      return res.status(409).json({
        status: "error",
        data: null,
        message: "something went wrong!",
      });
    }
  };

  getMyProfile = async (req: Request & CookieType, res: CustomResponse) => {
    try {
      const { userId } = req.session;

      const profile = await source
        .getRepository(Profile)
        .createQueryBuilder("profile")
        .where("profile.userId = :userId", { userId })
        .getOne();

      return res.status(200).json({
        data: profile,
        message: "Profile is here",
        status: "ok",
      });
    } catch (err) {
      console.log("err", err);
      return res.status(409).json({
        data: null,
        message: "Something went wrong",
        status: "error",
      });
    }
  };

  follow = async (req: Request & CookieType, res: CustomResponse) => {
    const { userId } = req.session;
    const { followUserId } = req.query;

    if (String(userId) === String(followUserId)) {
      return res.status(409).json({
        data: null,
        message: "You cannot follow yourself",
        status: "error",
      });
    }

    try {
      const alreadyFollowing = await source
        .getRepository(Follow)
        .createQueryBuilder("follow")
        .leftJoinAndSelect("follow.following", "following")
        .leftJoin("follow.follower", "follower")
        .where("following.id = :followUserId AND follower.id = :userId", {
          followUserId,
          userId,
        })
        .getOne();

      console.log("Already following", alreadyFollowing);

      if (alreadyFollowing) {
        return res.status(409).json({
          data: null,
          message: "You are already following this user",
          status: "error",
        });
      }

      const follow = new Follow();

      const user = await source
        .getRepository(User)
        .createQueryBuilder("user")
        .where("id = :userId", { userId })
        .getOne();

      const followingUser = await source
        .getRepository(User)
        .createQueryBuilder("user")
        .where("id = :followUserId", { followUserId })
        .getOne();

      if (!followingUser) {
        return res.status(404).json({
          data: null,
          message: "User not found",
          status: "error",
        });
      }

      user.following += 1;
      followingUser.followers += 1;
      user.save();
      followingUser.save();

      follow.follower = user;
      follow.following = followingUser;

      await source.getRepository(Follow).save(follow);

      return res.status(200).json({
        data: follow,
        message: "following",
        status: "ok",
      });
    } catch (error) {
      console.log("err", error);
      return res.status(409).json({
        data: null,
        message: "Something went wrong",
        status: "error",
      });
    }
  };

  unfollow = async (req: Request & CookieType, res: CustomResponse) => {
    const { userId } = req.session;
    const { unfollowUserId } = req.query;

    if (String(userId) === String(unfollowUserId)) {
      return res.status(409).json({
        data: null,
        message: "You cannot follow yourself",
        status: "error",
      });
    }

    try {
      const following = await source
        .getRepository(Follow)
        .createQueryBuilder("follow")
        .leftJoinAndSelect("follow.following", "following")
        .leftJoin("follow.follower", "follower")
        .where("following.id = :unfollowUserId AND follower.id = :userId", {
          unfollowUserId,
          userId,
        })
        .getOne();

      console.log("Already following", following);

      if (!following) {
        return res.status(409).json({
          data: null,
          message: "You are not following this user to unfollow",
          status: "error",
        });
      }
      const user = await source
        .getRepository(User)
        .createQueryBuilder("user")
        .where("id = :userId", { userId })
        .getOne();

      const followingUser = await source
        .getRepository(User)
        .createQueryBuilder("user")
        .where("id = :unfollowUserId", { unfollowUserId })
        .getOne();

      if (!followingUser) {
        return res.status(404).json({
          data: null,
          message: "User not found",
          status: "error",
        });
      }

      user.following -= 1;
      followingUser.followers -= 1;
      user.save();
      followingUser.save();

      await source.getRepository(Follow).remove(following);

      return res.status(200).json({
        data: null,
        message: "unfollowed",
        status: "ok",
      });
    } catch (error) {
      console.log("err", error);
      return res.status(409).json({
        data: null,
        message: "Something went wrong",
        status: "error",
      });
    }
  };
  //722db2e9-19b5-4bae-8e4c-fe9fcd659e71
  othersProfile = async (req: Request & CookieType, res: CustomResponse) => {
    const { userId } = req.query;

    try {
      const user = await source
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne();

      if (!user) {
        return res.status(404).json({
          message: "user not found",
          status: "ok",
          data: null,
        });
      }

      const profile = await source
        .getRepository(Profile)
        .createQueryBuilder("profile")
        .where("profile.userId = :userId", { userId })
        .getOne();

      return res.status(200).json({
        data: {
          user,
          profile,
        },
        message: "users data",
        status: "ok",
      });
    } catch (error) {
      console.log("err", error);
      return res.status(409).json({
        data: null,
        message: "Something went wrong",
        status: "error",
      });
    }
  };
}

export default UserController;
