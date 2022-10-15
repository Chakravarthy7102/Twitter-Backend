import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import PostController from "../controller/post_controller";

const router = Router();
const post = new PostController();

router.post("/create", checkAuth, post.createPost);
router.get("/feed", post.feed);
router.get("/userposts", checkAuth, post.getUserPosts);
router.delete("/:id", checkAuth, post.deletePost);
router.get("/like", checkAuth, post.like);
router.get("/retweet", post.retweet);
router.get("/get-user-retweets", post.getUsersRetweets);

export default router;
