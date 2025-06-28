/**
 * @swagger
 * tags:
 *   name: Certificados
 *   description: Geração e gerenciamento de certificados
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CertificadoRequest:
 *       type: object
 *       required:
 *         - studentId
 *       properties:
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: ID do aluno para emissão do certificado
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 *     CertificadoResponse:
 *       type: object
 *       properties:
 *         certificado:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             issuedAt:
 *               type: string
 *               format: date-time
 *               description: Data de emissão
 *             totalHours:
 *               type: number
 *               description: Total de horas cumpridas
 *             subjectId:
 *               type: string
 *               format: uuid
 *               description: ID da disciplina
 *             studentId:
 *               type: string
 *               format: uuid
 *               description: ID do aluno
 *             professorId:
 *               type: string
 *               format: uuid
 *               description: ID do professor
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem detalhada do erro
 */

/**
 * @swagger
 * /api/professors/{professorId}/subjects/{subjectId}/certificates:
 *   post:
 *     summary: Emitir um certificado
 *     description: |
 *       Gera um certificado em PDF para um aluno em uma disciplina.
 *       Requisitos:
 *       - Aluno deve estar matriculado na disciplina
 *       - Aluno deve ter cumprido a carga horária mínima
 *       - Certificado não deve existir previamente
 *       
 *       O certificado será enviado automaticamente por email para o aluno.
 *       Disponível para perfis ADMIN e PROFESSOR.
 *     tags: [Certificados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do professor emissor do certificado
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
 *             $ref: '#/components/schemas/CertificadoRequest'
 *     responses:
 *       201:
 *         description: Certificado gerado e enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CertificadoResponse'
 *       400:
 *         description: |
 *           Possíveis erros:
 *           - Certificado já existe
 *           - Professor não encontrado
 *           - Aluno não encontrado
 *           - Disciplina não encontrada
 *           - Aluno não matriculado
 *           - Aluno não cumpriu carga horária mínima
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       403:
 *         description: Acesso negado (requer perfil ADMIN ou PROFESSOR)
 *       500:
 *         description: Erro interno (falha na geração do PDF ou envio de email)
 */