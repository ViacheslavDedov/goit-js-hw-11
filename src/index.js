import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { renderMarkup } from './render-list';
import ApiService from './api';


const apiData = new ApiService();
const gallery = new SimpleLightbox('.gallery a', {captionData: 'alt', captionDelay: 200});

const refs = {
  searchForm: document.querySelector('#search-form'),
  btnLoadMore: document.querySelector('.load-more'),
  galeryList: document.querySelector('.gallery')
}

const container = refs.galeryList; 
refs.searchForm.addEventListener('submit', renderImages);
refs.btnLoadMore.addEventListener('click', loadMore);

function renderImages(e) {
    e.preventDefault();
    refs.galeryList.innerHTML = '';
    apiData.query = e.currentTarget.elements.searchQuery.value.trim();
    apiData.resetPage();
    disable(); 
    if (!apiData.query) {
      return;
    }
     apiData.fetchImages()
       .then(({ hits, totalHits }) => {
    
      if (totalHits === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");      
      }
      if (hits.length >= totalHits && hits.length !== 0) {
        renderMarkup(hits, container);
        notDisable();
        gallery.refresh();
        Notify.warning("We're sorry, but you've reached the end of search results."); 
      }
      if (hits.length < totalHits && hits.length >= 1) {
        renderMarkup(hits, container);
        enable();
        notDisable();
        Notify.success(`Hooray! We found ${totalHits} images.`);
        gallery.refresh();
      }
    })
      .catch(() => {
          refs.galeryList.innerHTML = '';
          Notify.failure("Oops,something went wrong")
    });
    refs.searchForm.reset();
}
  

function loadMore() {
  btnLoadMoreDisable();
    
  apiData.fetchImages().then(({ hits, totalHits }) => {
      const currentPage = apiData.getCurrentPage();
      const page = Math.ceil(totalHits / apiData.getPer_page()); 
    if (currentPage >= page) {
     
      disable();
      Notify.warning("We're sorry, but you've reached the end of search results."); 
    }
    renderMarkup(hits, container);
    notDisable();
    gallery.refresh();
  
    const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
  });
}
  
function btnLoadMoreDisable() {
  refs.btnLoadMore.setAttribute('disabled', '');
  refs.btnLoadMore.textContent = 'loading...';
  };  
function notDisable() {
  refs.btnLoadMore.removeAttribute('disabled');
  refs.btnLoadMore.textContent = 'Load more';
};
function disable() {
    refs.btnLoadMore.classList.add('is-hidden');
};
function enable() {
    refs.btnLoadMore.classList.remove('is-hidden');  
};
