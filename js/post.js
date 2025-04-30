let isAdmin = localStorage.getItem('isAdmin') === 'true';

function loadPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const posts = loadPosts();
    const post = posts.find(p => p.id == postId);
    const postContent = document.getElementById('post-content');

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.body.classList.add('dark-mode');

    if (post) {
        postContent.innerHTML = `
            <h1 class="text-2xl font-bold mb-2">${post.title}</h1>
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="w-full h-64 object-cover mb-4 rounded">` : ''}
            <p class="text-gray-300">${post.text}</p>
            <div class="mt-4 space-x-2 ${isAdmin ? '' : 'hidden'}">
                <a href="add-edit-post.html?id=${post.id}" class="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700">Редактировать</a>
                <button id="delete-btn" class="px-2 py-1 bg-red-600 rounded hover:bg-red-700">Удалить</button>
            </div>
        `;
        
        document.getElementById('delete-btn')?.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                const updatedPosts = posts.filter(p => p.id != postId);
                localStorage.setItem('posts', JSON.stringify(updatedPosts));
                window.location.href = 'index.html';
            }
        });
    } else {
        postContent.innerHTML = '<p class="text-gray-400">Пост не найден.</p>';
    }

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});