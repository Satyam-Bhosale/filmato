export function toTitleCase(str: string) {
    const normalized = str.split(' ')
        .map(el => el.at(0)?.toUpperCase() + el.slice(1).toLowerCase())
        .join(' ');
    return normalized;
}