import knexLib from "knex";

class Container {
	constructor(options, table) {
		this.knex = knexLib(options);
		this.table = table;
	}

	async isEmpty() {
		try {
			const rows = await this.knex.from(this.table).select("id").limit(1);

			return rows.length > 0 ? true : false;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async getElementById(id) {
		try {
			const rows = await this.knex.from(this.table).select("*").where("id", id).limit(1);

			return rows.length > 0 ? rows[0] : false;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async getElementsAll() {
		try {
			const rows = await this.knex.from(this.table).select("*");

			return rows;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async insertElement(element) {
		try {
			const id = await this.knex(this.table).insert(element);

			return { ...element, id };
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async updateElement(id, modifications) {
		try {
			await this.knex(this.table).where("id", id).update(modifications);

			const element = await this.getElementById(id);

			return element;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async deleteElementById(id) {
		try {
			const element = await this.getElementById(id);

			await this.knex(this.table).where("id", id).del();

			return element;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export { Container };