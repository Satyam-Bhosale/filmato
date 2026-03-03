export function isProduction(nodeEnv: string | undefined) {
    if (nodeEnv === 'production') {
        return true;
    } else {
        return false
    }
}