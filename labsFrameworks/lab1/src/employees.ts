interface Payable {
  pay(): void;
}

abstract class Employee {
  constructor(public name: string, public age: number, public salary: number) {}
  abstract getAnnualBonus(): number;
}

class Developer extends Employee implements Payable {
  getAnnualBonus(): number {
    return this.salary * 0.1;
  }
  pay(): void {
    console.log(`Paying Developer ${this.name}: $${this.salary}`);
  }
}

class Manager extends Employee implements Payable {
  getAnnualBonus(): number {
    return this.salary * 0.2;
  }
  pay(): void {
    console.log(`Paying Manager ${this.name}: $${this.salary}`);
  }
}

const employees: Employee[] = [
  new Developer("Alice", 25, 50000),
  new Developer("Bob", 28, 60000),
  new Manager("Charlie", 35, 90000),
];

const totalBonus = employees.reduce(
  (sum, emp) => sum + emp.getAnnualBonus(),
  0
);
console.log(`Total annual bonuses for all employees: $${totalBonus}`);
