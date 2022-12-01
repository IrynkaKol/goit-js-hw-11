import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const searchQuery = document.querySelector('input');
const loadBtn = document.querySelector('.load-more');

const gallery = document.querySelector('.gallery');

const BASE_URL = 'https://pixabay.com/api/';
const API = '31662888-485c328889ccd569f357119c9';

let pageToFetch = 1;
let wordToFetch = '';
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

loadBtn.style.display = 'none';

async function fetchEvents(keyWord, searchPage) {
  const searchParams = new URLSearchParams({
    key: API,
    q: keyWord,
    per_page: 100,
    page: searchPage,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
  //console.log(searchParams.toString());
  try {
    const resp = await fetch(`${BASE_URL}?${searchParams}`);
    
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    return await resp.json();
  } catch (error) {
    console.error(error);
  }

  /* if (!resp.ok) {
        throw new Error(resp.status);
      }*/
} //робе запит

function getEvents(keyWord, searchPage) {
  fetchEvents(keyWord, searchPage).then(resp => {
    //console.log(resp) //дивимось як достукатись до events
    const events = resp.hits;
    renderEvents(events); //викликаємо розмітку
    //console.log(resp.totalHits);
    //console.log(events);
    pageToFetch += 1;
    let page = Math.ceil(resp.totalHits / events.length);
    if (events.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtn.style.display = 'none';
    } else {
      Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      loadBtn.style.display = 'flex';
    }
    if (keyWord === ' ') {
      loadBtn.classList.add('load-more');
    }
    //if (resp.totalHits / events.length > 1) {}

    if (pageToFetch === page) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      loadBtn.style.display = 'none';
    }
  });
} //отримали подію
//getEvents('cat', // був для тесту

loadBtn.addEventListener('click', () => {
  getEvents(wordToFetch, pageToFetch);
});

function renderEvents(events) {
  const markup = events
    .map(event => {
      //console.log(event)
      return `
        <div class="photo-card galary_item">
        
  <a class = "galery_link" href = "${event.largeImageURL}">
  <img class = "galary_image" src="${event.webformatURL}"
  data-source = "${event.largeImageURL}"
  alt="${events.tags}" loading="lazy" >
  </img>
  </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${event.likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${event.views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${event.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${event.downloads}
    </p>
      </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  gallerySimpleLightbox.refresh();
} //малюємо розмітку. в якості параметрів приймає масив подій

form.addEventListener('submit', onClick);

function onClick(event) {
  event.preventDefault(); // блокуємо перезавантаження сторінки
  wordToFetch = event.target.elements.searchQuery.value; //перевизначаємо wordToFetch, в якому event.target_ який э  формою, elements це об'єкти, а в цього обєкта є властивості, які відповідають значення атрибуту name нашого inputa в HTML,
  pageToFetch = 1;
  gallery.innerHTML = '';

  getEvents(wordToFetch, pageToFetch);
}
