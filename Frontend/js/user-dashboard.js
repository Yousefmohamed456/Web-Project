// Wait for page load
document.addEventListener("DOMContentLoaded", () => {

  // ===== 1. Load current user =====
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const welcomeSection = document.querySelector("main section h2");

  if (currentUser) {
    welcomeSection.textContent = `Welcome, ${currentUser.username}!`;
  }

  // ===== 2. Logout functionality =====
  const logoutBtn = document.querySelector("header a[href='home.html']");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
  });

  // ===== 3. Borrowed books =====
  const booksList = document.querySelector("ul");

  // Example: get books from localStorage
  let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) ;

  function renderBooks(list) {
    booksList.innerHTML = "";

    if (list.length === 0) {
      booksList.innerHTML = "<li>No borrowed books yet.</li>";
      return;
    }

    list.forEach(book => {
      const li = document.createElement("li");
      li.textContent = book;
      booksList.appendChild(li);
    });
  }

  renderBooks(borrowedBooks);

  // ===== 4. Search functionality =====
  const searchInput = document.querySelector(".search input");

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = borrowedBooks.filter(book =>
      book.toLowerCase().includes(value)
    );

    renderBooks(filtered);
  });

});