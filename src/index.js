// add event listener to delay code execution until DOM content is fully loaded
document.addEventListener("DOMContentLoaded", init);

// initialization function (orchestrates code execution after DOM content loaded)
function init() {
  // disable add function on initial load
  let addToy = false;

  // call content-load function
  postToyCards();

  // toggle the add-toy submission form
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // initiate submit new toy process
  const submitForm = document.querySelector('.add-toy-form');
  submitForm.addEventListener('submit', event => {handleSubmit(event)});
}


// server interaction functions

function postToyCards() {
  // get the toy data from the server
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(json => {
      json.forEach(toyObj => {
        // post each toy card to the DOM
        const cardContainer = document.querySelector('div#toy-collection');
        cardContainer.appendChild(buildToyCard(toyObj));
      });
    })
}

function submitNewToy(toyObj) {
  // build submission data object
  const submitObj = {};
  submitObj.method = 'POST';
  submitObj.headers = {'Content-Type': 'application/json', 'Accept': 'application/json',};
  submitObj.body = JSON.stringify(toyObj);

  // submit new toy to server
  fetch("http://localhost:3000/toys", submitObj)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data)
    .catch(error => console.log('Fetch error:', error))
}

function updateLikes(toyObj) {
  const submitObj = {};
  submitObj.method = 'PATCH';
  submitObj.headers = {'Content-Type': 'application/json', 'Accept': 'application/json',};
  submitObj.body = JSON.stringify(toyObj);

  // submit update to server
  fetch(`http://localhost:3000/toys/${toyObj.id}`, submitObj)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => data)
  .catch(error => console.log('Fetch error:', error))
}


// callback functions

function buildToyCard(toyObj) {
  // create all card elements
  const toyName = document.createElement('h2');
  toyName.innerText = toyObj.name;

  const toyImg = document.createElement('img');
  toyImg.className = 'toy-avatar';
  toyImg.src = toyObj.image;

  const toyLikes = document.createElement('p');
  toyLikes.className = 'like-count';
  toyLikes.innerText = toyObj.likes;

  const likeBtn = document.createElement('button');
  likeBtn.className = 'like-btn';
  likeBtn.id = toyObj.id;
  likeBtn.textContent = 'like';
  likeBtn.addEventListener('click', () => {handleLikes(toyObj, toyLikes)});

  const toyCard = document.createElement('span');
  toyCard.className = 'card';
  toyCard.id = `card-${toyObj.id}`;

  // assemble card
  toyCard.appendChild(toyName);
  toyCard.appendChild(toyImg);
  toyCard.appendChild(toyLikes);
  toyCard.appendChild(likeBtn);

  return toyCard;
}

function handleSubmit(event) {
  event.preventDefault();

  // build toy object for submission
  let toyObj = {};
  toyObj.name = document.querySelector('[name="name"]').value;
  toyObj.image = document.querySelector('[name="image"]').value;
  toyObj.likes = 0

  // submit new toy to the server and clear form
  submitNewToy(toyObj);
  event.target.reset();

  // add new toy to the DOM
  const cardContainer = document.querySelector('div#toy-collection');
  cardContainer.appendChild(buildToyCard(toyObj));
}

function handleLikes(toyObj, toyLikes) {
  toyObj.likes++;
  updateLikes(toyObj);
  toyLikes.innerText = toyObj.likes;
}