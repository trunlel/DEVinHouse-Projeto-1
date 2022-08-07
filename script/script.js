const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sTitulo = document.querySelector("#titulo");
const sSkill = document.querySelector("#skill");
const sCategoria = document.querySelector("#categoria");
const sVideo = document.querySelector("#pushVideo");
const sDescricao = document.querySelector("#descricao");
const btnSalvar = document.querySelector("#btnSalvar");
const inputSearch = document.querySelector("#search input");
const filtro = document.querySelector("#filtro");
const ul = document.querySelector("#lista-ul");
const divCards = document.querySelector("#cards-container");
const divTable = document.querySelector("#table-item");
const mudarLayout = document.querySelector("#layout");

mudarLayout.onclick = () => {
  divCards.classList.toggle("cards-container-hidden");
  divTable.classList.toggle("lista-ul-hidden");
};

//LocalStorage
const getItensBD = () => JSON.parse(localStorage.getItem("dbfunc")) ?? [];
const setItensBD = () => localStorage.setItem("dbfunc", JSON.stringify(itens));

//Renderizador de itens na tela
function loadItens() {
  itens = getItensBD();

  renderUl(itens);
  tbody.innerHTML = "";
  divCards.innerHTML = "";
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

let itens;
let id;

//funções para abrir o modal/editar/deletar
function openModal(edit, index) {
  let editValidation = edit;
  modal.classList.add("active");
  modal.addEventListener("click", (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
      id = undefined;
      sTitulo.value = "";
      sSkill.value = "";
      sCategoria.value = "";
      sDescricao.value = "";
      sVideo.value = "";
    }
  });

  if (editValidation == true) {
    id = index;
    sTitulo.value = itens[index].titulo;
    sSkill.value = itens[index].skill;
    sCategoria.value = itens[index].categoria;
    sDescricao.value = itens[index].descricao;
    sVideo.value = itens[index].pushVideo;
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  if (confirm(`Deseja deletar o item?`)) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
  }
}

btnSalvar.onclick = (e) => {
  if (
    sTitulo.value == "" ||
    sSkill.value == "" ||
    sDescricao.value == "" ||
    sCategoria.value == ""
  ) {
    return;
  }
  e.preventDefault();

  if (id !== undefined) {
    itens[id].titulo = sTitulo.value;
    itens[id].skill = sSkill.value;
    itens[id].categoria = sCategoria.value;
    itens[id].descricao = sDescricao.value;
    itens[id].pushVideo = sVideo.value;
  } else {
    itens.push({
      titulo: sTitulo.value,
      skill: sSkill.value,
      categoria: sCategoria.value,
      descricao: sDescricao.value,
      pushVideo: sVideo.value,
    });
  }
  alert("Sucesso!");
  setItensBD();
  modal.classList.remove("active");
  loadItens();
  id = undefined;
  sTitulo.value = "";
  sSkill.value = "";
  sCategoria.value = "";
  sDescricao.value = "";
  sVideo.value = "";
};

//função para inserir no HTML
function insertItem(item, index) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
  
    <td>${item.titulo}</td>
    <td>${item.skill}</td>
    <td>${item.categoria}</td>
    <td>${item.descricao}</td>
 
    <td class="acao">
    <a href="${item.pushVideo}" target="_blank"> <button onclick=""><i class='bx bx-video' ></i></button>
  </td></a>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
    
  `;
  let div = document.createElement("div");
  div.classList.add("cards");
  div.innerHTML = `

    <h1 class="card-title">${item.titulo}</h1>
    <h3 class="card-skill card-content">Skill: <p>${item.skill}</p></h3>
    <h3 class="card-categoria card-content">Categoria: <p>${item.categoria}</p></h3>
    <h3 class="card-descricao card-content">Descrição:</h3>
    <h3><textarea class="card-descricao-text" disabled="true" rows="7">${item.descricao}</textarea></h3>
  <div class="buttons-action">
    <a href="${item.pushVideo}" target="_blank"><button onclick=""><i class='bx bx-video' ></i></button></a>
    <p class="acao"><button onclick="editItem(${index})"><i class='bx bx-edit'></i></button></p>
    <p class="acao"><button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button></p>      
  </div>
  `;
  divCards.appendChild(div);
  tbody.appendChild(tr);
}

//Contador
function renderUl(item) {
  ul.innerHTML = "";
  let frontend = 0;
  let backend = 0;
  let fullstack = 0;
  let softskill = 0;

  if (item != null) {
    for (let itens of item) {
      switch (itens.categoria) {
        case "FrontEnd":
          frontend++;
          break;
        case "BackEnd":
          backend++;
          break;
        case "FullStack":
          fullstack++;
          break;
        default:
          softskill++;
      }
    }
    ul.innerHTML = `
  
    <li>
    Total <span class="total">${item.length}</span>
    </li>
    <li>
    FrontEnd <span class="front">${frontend}</span>
    </li>
    <li>
    BackEnd <span class="back">${backend}</span>
    </li>
    <li>
    FullStack <span class="full">${fullstack}</span>
    </li>
    <li>
    Softskill <span class="soft">${softskill}</span>
    </li>`;
  }
}

//Filtragem de elementos pelo input
const filterTodos = (todos, inputValue, returnMatchedTodos) =>
  todos.filter((todos) => {
    const matchedTodos = todos.textContent.toLowerCase().includes(inputValue);
    return returnMatchedTodos ? matchedTodos : !matchedTodos;
  });

const hideTodos = (todos, inputValue) => {
  filterTodos(todos, inputValue, false).forEach((todo) => {
    todo.classList.add("hidden");
  });
};

const showTodos = (todos, inputValue) => {
  filterTodos(todos, inputValue, true).forEach((todo) => {
    todo.classList.remove("hidden");
  });
};

inputSearch.addEventListener("input", (event) => {
  const inputValue = event.target.value.trim().toLowerCase();
  const todos = Array.from(filtro.children);

  hideTodos(todos, inputValue);
  showTodos(todos, inputValue);
});

loadItens();
