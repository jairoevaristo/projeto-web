const buttonSubmit = document.querySelector("#button-submit");
const spanMessage = document.querySelector("#span-message");

const imageProfile = document.querySelector("#image");

const nome = document.querySelector("#nome");
const marca = document.querySelector("#marca");
const preco_diaria = document.querySelector("#preco_diaria");
const valor_carro = document.querySelector("#valor_carro");
const cor = document.querySelector("#cor");
const avatar = document.querySelector("#avatar");

const typeImages = ["image/png", "image/jpg"];
let storedFiles = [];

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

buttonSubmit.addEventListener("click", (e) => {
  if (imageProfile.src.startsWith("data:image/")) {
    alert("Incluia uma imagem para o carro");
    return;
  }

  e.preventDefault();
  const data = new FormData();

  data.append("nome", nome.value);
  data.append("marca", marca.value);
  data.append("preco_diaria", preco_diaria.value);
  data.append("valor_carro", valor_carro.value);
  data.append("cor", cor.value);

  const len = storedFiles.length;
  for (let i = 0; i < len; i++) {
    data.append("avatar", storedFiles[i]);
  }

  fetch("/admin/loja/add-carro", {
    method: "post",
    body: data,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response._id) {
        window.location.href = "/admin/loja";
      } else {
        // window.location.href = "/admin/loja/add-carro";
        spanMessage.textContent = "Houve um erro ao salvar o carro";
      }
    })
    .catch((error) => console.log(error));
});
