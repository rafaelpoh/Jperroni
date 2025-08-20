document.addEventListener("DOMContentLoaded", function() {
    fetch("../header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
        });

    fetch("../menu.html")
        .then(response => response.text())
        .then(data => {
            const header = document.querySelector("header");
            if (header) {
                header.insertAdjacentHTML("afterend", data);
            } else {
                document.body.insertAdjacentHTML("afterbegin", data);
            }
        });
});