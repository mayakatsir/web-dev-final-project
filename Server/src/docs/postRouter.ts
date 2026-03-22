/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostWithoutId'
 *     responses:
 *       200:
 *         description: The new post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request error - body param is either missing or invalid
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by the post id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the post to update
 *         example: 674069829f3ed9c93edb75b0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostWithoutId'
 *     responses:
 *       200:
 *         description: Update succeeded
 *       400:
 *         description: Invalid post id or body
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the post to find
 *         example: 654069829c3ed9c63eda75b1
 *     responses:
 *       200:
 *         description: The post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post id
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         description: Id of the user to find their posts
 *         example: 654069829c3ed9c63eda75b1
 *     responses:
 *       200:
 *         description: The posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid sender
 *       500:
 *         description: Internal server error
 */