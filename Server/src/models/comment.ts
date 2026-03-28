import { InferSchemaType, Schema, model } from 'mongoose';

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedAt: {
        type: String,
        default: () => new Date().toISOString(),
    },
});

export const commentModel = model('comment', commentSchema);
export type Comment = InferSchemaType<typeof commentSchema>;