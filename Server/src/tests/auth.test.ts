import request from 'supertest';
import mongoose from 'mongoose';
import { postModel } from '../models/post';
import { Express } from 'express';
import { userModel, User } from '../models/user';
import { commentModel } from '../models/comment';

let app: Express;

beforeAll(async () => {
    app = await global.initTestServer();
   
    await userModel.deleteMany();
    await postModel.deleteMany();
    await commentModel.deleteMany();
});

afterAll(async () => {
    mongoose.connection.close();
    await global.closeTestServer();
});

const testUser: User & { _id: string; accessToken: string; refreshedToken: string } = {
    email: 'test@user.com',
    password: 'testpassword',
    username: 'test',
    _id: '',
    refreshToken: [],
    accessToken: '',
    refreshedToken: '',
};

describe('Auth Tests', () => {
    test('Register a new user', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send(testUser);

        expect(response.statusCode).toBe(200);
        testUser._id = response.body._id;
    });

    test('Fail registering the same user twice', async () => {
        const {statusCode, body: {message}} = await request(app)
            .post('/auth/register')
            .send(testUser);

        expect(statusCode).toBe(400);
        expect(message).toBe('username: test already exists');
    });

    test('Login user', async () => {
        const { statusCode, body} = await request(app)
            .post('/auth/login')
            .send(testUser);

        expect(statusCode).toBe(200);
        const accessToken = body.token;
        const refreshToken = body.refreshToken;

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
    });

    test('Fail to login without username in params', async () => {
        const { statusCode, body: { message} } = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: 'mayaya',
            });

        expect(statusCode).toBe(400);
        expect(message).toBe('body param is missing (username or password)');
    });

    test('Use Auth', async () => {
        const { statusCode, body: { message }} = await request(app).post('/posts').send({
            title: 'New post',
            content: 'post content',
            owner: 'mayaK',
        });
        expect(statusCode).toBe(404);
        
        const secondResponse = await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({
                title: 'New post',
                content: 'post content',
                sender: testUser._id,
            });
        expect(secondResponse.statusCode).toBe(200);
    });

    test('Refresh token', async () => {
        const {statusCode, body} = await request(app)
            .post('/auth/refresh-token')
            .send({
                refreshToken: testUser.refreshToken,
            });

        expect(statusCode).toBe(200);
        expect(body.token).toBeDefined();
        expect(body.refreshToken).toBeDefined();
        testUser.accessToken = body.token;
        testUser.refreshToken = body.refreshToken;
    });

    test('Test logout', async () => {
        const {statusCode, body} = await request(app)
            .post('/auth/login')
            .send(testUser);

        expect(statusCode).toBe(200);
        testUser.accessToken = body.token;
        testUser.refreshToken = body.refreshToken;

        const logoutResponse = await request(app)
            .post('/auth/logout')
            .send({
                refreshToken: testUser.refreshToken,
            });

        expect(logoutResponse.statusCode).toBe(200);
    });
});