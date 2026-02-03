// lib/clean/cleanService.ts
/*import Clean from '@/models/RecordsClean';
import mongoose from 'mongoose';
import { 
    getTodayDateRange, 
    getYesterdayDateRange, 
    getThisWeekDateRange,
    getThisMonthDateRange,
    getThisYearDateRange,
    getLastNDaysDateRange 
} from './dateHelpers';

export interface DateRange {
    start: number;
    end: number;
}

export interface QueryParams {
    page?: string;
    limit?: string;
}

export async function getRecordsCount(dateRange?: DateRange) {
    const query = dateRange ? { createdAt_date: { $gte: dateRange.start, $lt: dateRange.end } } : {};
    return await Clean.countDocuments(query);
}

export async function getFilteredRecords(dateRange: DateRange, params: QueryParams) {
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '100');
    const skip = (page - 1) * limit;
    
    const dateQuery = { createdAt_date: { $gte: dateRange.start, $lt: dateRange.end } };
    const totalRecords = await Clean.countDocuments(dateQuery);
    
    const records = await Clean.find(dateQuery)
        .sort({ createdAt_date: -1 })
        .skip(skip)
        .limit(limit);
    
    const stats = await Clean.aggregate([
        { $match: dateQuery },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                invoiceCount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, 1, 0] } },
                cashSaleCount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, 1, 0] } },
                quotationCount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, 1, 0] } },
                invoiceAmount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, "$amount", 0] } },
                cashSaleAmount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, "$amount", 0] } },
                quotationAmount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, "$amount", 0] } }
            }
        }
    ]);
    
    const resultStats = stats[0] || {
        totalAmount: 0, invoiceCount: 0, cashSaleCount: 0, quotationCount: 0,
        invoiceAmount: 0, cashSaleAmount: 0, quotationAmount: 0
    };
    
    return {
        success: true,
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        records,
        stats: {
            totalAmount: resultStats.totalAmount || 0,
            invoiceCount: resultStats.invoiceCount || 0,
            cashSaleCount: resultStats.cashSaleCount || 0,
            quotationCount: resultStats.quotationCount || 0,
            invoiceAmount: resultStats.invoiceAmount || 0,
            cashSaleAmount: resultStats.cashSaleAmount || 0,
            quotationAmount: resultStats.quotationAmount || 0
        },
        dateFilter: {
            startTimestamp: dateRange.start,
            endTimestamp: dateRange.end,
            startDate: new Date(dateRange.start).toISOString(),
            endDate: new Date(dateRange.end).toISOString()
        }
    };
}

export async function getAllRecords(params: QueryParams) {
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '100');
    const skip = (page - 1) * limit;
    
    const totalRecords = await Clean.countDocuments();
    const records = await Clean.find().sort({ createdAt_date: -1 }).skip(skip).limit(limit);
    
    const stats = await Clean.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                invoiceCount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, 1, 0] } },
                cashSaleCount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, 1, 0] } },
                quotationCount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, 1, 0] } },
                invoiceAmount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, "$amount", 0] } },
                cashSaleAmount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, "$amount", 0] } },
                quotationAmount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, "$amount", 0] } }
            }
        }
    ]);
    
    const resultStats = stats[0] || {
        totalAmount: 0, invoiceCount: 0, cashSaleCount: 0, quotationCount: 0,
        invoiceAmount: 0, cashSaleAmount: 0, quotationAmount: 0
    };
    
    return {
        success: true,
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        records,
        stats: {
            totalAmount: resultStats.totalAmount || 0,
            invoiceCount: resultStats.invoiceCount || 0,
            cashSaleCount: resultStats.cashSaleCount || 0,
            quotationCount: resultStats.quotationCount || 0,
            invoiceAmount: resultStats.invoiceAmount || 0,
            cashSaleAmount: resultStats.cashSaleAmount || 0,
            quotationAmount: resultStats.quotationAmount || 0
        },
        dateFilter: { dateLabel: "All Records", startTimestamp: null, endTimestamp: null }
    };
}

export async function validateRecordId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { error: "Invalid record ID format", status: 400 };
    }
    return null;
}

export { getTodayDateRange, getYesterdayDateRange, getThisWeekDateRange, getThisMonthDateRange, getThisYearDateRange, getLastNDaysDateRange };*/

/*import Clean from '@/models/RecordsClean';
import mongoose from 'mongoose';
import { 
    getTodayDateRange, 
    getYesterdayDateRange, 
    getThisWeekDateRange,
    getThisMonthDateRange,
    getThisYearDateRange,
    getLastNDaysDateRange 
} from './dateHelpers';

export interface DateRange {
    start: number;
    end: number;
}

export interface QueryParams {
    page?: string;
    limit?: string;
}

export interface FilteredRecordsResult {
    success: boolean;
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    records: any[];
    stats: {
        totalAmount: number;
        invoiceCount: number;
        cashSaleCount: number;
        quotationCount: number;
        invoiceAmount: number;
        cashSaleAmount: number;
        quotationAmount: number;
    };
    dateFilter: {
        startTimestamp: number;
        endTimestamp: number;
        startDate: string;
        endDate: string;
        dateLabel?: string;  // Add optional property
        date?: string;       // Add optional property
        year?: number;
    };
}

export async function getRecordsCount(dateRange?: DateRange) {
    const query = dateRange ? { createdAt_date: { $gte: dateRange.start, $lt: dateRange.end } } : {};
    return await Clean.countDocuments(query);
}

export async function getFilteredRecords(dateRange: DateRange, params: QueryParams): Promise<FilteredRecordsResult> {
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '100');
    const skip = (page - 1) * limit;
    
    const dateQuery = { createdAt_date: { $gte: dateRange.start, $lt: dateRange.end } };
    const totalRecords = await Clean.countDocuments(dateQuery);
    
    const records = await Clean.find(dateQuery)
        .sort({ createdAt_date: -1 })
        .skip(skip)
        .limit(limit);
    
    const stats = await Clean.aggregate([
        { $match: dateQuery },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                invoiceCount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, 1, 0] } },
                cashSaleCount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, 1, 0] } },
                quotationCount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, 1, 0] } },
                invoiceAmount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, "$amount", 0] } },
                cashSaleAmount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, "$amount", 0] } },
                quotationAmount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, "$amount", 0] } }
            }
        }
    ]);
    
    const resultStats = stats[0] || {
        totalAmount: 0, invoiceCount: 0, cashSaleCount: 0, quotationCount: 0,
        invoiceAmount: 0, cashSaleAmount: 0, quotationAmount: 0
    };
    
    return {
        success: true,
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        records,
        stats: {
            totalAmount: resultStats.totalAmount || 0,
            invoiceCount: resultStats.invoiceCount || 0,
            cashSaleCount: resultStats.cashSaleCount || 0,
            quotationCount: resultStats.quotationCount || 0,
            invoiceAmount: resultStats.invoiceAmount || 0,
            cashSaleAmount: resultStats.cashSaleAmount || 0,
            quotationAmount: resultStats.quotationAmount || 0
        },
        dateFilter: {
            startTimestamp: dateRange.start,
            endTimestamp: dateRange.end,
            startDate: new Date(dateRange.start).toISOString(),
            endDate: new Date(dateRange.end).toISOString(),
            dateLabel: "",  // Initialize optional properties
            date: ""
        }
    };
}

export async function getAllRecords(params: QueryParams) {
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '100');
    const skip = (page - 1) * limit;
    
    const totalRecords = await Clean.countDocuments();
    const records = await Clean.find().sort({ createdAt_date: -1 }).skip(skip).limit(limit);
    
    const stats = await Clean.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                invoiceCount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, 1, 0] } },
                cashSaleCount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, 1, 0] } },
                quotationCount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, 1, 0] } },
                invoiceAmount: { $sum: { $cond: [{ $eq: ["$documentType", "INVOICE"] }, "$amount", 0] } },
                cashSaleAmount: { $sum: { $cond: [{ $eq: ["$documentType", "CASH_SALE"] }, "$amount", 0] } },
                quotationAmount: { $sum: { $cond: [{ $eq: ["$documentType", "QUOTATION"] }, "$amount", 0] } }
            }
        }
    ]);
    
    const resultStats = stats[0] || {
        totalAmount: 0, invoiceCount: 0, cashSaleCount: 0, quotationCount: 0,
        invoiceAmount: 0, cashSaleAmount: 0, quotationAmount: 0
    };
    
    return {
        success: true,
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        records,
        stats: {
            totalAmount: resultStats.totalAmount || 0,
            invoiceCount: resultStats.invoiceCount || 0,
            cashSaleCount: resultStats.cashSaleCount || 0,
            quotationCount: resultStats.quotationCount || 0,
            invoiceAmount: resultStats.invoiceAmount || 0,
            cashSaleAmount: resultStats.cashSaleAmount || 0,
            quotationAmount: resultStats.quotationAmount || 0
        },
        dateFilter: { dateLabel: "All Records", startTimestamp: null, endTimestamp: null }
    };
}

export async function validateRecordId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { error: "Invalid record ID format", status: 400 };
    }
    return null;
}

export { getTodayDateRange, getYesterdayDateRange, getThisWeekDateRange, getThisMonthDateRange, getThisYearDateRange, getLastNDaysDateRange };*/

import Clean from '@/models/RecordsClean';
import mongoose from 'mongoose';
import {
  getTodayDateRange,
  getYesterdayDateRange,
  getThisWeekDateRange,
  getThisMonthDateRange,
  getThisYearDateRange,
  getLastNDaysDateRange
} from './dateHelpers';

/* =====================================================
   Types
===================================================== */

export interface DateRange {
  start: number; // timestamp
  end: number;   // timestamp
}

export interface QueryParams {
  page?: string;
  limit?: string;
}

export interface StatsResult {
  totalAmount: number;
  invoiceCount: number;
  cashSaleCount: number;
  quotationCount: number;
  invoiceAmount: number;
  cashSaleAmount: number;
  quotationAmount: number;
}

export interface FilteredRecordsResult {
  success: boolean;
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  records: any[];
  stats: StatsResult;
  dateFilter: {
    startTimestamp: number | null;
    endTimestamp: number | null;
    startDate?: string;
    endDate?: string;
    dateLabel?: string;
    date?: string;
    year?: number;
  };
}

/* =====================================================
   Helpers
===================================================== */

/** Parse pagination params safely */
function parsePagination(params: QueryParams) {
  const page = Math.max(1, parseInt(params.page || '1') || 1);
  const limit = Math.min(200, parseInt(params.limit || '100') || 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/** Build a MongoDB query for a numeric date range */
function buildDateQuery(dateRange: DateRange) {
  return {
    createdAt_date: { $gte: dateRange.start, $lt: dateRange.end }
  };
}

/** Shared aggregation for stats */
async function getStats(matchQuery: any): Promise<StatsResult> {
  const stats = await Clean.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        invoiceCount: { $sum: { $cond: [{ $eq: ['$documentType', 'INVOICE'] }, 1, 0] } },
        cashSaleCount: { $sum: { $cond: [{ $eq: ['$documentType', 'CASH_SALE'] }, 1, 0] } },
        quotationCount: { $sum: { $cond: [{ $eq: ['$documentType', 'QUOTATION'] }, 1, 0] } },
        invoiceAmount: { $sum: { $cond: [{ $eq: ['$documentType', 'INVOICE'] }, '$amount', 0] } },
        cashSaleAmount: { $sum: { $cond: [{ $eq: ['$documentType', 'CASH_SALE'] }, '$amount', 0] } },
        quotationAmount: { $sum: { $cond: [{ $eq: ['$documentType', 'QUOTATION'] }, '$amount', 0] } }
      }
    }
  ]);

  return stats[0] || {
    totalAmount: 0,
    invoiceCount: 0,
    cashSaleCount: 0,
    quotationCount: 0,
    invoiceAmount: 0,
    cashSaleAmount: 0,
    quotationAmount: 0
  };
}

/* =====================================================
   Core Services
===================================================== */

/** Get filtered records for a date range */
export async function getFilteredRecords(
  dateRange: DateRange,
  params: QueryParams
): Promise<FilteredRecordsResult> {
  const { page, limit, skip } = parsePagination(params);
  const dateQuery = buildDateQuery(dateRange);

  const [totalRecords, records, stats] = await Promise.all([
    Clean.countDocuments(dateQuery),
    Clean.find(dateQuery).sort({ createdAt_date: -1 }).skip(skip).limit(limit),
    getStats(dateQuery)
  ]);

  return {
    success: true,
    page,
    limit,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    records,
    stats,
    dateFilter: {
      startTimestamp: dateRange.start,
      endTimestamp: dateRange.end,
      startDate: new Date(dateRange.start).toISOString(),
      endDate: new Date(dateRange.end).toISOString(),
      dateLabel: '',
      date: ''
    }
  };
}

/** Get all records (no date filter) */
export async function getAllRecords(params: QueryParams): Promise<FilteredRecordsResult> {
  const { page, limit, skip } = parsePagination(params);

  const [totalRecords, records, stats] = await Promise.all([
    Clean.countDocuments(),
    Clean.find().sort({ createdAt_date: -1 }).skip(skip).limit(limit),
    getStats({})
  ]);

  return {
    success: true,
    page,
    limit,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    records,
    stats,
    dateFilter: {
      dateLabel: 'All Records',
      startTimestamp: null,
      endTimestamp: null
    }
  };
}

/** Count records optionally by date range */
export async function getRecordsCount(dateRange?: DateRange) {
  const query = dateRange ? buildDateQuery(dateRange) : {};
  return Clean.countDocuments(query);
}

/* =====================================================
   Validation
===================================================== */

/** Validate MongoDB ObjectId */
export async function validateRecordId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: 'Invalid record ID format', status: 400 };
  }
  return null;
}

/* =====================================================
   Re-exports
===================================================== */

export {
  getTodayDateRange,
  getYesterdayDateRange,
  getThisWeekDateRange,
  getThisMonthDateRange,
  getThisYearDateRange,
  getLastNDaysDateRange
};
