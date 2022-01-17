import { options as mysqlOptions } from "../db/options/mysql.js";
import { options as sqlite3Options } from "../db/options/sqlite3.js";
import knexLib from "knex";

async function createTables() {

//---------------Products Table
	let knex = knexLib(sqlite3Options);

	try {
		const existsProducts = await knex.schema.hasTable("products");

		if (!existsProducts) {
			try {
				await knex.schema.createTable("products", (table) => {
					table.increments("id");
					table.string("title");
					table.integer("price");
					table.string("imageUrl");
				});

				console.log("Table products created");
			} catch (error) {
				console.log("Error creating products table.");
			}
		}
	} catch (error) {
		console.log("Error products table");
	} finally {
		knex.destroy();
	}

//----------------------Messages table
	knex = knexLib(mysqlOptions);

	try {
		const existsMessages = await knex.schema.hasTable("messages");

		if (!existsMessages) {
			try {
				await knex.schema.createTable("messages", (table) => {
					table.increments("id");
					table.string("email");
					table.string("date");
					table.string("message");
				});
				// { 
				// 	author: {
				// 		id: 'mail del usuario', 
				// 		nombre: 'nombre del usuario', 
				// 		apellido: 'apellido del usuario', 
				// 		edad: 'edad del usuario', 
				// 		alias: 'alias del usuario',
				// 		avatar: 'url avatar (foto, logo) del usuario'
				// 	},
				// 	text: 'mensaje del usuario'
				// }
				

				console.log("TABLE MESSAGES CREATED");
			} catch (error) {
				console.log("Error creating messages table.");
			}
		}
	} catch (error) {
		console.log("Error checking messages table.");
	} finally {
		knex.destroy();
	}
}

createTables();;