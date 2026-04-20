"use strict";

let textGrade;
function gradeToText() {
  if (gradeMark < 4 && gradeMark > 0) {
    textGrade = "незадовільно";
  } else if (gradeMark < 7 && gradeMark > 0) {
    textGrade = "задовільно";
  } else if (gradeMark < 10 && gradeMark > 0) {
    textGrade = "добре";
  } else if (gradeMark < 13 && gradeMark > 0) {
    textGrade = "відмінно";
  } else {
    textGrade = "некоректне значення оцінки";
  }

  return { textGrade: textGrade };
}

let gradeMark = 0;
textGrade = gradeToText(gradeMark);
console.log("Ваша оцінка:", textGrade.textGrade);

function monthToSeason(month) {
  let season;

  if (month == "January" || month == "February" || month == "December") {
    season = "Winter";
  } else if (month == "Match" || month == "April" || month == "May") {
    season = "Spring";
  } else if (month == "June" || month == "July" || month == "August") {
    season = "Summer";
  } else if (
    month == "September" ||
    month == "October" ||
    month == "November"
  ) {
    season = "Fall";
  } else {
    console.log("Month is wrong");
  }
  return season;
}

let month = "May";
let season = monthToSeason(month);

console.log(season);
