const jsFlock = require('js-flock');
const arraySort = require('array-sort');
const lodash = require('lodash');
const latestFlockSort = require('../../dist/sort.js');

const base = require('./base');

const sortImplementation = {
  flock: (arr) => jsFlock.sort(arr).asc(),
  latestFlock: (arr) => latestFlockSort(arr).asc(),
  lodash: (arr) => lodash.sortBy(arr),
  arraySort: (arr) => arraySort(arr),
  native: (arr) => arr.sort((a, b) => {
    if (a == null) return 1;
    if (b == null) return -1;

    if (a === b) return 0;
    if (a < b) return -1;
    return 1;
  }),
};

module.exports.run = function({
  size,
  numberOfRuns,
  flockOnly,
  randomizer = Math.random,
}) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push(randomizer());
  }

  return base.run({
    sortImplementation,
    testArr,
    numberOfRuns,
    flockOnly,
  });
};
