import fs from "node:fs";
import { v4 as uuid } from "uuid";

class CartsService {
    path;
    carts = [];

    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            try {
                this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.carts = [];
            }
        } else {
            this.carts = [];
            this.saveOnFile();
        }
    }

    getAll() {
        return this.carts;
    }

    getById({ id }) {
        return this.carts.find((cart) => cart.id === id);
    }

    async create() {
        const id = uuid();
        const cart = { id, products: [] };

        this.carts.push(cart);
        await this.saveOnFile();
        return cart;
    }

    async addProductToCart({ cartId, productId }) {
        const cart = this.carts.find((c) => c.id === cartId);
        if (!cart) return null;

        const product = cart.products.find((p) => p.product === productId);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveOnFile();
        return cart;
    }

    async saveOnFile() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }
}

export const cartsService = new CartsService("./src/db/carts.json");

