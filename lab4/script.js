function fruitsManagment() {
  console.log("Завдання 1:");

  let fruits = ["яблуко", "виноград", "груша", "абрикос"];
  console.log("Початковий масив:", fruits);

  fruits.pop();
  console.log("Після видалення останнього елемента:", fruits);

  fruits.unshift("ананас");
  console.log("Після додавання 'ананас' на початок:", fruits);

  fruits.sort();
  fruits.reverse();
  console.log("Масив у зворотньому алфавітному порядку:", fruits);

  let indexApple = fruits.indexOf("яблуко");
  console.log("Індекс елемента 'яблуко':", indexApple);
}

function colorsManagment() {
  console.log("Завдання 2:");

  let colors = ["фіолетовий", "охра", "сірий", "синій", "синій"];
  console.log("Початковий масив:", colors);

  let longest = colors.reduce(function (best, current) {
    if (current.length > best.length) {
      return current;
    } else {
      return best;
    }
  }, colors[0]);

  let shortest = colors.reduce(function (best, current) {
    if (current.length < best.length) {
      return current;
    } else {
      return best;
    }
  }, colors[0]);

  console.log("Найдовший елемент:", longest);
  console.log("Найкоротший елемент:", shortest);

  function checkForBlue(word) {
    if (word.includes("синій")) {
      return true;
    } else {
      return false;
    }
  }

  let blues = colors.filter(checkForBlue);

  console.log("Всі сині з масиву:", blues);

  console.log(colors.join(","));
  console.log("Отриманий масив:", colors);
}

function workerManagment() {
  console.log("Завдання 3:");
  let workers = [
    {
      name: "Клара",
      age: 30,
      position: "розробник",
    },
    {
      name: "Карл",
      age: 34,
      position: "тестувальник",
    },
    {
      name: "Артем",
      age: 27,
      position: "розробник",
    },
    workers.forEach(function (worker) {
      worker.worker = true;
    }),
  ];

  console.log("Початковий масив", workers);

  function compareByName(a, b) {
    let nameA = a.name;
    let nameB = b.name;

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  }

  let sortedWorkersByName = workers.sort(compareByName);

  console.log("Відсортовані працівники", sortedWorkersByName);

  function checkForDeveloper(worker) {
    if (worker.position.includes("розробник")) {
      return true;
    } else {
      return false;
    }
  }

  let developers = workers.filter(checkForDeveloper);
  console.log("Список розробників", developers);

  for (let i = workers.length - 1; i >= 0; i--) {
    if (workers[i].age > 33) {
      workers.splice(i, 1);
    }
  }
  console.log("delited if older 33", workers);

  let newWorker = {
    name: "Яким",
    age: 23,
    position: "дизайнер",
  };
  workers.push(newWorker);
  console.log("доданий", workers);
}
function studentsManagment() {
  console.log("Завдання 4:");
  let students = [
    {
      name: "Ірина",
      age: 17,
      yearOfUniversity: 1,
    },
    {
      name: "Олексій",
      age: 19,
      yearOfUniversity: 2,
    },
  ];

  for (let i = students.length - 1; i >= 0; i--) {
    if (students[i].name === "Олексій") {
      students.splice(i, 1);
    }
  }

  let newStudent = {
    name: "Світана",
    age: 21,
    yearOfUniversity: 3,
  };
  students.push(newStudent);
  function compareByAge(a, b) {
    if (a.age > b.age) return 1;
    if (a.age == b.age) return 0;
    if (a.age < b.age) return -1;
  }
  students.sort(compareByAge);
  console.log("Відсортовані студенти за віком:", students);

  let thrirdYearStudent = students.find(function (student) {
    return student.yearOfUniversity === 3;
  });
  console.log("student of third year of university:", thrirdYearStudent);
}

function numbersManagment() {
  console.log("Завдання 5:");
  let numbers = [2, 3, 7];
  let squaredNumbers = numbers.map(function (number) {
    return number * number;
  });
  console.log(squaredNumbers);

  let binates = numbers.filter(function (number) {
    return number % 2 === 0;
  });
  console.log("binates:", binates);

  let sum = numbers.reduce(function (sum, current) {
    return sum + current;
  }, 0);
  console.log("сума:", sum);

  let newNumbers = [1, 5, 8, 9, 10];
  numbers = numbers.concat(newNumbers);
  console.log("Доповнений масив:", numbers);

  numbers.splice(0, 3);
  console.log("массив без перших 3-х елементів", numbers);
}
function libraryManagement() {
  let books = [
    {
      title: "1984",
      autor: "Джордж Орвелл",
      genre: "роман-антиутопія",
      pages: 368,
      isAvaliable: true,
    },
    {
      title: "Вчитель",
      autor: "Шарлотта Бронте",
      genre: "роман",
      pages: 336,
      isAvaliable: true,
    },
    {
      title: "Тигролови",
      autor: "Іван Багряний",
      genre: "пригодницький роман",
      pages: 768,
      isAvaliable: true,
    },
  ];
  function addBook(title, author, genre, pages) {
    let newBook = {
      title: title,
      author: author,
      genre: genre,
      pages: pages,
      isAvailable: true,
    };
    books.push(newBook);
    console.log("Книгу додано:", newBook);
  }
  addBook("Кобзар", "Тарас Шевченко", 672);
  console.log(books);

  function removeBook(title) {
    let index = -1;
    for (let i = 0; i < books.length; i++) {
      if (books[i].title === title) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      let removed = books.splice(index, 1)[0];
      console.log("Книгу видалено:", removed);
    } else {
      console.log("Книгу не знайдено");
    }
  }
  removeBook("Вчитель");

  function findBooksByAuthor(author) {
    let foundBook = books.find(function (book) {
      return book.author === author;
    });
    return foundBook;
  }
  findBooksByAuthor("Шевченко");

  function toggleBookAvailability(title, isBorrowed) {
    let book = books.find(function (item) {
      return item.title === title;
    });

    if (book !== undefined) {
      if (isBorrowed) {
        book.isAvailable = false;
        console.log(`Книгу "${title}" позначено як взяту.`);
      } else {
        book.isAvailable = true;
        console.log(`Книгу "${title}" позначено як повернуту.`);
      }
    } else {
      console.log(`Книгу з назвою "${title}" не знайдено.`);
    }
  }
  toggleBookAvailability("Тигролови", true);
  console.log(books);

  function sortBooksByPages() {
    function compareByPages(a, b) {
      if (a.pages < b.pages) {
        return -1;
      } else if (a.pages > b.pages) {
        return 1;
      } else {
        return 0;
      }
    }
    books.sort(compareByPages);
    console.log("Відсортовані книги за кількістю сторінок:", books);
  }
  sortBooksByPages();

  function getBooksStatistics() {
    let totalBooks = books.length;

    let availableBooks = books.filter(function (book) {
      return book.isAvailable === true;
    }).length;

    let borrowedBooks = books.filter(function (book) {
      return book.isAvailable === false;
    }).length;

    let totalPages = books.reduce(function (sum, book) {
      return sum + book.pages;
    }, 0);
    let averagePages = totalBooks > 0 ? totalPages / totalBooks : 0;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      averagePages,
    };
  }
  let booksStatistics = getBooksStatistics();
  console.log("Статистика по книгам", booksStatistics);
}
function studentMethodsManagement() {
  let student = {
    name: "Ангеліна",
    age: 19,
    yearOfUniversity: 2,
  };
  student.subjects = ["Англійська", "Бази даних", "Веб технології"];
  delete student.age;
  console.log("Оновлений студент", student);
}

fruitsManagment();
colorsManagment();
workerManagment();
studentsManagment();
numbersManagment();
libraryManagement();
studentMethodsManagement();
