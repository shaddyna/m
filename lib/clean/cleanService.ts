// lib/clean/cleanService.ts
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

export { getTodayDateRange, getYesterdayDateRange, getThisWeekDateRange, getThisMonthDateRange, getThisYearDateRange, getLastNDaysDateRange };