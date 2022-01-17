const socket = io();
const logOutButton = document.querySelector(".logOutButton");
const fakerProductsTableContainer = document.querySelector(".fakerProductsTableContainer");
const productsTableContainer = document.querySelector(".productsTableContainer");
const form = document.querySelector(".addProductForm");
const messageCenterTitle = document.querySelector(".messageCenterContainer h2");
const messageCenter = document.querySelector(".messageCenter");
const sendMessage = messageCenter.querySelector(".sendMessage");
const emailInput = messageCenter.querySelector("#email");
const nameInput = messageCenter.querySelector("#name");
const surnameInput = messageCenter.querySelector("#surname");
const ageInput = messageCenter.querySelector("#age");
const aliasInput = messageCenter.querySelector("#alias");
const avatarInput = messageCenter.querySelector("#avatar");
const messageInput = messageCenter.querySelector("#message");
const sendButton = messageCenter.querySelector(".sendButton");

//----------------Normalizar Schema
const authorSchema = new normalizr.schema.Entity("authors");
const messageSchema = new normalizr.schema.Entity("messages", { author: authorSchema }, { idAttribute: "_id" });
const messagesSchema = [messageSchema];

//---------------- Sessions

//LOG OUT
async function onLogOut() {
	window.location.replace("/logout");
}

logOutButton.addEventListener("click", onLogOut);

//-----------------Sockets

//load Faker Products
socket.on("loadFakerProducts", async (fakerProducts) => {
//--Removes old table
	let oldProductsTable = fakerProductsTableContainer.querySelector(".fakerProductsTable");
	fakerProductsTableContainer.removeChild(oldProductsTable);

//--Fetch FakerProductsTable 
	const fakerProductsTableFile = await fetch("views/partials/products/fakerProductsTable.ejs");
	const fakerProductsTableEjs = await fakerProductsTableFile.text();

//--Renders table
	const fakerProductsTable = ejs.render(fakerProductsTableEjs, { fakerProducts: fakerProducts });
	fakerProductsTableContainer.innerHTML += fakerProductsTable;
});

//On load Products
socket.on("loadProducts", async (products) => {
//--Removes old table
	let oldProductsTable = productsTableContainer.querySelector(".productsTable");
	productsTableContainer.removeChild(oldProductsTable);

//--Fetches productsTable
	const productsTableFile = await fetch("views/partials/products/productsTable.ejs");
	const productsTableEjs = await productsTableFile.text();

//--Renders table
	const productsTable = ejs.render(productsTableEjs, { products: products });
	productsTableContainer.innerHTML += productsTable;
});

function getDenormalizedMessages(normalizedMessages) {
	const messages = normalizr.denormalize(normalizedMessages.result, messagesSchema, normalizedMessages.entities);

	const denormalizedLength = JSON.stringify(messages).length;
	const normalizedLength = JSON.stringify(normalizedMessages).length;
	const compressionPercentage = 100 - (normalizedLength * 100) / denormalizedLength;

	messageCenterTitle.innerHTML = `Messages Center - Compression: ${compressionPercentage}`;

    console.log('Compression is:',compressionPercentage);

	return messages;
}

//--On load Messages
socket.on("loadMessages", async (normalizedMessages) => {
	if (!normalizedMessages) {
		emailInput.disabled = true;
		sendButton.disabled = true;
	}

	const messages = getDenormalizedMessages(normalizedMessages);

//--old chats remover
	let oldChat = messageCenter.querySelector(".chat");
	messageCenter.removeChild(oldChat);

//--Fetches chat 
	const chatFile = await fetch("views/partials/messages/chat.ejs");
	const chatEjs = await chatFile.text();

	const chat = ejs.render(chatEjs, { messages: messages });
	const wrapper = document.createElement("div");
	wrapper.innerHTML = chat;

//--Render chat
	const chatNode = wrapper.firstChild;

	messageCenter.insertBefore(chatNode, sendMessage);
});

//-----------------Form

//Add products
form.addEventListener("submit", async (e) => {
	e.preventDefault();

//--Get input values
	const title = e.target.querySelector("#title").value;
	const price = e.target.querySelector("#price").value;
	const imageUrl = e.target.querySelector("#imageUrl").value;
	const newProduct = { title: title, price: price, imageUrl: imageUrl };

	try {
		await fetch("/api/products/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});
		form.reset();
	} catch (err) {
		console.log(err);
	}
});

//Message Center

function handleInputsChange() {
	let areInputsFilled = true;
	const messageCenterInputs = [emailInput, nameInput, surnameInput, ageInput, aliasInput];

	for (let i = 0; i < messageCenterInputs.length; i++) {
		if (messageCenterInputs[i].value === "") {
			areInputsFilled = false;
			break;
		}
	}

	if (areInputsFilled) {
		messageInput.disabled = false;
		sendButton.disabled = false;
	} else {
		messageInput.disabled = true;
		sendButton.disabled = true;
	}
}
emailInput.addEventListener("change", handleInputsChange);
nameInput.addEventListener("change", handleInputsChange);
surnameInput.addEventListener("change", handleInputsChange);
ageInput.addEventListener("change", handleInputsChange);
aliasInput.addEventListener("change", handleInputsChange);

//GEGet Date
function getFormattedDate() {
	const date = new Date();
	const formattedDate = `${date.getDate()}/${
		date.getMonth() + 1
	}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

	return formattedDate;
}

//Send Messages
sendButton.addEventListener("click", async (e) => {
	e.preventDefault();
//--Get input values
	const email = emailInput.value;
	const name = nameInput.value;
	const surname = surnameInput.value;
	const age = ageInput.value;
	const alias = aliasInput.value;
	const avatar = avatarInput.value;

	const date = getFormattedDate();
	const message = messageInput.value;

	const newMessage = {
		author: { id: email, name: name, surname: surname, age: age, alias: alias, avatar: avatar },
		message: message,
		date: date,
	};

	try {
		////Post new product
		await fetch("/api/chat/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newMessage),
		});

		/////Reset message input values
		messageInput.value = "";
	} catch (err) {
		console.log(err);
	}
});