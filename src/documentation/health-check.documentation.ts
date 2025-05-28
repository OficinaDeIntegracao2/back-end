/**
 * @swagger
 * tags:
 *   name: HealthCheck
 *   description: Verificação de status da API
 */

/**
 * @swagger
 * /api/health-check:
 *   get:
 *     summary: Verifica se a API está online
 *     tags: [HealthCheck]
 *     responses:
 *       200:
 *         description: API está online
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 */
  