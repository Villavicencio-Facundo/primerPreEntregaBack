import { Router } from "express";
import { productsService } from "../service/products.service.js";

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    const products = productsService.getAll();
    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit));
        return res.status(200).json(limitedProducts);
    }
    res.status(200).json(products);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const product = productsService.getById({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
        const product = await productsService.create({ title, description, code, price, status, stock, category, thumbnails });
        res.status(201).json(product);
    } catch {
        res.status(500).json({ message: "Error creating product" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productsService.update({ id, ...req.body });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch {
        res.status(500).json({ message: "Error updating product" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productsService.delete({ id });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(204).end();
    } catch {
        res.status(500).json({ message: "Error deleting product" });
    }
});

export { router as productsRouter };


