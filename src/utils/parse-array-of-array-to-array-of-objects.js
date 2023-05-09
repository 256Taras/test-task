
/**
 * @template T
 * @param {Array<Array>} arr
 * @returns {Array<Object | T>}
 */
export const parseArrayOfArrayToArrayOfObjects = (arr) => {
    // Get the column headers from the first line of the CSV.
    const headers = arr[0];
    const createObject = (line) => {
        const obj = {};
        const updateObject = (header, i) => {
            // Clean up the header keys by removing spaces and parentheses.
            let key = header.replace(/ /g, '')
            obj[key.charAt(0).toLowerCase() + key.slice(1)] = line[i];
            return obj;
        };
        return headers.map(updateObject).reduce((acc, curr) => ({...acc, ...curr}), {});
    };
    return arr.slice(1).map(createObject);
};
