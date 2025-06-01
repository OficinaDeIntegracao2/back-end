/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operações relacionadas a usuários (professores e voluntários)
 */

/**
 * @swagger
 * /api/users/professors:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *       400:
 *         description: Erro de validação ou professor já existe
 */

/**
 * @swagger
 * /api/users/volunteers:
 *   post:
 *     summary: Cria um novo aluno voluntário vinculado a um professor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Voluntário criado com sucesso
 *       400:
 *         description: Erro de validação ou voluntário já existe
 */
