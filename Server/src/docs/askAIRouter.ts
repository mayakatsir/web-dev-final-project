/**
 * @swagger
 * /ask-ai:
 *   get:
 *     summary: Ask ChatGPT a question
 *     description: Sends a prompt to ChatGPT and returns the response
 *     tags: [AI]
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         schema:
 *           type: string
 *         description: The prompt to send to ChatGPT
 *         example: Give me a quick pasta recipe
 *     responses:
 *       200:
 *         description: ChatGPT response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Missing prompt query param
 *       500:
 *         description: Failed to get response from ChatGPT
 */

/**
 * @swagger
 * /ask-ai/recommend:
 *   post:
 *     summary: Recommend a recipe based on ingredients
 *     description: Sends a list of ingredients to ChatGPT and returns a recipe suggestion
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ingredients]
 *             properties:
 *               ingredients:
 *                 type: string
 *                 example: eggs, tomatoes, cheese, onion
 *     responses:
 *       200:
 *         description: Recipe recommendation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Missing ingredients param
 *       500:
 *         description: Failed to get recommendation
 */

/**
 * @swagger
 * /ask-ai/recommend-from-favorites:
 *   post:
 *     summary: Recommend a recipe based on user's liked posts
 *     description: Fetches the user's top liked posts in the chosen category and generates a personalized recipe
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, mealType]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 654069829c3ed9c63eda75b1
 *               mealType:
 *                 type: string
 *                 example: Dinner
 *     responses:
 *       200:
 *         description: Personalized recipe recommendation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Missing params or user has no liked posts
 *       500:
 *         description: Failed to generate recommendation
 */
