import { Router } from "express";
import { RecordRepository } from "./record.repository.js";
import { RecordService } from "./record.service.js";
import { RecordController } from "./record.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { customRole } from "../../middlewares/rabc.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { CreateRecordSchema, UpdateRecordSchema, filterRecordSchema } from "./record.schema.js";
import { ROLES } from "../../middlewares/rabc.middleware.js";

const router = Router();


const recordRepository = new RecordRepository();
const recordService = new RecordService(recordRepository);
const recordController = new RecordController(recordService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         userId: { type: string, format: uuid }
 *         amount: { type: integer }
 *         type: { type: string, enum: [income, expense] }
 *         category: { type: string }
 *         description: { type: string, nullable: true }
 *         date: { type: string, format: date-time }
 *         createdAt: { type: string, format: date-time }
 */

// Authentication middleware
router.use(authenticate);


// get all records
/**
 * @swagger
 * /records:
 *   get:
 *     tags: [Records]
 *     summary: List financial records with filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         schema: { type: string, enum: [income, expense] }
 *       - name: category
 *         in: query
 *         schema: { type: string }
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *       - name: startDate
 *         in: query
 *         schema: { type: string, format: date }
 *       - name: endDate
 *         in: query
 *         schema: { type: string, format: date }
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of records
 */
router.get(
    "/",
    customRole(ROLES.ADMIN, ROLES.ANALYST),
    validate(filterRecordSchema, "query"),
    recordController.getRecords
);

// create record

/**
 * @swagger
 * /records:
 *   post:
 *     tags: [Records]
 *     summary: Create a new financial record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount: { type: integer }
 *               type: { type: string, enum: [income, expense] }
 *               category: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date, description: "YYYY-MM-DD" }
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 */
router.post(
    "/",
    customRole(ROLES.ADMIN),
    validate(CreateRecordSchema),
    recordController.createRecord
);


// get record by id
/**
 * @swagger
 * /records/{id}:
 *   get:
 *     tags: [Records]
 *     summary: Get a specific record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Record details
 */
router.get(
    "/:id",
    customRole(ROLES.ADMIN, ROLES.ANALYST),
    recordController.getRecord
);

// update record

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     tags: [Records]
 *     summary: Update a financial record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: integer }
 *               type: { type: string, enum: [income, expense] }
 *               category: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Record updated successfully
 */
router.patch(
    "/:id",
    customRole(ROLES.ADMIN),
    validate(UpdateRecordSchema),
    recordController.updateRecord
);


// soft delete record

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     tags: [Records]
 *     summary: Soft delete a financial record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Record deleted successfully
 */
router.delete(
    "/:id",
    customRole(ROLES.ADMIN),
    recordController.softDeleteRecord
);

export default router;