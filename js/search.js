document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const blogGrid = document.getElementById('blogGrid');
    const categoryContainer = document.getElementById('categoryContainer');
    const categoryBtns = document.querySelectorAll('.category-btn');

    let posts = [];
    let currentCategory = 'all';
    let searchQuery = '';

    // Fetch the index.json
    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
        })
        .catch(error => console.error('Error fetching search index:', error));

    // Search Input Listener
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterPosts();
    });

    // Category Button Listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active state
            categoryBtns.forEach(b => {
                b.classList.remove('bg-blue-500', 'text-white');
                b.classList.add('bg-white/5', 'text-gray-300', 'border', 'border-white/10');
            });

            const targetBtn = e.currentTarget;
            targetBtn.classList.remove('bg-white/5', 'text-gray-300', 'border', 'border-white/10');
            targetBtn.classList.add('bg-blue-500', 'text-white');

            currentCategory = targetBtn.getAttribute('data-category');
            filterPosts();
        });
    });

    function filterPosts() {
        const filteredPosts = posts.filter(post => {
            // Category Filter
            let categoryMatch = true;
            if (currentCategory !== 'all') {
                if (!post.categories) {
                    categoryMatch = false;
                } else {
                    const postCategories = post.categories.map(c => c.toLowerCase());
                    categoryMatch = postCategories.includes(currentCategory.toLowerCase());
                }
            }

            // Search Query Filter
            let searchMatch = true;
            if (searchQuery) {
                const title = post.title.toLowerCase();
                const content = post.content.toLowerCase();
                const summary = post.summary.toLowerCase();
                const categories = post.categories ? post.categories.join(' ').toLowerCase() : '';
                const tags = post.tags ? post.tags.join(' ').toLowerCase() : '';

                searchMatch = title.includes(searchQuery) ||
                    content.includes(searchQuery) ||
                    summary.includes(searchQuery) ||
                    categories.includes(searchQuery) ||
                    tags.includes(searchQuery);
            }

            return categoryMatch && searchMatch;
        });

        renderPosts(filteredPosts);
    }

    function renderPosts(postsToRender) {
        blogGrid.innerHTML = '';

        if (postsToRender.length === 0) {
            blogGrid.innerHTML = '<p class="text-center col-span-full dark:text-gray-400">No results found.</p>';
            return;
        }

        postsToRender.forEach(post => {
            const article = document.createElement('article');
            article.className = 'flex flex-col group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300';

            const imageSrc = post.image || '../fields.jpg';

            let categoriesHtml = '';
            if (post.categories && post.categories.length > 0) {
                post.categories.forEach(cat => {
                    let colorClass = "text-blue-500 bg-blue-500/10";
                    if (cat === "AI") colorClass = "text-[#FF6B00] bg-[#FF6B00]/10";
                    else if (cat === "Software") colorClass = "text-teal-600 bg-teal-500/10";
                    else if (cat === "Hardware") colorClass = "text-indigo-600 bg-indigo-500/10";

                    categoriesHtml += `
                        <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}">
                            ${cat}
                        </span>
                    `;
                });
            }

            // Format date
            const date = new Date(post.date);
            const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            // Truncate summary
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.summary;
            let plainSummary = tempDiv.textContent || tempDiv.innerText || '';
            if (plainSummary.length > 150) {
                plainSummary = plainSummary.substring(0, 150) + '...';
            }

            article.innerHTML = `
                <a class="block" href="${post.permalink}">
                    <img class="w-full h-48 object-cover" src="${imageSrc}" alt="${post.title}" />
                </a>

                <div class="p-4 flex flex-col flex-grow">
                    <div class="flex items-center gap-2 mb-3">
                        ${categoriesHtml}
                    </div>

                    <h3 class="text-xl font-bold text-white mb-1 leading-tight group-hover:text-blue-500 transition-colors">
                        <a href="${post.permalink}">${post.title}</a>
                    </h3>

                    <p class="text-gray-400 truncate-2lines text-sm leading-relaxed mb-2 flex-grow">${plainSummary}</p>

                    <div class="flex flex-wrap gap-2 mb-2">
                        ${post.tags ? post.tags.map(tag => `<span class="text-xs text-gray-500">#${tag}</span>`).join('') : ''}
                    </div>

                    <p class="text-xs text-gray-500 mt-auto">${formattedDate}</p>
                </div>
            `;

            blogGrid.appendChild(article);
        });
    }
});
