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
console.log("1 Сума 50 перших натуральних чисел:", resultOfSum);
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
console.log("2 факторіал =", resultOfFactorial);
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
console.log("3", monthWord);
//4
function findSumOfBinate(array) {
  let sum = 0;

  if (!array.length) {
    return sum = 0;
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 == 0) {
      sum = sum + array[i];
    }
  }
  return sum;
}
let arr = [];
let binateSum = findSumOfBinate(arr);
console.log("4", binateSum);
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
      char === "я"
    ) {
      count++;
    }
  }

  return count;
};

console.log("5", countVowels("Тратата"));
//6

function findPower() {
  return base ** exponent;
}
let base = 3;
let exponent = 2;
let powerRes = findPower(base, exponent);
console.log("6", powerRes);
