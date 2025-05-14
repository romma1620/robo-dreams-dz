function sumOfNumbers(str) {
  str = Array.isArray(str) ? str : JSON.parse(str);
  if (str.every(el => typeof el === 'number')) {
    return str.reduce((a, b) => a + b, 0);
  } else {
    str = str.flat(1);
    return sumOfNumbers(str);
  }
}

console.log(sumOfNumbers('[1, 2, [3, 4, [5]], 6]'));
