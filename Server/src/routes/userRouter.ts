import { Router } from 'express';
import userController from '../controllers/userController';
import { upload } from '../middlewares/upload';

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:id', userController.getUserById);

userRouter.put('/:id', upload.single('avatar'), userController.updateUser);

userRouter.delete('/:id', userController.deleteUserById);

export default userRouter;
