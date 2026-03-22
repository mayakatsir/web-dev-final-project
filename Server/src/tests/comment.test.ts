import request from 'supertest';
import mongoose from 'mongoose';
import { commentModel } from '../models/comment';
import { Express, response } from 'express';
import { User, userModel } from '../models/user';
import { postModel } from '../models/post';

let app: Express;

let testUser: User & { _id: string, token: string } = {
    username: 'testuser',
    email: 'test@user.com',
    password: 'testpassword',
    token: '',
    refreshToken: [],
    _id: '',
};
let userId: string;
let postId: string;

beforeAll(async () => {
    app = await global.initTestServer();

    await commentModel.deleteMany();
    await userModel.deleteMany();
    await postModel.deleteMany();

    testUser = (await request(app).post('/auth/register').send(testUser)).body;
    userId = testUser._id;

    const { token, refreshToken } = (
        await request(app)
            .post('/auth/login')
            .send({ username: testUser.username, password: 'testpassword' })
    ).body;
    testUser.token = token;
    testUser.refreshToken = [refreshToken];

    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `bearer ${token}`)
      .send({
        sender: userId,
        title: 'Test Post',
        content: 'Test Content',
      });
    postId = postResponse.body._id;
});

afterAll(async () => {
    mongoose.connection.close();

    await global.closeTestServer();
});

let commentId = '';

describe('Comments Tests', () => {
    test('Create a new comment', async () => {
        const {
            statusCode,
            body: { content: expectedContent, postId: expectedPostId, sender: expectedSender, _id },
        } = await request(app)
            .post('/comment')
            .send({
                sender: userId,
                content: 'Test Comment',
                postId: postId,
            })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(expectedContent).toBe('Test Comment');
        expect(expectedPostId).toBe(postId);
        expect(expectedSender).toBe(userId);
        commentId = _id;
    });

    test('Get comment by id', async () => {
        const { statusCode, body } = await request(app)
            .get('/comment/' + commentId)
            .set('Authorization', `Bearer ${testUser.token}`);
        const { content: expectedContent, postId: expectedPostId, sender: expectedSender } = body;

        expect(statusCode).toBe(200);
        expect(expectedContent).toBe('Test Comment');
        expect(expectedPostId).toBe(postId);
    });

    test('Add a second comment to the same post', async () => {
        const {
            statusCode,
            body: { content: expectedContent, postId: expectedPostId, sender: expectedSender },
        } = await request(app)
            .post('/comment')
            .send({
                sender: userId,
                content: 'Test Comment 2',
                postId: postId,
            })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(expectedContent).toBe('Test Comment 2');
        expect(expectedPostId).toBe(postId);
        expect(expectedSender).toBe(userId);
    });

    test('Get all comments of a post by post id', async () => {
        const {
            statusCode,
            body: { comments },
        } = await request(app)
            .get('/comment/post/' + postId)
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(comments.length).toBe(2);
        expect(comments[0].content).toBe('Test Comment');
        expect(comments[0].postId).toBe(postId);
        expect(comments[0].sender).toBe(userId);
        expect(comments[1].content).toBe('Test Comment 2');
        expect(comments[1].postId).toBe(postId);
        expect(comments[1].sender).toBe(userId);
    });

    test('Edit comment', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .put('/comment/' + commentId)
            .send({ content: 'Edited Comment' })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
    });

    test('Delete comment', async () => {
        const createResponse = await request(app)
          .post('/comment')
          .set('Authorization', `Bearer ${testUser.token}`)
          .send({
            sender: userId,
            content: 'Comment to delete',
            postId,
          });

        const commentId = createResponse.body._id;
    
        const res = await request(app)
          .delete('/comment/' + commentId)
          .set('Authorization', `Bearer ${testUser.token}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(`Successfully deleted comment ${commentId}`);
    });

    test('Should fail deleting a comment with invalid id', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .delete('/comment/invalidID')
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe("Invalid comment ID: invalidID");
    });

    test('Should fail fetching a comment with invalid id', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .get('/comment/invalidID')
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe('Invalid id: invalidID param');
    });

    test('Should fail fetching comments with invalid post id', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .get('/comment/post/invalidID')
            .set('Authorization', `Bearer ${testUser.token}`);
        expect(statusCode).toBe(400);
        expect(message).toBe("Invalid postId: invalidID param");
    });

    test('Should fail creating a comment with missing body params', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .post('/comment')
            .send({ content: 'Test Comment' })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe('Sender or postId is missing from body params');
    });

    test('Should fail creating a comment with an invalid post id', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .post('/comment')
            .send({ sender: userId, content: 'Test Comment', postId: 'invalidID' })
            .set('Authorization', `Bearer ${testUser.token}`);
            
        expect(statusCode).toBe(400);
        expect(message).toBe("Invalid postId: invalidID param");
    });

    test('Should fail creating a comment with non existing post id', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .post('/comment')
            .send({ sender: userId, content: 'Test Comment', postId: '30c4b7263ca1a4f3f8e8f3d7' })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe(
          "Non existent post with id: 30c4b7263ca1a4f3f8e8f3d7"
        );
    });

    test('Should fail editing comment with an invalid id', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .put('/comment/invalidID')
            .send({ content: 'Edited Comment', sender: userId })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe("Invalid comment ID: invalidID");
    });
});