import { userModel } from '../models/user';
import { postModel } from '../models/post';
import { commentModel } from '../models/comment';

class UserRepository {
    async createUser(username: string, email: string, password: string, name = '', avatarUrl = '') {
        return await userModel.create({ username, email, password, name, avatarUrl });
    }

    async getUserById(id: string) {
        return await userModel.findById(id).select('-__v -password');
    }

    async getUserByUsername(username: string) {
        return await userModel.findOne({ username }).select('-__v');
    }

    async getAllUsers() {
        return await userModel.find().select('-__v -password');
    }

    async updateUser(id: string, updates: { username?: string; email?: string; password?: string; name?: string; avatarUrl?: string; bio?: string }) {
        await userModel.findByIdAndUpdate(id, updates);
    }

    async deleteUserById(userId: string) {
        await userModel.deleteOne({ _id: userId });
        await postModel.deleteMany({ sender: userId });
        await commentModel.deleteMany({ sender: userId });
    }

    async isUsernameExists(username: string) {
        return (await userModel.countDocuments({ username })) > 0;
    }

    async getUserByEmail(email: string) {
        return await userModel.findOne({ email }).select('-__v');
    }
}

export default new UserRepository();
