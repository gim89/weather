function render(parent, obj) {
  const div = document.createElement("div");
  div.innerHTML = `<h2>Name: ${obj.name}</h2> <h2>Surame: ${obj.surname}</h2>`;
  parent.appendChild(div);
}
