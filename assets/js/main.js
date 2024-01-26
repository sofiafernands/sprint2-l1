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
    const data = await response.json();
    const posts = data.posts;
    hideLoader();
    if (!Array.isArray(posts)) {
      throw new Error('Data is not an array');
    }
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

async function fetchPostDetail(id) {
  try {
    showLoader();
    const response = await fetch(`${urls.posts}/${id}`);
    const postDetail = await response.json();
    hideLoader();
    return postDetail;
  } catch (error) {
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
    const postDetail = await fetchPostDetail(post.id);
    showPostDetail(postDetail);
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

function tiempoTranscurrido(fechaCreacion) {
  const ahora = new Date();
  const fechaPost = new Date(fechaCreacion);
  const segundos = Math.floor((ahora - fechaPost) / 1000);

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
    const intervalo = Math.floor(segundos / intervalos[i].segundos);
    if (intervalo >= 1) {
      return `${intervalo} ${intervalos[i].nombre}${intervalo > 1 ? 's' : ''}`;
    }
  }
}

backButton.addEventListener('click', async () => {
  try {
    const posts = await fetchPosts();
    showPosts(posts);
  } catch (error) {
    console.error('Error showing posts:', error);
  }
});

fetchPosts().then(showPosts);