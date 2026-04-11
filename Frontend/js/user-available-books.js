const grid = document.getElementById('books-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Category icon map
const categoryIcons = {
  'Programming':    '💻',
  'Computer Science': '🔢',
  'Fantasy':        '🧙',
  'Technology':     '⚙️',
  'Science':        '🔬',
  'History':        '📜',
  'Literature':     '📖',
  'Other':          '📚',
};

// Category CSS class map
const categoryClass = {
  'Programming':      'cat-programming',
  'Computer Science': 'cat-cs',
  'Fantasy':          'cat-fantasy',
  'Technology':       'cat-technology',
};

function loadBooks() {
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');

  grid.innerHTML = '';

  if (books.length === 0) {
    grid.innerHTML = '<div class="empty-state">No books available at the moment.</div>';
    return;
  }

  books.forEach(book => {
    // Check if book is borrowed
    const isBorrowed = borrowedBooks.some(b => b.id === book.id);
    const isAvailable = !isBorrowed;

    const icon      = categoryIcons[book.category] || '📚';
    const catClass  = categoryClass[book.category]  || 'cat-cs';

    const statusLabel = isAvailable
      ? '<span class="card-status status-available">✔ Available</span>'
      : '<span class="card-status status-unavailable">✖ Not Available</span>';

    const btnHTML = isAvailable
      ? `<button class="card-btn" data-id="${book.id}">View Details</button>`
      : `<button class="card-btn" disabled>Not Available</button>`;

    const card = document.createElement('div');
    card.className = `card${isAvailable ? '' : ' unavailable'}`;
    card.dataset.category = book.category;
    card.dataset.id = book.id;

    card.innerHTML = `
      <div class="card-id">${book.id}</div>
      <div class="card-icon">${icon}</div>
      <div class="card-title">${book.title}</div>
      <div class="card-author">By <span>${book.author}</span></div>
      <span class="card-category ${catClass}">◈ ${book.category}</span>
      ${statusLabel}
      ${btnHTML}
    `;

    grid.appendChild(card);
  });

  // Attach click events to "View Details" buttons
  grid.querySelectorAll('.card-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.dataset.id;
      localStorage.setItem('selectedBookId', bookId);
      window.location.href = 'book-details.html';
    });
  });
}

// ── Filter ──
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
