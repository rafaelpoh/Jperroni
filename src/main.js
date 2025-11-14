document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById("login-container");
    const mainContent = document.getElementById("main-content");
    const menuContainer = document.getElementById("menu-container");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    let isLoggedIn = false;

    function showChefeLink() {
        loginContainer.innerHTML = ''; // Clear the login form
        const chefeLink = document.createElement('a');
        chefeLink.textContent = 'Painel do Chefe';
        chefeLink.href = 'index.html?page=chefe';
        chefeLink.classList.add('link'); // Use the same class as other links for styling
        loginContainer.appendChild(chefeLink);
        setupMenuLinks(); // Re-run setup to include the new link
    }

    function login() {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            fetch("src/credentials.json")
                .then(response => response.json())
                .then(credentials => {
                    if (username === credentials.username && password === credentials.password) {
                        isLoggedIn = true;
                        showChefeLink();
                    } else {
                        loginError.textContent = "Usuário ou senha inválidos.";
                    }
                })
                .catch(error => {
                    console.error("Error loading credentials:", error);
                    loginError.textContent = "Erro ao tentar fazer login. Tente novamente mais tarde.";
                });
        });
    }

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

    const setupMenuLinks = () => {
        document.querySelectorAll(".menu a.link, .login-container a.link").forEach(link => {
            // To avoid adding multiple listeners, we can clone and replace the node
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener("click", function(event) {
                event.preventDefault();
                const fullUrl = this.getAttribute("href");
                const urlObj = new URL(fullUrl, window.location.origin);
                const pageName = urlObj.searchParams.get('page');

                history.pushState({ page: pageName }, "", fullUrl);
                loadContent(`src/partials/${pageName}.html`, pageName);
            });
        });
    };

    const loadContent = (url, pageName) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                mainContent.innerHTML = data;
                if (pageName === 'home') {
                    displayBossMessage();
                } else if (pageName === 'chefe') {
                    setupChefePage();
                }
            })
            .catch(error => {
                console.error("Error loading content:", error);
                mainContent.innerHTML = "<h1>Página não encontrada</h1><p>A página que você tentou acessar não foi encontrada.</p>";
            });
    };

    function setupChefePage() {
        const saveButton = document.getElementById('save-boss-message');
        const messageTextarea = document.getElementById('boss-message');
        const confirmation = document.getElementById('save-confirmation');

        // Load existing message
        const savedMessage = getDataFromLocalStorage('bossMessage');
        if (savedMessage) {
            messageTextarea.value = savedMessage;
        }

        saveButton.addEventListener('click', function() {
            saveDataToLocalStorage('bossMessage', messageTextarea.value);
            confirmation.style.display = 'block';
            setTimeout(() => {
                confirmation.style.display = 'none';
            }, 3000);
        });
    }

    function displayBossMessage() {
        const bossMessage = getDataFromLocalStorage('bossMessage');
        if (bossMessage && bossMessage.trim() !== '') {
            const existingParagraph = document.querySelector('#main-content p');
            if (existingParagraph) {
                const messageElement = document.createElement('p');
                messageElement.textContent = bossMessage;
                existingParagraph.parentNode.insertBefore(messageElement, existingParagraph.nextSibling);
            }
        }
    }

    /**
     * Saves data to localStorage. This is a generic function that can be reused.
     * @param {string} key The key to save the data under.
     * @param {string} value The value to save.
     */
    function saveDataToLocalStorage(key, value) {
        // Using localStorage as there is no backend.
        // This data will only be visible to the user who saves it, on this browser.
        localStorage.setItem(key, value);
    }

    /**
     * Retrieves data from localStorage.
     * @param {string} key The key of the data to retrieve.
     * @returns {string|null} The retrieved data or null if not found.
     */
    function getDataFromLocalStorage(key) {
        return localStorage.getItem(key);
    }

    function getPageNameFromUrl() {
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
        return page;
    }

    function initializeApp() {
        window.addEventListener("popstate", function(event) {
            const pageName = getPageNameFromUrl();
            loadContent(`src/partials/${pageName}.html`, pageName);
        });

        const initialPageName = getPageNameFromUrl();
        loadContent(`src/partials/${initialPageName}.html`, initialPageName);
    }

    loadMenu();
    login();
    initializeApp();
});