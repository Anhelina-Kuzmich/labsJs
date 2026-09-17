interface LibraryItem {
  title: string;
  author: string;
  isBorrowed: boolean;
  borrow(): void;
}

abstract class BaseLibraryItem implements LibraryItem {
  public isBorrowed: boolean = false;
  constructor(public title: string, public author: string) {}

  borrow(): void {
    if (!this.isBorrowed) {
      this.isBorrowed = true;
      console.log(`'${this.title}' has been borrowed.`);
    } else {
      console.log(`'${this.title}' is already borrowed.`);
    }
  }
}

class Book extends BaseLibraryItem {
  constructor(title: string, author: string, public pages: number) {
    super(title, author);
  }
}

class Magazine extends BaseLibraryItem {
  constructor(title: string, author: string, public issueNumber: number) {
    super(title, author);
  }
}

class DVD extends BaseLibraryItem {
  constructor(title: string, author: string, public durationMins: number) {
    super(title, author);
  }
}

class Library {
  private items: LibraryItem[] = [];

  addItem(item: LibraryItem): void {
    this.items.push(item);
  }
  findItemByName(name: string): LibraryItem | undefined {
    return this.items.find((item) => item.title === name);
  }
  printAvailableItems(): void {
    const available = this.items.filter((item) => !item.isBorrowed);
    console.log("Available Items:");
    available.forEach((i) => console.log(`- ${i.title} by ${i.author}`));
  }
}

const myLib = new Library();
myLib.addItem(new Book("1984", "George Orwell", 328));
myLib.addItem(new Magazine("Time", "Various", 5202));
myLib.addItem(new DVD("Inception", "Christopher Nolan", 148));

const book = myLib.findItemByName("1984");
book?.borrow();

myLib.printAvailableItems();
