/**
 *
 * @param stream
 * @returns {Promise<string[][]>}
 */
export const streamToArray = async (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).then((fileContent) => {
        const lines = fileContent.trim().split(/\r?\n/);
        return lines.map(line => line.split(','));
    })
};
