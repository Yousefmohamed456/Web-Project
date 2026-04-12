
        window.onload = function () {
            let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
            let table = document.getElementById("borrowedTable");

            table.innerHTML = "";

            borrowed.forEach(book => {
                table.innerHTML += `
            <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.user}</td>
            <td>${book.date}</td>
            <td>--</td>
            </tr>
        `;
            });
        };
        
        

