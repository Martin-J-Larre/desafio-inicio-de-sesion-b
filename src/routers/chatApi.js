import { Router } from "express";
const router = new Router();
import { validateSession } from "../index.js";

//----------------services

import { Container } from "../services/Container.js";
import { options } from "../db/options/sqlite3.js";
const service = new Container(options, "products");

//-----------------Middlewares
function validateProduct(req, res, next) {
	const { title, price, imageUrl } = req.body;
	if (!title || !price || !imageUrl) return res.status(406).json({ error: "Invalid product" });
	else next();
}

async function productsAvailable(req, res, next) {
	try {
		const response = await service.isEmpty();

		if (!response) res.status(404).json({ error: "No product loaded" });
		else next();
	} catch (error) {
		res.status(500).json({ error: "Error productsAvailable()", description: error.message });
	}
}

function validateId(req, res, next) {
	const id = Number(req.params.id);

	if (isNaN(id)) return res.status(400).json({ error: "The ID is not a number." });
	else if (!Number.isInteger(id)) return res.status(400).json({ error: "The ID should be a integer." });
	else {
		next();
	}
}

async function productExists(req, res, next) {
	const id = Number(req.params.id);

	try {
		const product = await service.getElementById(id);

		if (!product) res.status(404).json({ error: "Product not found" });
		else next();
	} catch (error) {
		res.status(500).json({ error: "Error productExists()", description: error.message });
	}
}

//-----------Helper functions
async function emitLoadProducts() {
	try {
		const products = await service.getElementsAll();

		const { io } = await import("../index.js");
		io.sockets.emit("loadProducts", products);
	} catch (error) {
		console.log(error.message);
	}
}

//Routes
//------------- Get
router.get("/", validateSession, productsAvailable, async (req, res) => {
	try {
		const products = await service.getElementsAll();

		res.json(products);
	} catch (error) {
		res.status(500).json({ error: "Error in getElementsAll() ", description: error.message });
	}
});

router.get("/:id", validateSession, productsAvailable, validateId, productExists, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await service.getElementById(id);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error getElementById(id)", description: error.message });
	}
});

//------------- Post
router.post("/", validateSession, validateProduct, async (req, res) => {
	try {
		const product = await service.insertElement(req.body);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error insertElement(req.body)", description: error.message });
	}

	await emitLoadProducts();
});

//------------- Put
router.put("/:id", validateSession, productsAvailable, validateId, productExists, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await service.updateElement(id, req.body);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error updateElement(id, req.body)", description: error.message });
	}

	await emitLoadProducts();
});

//------------- Delete
router.delete("/:id", validateSession, productsAvailable, validateId, productExists, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await service.deleteElementById(id);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error deleteElementById(id)", description: error.message });
	}

	await emitLoadProducts();
});

export { router };