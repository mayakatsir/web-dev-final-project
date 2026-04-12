import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { userModel } from '../models/user';
import { commentModel } from '../models/comment';
import { postModel } from '../models/post';

let app: Express;

let testUser = {
    username: 'testuser',
    email: 'test@user.com',
    password: 'testpassword',
    name: '',
    avatarUrl: '',
    bio: '',
    token: '',
    refreshToken: [] as string[],
    _id: '',
};

let userId: string;
let postId = '';

beforeAll(async () => {
    app = await global.initTestServer();

    await commentModel.deleteMany();
    await userModel.deleteMany();
    await postModel.deleteMany();

    const registerBody = (await request(app).post('/auth/register').send(testUser)).body;
    testUser._id = registerBody.user._id;
    userId = testUser._id;

    const { token, refreshToken } = (
        await request(app)
            .post('/auth/login')
            .send({ username: testUser.username, password: 'testpassword' })
    ).body;
    testUser.token = token;
    testUser.refreshToken = [refreshToken];

    expect(testUser.refreshToken).toBeDefined();
});

afterAll(async () => {
    mongoose.connection.close();
    await global.closeTestServer();
});

describe('Posts Tests', () => {
    test('Get all posts', async () => {
        const {
            statusCode,
            body: { posts },
        } = await request(app)
            .get('/post')
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(posts.length).toBe(0);
    });

    test('Should fail to get all posts of an invalid existing sender', async () => {
        const { statusCode, body: { message } } = await request(app)
            .get(`/post/${userId}1`)
            .set('Authorization', `Bearer ${testUser.token}`);
            
        expect(statusCode).toBe(400);
        expect(message).toBe(`id: ${userId}1 is not valid`);
    });


    test('Create a new Post', async () => {
        const {
            statusCode,
            body: { title, description, _id },
        } = await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({
                title: 'Test new post',
                description: 'Test new content',
                sender: userId,
            });

        expect(statusCode).toBe(200);
        expect(title).toBe('Test new post');
        expect(description).toBe('Test new content');
        postId = _id;
    });

    test('Get post by sender', async () => {
        const {
            statusCode,
            body: { posts },
        } = await request(app)
            .get('/post')
            .query({ sender: userId })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(posts.length).toBe(1);
        expect(posts[0].title).toBe('Test new post');
        expect(posts[0].description).toBe('Test new content');
    });

    test('Update post content', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .put(`/post/${postId}`)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({
                description: 'Different Content',
            });

        expect(statusCode).toBe(200);
        expect(message).toBe('Post updated successfully');
    });

    test('Update content of a non exsiting post', async () => {
        const { statusCode, body: { message } } = await request(app)
            .put(`/post/${postId}1`)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({
                content: 'Different Content',
            });

        expect(statusCode).toBe(400);
        expect(message).toBe(`id: ${postId}1 is not valid`);
    });

    test('Update post content with an invalid post id', async () => {
        const { statusCode, body: { message } } = await request(app)
            .put(`/post/26342invalidid`)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({
                content: 'Different Content',
            });

        expect(statusCode).toBe(400);
        expect(message).toBe(`id: 26342invalidid is not valid`);
    });

    test('Get a post by id', async () => {
        const {
            statusCode,
            body: {
                post: { title, description },
            },
        } = await request(app)
            .get(`/post/${postId}`)
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(title).toBe('Test new post');
        expect(description).toBe('Different Content');
    });

    test('Get post with invalid id', async () => {
        const { statusCode, body: { message } } = await request(app)
            .get(`/post/123invalidid`)
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(404);
        expect(message).toBe(`didn't find post with id: 123invalidid`);
    });

    test('Create another post', async () => {
        const { statusCode } = await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({
                title: 'Second post',
                description: 'Second content',
                sender: userId,
            });

        expect(statusCode).toBe(200);
    });

    test('Get all posts - having only two', async () => {
        const {
            statusCode,
            body: { posts },
        } = await request(app)
            .get('/post')
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(posts.length).toBe(2);
    });

    test('Should fail creating a post', async () => {
        const { statusCode, body: { message } } = await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testUser.refreshToken[0]}`)
            .send({
                content: 'Test Content 2',
            });
            
        expect(statusCode).toBe(400);
        expect(message).toBe('body param is missing (sender or title)');
    });
});