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
