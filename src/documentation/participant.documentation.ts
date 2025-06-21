/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: Gerenciamento de participantes (voluntários e alunos) em disciplinas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AssociateVolunteerRequest:
 *       type: object
 *       required:
 *         - volunteerId
 *       properties:
 *         volunteerId:
 *           type: string
 *           format: uuid
 *           description: ID do usuário voluntário
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 *     AssociateStudentRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@example.com"
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro detalhada
 */

/**
 * @swagger
 * /api/professors/{professorId}/subjects/{subjectId}/participants/volunteers:
 *   post:
 *     summary: Associa um voluntário a uma disciplina
 *     description: |
 *       Apenas ADMIN e PROFESSOR podem associar voluntários.
 *       Verifica conflitos de horário antes de associar.
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do professor responsável pela disciplina
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssociateVolunteerRequest'
 *     responses:
 *       201:
 *         description: Voluntário associado com sucesso
 *       400:
 *         description: |
 *           Possíveis erros:
 *           - Disciplina não encontrada
 *           - Voluntário não encontrado
 *           - Voluntário já associado
 *           - Conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissões insuficientes
 * 
 * /api/professors/{professorId}/subjects/{subjectId}/participants/students:
 *   post:
 *     summary: Associa um aluno a uma disciplina
 *     description: |
 *       ADMIN, PROFESSOR e VOLUNTÁRIOS podem associar alunos.
 *       Se o aluno não existir, será criado.
 *       Verifica conflitos de horário antes de associar.
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do professor responsável pela disciplina
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssociateStudentRequest'
 *     responses:
 *       201:
 *         description: Aluno associado/criado com sucesso
 *       400:
 *         description: |
 *           Possíveis erros:
 *           - Disciplina não encontrada
 *           - Aluno já associado
 *           - Conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissões insuficientes
 */