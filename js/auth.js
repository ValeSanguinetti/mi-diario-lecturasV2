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
    mensaje.textContent = "";
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const { data, error } = await window.supabaseClient.auth.signUp({
        email,
        password,
      });

      // 🔹 Logs para depuración
    //  console.log("Registro:", { data, error });

      if (error) {
        mensaje.textContent = "⚠️ " + error.message;
        mensaje.style.color = "red";
        return;
      }

      // Revisar si se creó un usuario o no
    if (!data.session && data.user && data.user.email === email) {
      mensaje.textContent = "⚠️ Este email ya está registrado";
      mensaje.style.color = "red";
      return;
    }
      // Usuario creado correctamente o pendiente confirmación
      //console.log("Usuario registrado correctamente", data);
      mensaje.textContent = "✅ Registro exitoso (verifica tu email)";
      mensaje.style.color = "green";

    } catch (err) {
      //console.error("Error en el registro:", err);
      mensaje.textContent = "⚠️ Ocurrió un error inesperado";
      mensaje.style.color = "red";
    }
  });
}
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const { error } = await window.supabaseClient.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value,
    });
if (error) {
      // mostrar mensaje de error en pantalla
      mensaje.textContent = "Email o contraseña incorrecta";
      
      return;
    }
    if (!error) {
      window.location.href = "app.html";
    }
  });
}