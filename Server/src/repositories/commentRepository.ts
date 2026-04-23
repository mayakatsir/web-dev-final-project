import { Comment, commentModel } from '../models/comment';
import { userModel } from '../models/user';

class CommentRepository {
    async createComment(comment: Comment) {
        return await commentModel.create(comment);
    }

    async updateComment(id: string, updatedFields: Partial<Comment>) {
        return await commentModel.findByIdAndUpdate(id, updatedFields, { new: true }).select('-__v');
    }

    async getAllComments() {
        return await commentModel.find().select('-__v');
    }

    async getCommentsByPostId(postId: string) {
        const comments = await commentModel.find({ postId }).lean();
        const senderIds = [...new Set(comments.map((c) => c.sender))];
        const objectIdSenderIds = senderIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));
        const users = await userModel.find({ _id: { $in: objectIdSenderIds } }).select('name username avatarUrl').lean();
        const userMap = new Map(users.map((u) => [String(u._id), { name: u.name || u.username, avatarUrl: u.avatarUrl ?? '' }]));
        return comments.map((c) => {
            const userData = userMap.get(c.sender);
            return { ...c, senderName: userData?.name ?? c.sender, senderAvatar: userData?.avatarUrl ?? '' };
        });
    }

    async getCommentById(id: string) {
        return await commentModel.findById(id);
    }

    async deleteCommentById(commentId: string) {
        await commentModel.deleteOne({ _id: commentId });
    }
}

export default new CommentRepository();
