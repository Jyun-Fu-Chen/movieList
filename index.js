const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
let filteredMovies = []
const movies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data){
  let rawHTML = ''

data.forEach(function(item){
//title.image
  rawHTML +=`<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title"> ${item.title}</h5>
          </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
        </div>
      </div>
    </div>`

})

dataPanel.innerHTML = rawHTML


}

function renderPaginator(amount){
const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
let rawHTML=``

for(let page = 1; page <= numberOfPages; page++){
  rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
}
paginator.innerHTML = rawHTML

}

function getMoviesByPage(page){
const data = filteredMovies.length ? filteredMovies : movies
const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}


function showMovieModal(id) {
const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
axios.get(INDEX_URL + id).then(response => {
  const data = response.data.results
  modalTitle.innerText = data.title 
  modalDate.innerText = `Release date: ` + data.release_date
  modalDescription.innerText = data.description
  modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" class="card-img-top" alt="Movie Poster">`
})
}

function addToFavorite(id){
  const list = JSON.parse(localStorage.getItem('favoriteMovies') )|| []
const movie = movies.find((movie)=>movie.id === id)

  if (list.find((movie) => movie.id === id)){
    alert('此電影已經有了！')
  }else{
     list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list)) 
  }


}

dataPanel.addEventListener('click', function onPanelClicked(event){
  if(event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  }else if(event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }
})
axios.get(INDEX_URL).then((response)=>{
  movies.push(...response.data.results)
  renderPaginator(movies.length)
renderMovieList(getMoviesByPage(1))
})

paginator.addEventListener('click',function onPaginatorClicked(event){
if(event.target.tagName !== 'A'){
return
}
  const page = Number(event.target.dataset.page)
renderMovieList(getMoviesByPage(page))


})


searchForm.addEventListener('submit',function onSearchFormSubmitted(event){
event.preventDefault()
  const keyword = searchInput.value.toLowerCase().trim()


  // if(!keyword.length){
  //   return alert('please enter a valid string')
  // }
//陣列操作三寶：map, filter, reduce
filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

if(filteredMovies.length === 0){
  return alert('Cannot find movie with keyword: ' + keyword)
}

// for(const movie of movies){
//   if(movie.title.toLowerCase().includes(keyword))
//   filteredMovies.push(movie)
// }
renderPaginator(filteredMovies.length)
renderMovieList(getMoviesByPage(1))
})
