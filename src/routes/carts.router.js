import { Router } from "express";
import { cartsService } from "../service/carts.service.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cart = await cartsService.create();
        res.status(201).json(cart);
    } catch {
        res.status(500).json({ message: "Error creating cart" });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const cart = cartsService.getById({ id: cid });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartsService.addProductToCart({ cartId: cid, productId: pid });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.status(200).json(cart);
    } catch {
        res.status(500).json({ message: "Error adding product to cart" });
    }
});

export { router as cartsRouter };
