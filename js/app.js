// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.ToDoList-form');
const ToDoList = document.getElementById('ToDoList');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.ToDoList-container');
const list = document.querySelector('.ToDoList-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit',addItem);
// clear items
clearBtn.addEventListener('click',clearItem);
// load items
window.addEventListener('DOMContentLoaded',setupItems);

// ****** FUNCTIONS **********
function addItem(e){
  e.preventDefault();
  const  value = ToDoList.value;
  const id = new Date().getTime().toString();
  if(value !== '' && editFlag === false){
    const element = document.createElement('article');
    // add class
    element.classList.add('ToDoList-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>  
    <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>  
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>  
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);

    //apend child
    list.appendChild(element);
    // display alert
    displayAlert("item added to the item","success");
    // show container
    container.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  }
  else if(value !== '' && editFlag === true){
    editElement.innerHTML = value;
    displayAlert('value changed','success');
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  }
  else{
    displayAlert("Please enter value","danger");
  }
/* alternate way
  if(value && !editFlag){
    console.log('add item to the list');
  }
  else if(value && editFlag){
    console.log('editing');
  }
  else{
    console.log('empty value');
  }
*/
}
    //display alert
    function displayAlert(text,action){
        alert.textContent = text;
        alert.classList.add(`alert-${action}`);

        //remove alert
        setTimeout(function(){
            alert.textContent = "";
            alert.classList.remove(`alert-${action}`);
        },1000)
    }

    // clear items
    function clearItem(){
        const items = document.querySelectorAll('ToDoList-item');

        if(items.length > 0){
            items.forEach(function(item){
                list.removeChild(item);
            });
        }
        container.classList.remove('show-container');
        displayAlert('empty list','danger');
        setBackToDefault();
        localStorage.removeItem('list');
    }

    //edit function
    function editItem(e){
        const element = e.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
        //set edit item
        editElement = e.currentTarget.parentElement.
        previousElementSibling;
        // set form value
        ToDoList.value = editElement.innerHTML;
        editFlag = true;
        editID = element.dataset.id;
        submitBtn.textContent = "edit";
    }

    // delete function
    function deleteItem(e){
        const element = e.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
        list.removeChild(element);
        if (list.childern.length === 0){
            container.classList.remove('show-container');
        }
        displayAlert('item removed', 'danger');
        setBackToDefault();
        // remove from local storage
        removeFromLocalStorage(id);
    }

    // set back to default
    function setBackToDefault(){
       // console.log("set back to default");
        ToDoList.value ='';
        editFlag = false;
        editID = '';
        submitBtn.textContent = 'submit';
    }
    
// ****** LOCAL STORAGE **********

// add to local storage
function addToLocalStorage(id, value){
    const ToDoList = {id:id, value:value};
    // alternative way const ToDoList = {id, value};

    let items = getLocalStorage();
    items.push(ToDoList);      
    localStorage.setItem('list',JSON.stringify(items));
    // console.log("added to local storage");
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
  
    items = items.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });
  
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if (item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list')
                ? JSON.parse(localStorage.getItem('list'))
                : [];
}

/* demonstration
localStorage.setItem('orange',JSON.stringify(["item","item2"]));
const oranges = JSON.parse(localStorage.getItem('orange'));
localStorage.removeItem("oranges"); */
// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
  
    if (items.length > 0) {
      items.forEach(function (item) {
        createListItem(item.id, item.value);
      });
      container.classList.add("show-container");
    }
  }
  
  function createListItem(id, value) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("ToDoList-item");
    element.innerHTML = `<p class="title">${value}</p>
              <div class="btn-container">
                <!-- edit btn -->
                <button type="button" class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <!-- delete btn -->
                <button type="button" class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
  
    // append child
    list.appendChild(element);
  }

  // ****** Register service worker to control making site work offline **********

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then(() => { console.log('Service Worker Registered'); });
  }
