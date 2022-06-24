// Аргументи: Куди додаєм, що додаєм, перезаписуємо?(boolean)
export default function renderGallery(element, gallery, remove){
    const decision = remove || false;
    if(decision){
      element.innerHTML = gallery;
    }else{
      element.insertAdjacentHTML("beforeend", gallery);
    };
  };