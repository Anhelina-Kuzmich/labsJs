interface Animal {
  name: string;
  diet: string;
  speed?: number;
  move(): void;
}

class Cat implements Animal {
  constructor(
    public name: string,
    public diet: string,
    public speed?: number
  ) {}
  move(): void {
    console.log(`${this.name} runs gracefully.`);
  }
}

class Bird implements Animal {
  constructor(
    public name: string,
    public diet: string,
    public canFly?: boolean
  ) {}
  move(): void {
    console.log(`${this.name} flies in the sky.`);
  }
}

class Fish implements Animal {
  constructor(
    public name: string,
    public diet: string,
    public depthLevel?: number
  ) {}
  move(): void {
    console.log(`${this.name} swims underwater.`);
  }
}
