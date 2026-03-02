"use strict";
let min = 2;
let max = 9;
let isInDiapason = false;
function checkIsInDiapason(num) {
  if (min > max) {
    console.log("change numbers");
  } else {
    if (min <= number && number <= max) {
      isInDiapason = !isInDiapason;
    }
  }
  return { isInDiapason: isInDiapason };
}

let number = 1;
isInDiapason = checkIsInDiapason(number);
console.log("isInDiapason", isInDiapason.isInDiapason);
