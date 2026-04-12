document.addEventListener("DOMContentLoaded", function () {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  let total = books.length;
  let available = 0;
  let borrowed = 0;

  for (let i = 0; i < books.length; i++) {
    if (books[i].status === "available") {
      available++;
    } else {
      borrowed++;
    }
  }

  document.getElementById("totalBooks").textContent = total;
  document.getElementById("availableBooks").textContent = available;
  document.getElementById("borrowedBooks").textContent = borrowed;
});
