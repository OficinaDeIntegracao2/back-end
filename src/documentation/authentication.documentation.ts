/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operações de autenticação (login)
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *     responses:
 *       201:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Dados do usuário autenticado
 *                   example:
 *                     id: "abc123"
 *                     name: "Nome do Usuário"
 *                     email: "usuario@example.com"
 *                     role: "PROFESSOR"
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciais inválidas
 */
