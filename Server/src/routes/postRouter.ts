import { Router } from 'express';
import postController from '../controllers/postController';

const postRouter = Router();

postRouter.post('/', postController.createPost);

postRouter.get('/', postController.getAllPosts);

postRouter.get('/liked/:userId', postController.getLikedPosts);

postRouter.get('/:id',postController.getPostById );

postRouter.put('/:id', postController.updatePost );

postRouter.post('/:id/like', postController.likePost);
postRouter.delete('/:id/like', postController.unlikePost);

postRouter.delete('/:id',postController.deletePostById );

export default postRouter;
