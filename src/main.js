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
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        if (page === '' || page === 'index.html') {
            return 'home.html';
        }
        return page;
    }

    document.querySelectorAll(".menu a.link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const url = this.getAttribute("href");
            history.pushState({ path: url }, "", url);
            loadContent(url);
        });
    });

    window.addEventListener("popstate", function(event) {
        const page = getPageFromUrl();
        loadContent(page);
    });

    const initialPage = getPageFromUrl();
    loadContent(initialPage);
});