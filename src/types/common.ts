export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}