/**
 * Poll helper
 *
 * Source: https://gist.github.com/treyhuffine/a13f598d1466240de0d896e7efbe753b#file-poll-js
 *
 * @param {Object} options
 * @param {Function} options.fn
 * @param {Function} options.validate
 * @param {Number} options.interval
 * @param {Number} options.maxAttempts
 * @returns {Promise}
 */
export const poll = ({ fn, validate, interval, maxAttempts }) => {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await fn();
    attempts++;

    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};
