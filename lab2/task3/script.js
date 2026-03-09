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

let season;
function monthToSeason(month) {
  let seasons = {
    December: "Winter",
    January: "Winter",
    February: "Winter",
    March: "Spring",
    April: "Spring",
    May: "Spring",
    June: "Summer",
    July: "Summer",
    August: "Summer",
    September: "Autumn",
    October: "Autumn",
    November: "Autumn",
  };
  const season = seasons[month] || "invalid input";
  return { season: season };
}

let month = "May";
season = monthToSeason(month);
console.log("Визначений сезон:", season.season);
