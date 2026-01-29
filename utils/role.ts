export const normalizeRole = (role?: string): string => {
    if (!role) return 'user';
    return role
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace('storemanager', 'storeManager');
};