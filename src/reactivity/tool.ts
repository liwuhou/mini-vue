export function isObject(value): boolean {
    if (value === null) return false;
    return typeof value === 'object' || Array.isArray(value);
}

export function isPrimitive(value): boolean {
    if (isObject(value)) return false;
    return value !== undefined;
}
