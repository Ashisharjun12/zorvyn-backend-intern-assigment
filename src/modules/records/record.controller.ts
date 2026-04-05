import type { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.middleware.js';
import type { IRecordService } from './record.interface.js';

export class RecordController {
  constructor(private readonly recordService: IRecordService) {}

  // create a new record
  createRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id; // extracted from authenticate middleware
    const record = await this.recordService.createRecord(userId, req.body);
    
    res.status(201).json({
      success: true,
      data: record,
      message: 'Record created successfully'
    });
  });

  // get all records with filters and pagination
  getRecords = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const result = await this.recordService.getRecords(userId, req.query as any);
    
    res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      message: 'Records fetched successfully'
    });
  });

  // get record by its id
  getRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const record = await this.recordService.getRecord(id, userId);
    
    res.status(200).json({
      success: true,
      data: record,
      message: 'Record fetched successfully'
    });
  });


  // update record
  updateRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const record = await this.recordService.updateRecord(id, userId, req.body);
    
    res.status(200).json({
      success: true,
      data: record,
      message: 'Record updated successfully'
    });
  });

  // soft delete record
  softDeleteRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const userId = req.user!.id;
    await this.recordService.softDeleteRecord(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  });
}
