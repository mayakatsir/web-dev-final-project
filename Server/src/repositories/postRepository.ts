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

  async getAllPosts(query: Record<string, string | undefined>, page = 1, limit = 6) {
    const filters: FilterQuery<Post> = {};

    if ('sender' in query) {
      filters.sender = query.sender;
    }

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      postModel.find(filters).sort({ postedAt: -1 }).skip(skip).limit(limit).select('-__v').lean(),
      postModel.countDocuments(filters),
    ]);

    const senderIds = [...new Set(posts.map((p) => p.sender))];
    const users = await userModel.find({ _id: { $in: senderIds } }).select('username name avatarUrl').lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    return {
      posts: posts.map((p) => ({
        ...p,
        senderUsername: userMap[p.sender]?.username ?? p.sender,
        senderName: userMap[p.sender]?.name ?? '',
        senderAvatar: userMap[p.sender]?.avatarUrl ?? '',
      })),
      total,
      hasMore: skip + posts.length < total,
    };
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
    await userModel.updateOne({ _id: userId }, { $addToSet: { likedPosts: postId } });
  }

  async unlikePost(postId: string, userId: string) {
    await postModel.updateOne(
      { _id: postId, likedBy: userId },
      { $pull: { likedBy: userId }, $inc: { likesCount: -1 } },
    );
    await userModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
  }

  async getTopLikedPostsByCategory(userId: string, category: string, limit: number) {
    const user = await userModel.findById(userId).select('likedPosts').lean();
    if (!user || !user.likedPosts?.length) return [];
    const posts = await postModel
      .find({ _id: { $in: user.likedPosts }, category: { $regex: new RegExp(`^${category}$`, 'i') } })
      .sort({ likesCount: -1 })
      .limit(limit)
      .select('-__v')
      .lean();
    return posts;
  }

  async getLikedPosts(userId: string, page = 1, limit = 9) {
    const user = await userModel.findById(userId).select('likedPosts').lean();
    if (!user || !user.likedPosts?.length) return { posts: [], total: 0, hasMore: false };
    const total = user.likedPosts.length;
    const skip = (page - 1) * limit;
    const posts = await postModel
      .find({ _id: { $in: user.likedPosts } })
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();
    const senderIds = [...new Set(posts.map((p) => p.sender))];
    const users = await userModel.find({ _id: { $in: senderIds } }).select('username name avatarUrl').lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
    return {
      posts: posts.map((p) => ({
        ...p,
        senderUsername: userMap[p.sender]?.username ?? p.sender,
        senderName: userMap[p.sender]?.name ?? '',
        senderAvatar: userMap[p.sender]?.avatarUrl ?? '',
      })),
      total,
      hasMore: skip + posts.length < total,
    };
  }

  async deletePostById(postId: string) {
    await postModel.deleteOne({ _id: postId });
  }
}

export default new PostRepository();
