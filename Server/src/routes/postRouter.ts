import { Router } from 'express';
import postController from '../controllers/postController';
import { upload } from '../middlewares/upload';

const postRouter = Router();

postRouter.post('/', upload.single('image'), postController.createPost);

postRouter.get('/', postController.getAllPosts);

postRouter.get('/liked/:userId', postController.getLikedPosts);

postRouter.get('/:id', postController.getPostById);

postRouter.put('/:id', upload.single('image'), postController.updatePost);

postRouter.post('/:id/like', postController.likePost);
postRouter.delete('/:id/like', postController.unlikePost);

postRouter.delete('/:id', postController.deletePostById);

export default postRouter;
