class IceCreamMaker {
  private menu: Record<string, number> = {
    small: 10,
    large: 25,
    chocolate: 5,
    caramel: 6,
    berries: 10,
    marshmallow: 5,
  };

  public addComponent(name: string, price: number): void {
    this.menu[name.toLowerCase()] = price;
  }

  public calculatePrice(): void {
    let size = prompt("Оберіть розмір (small/large):")?.toLowerCase() || "";

    if (!this.menu[size] || (size !== "small" && size !== "large")) {
      console.log("Помилка: Невірний розмір.");
      return;
    }

    let total = this.menu[size];

    let toppingsInput = prompt(
      "Введіть начинки через кому (chocolate, caramel, berries, marshmallow):"
    );
    if (toppingsInput) {
      let toppings = toppingsInput
        .split(",")
        .map((t) => t.trim().toLowerCase());
      for (const topping of toppings) {
        if (this.menu[topping]) {
          total += this.menu[topping];
        } else {
          console.log(`Інгредієнт '${topping}' не знайдено в меню.`);
        }
      }
    }
    console.log(`Загальна вартість вашого морозива: ${total} грн.`);
  }
}

const order = new IceCreamMaker();
order.addComponent("nuts", 8);
