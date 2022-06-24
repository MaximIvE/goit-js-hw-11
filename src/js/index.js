import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ImgApiService from './img-servise';
import {createGallery} from './create-markup';
import renderGallery from './rendergallery';

const refs = {
  form: document.querySelector('.search-form'),
  buttonSearch: document.querySelector('button[type="submit"]'),
  buttonMore: document.querySelector('button[type="button"]'),
  galleryEl: document.querySelector('.gallery'),
  pElement: document.querySelector('.notification-text'),
  };

//Створюємо екземпляри класів пошукового сервіса та галереї зображень
const imgService = new ImgApiService();
let galleryImg = new SimpleLightbox('.gallery a');

// це початкові значення другої кнопочки 
refs.buttonMore.classList.add('visually-hidden');

//події для кнопок
refs.form.addEventListener('submit', (e) =>{
  e.preventDefault();
  onSearch();}
  );
refs.buttonMore.addEventListener('click', onSearch);

//сама головна функція тут. Запускає все інше
async function onSearch(){
    const searchQuery = refs.form.elements[0].value.trim();
    
    // Якщо запит пустий, або це остання сторінка при такому ж запросі, то код далі не виконується
    if (searchQuery === ''){
      Notiflix.Notify.info('Enter search data, please!');
      return;
    };

    if ((searchQuery === imgService.query)&(imgService.status === "end")){
      return;
    };

    // щоб не натискали на кнопки під час запиту та рендеру
    refs.buttonSearch.disabled = true;
    refs.buttonMore.classList.add('visually-hidden');

    //Звернення до апішки
    const answer = await imgService.fetchImages(searchQuery);
    const totalHits = answer.totalHits;

    //Якщо інформації по запиту не знайдено, виходим
    if (totalHits === 0){
      useByttons();
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };

    //якщо це перша сторінка з таким запитом, сповіщуємо
    if(imgService.isnewquerty){ 
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    };
    
    const gallery = await createGallery(answer.hits);
    renderGallery(refs.galleryEl, gallery, imgService.isnewquerty);
    galleryImg.refresh();
    
    useByttons();
};

function useByttons(){
  refs.buttonSearch.disabled = false;
    //Якщо лист останній - замість кнопки 2 показати надпис
    //Якщо лист не останній, замість надпису показати кнопку
  if (imgService.status === "end"){
    refs.buttonMore.classList.add('visually-hidden');
    refs.pElement.classList.remove('visually-hidden');
    }else{
      refs.buttonMore.classList.remove('visually-hidden');
    refs.pElement.classList.add('visually-hidden');
    };
};