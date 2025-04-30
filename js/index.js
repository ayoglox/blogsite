let isAdmin = localStorage.getItem('isAdmin') === 'true';

function loadPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function displayPosts() {
    const posts = loadPosts();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = posts.length ? '' : '<p class="text-gray-400">Пока нет постов.</p>';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('bg-gray-800', 'p-4', 'rounded', 'shadow', 'transition-opacity', 'duration-500');
        postElement.innerHTML = `
            <h2 class="text-xl font-semibold">${post.title}</h2>
            <p class="text-gray-300">${truncateText(post.text, 100)}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="w-full h-48 object-cover mt-2 rounded">` : ''}
            <div class="mt-2 flex flex-wrap gap-2">
                <a href="post.html?id=${post.id}" class="text-blue-500 hover:underline">Читать далее</a>
                <div class="flex gap-2 ${isAdmin ? '' : 'hidden'}">
                    <button class="edit-btn px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm" data-id="${post.id}">Редактировать</button>
                    <button class="delete-btn px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-sm" data-id="${post.id}">Удалить</button>
                </div>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

    const addPostBtn = document.getElementById('add-post-btn');
    const logoutBtn = document.getElementById('admin-logout');
    const adminToggleBtn = document.getElementById('admin-toggle');
    if (isAdmin) {
        addPostBtn.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        adminToggleBtn.classList.add('hidden');
    } else {
        addPostBtn.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        adminToggleBtn.classList.remove('hidden');
    }
}

function toggleAdmin() {
    const password = prompt('Введите пароль админа - 123:');
    if (password === '123') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => btn.parentElement.classList.remove('hidden'));
        displayPosts();
    } else {
        alert('Неверный пароль');
    }
}

function logoutAdmin() {
    isAdmin = false;
    localStorage.setItem('isAdmin', 'false');
    document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => btn.parentElement.classList.add('hidden'));
    displayPosts();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.body.classList.add('dark-mode');
    
    displayPosts();
    
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    document.getElementById('admin-toggle').addEventListener('click', toggleAdmin);
    
    document.getElementById('admin-logout').addEventListener('click', logoutAdmin);
    
    document.getElementById('posts').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                const id = e.target.dataset.id;
                const posts = loadPosts().filter(post => post.id != id);
                savePosts(posts);
                e.target.closest('div').classList.add('opacity-0');
                setTimeout(() => displayPosts(), 500);
            }
        } else if (e.target.classList.contains('edit-btn')) {
            window.location.href = `add-edit-post.html?id=${e.target.dataset.id}`;
        }
    });
});