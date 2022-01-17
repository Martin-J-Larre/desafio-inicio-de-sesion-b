const goToRegisterButton = document.querySelector(".goToRegisterButton");

goToRegisterButton.addEventListener("click", () => {
	window.location.pathname = "/register";
});