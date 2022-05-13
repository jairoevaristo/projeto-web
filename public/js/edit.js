const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const data_nascimento = document.querySelector("#data_nascimento");
const telefone = document.querySelector("#telefone");
const genero = document.querySelector("#genero");

const buttonSubmit = document.querySelector("#button-submit");

const imageProfile = document.querySelector("#image");

const typeImages = ["image/png", "image/jpg"];
let storedFiles = [];

const spanMessage = document.querySelector("#span-message");

avatar.addEventListener("change", (e) => {
  if (!typeImages.includes(e.target.files[0].type)) {
    spanMessage.classList.remove("hidden");
    spanMessage.textContent = "Tipo de arquivo não suportado.";
    return;
  }

  let files = e.target.files;
  storedFiles = Array.from(files);

  spanMessage.classList.add("hidden");

  imageProfile.src = URL.createObjectURL(e.target.files[0]);
});

buttonSubmit.addEventListener("click", () => {
  const data = new FormData();

  data.append("nome", nome.value);
  data.append("email", email.value);
  data.append("data_nascimento", data_nascimento.value);
  data.append("telefone", telefone.value);
  data.append("genero", genero.value);

  const len = storedFiles.length;
  for (let i = 0; i < len; i++) {
    data.append("avatar", storedFiles[i]);
  }

  fetch("/loja/conta-editar", {
    method: "post",
    body: data,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response._id) {
        window.location.href = "/loja/conta";
      }
    })
    .catch((error) => console.log(error));
});
