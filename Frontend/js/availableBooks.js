const grid = document.querySelector('.grid');
const filterBtns = document.querySelectorAll('.filter-btn');

function loadBooks() {
  const books = JSON.parse(localStorage.getItem('books') || '[]');

  books.forEach(book => {
    if (!document.querySelector(`.card[data-id="${book.id}"]`)) {
      
      let htmlCart = `
        <div class="card" data-category="${book.category}" data-id="${book.id}">
          <div class="card-id">${book.id}</div>
          <div class="card-title">${book.title}</div>
          <div class="card-author">By <span>${book.author}</span></div>
          <span class="card-category cat-cs">◈ ${book.category}</span>
          <button class="card-btn">
            <a href="#">Edit Book</a>
          </button>
        </div>`;

      grid.innerHTML += htmlCart;
    }
  });
}
// ——— Filter ———
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

loadBooks();
