import fs from "node:fs";
import { v4 as uuid } from "uuid";

class ProductsService {
    path;
    products = [];

    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), "utf-8");
        }
    }

    getAll() {
        return this.products;
    }

    getById({ id }) {
        return this.products.find((product) => product.id === id);
    }

    async create({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        const id = uuid();
        const product = { id, title, description, code, price, status, stock, category, thumbnails };

        this.products.push(product);
        await this.saveOnFile();
        return product;
    }

    async update({ id, ...updates }) {
        const product = this.products.find((p) => p.id === id);
        if (!product) return null;

        Object.assign(product, updates);
        await this.saveOnFile();
        return product;
    }

    async delete({ id }) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) return null;

        const [deletedProduct] = this.products.splice(index, 1);
        await this.saveOnFile();
        return deletedProduct;
    }

    async saveOnFile() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
    }
}

export const productsService = new ProductsService("./src/db/products.json");

