import { urls } from '../js/constant.js';

const postsSection = document.querySelector('.posts');
const detailSection = document.querySelector('.detail-post');
const backButton = document.querySelector('.back-button');
const loader = document.querySelector('.loader-container');

//showLoader y hideLoader son funciones para mostrar y ocultar el loader
function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}
//funcion asincorina para hacer el fetch de los posts(metodo get por default), si la respuesta es exitosa, se convierte la respuesta en JSON.
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
//obtiene el detalle de cada post, se utiliza la clave específica para cada publicación(en este caso se utiliza el id)
async function fetchPostDetail(id) {
  try {
    showLoader();
    const response = await fetch(urls[id]); // Utiliza la clave específica para cada publicacion(id del post)
    if (!response.ok) throw new Error('Network response was not ok');
    const postDetail = await response.json();
    hideLoader();
    return postDetail;
  } catch (error) {
    hideLoader();
    console.error('Error fetching post detail:', error);
  }
}
//crea el elemento HTML para cada post, crea un elemento post en el DOM utilizando los datos de un post. 
//esta funcion tambien agrega un evento click al elemento post, para mostrar el detalle del post.(line 64)
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
        <p class="post-date">${timeElapsed(post.date)}</p>

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
//Esta función toma una lista de posts, limpia la sección de posts, crea un nuevo 
//elemento de post para cada post en la lista utilizando createPostElement y lo agrega a la sección de posts.
// Luego muestra la sección de posts y oculta la sección de detalles.
function showPosts(posts) {
  postsSection.innerHTML = '';
  posts.forEach(post => {
    const postElement = createPostElement(post);
    postsSection.appendChild(postElement);
  });
  postsSection.classList.remove('hidden');
  detailSection.classList.add('hidden');
}
// Esta función toma un post y lo muestra en la sección de detalles.
function showPostDetail(postDetail) {
  detailSection.querySelector('.detail-post-header h2').textContent = postDetail.title;
  detailSection.querySelector('.detail-post-content').textContent = postDetail.content;
  detailSection.querySelector('.detail-post-author').textContent = postDetail.author;
  postsSection.classList.add('hidden');
  detailSection.classList.remove('hidden');
}

//funcion para calcular el tiempo transcurrido desde la creacion del post
function timeElapsed(fechaCreacion) {
  const now = new Date();
  const fechaPost = new Date(fechaCreacion);
  let segundosTranscurridos = Math.floor((now - fechaPost) / 1000);

  const intervalos = [
    { nombre: 'mese', segundos: 2592000 },
    { nombre: 'día', segundos: 86400 },
  ];

  let resultado = '';

  for (let i = 0; i < intervalos.length; i++) {
    const intervalo = Math.floor(segundosTranscurridos / intervalos[i].segundos);
    if (intervalo >= 1) {
      resultado += `${intervalo} ${intervalos[i].nombre}${intervalo > 1 ? 's' : ''} `;
      segundosTranscurridos -= intervalo * intervalos[i].segundos;
    }
  }

  return resultado ? `${resultado}atrás` : 'Recién creado';
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