import { Router } from "express";
import { RecordRepository } from "./record.repository.js";
import { RecordService } from "./record.service.js";
import { RecordController } from "./record.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { customRole } from "../../middlewares/rabc.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { CreateRecordSchema, UpdateRecordSchema, filterRecordSchema } from "./record.schema.js";

const router = Router();


const recordRepository = new RecordRepository();
const recordService = new RecordService(recordRepository);
const recordController = new RecordController(recordService);

// Authentication middleware
router.use(authenticate);

// Get all records with filters and pagination - (admin, analyst)
router.get(
    "/", 
    customRole("admin", "analyst"),
    validate(filterRecordSchema, "query"), 
    recordController.getRecords
);

// Create a new record - admin
router.post(
    "/", 
    customRole("admin"),
    validate(CreateRecordSchema), 
    recordController.createRecord
);

// Get record by id - (admin, analyst)
router.get(
    "/:id", 
    customRole("admin", "analyst"),
    recordController.getRecord
);

// Update record - admin
router.patch(
    "/:id", 
    customRole("admin"),
    validate(UpdateRecordSchema), 
    recordController.updateRecord
);

// Soft delete record - admin
router.delete(
    "/:id", 
    customRole("admin"),
    recordController.softDeleteRecord
);

export default router;