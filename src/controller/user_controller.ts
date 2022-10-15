import { Request } from "express";
import { CustomResponse } from "../types/response.type";
import { source } from "../config/connectDB";
import { CookieType } from "../types/cookieType";
import { Profile } from "../entities/Profile";

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

  follow = async (req: Request & CookieType, res: CustomResponse) => {};
  unfollow = async (req: Request & CookieType, res: CustomResponse) => {};
}

export default UserController;
