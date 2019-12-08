// >>> HELPERS <<<
var orderHandler = function (comparer) { return function (a, b, order) { return comparer(a, b, order) * order; }; };
var unpackObjectSorter = function (sortByObj) {
    var sortBy = (sortByObj || {}).asc || (sortByObj || {}).desc;
    if (!sortBy) {
        throw Error('Invalid sort config');
    }
    var order = sortByObj.asc ? 1 : -1;
    var comparer = sortByObj.comparer
        ? orderHandler(sortByObj.comparer)
        : undefined;
    return { order: order, sortBy: sortBy, comparer: comparer };
};
// >>> SORTERS <<<
var multiPropertySorter = function (sortBy, sortByArray, depth, order, comparer, a, b) {
    var valA;
    var valB;
    if (typeof sortBy === 'string') {
        valA = a[sortBy];
        valB = b[sortBy];
    }
    else if (typeof sortBy === 'function') {
        valA = sortBy(a);
        valB = sortBy(b);
    }
    else {
        var objectSorterConfig = unpackObjectSorter(sortBy);
        return multiPropertySorter(objectSorterConfig.sortBy, sortByArray, depth, objectSorterConfig.order, objectSorterConfig.comparer || comparer, a, b);
    }
    var equality = comparer(valA, valB, order);
    if (sortByArray.length > depth &&
        (equality === 0 || (valA == null && valB == null))) {
        return multiPropertySorter(sortByArray[depth], sortByArray, depth + 1, order, comparer, a, b);
    }
    return equality;
};
var sort = function (order, ctx, sortBy, comparer) {
    var _a;
    if (!Array.isArray(ctx)) {
        return ctx;
    }
    // Unwrap sortBy if array with only 1 value
    if (Array.isArray(sortBy) && sortBy.length < 2) {
        _a = sortBy, sortBy = _a[0];
    }
    var sorter;
    if (sortBy === undefined || sortBy === true) {
        sorter = function (a, b) { return comparer(a, b, order); };
    }
    else if (typeof sortBy === 'string') {
        sorter = function (a, b) { return comparer(a[sortBy], b[sortBy], order); };
    }
    else if (typeof sortBy === 'function') {
        sorter = function (a, b) { return comparer(sortBy(a), sortBy(b), order); };
    }
    else if (Array.isArray(sortBy)) {
        sorter = multiPropertySorter.bind(undefined, sortBy[0], sortBy, 1, order, comparer);
    }
    else {
        var objectSorterConfig = unpackObjectSorter(sortBy);
        return sort(objectSorterConfig.order, ctx, objectSorterConfig.sortBy, objectSorterConfig.comparer || comparer);
    }
    return ctx.sort(sorter);
};
function createSortInstance(opts) {
    var comparer = opts.preventDefaultOrderHandling
        ? opts.comparer
        : orderHandler(opts.comparer);
    return function (ctx) {
        return {
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
            asc: function (sortBy) {
                return sort(1, ctx, sortBy, comparer);
            },
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
            desc: function (sortBy) {
                return sort(-1, ctx, sortBy, comparer);
            },
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
            by: function (sortBy) {
                return sort(1, ctx, sortBy, comparer);
            },
        };
    };
}
var defaultSort = createSortInstance({
    preventDefaultOrderHandling: true,
    comparer: function (a, b, order) {
        if (a < b)
            return -order;
        if (a === b)
            return 0;
        if (a == null)
            return 1;
        if (b == null)
            return -1;
        return order;
    },
});
// Attach createNewInstance to sort function
defaultSort['createNewInstance'] = createSortInstance;

export default defaultSort;
