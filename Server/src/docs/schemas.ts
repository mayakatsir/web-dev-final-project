/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - birthDate
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user password
 *         birthDate:
 *           type: date
 *           description: The user's birth date
 *       example:
 *         _id: 67796f764899e36c4973095c
 *         username: 'karen'
 *         email: 'maya@gmail.com'
 *         password: '123456'
 *         birthDate: '1990-01-01'
 *     LogInObject:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         username: 'karen'
 *         password: '123456'
 *     UserWithoutId:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - birthDate
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user password
 *         birthDate:
 *           type: date
 *           description: The user's birth date
 *       example:
 *         username: 'maya'
 *         email: 'karen@gmail.com'
 *         password: '123456'
 *         birthDate: '1990-01-01'
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     RefreshToken:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - sender
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         sender:
 *           type: string
 *           description: The id of the user that sent the post
 *       example:
 *         _id: 678b428c7a4c7c28093f2633
 *         title: a post
 *         content: a content dlssdsaa
 *         sender: 62396f7648a9e36c4973095c
 *     PostWithoutId:
 *       type: object
 *       required:
 *         - title
 *         - sender
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         sender:
 *           type: string
 *           description: The id of the user that sent the post
 *       example:
 *         title: my post
 *         content: my content
 *         sender: 67356c764899a36e497309c
 *     Comment:
 *       type: object
 *       required:
 *         - postID
 *         - sender
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated id of the comment
 *         postID:
 *           type: string
 *           description: The comment's post
 *         content:
 *           type: string
 *           description: The comment's content
 *         sender:
 *           type: string
 *           description: The id of the user that sent the comment
 *       example:
 *         _id: 674069826f3ed9c93edb75e4
 *         postID: 373b418c7a4c7c28093f2633
 *         content: my content
 *         sender: 64796f764899e36c4973095c
 *     CommentWithoutId:
 *       type: object
 *       required:
 *         - postID
 *         - sender
 *       properties:
 *         postID:
 *           type: string
 *           description: The post of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         sender:
 *           type: string
 *           description: The id of the user that sent the comment
 *       example:
 *         postID: 673b418c7a4c7c28093f2633
 *         content: my content
 *         sender: 67796f764899e36c4973095c
 *     Id:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The id
 *       example:
 *         id: 654069829c3ed9c63eda75b1
 */