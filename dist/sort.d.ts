export interface ISortByFunction<T> {
    (prop: T): any;
}
export declare type ISortBy<T> = string | ISortByFunction<T> | (string | ISortByFunction<T>)[];
export interface ICustomComparer {
    comparer?(a: any, b: any, order: number): number;
}
export interface ISortByAscSorter<T> extends ICustomComparer {
    asc: boolean | ISortBy<T>;
}
export interface ISortByDescSorter<T> extends ICustomComparer {
    desc: boolean | ISortBy<T>;
}
export declare type ISortByObjectSorter<T> = ISortByAscSorter<T> | ISortByDescSorter<T>;
export interface ICreateSortInstanceOptions extends ICustomComparer {
    preventDefaultOrderHandling?: boolean;
}
declare function createSortInstance(opts: ICreateSortInstanceOptions): <T>(ctx: T[]) => {
    /**
     * Sort array in ascending order. Mutates provided array by sorting it.
     * @example
     * sort([3, 1, 4]).asc();
     * sort(users).asc('firstName');
     * sort(users).asc(u => u.address.zip);
     * sort(users).asc([
     *  'firstName',
     *  'lastName',
     *   u => u.address.zip,
     * ]);
     */
    asc(sortBy?: string | ISortByFunction<T> | (string | ISortByFunction<T>)[] | ISortBy<T>[]): T[];
    /**
     * Sort array in descending order. Mutates provided array by sorting it.
     * @example
     * sort([3, 1, 4]).desc();
     * sort(users).desc('firstName');
     * sort(users).desc(u => u.address.zip);
     * sort(users).desc([z
     *  'firstName',
     *  'lastName',
     *   u => u.address.zip,
     * ]);
     */
    desc(sortBy?: string | ISortByFunction<T> | (string | ISortByFunction<T>)[] | ISortBy<T>[]): T[];
    /**
     * Sort array in ascending or descending order. It allows sorting on multiple props
     * in different order for each of them. Mutates provided array by sorting it.
     * @example
     * sort(users).by([
     *  { asc: 'firstName' }.
     *  { desc: u => u.address.zip }
     * ]);
     * sort(users).by({ desc: 'lastName' });
     */
    by(sortBy: ISortByAscSorter<T> | ISortByDescSorter<T> | ISortByObjectSorter<T>[]): T[];
};
declare const defaultSort: <T>(ctx: T[]) => {
    /**
     * Sort array in ascending order. Mutates provided array by sorting it.
     * @example
     * sort([3, 1, 4]).asc();
     * sort(users).asc('firstName');
     * sort(users).asc(u => u.address.zip);
     * sort(users).asc([
     *  'firstName',
     *  'lastName',
     *   u => u.address.zip,
     * ]);
     */
    asc(sortBy?: string | ISortByFunction<T> | (string | ISortByFunction<T>)[] | ISortBy<T>[]): T[];
    /**
     * Sort array in descending order. Mutates provided array by sorting it.
     * @example
     * sort([3, 1, 4]).desc();
     * sort(users).desc('firstName');
     * sort(users).desc(u => u.address.zip);
     * sort(users).desc([z
     *  'firstName',
     *  'lastName',
     *   u => u.address.zip,
     * ]);
     */
    desc(sortBy?: string | ISortByFunction<T> | (string | ISortByFunction<T>)[] | ISortBy<T>[]): T[];
    /**
     * Sort array in ascending or descending order. It allows sorting on multiple props
     * in different order for each of them. Mutates provided array by sorting it.
     * @example
     * sort(users).by([
     *  { asc: 'firstName' }.
     *  { desc: u => u.address.zip }
     * ]);
     * sort(users).by({ desc: 'lastName' });
     */
    by(sortBy: ISortByAscSorter<T> | ISortByDescSorter<T> | ISortByObjectSorter<T>[]): T[];
};
declare type ISortFunction = typeof defaultSort;
interface ISortExport extends ISortFunction {
    createNewInstance: typeof createSortInstance;
}
declare const _default: ISortExport;
export default _default;
