export { generateToken };
/**
 * https://stackoverflow.com/questions/8532406/create-a-random-token-in-javascript-based-on-user-details
 */
async function generateToken(length) {
    let a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let b = [];
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join('');
}