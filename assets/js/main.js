import { urls } from '../js/constant.js';

const postsSection = document.querySelector('.posts');
const detailSection = document.querySelector('.detail-post');
const backButton = document.querySelector('.back-button');
const loader = document.querySelector('.loader-container');

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

async function fetchPosts() {
  try {
    showLoader();
    const response = await fetch(urls.post);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const posts = data.posts;
    hideLoader();
    if (!Array.isArray(posts)) {
      throw new Error('Data is not an array');
    }
    return posts;
  } catch (error) {
    hideLoader();
    console.error('Error fetching posts:', error);
  }
}

async function fetchPostDetail(id) {
  try {
    showLoader();
    const response = await fetch(urls[id]); // Utiliza la clave específica para cada publicación
    if (!response.ok) throw new Error('Network response was not ok');
    const postDetail = await response.json();
    hideLoader();
    return postDetail;
  } catch (error) {
    hideLoader();
    console.error('Error fetching post detail:', error);
  }
}

function createPostElement(post) {
  const postElement = document.createElement('article');
  postElement.classList.add('post');
  postElement.innerHTML = `
    <a class="post-link" data-id="${post.id}">
      <header class="post-header">
        <h3 class="post-title">${post.title}</h3>
      </header>
      <footer class="post-footer">
        <p class="post-content">${post.content}</p>
        <p class="post-date">${tiempoTranscurrido(post.date)}</p>
      </footer>
    </a>
  `;
  postElement.querySelector('.post-link').addEventListener('click', async () => {
    try {
      const postDetail = await fetchPostDetail(post.id);
      showPostDetail(postDetail);
    } catch (error) {
      console.error('Error fetching post detail:', error);
    }
  });
  return postElement;
}


function showPosts(posts) {
  postsSection.innerHTML = '';
  posts.forEach(post => {
    const postElement = createPostElement(post);
    postsSection.appendChild(postElement);
  });
  postsSection.classList.remove('hidden');
  detailSection.classList.add('hidden');
}

function showPostDetail(postDetail) {
  detailSection.querySelector('.detail-post-header h2').textContent = postDetail.title;
  detailSection.querySelector('.detail-post-content').textContent = postDetail.content;
  detailSection.querySelector('.detail-post-author').textContent = postDetail.author;
  postsSection.classList.add('hidden');
  detailSection.classList.remove('hidden');
}

//funcion para calcular el tiempo transcurrido desde la creacion del post
function tiempoTranscurrido(fechaCreacion) {
  const ahora = new Date();
  const fechaPost = new Date(fechaCreacion);
  const segundosTranscurridos = Math.floor((ahora - fechaPost) / 1000);

  const intervalos = [
    { nombre: 'año', segundos: 31536000 },
    { nombre: 'mes', segundos: 2592000 },
    { nombre: 'semana', segundos: 604800 },
    { nombre: 'día', segundos: 86400 },
    { nombre: 'hora', segundos: 3600 },
    { nombre: 'minuto', segundos: 60 },
    { nombre: 'segundo', segundos: 1 },
  ];

  for (let i = 0; i < intervalos.length; i++) {
    const intervalo = Math.floor(segundosTranscurridos / intervalos[i].segundos);
    if (intervalo >= 1) {
      return `${intervalo} ${intervalos[i].nombre}${intervalo > 1 ? 's' : ''} atrás`;
    }
  }

  return 'Recién creado'; // Si no ha pasado ni un segundo
}

///evento click para el boton de regresar a la lista de posts)
backButton.addEventListener('click', async () => {
  try {
    const posts = await fetchPosts();
    showPosts(posts);
  } catch (error) {
    console.error('Error showing posts:', error);
  }
});
///llamado a la funcion fetchPosts
fetchPosts().then(posts => {
  if (posts) showPosts(posts);
});