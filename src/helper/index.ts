type Entries<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T][]

export const entries = <T>(obj: T): Entries<T> => {
    return Object.entries(obj) as any;
}