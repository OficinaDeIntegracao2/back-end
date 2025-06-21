/**
 * @swagger
 * tags:
 *   name: Workload
 *   description: Hour log management for subjects
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HourLogRequest:
 *       type: object
 *       required:
 *         - email
 *         - attendedAt
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "student@example.com"
 *           description: Student's email to log hours for
 *         attendedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-07-20T14:00:00Z"
 *           description: Date and time of attendance
 * 
 *     HourLogResponse:
 *       type: object
 *       properties:
 *         hourLog:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             loggedById:
 *               type: string
 *               format: uuid
 *             subjectId:
 *               type: string
 *               format: uuid
 *             studentId:
 *               type: string
 *               format: uuid
 *             attendedAt:
 *               type: string
 *               format: date-time
 *             createdAt:
 *               type: string
 *               format: date-time
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/subjects/{subjectId}/hour-logs:
 *   post:
 *     summary: Create a new hour log
 *     description: |
 *       Log student attendance for a subject.
 *       Available for ADMIN, PROFESSOR and VOLUNTEER roles.
 *       Validates that the attendance date matches the subject schedule.
 *     tags: [Workload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HourLogRequest'
 *     responses:
 *       201:
 *         description: Hour log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HourLogResponse'
 *       400:
 *         description: |
 *           Possible errors:
 *           - Student not found
 *           - Subject not found
 *           - Subject not scheduled at attendance time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (requires ADMIN, PROFESSOR or VOLUNTEER role)
 */