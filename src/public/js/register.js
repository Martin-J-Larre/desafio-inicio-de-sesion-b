const goToLoginButton = document.querySelector(".goToLoginButton");

goToLoginButton.addEventListener("click", () => {
	window.location.pathname = "/login";
});