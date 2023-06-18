export interface Debounce<T> {
    (func: T, delay: number): (...args: any) => void
}

export const debounce: Debounce<any> = (func: any, delay: number) => {
    let timeOutId: any;
    return (...args: any) => {
        if (timeOutId) clearTimeout(timeOutId)
        timeOutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}