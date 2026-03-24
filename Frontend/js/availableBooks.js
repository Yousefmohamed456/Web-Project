const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');
const cardIds = document.querySelectorAll('.card-id');
const cartBtns = document.querySelectorAll('.cart-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // show / hide cards
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

