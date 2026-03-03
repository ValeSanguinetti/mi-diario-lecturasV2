async function obtenerToken() {
  const { data } = await window.supabaseClient.auth.getSession();
  return data.session?.access_token;
}

window.obtenerToken = obtenerToken;

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mensaje = document.getElementById("mensaje");

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

if (btnRegister) {
  btnRegister.addEventListener("click", async () => {
    const { error } = await window.supabaseClient.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value,
    });

    if (error) {
      mensaje.textContent = error.message;
    } else {
      mensaje.textContent = "Registro exitoso";
    }
  });
}

if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const { error } = await window.supabaseClient.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value,
    });

    if (!error) {
      window.location.href = "app.html";
    }
  });
}