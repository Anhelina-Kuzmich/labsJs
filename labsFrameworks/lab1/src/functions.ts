function greetAndCount(name: string, count: number = 1): void {
    console.log(`Hello ${name}, you have ${count} notifications.`);
}

greetAndCount("Alice", 5);
greetAndCount("Bob");