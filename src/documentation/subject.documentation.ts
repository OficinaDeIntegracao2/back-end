/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Operações relacionadas a matérias
 */

/**
 * @swagger
 * /api/users/professors/{professorId}/subjects:
 *   post:
 *     summary: Cria uma nova matéria
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               weekdays:
 *                 type: string
 *                 description: Dias da semana separados por vírgulas (e.g., "Mon, Tue")
 *               totalHours:
 *                 type: number
 *                 description: Total de horas da matéria (e.g., 60)
 *               startTime:
 *                 type: string
 *                 description: Time in HH:mm format (e.g., "14:30")
 *               endTime:
 *                 type: string
 *                 description: Time in HH:mm format (e.g., "16:00")
 *               durationWeeks:
 *                 type: string
 *                 description: Duration of the course in weeks (e.g., "4 weeks" or "4")
 *     responses:
 *       201:
 *         description: Matéria criada com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /api/users/professors/{professorId}/subjects/{subjectId}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Retorna uma disciplina pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: subjectId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Disciplina não encontrada
 *
 *   patch:
 *     tags:
 *       - Subjects
 *     summary: Atualiza uma disciplina existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               weekdays:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               totalHours:
 *                 type: number
 *               durationWeeks:
 *                 type: string
 *     responses:
 *       204:
 *         description: Atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *
 *   delete:
 *     tags:
 *       - Subjects
 *     summary: Remove uma disciplina existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deletado com sucesso
 *       400:
 *         description: Erro ao deletar
 */
