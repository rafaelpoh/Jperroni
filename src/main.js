document.addEventListener("DOMContentLoaded", function() {
    const mainContent = document.getElementById("main-content");
    const menuContainer = document.getElementById("menu-container");

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
            const path = window.location.pathname;
            const pathSegments = path.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];

            if (lastSegment === '' || lastSegment === 'index.html') {
                page = 'home'; // Default page
            } else {
                page = lastSegment.replace('.html', '');
            }
        }
        return `src/partials/${page}.html`;
    }

    const setupMenuLinks = () => {
        document.querySelectorAll(".menu a.link").forEach(link => {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                const fullUrl = this.getAttribute("href");
                const urlObj = new URL(fullUrl, window.location.origin);
                const pageName = urlObj.searchParams.get('page');

                history.pushState({ page: pageName }, "", fullUrl);
                loadContent(`src/partials/${pageName}.html`);
            });
        });
    };

    const loadMenu = () => {
        fetch("menu.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                menuContainer.innerHTML = data;
                setupMenuLinks();
            })
            .catch(error => {
                console.error("Error loading menu:", error);
                menuContainer.innerHTML = "<p>Erro ao carregar o menu.</p>";
            });
    };

    window.addEventListener("popstate", function(event) {
        const page = getPageFromUrl();
        loadContent(page);
    });

    loadMenu();
    const initialPage = getPageFromUrl();
    loadContent(initialPage);
});