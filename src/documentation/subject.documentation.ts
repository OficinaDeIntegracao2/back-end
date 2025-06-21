/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Gerenciamento de matérias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubjectCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - weekdays
 *         - startTime
 *         - endTime
 *         - durationWeeks
 *       properties:
 *         name:
 *           type: string
 *           example: "Advanced Mathematics"
 *         description:
 *           type: string
 *           example: "Course covering advanced mathematical concepts"
 *         weekdays:
 *           type: string
 *           example: "MON,WED,FRI"
 *         startTime:
 *           type: string
 *           format: time
 *           example: "14:00"
 *         endTime:
 *           type: string
 *           format: time
 *           example: "16:00"
 *         durationWeeks:
 *           type: string
 *           example: "12"
 * 
 *     SubjectUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Mathematics"
 *         description:
 *           type: string
 *           example: "Updated course description"
 *         weekdays:
 *           type: string
 *           example: "TUE,THU"
 *         startTime:
 *           type: string
 *           format: time
 *           example: "15:00"
 *         endTime:
 *           type: string
 *           format: time
 *           example: "17:00"
 *         durationWeeks:
 *           type: string
 *           example: "10"
 * 
 *     CreatedSubject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         professorId:
 *           type: string
 *           format: uuid
 * 
 *     SubjectDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         weekdays:
 *           type: string
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         durationWeeks:
 *           type: string
 *         totalHours:
 *           type: number
 *         professor:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *         volunteers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *         enrollments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 * 
 *     SubjectsListResponse:
 *       type: object
 *       properties:
 *         subjects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreatedSubject'
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/professors/{professorId}/subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Only PROFESSOR role can create subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the professor creating the subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectCreateRequest'
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatedSubject'
 *       400:
 *         description: Invalid input or subject already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires PROFESSOR role)
 * 
 *   get:
 *     summary: Get all subjects for a professor
 *     description: Returns all subjects for the specified professor (ADMIN or same professor only)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the professor
 *     responses:
 *       200:
 *         description: List of subjects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectsListResponse'
 *       400:
 *         description: Error retrieving subjects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not ADMIN or same professor)
 * 
 * /api/professors/{professorId}/subjects/{subjectId}:
 *   get:
 *     summary: Get subject details
 *     description: Get detailed information about a specific subject (ADMIN, PROFESSOR or VOLUNTEER)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the professor
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the subject
 *     responses:
 *       200:
 *         description: Subject details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectDetails'
 *       400:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not authorized to view this subject)
 * 
 *   patch:
 *     summary: Update a subject
 *     description: Update subject information (ADMIN or same professor only)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the professor
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the subject to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectUpdateRequest'
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Invalid input or subject not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not ADMIN or same professor)
 * 
 *   delete:
 *     summary: Delete a subject
 *     description: Delete a subject (ADMIN or same professor only)
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the professor
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the subject to delete
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       400:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not ADMIN or same professor)
 */