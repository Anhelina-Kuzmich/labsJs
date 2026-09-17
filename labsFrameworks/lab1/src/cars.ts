abstract class Car {
    protected constructor(
        public brand: string, 
        protected model: string, 
        private vin: string
    ) {}

    abstract displayInfo(): void;

    protected getVin(): string {
        return this.vin;
    }
}

class Toyota extends Car {
    constructor(model: string, vin: string, public hybrid: boolean) {
        super("Toyota", model, vin);
    }
    displayInfo(): void {
        console.log(`Brand: ${this.brand}, Model: ${this.model}, Hybrid: ${this.hybrid}, VIN: ${this.getVin()}`);
    }
}

class Ford extends Car {
    constructor(model: string, vin: string, public payloadCapacity: number) {
        super("Ford", model, vin);
    }
    displayInfo(): void {
        console.log(`Brand: ${this.brand}, Model: ${this.model}, Capacity: ${this.payloadCapacity}kg, VIN: ${this.getVin()}`);
    }
}

class BMW extends Car {
    constructor(model: string, vin: string, public mSportPackage: boolean) {
        super("BMW", model, vin);
    }
    displayInfo(): void {
        console.log(`Brand: ${this.brand}, Model: ${this.model}, M-Sport: ${this.mSportPackage}, VIN: ${this.getVin()}`);
    }
}

const camry = new Toyota("Camry", "VIN123", true);
const rav4 = new Toyota("RAV4", "VIN124", false);
const f150 = new Ford("F-150", "VIN223", 1500);
const mustang = new Ford("Mustang", "VIN224", 400);
const m3 = new BMW("M3", "VIN323", true);
const x5 = new BMW("X5", "VIN324", false);

[camry, rav4, f150, mustang, m3, x5].forEach(car => car.displayInfo());