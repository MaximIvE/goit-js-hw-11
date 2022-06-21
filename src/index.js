// import axios from "axios";
const axios = require('axios').default;

const refs = {
form: document.querySelector('.search-form'),
buttonSearch: document.querySelector('button[type="submit"]'),
buttonMore: document.querySelector('button[type="button"]'),
galleryEl: document.querySelector('.gallery'),
};

// console.log(refs.buttonSearch);
console.dir(refs.buttonMore);

let page =1;
//це значення інпуту, що вводимо з клави
let requestInput = "cat";
// це значення інпуту під час запросу
let searchQuery=" ";

refs.form[0].value = 'cat';
// refs.buttonMore.disabled = true;
refs.buttonMore.classList.add('visually-hidden');

refs.form.addEventListener('submit', onSearch);
refs.form.addEventListener('input', selecterButton);
refs.buttonMore.addEventListener('click', onMoreSearch);

function selecterButton(e){
  refs.buttonSearch.disabled = false;
  // console.log(e.currentTarget.elements.searchQuery.value);
  requestInput = e.currentTarget.elements.searchQuery.value;
  console.log(`${searchQuery} & ${requestInput}`)
  if ((requestInput === searchQuery)&(searchQuery)){
    refs.buttonSearch.disabled = true;
    refs.buttonMore.disabled = false;
  }else{
    refs.buttonSearch.disabled = false;
    refs.buttonMore.disabled = true;
  }
};


async function onSearch(e){
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value.trim();
    if (searchQuery ===""){
      return alert('Please, enter a search query');
    };

    page = 1;
    refs.galleryEl.innerHTML = '';
    refs.buttonSearch.disabled = true;
    refs.buttonMore.disabled = false;

    refs.buttonSearch.classList.add('no-pointer');

    

    const answer = await getAnswer(searchQuery);
    const gallery = await createGallery(answer);
    refs.galleryEl.insertAdjacentHTML("beforeend", gallery);

    refs.buttonMore.classList.remove('visually-hidden');
    // refs.buttonMore.disabled = false;
    
    
};

async function onMoreSearch(e){
  const answer = await getAnswer(searchQuery);
  const gallery = await createGallery(answer);
  refs.galleryEl.insertAdjacentHTML("beforeend", gallery);
}

async function getAnswer(searchQuery) {
    const KEY = '28160645-02600786ca706ffa5b60b520e';
    const url = `https://pixabay.com/api/?`;
    const options = {
      params: {
        'key': KEY,
        'image_type': 'photo',
        'orientation': 'horizontal',
        'safesearch': 'true',
        'q': searchQuery,
        'page': page,
        'per_page': 3,
      },
    };
    console.log(page);

    try {
    const response = await axios.get(url, options);
    page = page+1;
    
    return response.data.hits;

  } catch (error) {
   alert(error.message);
  }
}

function createGallery(arr){
    return  arr.reduce((contanier, card) => {
        contanier = contanier + createOneCard(card);
        return contanier;
    }, "");
}

function createOneCard(card){
    const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = card;
    return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </div>`
};