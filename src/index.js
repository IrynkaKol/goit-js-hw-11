import axios from 'axios';

const form = document.querySelector(".search-form");
const searchQuery = document.querySelector("input");
const loadBtn = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery")

const BASE_URL = "https://pixabay.com/api/";
const API = "31662888-485c328889ccd569f357119c9"

let pageToFetch = 1; 
let wordToFetch = "";

function fetchEvents(keyWord, searchPage) {
    const searchParams = new URLSearchParams({
        key: API,
        q: keyWord,
        per_page: 40,
        page: searchPage,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
    })
    //console.log(searchParams.toString()); 
return fetch(`${BASE_URL}?${searchParams}`)
.then((resp) => {
    if (!resp.ok) {
        throw new Error(resp.status);
      }
      return resp.json();
    })
    .catch((error) => {
        console.error(error)
    })
}  //робе запит

function getEvents(keyWord, searchPage){
    fetchEvents(keyWord, searchPage)
    .then(resp => {
    console.log(resp) //дивимось як достукатись до events
    const events = resp.hits
    renderEvents(events) //викликаємо розмітку
    //console.log(events)
    pageToFetch += 1;
    if (resp.totalHits > 1) {
    loadBtn.classList.remove("load-more")
    }
    if (pageToFetch === resp.totalHits) {
        loadBtn.classList.add("load-more")
    }

});
} //отримали подію
//getEvents('cat', // був для тесту
loadBtn.addEventListener("click", () => {
    getEvents(wordToFetch, pageToFetch)
})


function renderEvents(events) {
    const markup = events.map((event) => {
        //console.log(event)
        return `
        <div class="photo-card galary_item">
        <div class="galary__foto>
  <a class = "galery_link" href = "${event.largeImageURL}">
  <img class = "galary_image" src="${event.webformatURL}"
  data-source = "${event.largeImageURL}"
  alt="${events.tags}" loading="lazy" >
  </img>
  </a>
  </div>
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
    .join("");
    gallery.insertAdjacentHTML("beforeend", markup)

} //малюємо розмітку. в якості параметрів приймає масив подій

form.addEventListener("submit", onClick);

function onClick (event) {
    event.preventDefault(); // блокуємо перезавантаження сторінки
    wordToFetch = event.target.elements.searchQuery.value; //перевизначаємо wordToFetch, в якому event.target_ який э  формою, elements це об'єкти, а в цього обєкта є властивості, які відповідають значення атрибуту name нашого inputa в HTML, 
    pageToFetch = 1;
    gallery.innerHTML = '';

    getEvents(wordToFetch, pageToFetch)
}

