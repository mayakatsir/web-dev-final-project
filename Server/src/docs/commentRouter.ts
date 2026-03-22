/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentWithoutId'
 *     responses:
 *       200:
 *         description: The new comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request error - body param is missing or invalid
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Update a comment by its id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the comment to update
 *         example: 674069829f3ed9c93edb75b0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentWithoutId'
 *     responses:
 *       200:
 *         description: Update succeeded
 *       400:
 *         description: Invalid comment id or body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the comment to delete
 *         example: 674069829f3ed9c93edb75b0
 *     responses:
 *       200:
 *         description: Delete succeeded
 *       400:
 *         description: Invalid comment id
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get comment by id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the comment to find
 *         example: 674069829f3ed9c93edb75b0
 *     responses:
 *       200:
 *         description: The comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment id
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/posts/{postID}:
 *   get:
 *     summary: Get all comments by post id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postID
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the post to find comments for
 *         example: 674069829f3ed9c93edb75b0
 *     responses:
 *       200:
 *         description: The comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid postID
 *       500:
 *         description: Internal server error
 */