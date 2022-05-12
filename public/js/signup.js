const container = document.querySelector("#eye");
const containerConfirmar = document.querySelector("#eye-confirmar");

const inputSenha = document.querySelector("#password");
const inputSenhaConfirmar = document.querySelector("#password-confirmar");
const buttonSubmit = document.querySelector("#button-submit");

const inputFile = document.querySelector("#input-file");
const imageProfile = document.querySelector("#image");

const spanMessage = document.querySelector("#span-message");
const spanMessageSenha = document.querySelector("#span-message-senha");

const typeImages = ["image/png", "image/jpg"];

let isEye = false;
let isEyeConfirmar = false;

container.addEventListener("click", () => {
  isEye = !isEye;

  if (isEye) {
    container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>`;
    inputSenha.type = "text";
  } else {
    container.innerHTML = `<svg id="eye" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>`;
    inputSenha.type = "password";
  }
});

containerConfirmar.addEventListener("click", () => {
  isEyeConfirmar = !isEyeConfirmar;

  if (isEyeConfirmar) {
    containerConfirmar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>`;
    inputSenhaConfirmar.type = "text";
  } else {
    containerConfirmar.innerHTML = `<svg id="eye" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>`;
    inputSenhaConfirmar.type = "password";
  }
});

inputFile.addEventListener("change", (e) => {
  if (!typeImages.includes(e.target.files[0].type)) {
    spanMessage.classList.remove("hidden");
    spanMessage.textContent = "Tipo de arquivo não suportado.";
    return;
  }

  spanMessage.classList.add("hidden");

  imageProfile.src = URL.createObjectURL(e.target.files[0]);
});

buttonSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(inputSenhaConfirmar.value);

  if (inputSenha.value !== inputSenhaConfirmar.value) {
    spanMessageSenha.classList.remove("hidden");
    spanMessageSenha.textContent = "As senhas não são iguais";
    return;
  }

  spanMessageSenha.classList.add("hidden");
});
