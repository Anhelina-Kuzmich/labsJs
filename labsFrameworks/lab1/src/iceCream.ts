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
    console.log("Оберіть розмір (small/large): large");
    let size = "large";

    if (!this.menu[size] || (size !== "small" && size !== "large")) {
      console.log("Помилка: Невірний розмір.");
      return;
    }

    let total = this.menu[size];
    console.log(
      "Введіть начинки через кому (chocolate, caramel, berries, marshmallow): chocolate, marshmallow"
    );
    let toppingsInput = "chocolate, marshmallow";

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
order.calculatePrice();
