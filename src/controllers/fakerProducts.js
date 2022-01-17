import faker from "faker";

function getFakerProducts() {
	let products = [];

	for (let i = 0; i < 5; i++) {
		products.push({
			name: faker.commerce.productName(),
			price: faker.commerce.price(),
			imageURL: faker.image.food(),
		});
	}

	return products;
}

export { getFakerProducts };