// import axios from "axios";
const axios = require('axios').default;

const refs = {
form: document.querySelector('.search-form'),
galleryEl: document.querySelector('.gallery'),
};
refs.form[0].value = 'cat';
refs.form.addEventListener('submit', onSearch)

async function onSearch(e){
    e.preventDefault();
    // e.currentTarget.elements.searchQuery.value = 'cat';
    const searchQuery = e.currentTarget.elements.searchQuery.value;
    const answer = await getAnswer(searchQuery);
    const gallery = await createGallery(answer);
    refs.galleryEl.insertAdjacentHTML("beforeend", gallery);

}

async function getAnswer(searchQuery) {
    const KEY = '28160645-02600786ca706ffa5b60b520e';
    const url = `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
  
    try {
    const response = await axios.get(url);
    return response.data.hits;

  } catch (error) {
    console.error(error);
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