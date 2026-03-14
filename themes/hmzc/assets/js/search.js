document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-query');
    const searchResults = document.getElementById('search-results');
    const blogList = document.getElementById('blog-list');

    if (!searchInput || !searchResults) {
        return;
    }

    let searchData = [];

    // Fetch the search index
    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            searchData = data;
        })
        .catch(error => console.error('Error fetching search index:', error));

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length === 0) {
            searchResults.style.display = 'none';
            if (blogList) blogList.style.display = 'block';
            return;
        }

        if (blogList) blogList.style.display = 'none';
        searchResults.style.display = 'block';

        const results = searchData.filter(item => {
            return item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
                (item.categories && item.categories.some(cat => cat.toLowerCase().includes(query)));
        });

        if (results.length > 0) {
            results.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.innerHTML = `
                    <h3><a href="${item.permalink}">${item.title}</a></h3>
                    <p>${item.summary}</p>
                    <div class="meta">
                        ${item.categories ? `<span class="categories">Categories: ${item.categories.join(', ')}</span>` : ''}
                        ${item.tags ? `<span class="tags">Tags: ${item.tags.join(', ')}</span>` : ''}
                    </div>
                `;
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.innerHTML = '<p>No results found.</p>';
        }
    });
});
