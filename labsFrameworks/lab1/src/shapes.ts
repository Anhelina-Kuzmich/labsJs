interface Shape {
  getArea(): number;
  getPerimeter(): number;
  scale(factor: number): void;
}

class Circle implements Shape {
  constructor(public radius: number) {}
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
  scale(factor: number): void {
    this.radius *= factor;
  }
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  getArea(): number {
    return this.width * this.height;
  }
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
  scale(factor: number): void {
    this.width *= factor;
    this.height *= factor;
  }
}

class Triangle implements Shape {
  constructor(public a: number, public b: number, public c: number) {}
  getArea(): number {
    const s = this.getPerimeter() / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }
  getPerimeter(): number {
    return this.a + this.b + this.c;
  }
  scale(factor: number): void {
    this.a *= factor;
    this.b *= factor;
    this.c *= factor;
  }
}

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4, 5),
];

let totalArea = 0;
let totalPerimeter = 0;

shapes.forEach((shape) => {
  totalArea += shape.getArea();
  totalPerimeter += shape.getPerimeter();
});

console.log(
  `Total Area: ${totalArea.toFixed(
    2
  )}, Total Perimeter: ${totalPerimeter.toFixed(2)}`
);
