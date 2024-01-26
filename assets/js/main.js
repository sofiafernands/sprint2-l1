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
    hideLoader();
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function fetchPostDetail(id) {
  showLoader();
  const response = await fetch(urls[id]);
  const postDetail = await response.json();
  hideLoader();
  return postDetail;
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

    let intervalo = Math.floor(segundos / 31536000);
    if (intervalo > 1) {
        return intervalo + " años";
    }
    intervalo = Math.floor(segundos / 2592000);
    if (intervalo > 1) {
        return intervalo + " meses";
    }
    intervalo = Math.floor(segundos / 604800);
    if (intervalo > 1) {
        return intervalo + " semanas";
    }
    intervalo = Math.floor(segundos / 86400);
    if (intervalo > 1) {
        return intervalo + " días";
    }
    intervalo = Math.floor(segundos / 3600);
    if (intervalo > 1) {
        return intervalo + " horas";
    }
    intervalo = Math.floor(segundos / 60);
    if (intervalo > 1) {
        return intervalo + " minutos";
    }
    return Math.floor(segundos) + " segundos";
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