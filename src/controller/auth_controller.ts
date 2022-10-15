import { Request, Response } from "express";
import { User } from "../entities/User";
import { source } from "../config/connectDB";
import { checkInputData } from "../utils/checkInputData";
import { CookieType } from "../types/cookieType";

class AuthController {
  register = async (
    req: Request & CookieType,
    res: Response
  ): Promise<Response<any, Record<string, any>>> => {
    const { username, password, gender } = req.body;

    const check = checkInputData(req.body);

    if (!check.status) {
      return res.status(409).json(check);
    }

    const user = new User();

    user.username = username;
    user.password = password;

    user.hashPassword();

    try {
      // const createdUser = await User.save(user);
      const createdUser = await source.getRepository(User).save(user);

      //set cookie to the new user
      req.session.userId = createdUser.id;

      return res.status(200).json({
        status: "ok",
        data: createdUser,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("ERR", error);
      if (error.code === "23505") {
        return res.status(409).json({
          status: "error",
          data: null,
          message: "Duplicate user name",
        });
      }

      return res.status(409).json({
        status: "error",
        data: null,
        message: "something went wrong!",
      });
    }
  };

  login = async (
    req: Request & CookieType,
    res: Response
  ): Promise<Response<any, Record<string, any>>> => {
    const { username, password } = req.body;

    console.log("pass", req.body);

    const user = await source
      .getRepository(User)
      .findOneBy({ username: username });

    if (!user) {
      return res.status(404).json({
        status: "error",
        data: null,
        message: "Please enter correct password or username",
      });
    }

    const valid = user.checkIfPasswordMatch(password);

    if (!valid) {
      return res.status(404).json({
        status: "error",
        data: null,
        message: "Please enter correct password or username",
      });
    }

    req.session.userId = user.id;

    return res.status(404).json({
      status: "ok",
      data: user,
      message: "Successss",
    });
  };

  logout = async (
    req: Request & CookieType,
    res: Response
  ): Promise<Response<any, Record<string, any>>> => {
    return new Promise((resolve, rejects) => {
      req.session.destroy((err) => {
        res.clearCookie("cid");
        resolve(true);

        if (err) {
          console.error("err", err);
          rejects(false);
        }
      });
    })
      .then((_) => {
        return res.status(200).json({
          message: "Logged out",
          status: "ok",
          data: null,
        });
      })
      .catch((err) => {
        return res.status(409).json({
          message: "Something went wrong!",
          status: "err",
          data: null,
        });
      });
  };
}

export default AuthController;
