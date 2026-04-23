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
        const users = await userModel.find({ _id: { $in: objectIdSenderIds } }).select('name username').lean();
        const userMap = new Map(users.map((u) => [String(u._id), u.name || u.username]));
        return comments.map((c) => ({ ...c, senderName: userMap.get(c.sender) ?? c.sender }));
    }

    async getCommentById(id: string) {
        return await commentModel.findById(id);
    }

    async deleteCommentById(commentId: string) {
        await commentModel.deleteOne({ _id: commentId });
    }
}

export default new CommentRepository();
