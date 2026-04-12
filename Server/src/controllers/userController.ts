import { Request, Response } from 'express';
import UserRepository from '../repositories/userRepository';
import { uploadToGridFS } from '../services/gridfs';
import { isValidObjectId } from 'mongoose';

class UserController {
    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }

            const user = await UserRepository.getUserById(id);

            if (!user) {
                res.status(404).send({ message: `didn't find user with id: ${id}` });
                return;
            }

            res.status(200).send({ user });
        } catch (err) {
            console.error('Error getting user by id', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            res.status(200).send({ users: await UserRepository.getAllUsers() });
        } catch (err) {
            console.error('Failed getting all users', err);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { username, email, name, bio } = req.body;
            let { avatarUrl } = req.body;

            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }

            if (req.file) {
                const fileId = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
                avatarUrl = `/uploads/${fileId}`;
            }

            if (username) {
                const exists = await UserRepository.isUsernameExists(username);
                if (exists) {
                    const current = await UserRepository.getUserById(id);
                    if (current?.username !== username) {
                        res.status(400).send({ message: `username: ${username} already exists` });
                        return;
                    }
                }
            }

            await UserRepository.updateUser(id, { username, email, name, avatarUrl, bio });
            const updated = await UserRepository.getUserById(id);
            res.status(200).send({ user: updated });
        } catch (err) {
            console.error('Error updating user', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }

            await UserRepository.deleteUserById(id);
            res.status(200).send({ message: `Successfully deleted user with id: ${id}` });
        } catch (err) {
            console.error('Error deleting user', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new UserController();
