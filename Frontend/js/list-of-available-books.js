    window.onload = function () {

    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    let rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        let id = row.children[0].innerText;
        let title = row.children[1].innerText;
        let author = row.children[2].innerText;
        let statusCell = row.children[4];
        let btn = row.querySelector(".select-btn");

        
        borrowed.forEach(book => {
        if (book.id == id) {
            btn.innerText = "Not Available";
            btn.disabled = true;
            statusCell.innerText = "Borrowed";
            statusCell.classList.remove("status-available");
            statusCell.classList.add("status-borrowed");
            row.style.opacity = "0.5";
        }
        });

        
        btn.addEventListener("click", function () {

        if (statusCell.innerText.trim() !== "Available") {
            alert("This book is already borrowed ");
            return;
        }

        borrowed.push({
            id: id,
            title: title,
            author: author,
            user: "User Name",
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));

        statusCell.innerText = "Borrowed";
        statusCell.classList.remove("status-available");
        statusCell.classList.add("status-borrowed");

        btn.innerText = "Not Available";
        btn.disabled = true;
        row.style.opacity = "0.5";

        alert("Book Borrowed Successfully ");
        });

    });

    };