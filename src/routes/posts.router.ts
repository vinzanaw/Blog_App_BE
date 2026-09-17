import { Router } from "express";
import { uploadSingleImage } from "../middleware/upload.middleware";
import PostsController from "../controller/posts/posts.controller";

const router = Router();


//CREATE
router.post('/', uploadSingleImage, PostsController.createPost);

//READ
//GUEST: GET POSTS 
router.get('/', PostsController.getPosts);

//GUEST GET BY ID
router.get('/:id', PostsController.getPostById);

//UPDATE
router.patch('/:id', uploadSingleImage, PostsController.updatePost);

//DELETE
router.delete('/:id', PostsController.deletePost);


export default router;