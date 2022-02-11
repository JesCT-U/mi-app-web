const form = document.getElementById("form")

document.addEventListener("DOMContentLoaded", function(){
    dibujarCategoria();
    let transactionArray = JSON.parse(localStorage.getItem("transactionData"))

    transactionArray.forEach(element => {
        insertRow(element)
    });
})

function insertarCategoria(categoria){
    const selectElement = document.getElementById("categoria")
    let htmlToInsert = `<option> ${categoria} </option>`;
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert);
}

function dibujarCategoria(){
    let allCategorias = [
        "Alquiler", "Comida", "Diversion", "Higiene", "Mascotas", "Salud"
    ]

    allCategorias.forEach(element => {
        insertarCategoria(element)
    })
}

form.addEventListener("submit", function(event){
    event.preventDefault()
    let transactionFormData = new FormData(form)
    let transactionObj = FromDataToTransactionObj(transactionFormData)
    saveTransactionObj(transactionObj)
    insertRow(transactionObj)
    form.reset();
})

function getNewTrasactionId(){
    let lastId = localStorage.getItem("lastTransactionId") || "0"
    let newId = parseInt(lastId) + 1
    localStorage.setItem("lastTransactionId", JSON.stringify(newId))

    return newId
}

function FromDataToTransactionObj(transactionFormData){
    let tipo = transactionFormData.get("selector")
    let descripcion = transactionFormData.get("descripcion")
    let monto = transactionFormData.get("monto")
    let categoria = transactionFormData.get("categoria")
    let id = getNewTrasactionId()

    return {
        "selector": tipo,
        "descripcion": descripcion,
        "monto": monto,
        "categoria": categoria,
        "id": id
    }
}

function insertRow(obj){
    let tabla = document.getElementById("table")
    let row = tabla.insertRow(-1)
    row.setAttribute("data-transaction-id", obj["id"])

    let cell = row.insertCell(0)
    cell.textContent = obj["selector"]
            
    cell = row.insertCell(1)
    cell.textContent = obj["descripcion"]

    cell = row.insertCell(2)
    cell.textContent = obj["monto"]

    cell = row.insertCell(3)
    cell.textContent = obj['categoria']

    let deleteCell = row.insertCell(4)
    let deleteButton = document.createElement("button")
    deleteButton.textContent = "Eliminar"
    deleteButton.classList.add("btn")
    deleteButton.classList.add("btn-primary")
    deleteCell.appendChild(deleteButton)

    deleteButton.addEventListener("click", (event) => {
        let transactionRow = event.target.parentNode.parentNode
        let transactionId = transactionRow.getAttribute("data-transaction-id")
        transactionRow.remove()
        deleteTransactionObj(transactionId)
    })
}

function deleteTransactionObj(transactionId){
    let transactionArray = JSON.parse(localStorage.getItem("transactionData"))
    let transactionIndex = transactionArray.findIndex(x => x.id == transactionId)
    transactionArray.splice(transactionIndex, 1)
    let Json = JSON.stringify(transactionArray)
    localStorage.setItem("transactionData", Json)
}

function saveTransactionObj(transactionObj){
    let transactionArray = JSON.parse(localStorage.getItem("transactionData"))  || []
    transactionArray.push(transactionObj)
    let Json = JSON.stringify(transactionArray)
    localStorage.setItem("transactionData", Json)
}