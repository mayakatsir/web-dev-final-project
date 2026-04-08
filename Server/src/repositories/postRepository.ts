import { FilterQuery } from 'mongoose';
import { Post, postModel } from '../models/post';
import { userModel } from '../models/user';

class PostRepository {
  async createPost(data: {
    title: string;
    sender: string;
    description?: string;
    category?: string;
    cookingTime?: number;
    difficulty?: string;
    imageUrl?: string;
  }) {
    return await postModel.create({
      ...data,
      postedAt: new Date().toISOString(),
    });
  }

  async getPostById(id: string) {
    return await postModel.findById(id).select('-__v');
  }

  async getAllPosts(query: Record<string, string | undefined>) {
    const filters: FilterQuery<Post> = {};

    if ('sender' in query) {
      filters.sender = query.sender;
    }

    const posts = await postModel.find(filters).select('-__v').lean();

    const senderIds = [...new Set(posts.map((p) => p.sender))];
    const users = await userModel.find({ _id: { $in: senderIds } }).select('username name avatarUrl').lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    return posts.map((p) => ({
      ...p,
      senderUsername: userMap[p.sender]?.username ?? p.sender,
      senderName: userMap[p.sender]?.name ?? '',
      senderAvatar: userMap[p.sender]?.avatarUrl ?? '',
    }));
  }

  async updatePost(id: string, updates: Partial<Post>) {
    await postModel.findByIdAndUpdate(id, updates);
  }

  async incrementCommentsCount(postId: string) {
    await postModel.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });
  }

  async decrementCommentsCount(postId: string) {
    await postModel.updateOne({ _id: postId, commentsCount: { $gt: 0 } }, { $inc: { commentsCount: -1 } });
  }

  async likePost(postId: string, userId: string) {
    await postModel.updateOne(
      { _id: postId, likedBy: { $ne: userId } },
      { $addToSet: { likedBy: userId }, $inc: { likesCount: 1 } },
    );
  }

  async unlikePost(postId: string, userId: string) {
    await postModel.updateOne(
      { _id: postId, likedBy: userId },
      { $pull: { likedBy: userId }, $inc: { likesCount: -1 } },
    );
  }

  async deletePostById(postId: string) {
    await postModel.deleteOne({ _id: postId });
  }
}

export default new PostRepository();
