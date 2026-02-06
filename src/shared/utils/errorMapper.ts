import i18next from 'i18next';

export const mapServerError = (error: string): string => {
    if (!error) return i18next.t('auth.errors.unknownError');

    const errorMap: Record<string, string> = {
        'User with this Telegram ID already exists': 'auth.errors.userExists',
        'Invalid request body': 'auth.errors.invalidData',
        'User not found': 'auth.errors.userNotFound',
        'Telegram data does not match': 'auth.errors.dataMismatch',
        'Internal server error': 'auth.errors.serverError',
        'telegramId is required': 'auth.errors.invalidData',
        'Phone number is required': 'auth.errors.invalidData',
        'Telegram data is required': 'auth.errors.invalidData',
    };

    const key = errorMap[error] || errorMap[Object.keys(errorMap).find(k => error.includes(k)) || ''] || 'auth.errors.unknownError';

    return i18next.t(key);
};
