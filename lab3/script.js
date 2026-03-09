"use strict";
//1
function findSum() {
  let sum = 0;
  let n = 0;
  while (n < 50) {
    n++;
    sum += n;
  }
  return sum;
}
let resultOfSum = findSum();
console.log("Сума 50 перших натуральних чисел:", resultOfSum);
// 2
function findFactorial() {
  let factorial = 1;
  for (numForFactorial; numForFactorial > 1; numForFactorial--) {
    factorial = factorial * numForFactorial;
  }
  return factorial;
}
let numForFactorial = 5;
let resultOfFactorial = findFactorial(numForFactorial);
console.log("факторіал =", resultOfFactorial);
//3
function numbToMonth() {
  let month;
  switch (monthNumb) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
    default:
      month = "Invalid number";
  }
  return month;
}
let monthNumb = 11;
let monthWord = numbToMonth(monthNumb);
console.log(monthWord);
//4
function findSumOfBinate() {
  let sum = 0;
  for (let i = 0; i < massive.length; i++) {
    if (massive[i] % 2 == 0) {
      sum = sum + massive[i];
    }
  }
  return sum;
}
let massive = [2, 5, 6, 8, 9];
let binateSum = findSumOfBinate(massive);
console.log(binateSum);
//5

const countVowels = (str) => {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    let char = str[i].toLowerCase();

    if (
      char === "а" ||
      char === "е" ||
      char === "є" ||
      char === "и" ||
      char === "і" ||
      char === "ї" ||
      char === "о" ||
      char === "у" ||
      char === "ю" ||
      char === "я" ||
      char === "a" ||
      char === "e" ||
      char === "i" ||
      char === "o" ||
      char === "u"
    ) {
      count++;
    }
  }

  return count;
};

console.log(countVowels("Тратата"));
//6

function findPower(base, exponent) {
  return base ** exponent;
}
let base = 3;
let exponent = 2;
let powerRes = findPower(base, exponent);
console.log(powerRes);
