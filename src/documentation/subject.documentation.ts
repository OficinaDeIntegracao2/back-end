/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Operações relacionadas a matérias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubjectBase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         weekdays:
 *           type: string
 *           example: "Mon,Wed,Fri"
 *         startTime:
 *           type: string
 *           format: HH:mm
 *           example: "14:30"
 *         endTime:
 *           type: string
 *           format: HH:mm
 *           example: "16:00"
 *         totalHours:
 *           type: number
 *           example: 60
 *         durationWeeks:
 *           type: string
 *           example: "12 weeks"
 *         professorId:
 *           type: string
 * 
 *     SubjectSimple:
 *       allOf:
 *         - $ref: '#/components/schemas/SubjectBase'
 *         - type: object
 *           properties:
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 * 
 *     ProfessorInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 * 
 *     VolunteerInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 * 
 *     SubjectComplete:
 *       allOf:
 *         - $ref: '#/components/schemas/SubjectBase'
 *         - type: object
 *           properties:
 *             professor:
 *               $ref: '#/components/schemas/ProfessorInfo'
 *             volunteers:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VolunteerInfo'
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/users/professors/{professorId}/subjects:
 *   post:
 *     summary: Cria uma nova matéria (apenas PROFESSOR)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor responsável
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
 *                 example: "Matemática Avançada"
 *               description:
 *                 type: string
 *                 example: "Curso de matemática para ensino médio"
 *               weekdays:
 *                 type: string
 *                 example: "Mon,Wed,Fri"
 *               startTime:
 *                 type: string
 *                 example: "14:30"
 *               endTime:
 *                 type: string
 *                 example: "16:00"
 *               totalHours:
 *                 type: number
 *                 example: 60
 *               durationWeeks:
 *                 type: string
 *                 example: "12 weeks"
 *     responses:
 *       201:
 *         description: Matéria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectSimple'
 *       400:
 *         description: Erro de validação ou matéria já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 * 
 *   get:
 *     summary: Lista todas as matérias de um professor (ADMIN ou próprio PROFESSOR)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Lista de matérias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubjectSimple'
 *       400:
 *         description: Erro ao buscar matérias
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */

/**
 * @swagger
 * /api/users/professors/{professorId}/subjects/{subjectId}:
 *   get:
 *     summary: Obtém uma matéria específica (ADMIN, PROFESSOR ou VOLUNTEER vinculado)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da matéria
 *     responses:
 *       200:
 *         description: Matéria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   $ref: '#/components/schemas/SubjectComplete'
 *       400:
 *         description: Matéria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 * 
 *   patch:
 *     summary: Atualiza uma matéria existente (ADMIN ou próprio PROFESSOR)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da matéria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Matemática Avançada II"
 *               description:
 *                 type: string
 *                 example: "Curso atualizado de matemática"
 *               weekdays:
 *                 type: string
 *                 example: "Tue,Thu"
 *               startTime:
 *                 type: string
 *                 example: "15:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *               totalHours:
 *                 type: number
 *                 example: 80
 *               durationWeeks:
 *                 type: string
 *                 example: "16 weeks"
 *     responses:
 *       200:
 *         description: Matéria atualizada com sucesso
 *       400:
 *         description: Erro de validação ou matéria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 * 
 *   delete:
 *     summary: Remove uma matéria existente (ADMIN ou próprio PROFESSOR)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da matéria
 *     responses:
 *       200:
 *         description: Matéria removida com sucesso
 *       400:
 *         description: Erro ao remover matéria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */