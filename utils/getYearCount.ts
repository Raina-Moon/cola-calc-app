export const getStartofYear = (date: Date) => {
return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}

export const getEndofYear = (date: Date) => {
return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}