(function () {


  let arrItems = [];

  let doneItem = false;

  keyName = ""

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper)

    return {
      form,
      input,
      button
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function saveList(arr, listName) {
    localStorage.setItem(listName, JSON.stringify(arr))

  }


  function createTodoApp(container, title = 'Список дел', listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    keyName = listName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(keyName)

    if (localData !== null && localData !== '') arrItems = JSON.parse(localData)

    for (const arrItem of arrItems) {
      let todoItem = createTodoItem(arrItem);
      todoList.append(todoItem.item)
    }

    todoItemForm.form.addEventListener('input', function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      }
    })

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
        return;
      }
      let objectItem = {
        id: createId(arrItems),
        name: todoItemForm.input.value,
        done: false,
      }
      arrItems.push(objectItem);

      saveList(arrItems, keyName)
      let todoItem = createTodoItem(objectItem)
      todoList.append(todoItem.item)
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    })
  }
  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = "Готово";
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = "Удалить";

    if (obj.done == true) {
      item.classList.add('list-group-item-success')
    }

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');


      for (const arrItem of arrItems) {

        if (obj.id == arrItem.id) {
          arrItem.done = !arrItem.done;
        }
        saveList(arrItems, keyName)
      }
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        let currentName = item.firstChild.textContent
        for (let i = 0; i < arrItems.length; i++) {

          if (obj.id == arrItems[i].id) {
            arrItems.splice(i, 1)
          }
          saveList(arrItems, keyName)
        }
      }

    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup)

    return {
      item,
      doneButton,
      deleteButton,
    }
  }
  function createId(arr) {
    let id = 1;
    for (const item of arr) {
      id = Math.max(item.id) + 1;
    }
    return id
  }

  window.createTodoApp = createTodoApp;
})()


