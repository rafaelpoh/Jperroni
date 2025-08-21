document.addEventListener("DOMContentLoaded", function() {
    const mainContent = document.getElementById("main-content");

    const loadContent = (url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                mainContent.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading content:", error);
                mainContent.innerHTML = "<h1>Página não encontrada</h1><p>A página que você tentou acessar não foi encontrada.</p>";
            });
    };

    const getPageFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        let page = params.get('page');
        if (!page) {
            // If no 'page' parameter, check if it's index.html or root
            const path = window.location.pathname;
            const pathSegments = path.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];

            if (lastSegment === '' || lastSegment === 'index.html') {
                page = 'home'; // Default page
            } else {
                // Fallback for direct access to partials (e.g., /home.html)
                page = lastSegment.replace('.html', '');
            }
        }
        return `${page}.html`;
    }

    document.querySelectorAll(".menu a.link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const fullUrl = this.getAttribute("href"); // e.g., index.html?page=home
            const urlObj = new URL(fullUrl, window.location.origin);
            const pageName = urlObj.searchParams.get('page'); // e.g., home

            history.pushState({ page: pageName }, "", fullUrl);
            loadContent(`${pageName}.html`);
        });
    });

    window.addEventListener("popstate", function(event) {
        const page = getPageFromUrl();
        loadContent(page);
    });

    const initialPage = getPageFromUrl();
    loadContent(initialPage);
});