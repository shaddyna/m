// lib/clean/dateHelpers.ts
export const getTodayDateRange = () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return { start: startOfDay.getTime(), end: endOfDay.getTime() };
};

export const getYesterdayDateRange = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const endOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);
    return { start: startOfDay.getTime(), end: endOfDay.getTime() };
};

export const getThisWeekDateRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return { start: startOfWeek.getTime(), end: endOfWeek.getTime() };
};

export const getThisMonthDateRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return { start: startOfMonth.getTime(), end: endOfMonth.getTime() };
};

export const getThisYearDateRange = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
    return { start: startOfYear.getTime(), end: endOfYear.getTime() };
};

export const getLastNDaysDateRange = (days: number) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 1);
    return { start: startDate.getTime(), end: endDate.getTime() };
};