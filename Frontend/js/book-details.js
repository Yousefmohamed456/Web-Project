 
function showToast(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

 
const categoryIcons = {
  'Programming':      '💻',
  'Computer Science': '🔢',
  'Fantasy':          '🧙',
  'Technology':       '⚙️',
  'Science':          '🔬',
  'History':          '📜',
  'Literature':       '📖',
  'Other':            '📚',
};

const categoryClass = {
  'Programming':      'cat-programming',
  'Computer Science': 'cat-cs',
  'Fantasy':          'cat-fantasy',
  'Technology':       'cat-technology',
};

 
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('book-container');

  // Get selected book ID
  const selectedId = localStorage.getItem('selectedBookId');
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');

  if (!selectedId) {
    showNotFound(container);
    return;
  }

  const book = books.find(b => String(b.id) === String(selectedId));

  if (!book) {
    showNotFound(container);
    return;
  }

  // Check if borrowed
  const isBorrowed = borrowedBooks.some(b => String(b.id) === String(book.id));
  const isAvailable = !isBorrowed;

  const icon     = categoryIcons[book.category] || '📚';
  const catClass = categoryClass[book.category]  || 'cat-cs';

  const statusHTML = isAvailable
    ? '<span class="status-badge status-available">✔ Available</span>'
    : '<span class="status-badge status-unavailable">✖ Not Available</span>';

  const borrowBtn = isAvailable
    ? `<button class="btn-borrow" id="borrow-btn">📖 Borrow Book</button>`
    : `<button class="btn-borrow" disabled>Not Available</button>`;

  // Render card
  container.innerHTML = `
    <div class="book-card${isAvailable ? '' : ' unavailable'}">

      <div class="book-header">
        <div class="book-icon">${icon}</div>
        <div>
          <div class="book-title">${book.title}</div>
          <div class="book-author">By <span>${book.author}</span></div>
        </div>
      </div>

      <hr class="divider" />

      <div class="book-meta">
        <div class="meta-row">
          <span class="meta-label">Book ID</span>
          <span>${book.id}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Category</span>
          <span class="card-category ${catClass}">◈ ${book.category}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Status</span>
          ${statusHTML}
        </div>
      </div>

      <div class="book-description">
        <h4>Description</h4>
        <p>${book.description || 'No description available.'}</p>
      </div>

      <div class="book-actions">
        ${borrowBtn}
        <a href="user-available-books.html" class="btn-back">← Back to Books</a>
      </div>

    </div>
  `;

  // ── Borrow Button Logic ──
  const borrowBtn_el = document.getElementById('borrow-btn');
  if (borrowBtn_el) {
    borrowBtn_el.addEventListener('click', () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (!currentUser) {
        showToast('You must be logged in to borrow a book.', 'error');
        return;
      }

      // Add book to borrowedBooks
      const updatedBorrowed = [...borrowedBooks, { id: book.id, title: book.title }];
      localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowed));

      showToast(`"${book.title}" borrowed successfully!`, 'success');

      // Update UI
      setTimeout(() => {
        window.location.href = 'user-available-books.html';
      }, 1800);
    });
  }
});

// ── Not Found State ─-------------──────────────────────────────────────── 

function showNotFound(container) {
  container.innerHTML = `
    <div class="not-found">
      <h2>📚 Book not found</h2>
      <p>The book you're looking for doesn't exist or was removed.</p>
      <a href="user-available-books.html">← Back to Books</a>
    </div>
  `;
}
