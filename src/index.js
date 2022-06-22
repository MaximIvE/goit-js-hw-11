// import axios from "axios";
const axios = require('axios').default;
import Notiflix from 'notiflix';

const refs = {
form: document.querySelector('.search-form'),
buttonSearch: document.querySelector('button[type="submit"]'),
buttonMore: document.querySelector('button[type="button"]'),
galleryEl: document.querySelector('.gallery'),
pElement: document.querySelector('.notification-text'),
};

// це початкові значення форми при перезавантаженні
refs.buttonMore.classList.add('visually-hidden');
let newQuery = "";
let searchQuery="";
let page =1;
let remove = false;

refs.form.addEventListener('submit', (e) =>{
  e.preventDefault();
  onSearch();}
  );
refs.form.addEventListener('input', selecterButton);
refs.buttonMore.addEventListener('click', onSearch);

function selecterButton(e){
  
  const valueInput = e.currentTarget.elements.searchQuery.value.trim();
  if ((page > 1)&(searchQuery === valueInput)){
    // refs.buttonSearch.disabled = true;
    refs.buttonMore.classList.remove('visually-hidden');
  }else{
    refs.buttonSearch.disabled = false;
    refs.buttonMore.classList.add('visually-hidden');
  };
};

async function onSearch(){
    
    refs.buttonSearch.disabled = true;
    refs.buttonMore.classList.add('visually-hidden');

    newQuery = refs.form.elements[0].value.trim();
    if (newQuery ===""){
      refs.buttonSearch.disabled = false;
      Notiflix.Notify.info('Enter search data, please!');
      if(page > 1){
        page = 1;
        remove = true;
        refs.pElement.classList.add('visually-hidden');
        return;
      };
      return;
    };

    if (newQuery !== searchQuery){
      searchQuery = newQuery;
      refs.pElement.classList.add('visually-hidden');

      if (page > 1){
        page =1;
        remove = true;
      };
    };

    const answer = await getAnswer(searchQuery);
    // console.log(answer);
    const totalHits = answer.totalHits;
    if (totalHits === 0){
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      refs.buttonSearch.disabled = false;
      return;
    };
    const gallery = await createGallery(answer.hits);

    if((page === 1)||remove){ 
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if(remove){
      refs.galleryEl.innerHTML = '';
      remove = false;
    };

    refs.galleryEl.insertAdjacentHTML("beforeend", gallery);

    //Тут ще перевірка на останній лист.
    const numberOfLetters = Math.ceil(totalHits / 40);
    if(numberOfLetters === page){
      refs.buttonMore.classList.add('visually-hidden');

      refs.pElement.classList.remove('visually-hidden');
      remove = true;
      return;
    }

    refs.buttonMore.classList.remove('visually-hidden');
    refs.buttonSearch.disabled = false;

    page = page+1;
};

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
        'per_page': 40,
      },
    };

    try {
    const response = await axios.get(url, options);
    
    return response.data;

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

