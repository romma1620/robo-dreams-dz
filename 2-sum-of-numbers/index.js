function sumOfNumbers(str) {
  str = Array.isArray(str) ? str : JSON.parse(str);
  if (str.every(el => typeof el === 'number')) {
    return str.reduce((a, b) => a + b, 0);
  } else {
    str = str.flat(1);
    return sumOfNumbers(str);
  }
}

const args = process.argv.slice(2);
console.log(sumOfNumbers(args[0]));
