
const BASE_URL = 'http://localhost:3000/posts';

document.addEventListener('DOMContentLoaded', main);

function main() {
displayPosts();
addNewPostListener();
}

function displayPosts() {
fetch(BASE_URL)
.then(res => res.json())
.then(posts => {
const postList = document.getElementById('post-list');
postList.innerHTML = '';
posts.forEach(post => {
const div = document.createElement('div');
div.textContent = post.title;
div.addEventListener('click', () => handlePostClick(post.id));
postList.appendChild(div);
});
});
}

function handlePostClick(postId) {
fetch(`${BASE_URL}/${postId}`)
.then(res => res.json())
.then(post => {
const postDetail = document.getElementById('post-detail');
postDetail.innerHTML = `
<h2>${post.title}</h2>
<p><strong>By:</strong> ${post.author}</p>
<p>${post.content}</p>
<button onclick="showEditForm(${post.id})">Edit</button>
<button onclick="deletePost(${post.id})">Delete</button>
`;
postDetail.dataset.id = post.id;
});
}

function addNewPostListener() {
const form = document.getElementById('new-post-form');
form.addEventListener('submit', e => {
e.preventDefault();
const newPost = {
title: form.title.value,
content: form.content.value,
author: form.author.value
};
fetch(BASE_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(newPost)
})
.then(res => res.json())
.then(() => {
form.reset();
displayPosts();
});
});
}

function showEditForm(id) {
fetch(`${BASE_URL}/${id}`)
.then(res => res.json())
.then(post => {
const form = document.getElementById('edit-post-form');
form.classList.remove('hidden');
form.dataset.id = id;
document.getElementById('edit-title').value = post.title;
document.getElementById('edit-content').value = post.content;
});

document.getElementById('cancel-edit').onclick = () => {
document.getElementById('edit-post-form').classList.add('hidden');
};

document.getElementById('edit-post-form').onsubmit = e => {
e.preventDefault();
const updatedPost = {
title: document.getElementById('edit-title').value,
content: document.getElementById('edit-content').value
};
fetch(`${BASE_URL}/${id}`, {
method: 'PATCH',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(updatedPost)
})
.then(() => {
document.getElementById('edit-post-form').classList.add('hidden');
displayPosts();
handlePostClick(id);
});
};
}

function deletePost(id) {
fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
.then(() => {
document.getElementById('post-detail').innerHTML = '';
displayPosts();
});
}
