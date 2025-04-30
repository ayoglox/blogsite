function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const titleInput = document.getElementById('title');
    const textInput = document.getElementById('text');
    const imageUrlInput = document.getElementById('image-url');

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.body.classList.add('dark-mode');

    if (postId) {
        const post = posts.find(p => p.id == postId);
        if (post) {
            titleInput.value = post.title;
            textInput.value = post.text;
            imageUrlInput.value = post.imageUrl || '';
        }
    }

    document.getElementById('submit-btn').addEventListener('click', () => {
        const title = titleInput.value.trim();
        const text = textInput.value.trim();
        const imageUrl = imageUrlInput.value.trim();

        if (!title || !text) {
            alert('Заголовок и текст обязательны.');
            return;
        }

        if (postId) {
            const index = posts.findIndex(p => p.id == postId);
            if (index !== -1) posts[index] = { id: Number(postId), title, text, imageUrl };
        } else {
            posts.push({ id: Date.now(), title, text, imageUrl });
        }

        localStorage.setItem('posts', JSON.stringify(posts));
        window.location.href = 'index.html';
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});