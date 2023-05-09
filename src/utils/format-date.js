/**
 *
 * @param {string} inputDate
 * @returns {string}
 */
export const formatDate = (inputDate)=> {
    const dateObj = new Date(inputDate);
    const outputDate = dateObj.toLocaleDateString('en-GB').replace(/\//g, '/');
    return outputDate
}