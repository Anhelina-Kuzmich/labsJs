"use strict";
let min;
let max;
function findMinMax(arr) {
  if (arr.length == 0) {
    min = "none";
    max = "none";
  } else {
    min = arr[0];
    max = arr[0];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < min) {
        min = arr[i];
      }
      if (arr[i] > max) {
        max = arr[i];
      }
    }
  }

  return { min: min, max: max };
}

let numbers = [7, 8, 3, 1];
let result = findMinMax(numbers);
console.log("Мінімум:", result.min);
console.log("Максимум:", result.max);
