document.addEventListener('DOMContentLoaded', () => {
  // =============== HEADER / NAV ===============
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const successMessage = document.getElementById('successMessage');

  // Contact form for "Contact Us"
  const contactForm = document.getElementById('contactForm');

  // Toggles the mobile menu
  const toggleMenu = () => {
    header.classList.toggle('menu-expanded');
    hamburger.textContent = header.classList.contains('menu-expanded') ? '✕' : '☰';
  };

  // Closes the menu
  const closeMenu = () => {
    header.classList.remove('menu-expanded');
    hamburger.textContent = '☰';
  };

  // Smooth scroll to a specific section
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  // Event listener for toggling the hamburger menu
  hamburger.addEventListener('click', toggleMenu);

  // Closes the menu whenever the user scrolls
  window.addEventListener('scroll', closeMenu);

  // Handle contact form submission using Fetch API
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            successMessage.textContent = 'Message sent successfully!';
            contactForm.reset();
          } else {
            successMessage.textContent = 'Failed to send message. Please try again.';
          }
        })
        .catch(() => {
          successMessage.textContent = 'Failed to send message. Please try again.';
        });
    });
  }

  // Expose scrollToSection and closeMenu to global scope (if used inline in HTML)
  window.scrollToSection = scrollToSection;
  window.closeMenu = closeMenu;


  // =============== REVIEWS LOGIC ===============
  const reviewsContainer = document.getElementById('reviewsContainer');
  const writeReviewBtn = document.getElementById('writeReviewBtn');
  const reviewFormContainer = document.getElementById('reviewFormContainer');
  const reviewForm = document.getElementById('reviewForm');
  const reviewMessage = document.getElementById('reviewMessage');
  const seeMoreBtn = document.getElementById('seeMoreBtn');

  // Store reviews in localStorage (for demo)
  // Data structure: { id, name, role, rating, text, date }
  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

  // For chunked display
  let currentIndex = 0;
  const chunkSize = 3;

  // Show or hide the review form
  writeReviewBtn.addEventListener('click', () => {
    // Toggle form visibility
    reviewFormContainer.style.display =
      reviewFormContainer.style.display === 'block' ? 'none' : 'block';
  });

  // Convert rating (number) to star symbols
  function getStars(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '⭐';
    }
    return stars;
  }

  // Sort reviews by date desc
  function sortReviewsByDateDesc(arr) {
    return arr.sort((a, b) => b.date - a.date);
  }

  // Render reviews in chunks of 3
  function renderReviews() {
    // Clear container
    reviewsContainer.innerHTML = '';

    // Sort by date desc
    const sorted = sortReviewsByDateDesc([...reviews]);

    // Slice the portion we want to show
    const sliced = sorted.slice(0, currentIndex);

    if (sliced.length === 0) {
      // No reviews to show
      reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to write one!</p>';
      seeMoreBtn.style.display = 'none';
      return;
    }

    // Build the HTML for each review
    sliced.forEach((rev) => {
      const card = document.createElement('div');
      card.classList.add('review-card');

      card.innerHTML = `
        <div class="review-header">
          <div>
            <span class="review-name">${rev.name}</span>
            <span class="review-role">(${rev.role})</span>
          </div>
          <span class="review-rating">${getStars(rev.rating)}</span>
        </div>
        <p>${rev.text}</p>
      `;
      reviewsContainer.appendChild(card);
    });

    // If we have more reviews to show, keep seeMoreBtn visible
    if (currentIndex < sorted.length) {
      seeMoreBtn.style.display = 'inline-block';
    } else {
      seeMoreBtn.style.display = 'none';
    }
  }

  // "See More" button to load the next 3 reviews
  seeMoreBtn.addEventListener('click', () => {
    currentIndex += chunkSize;
    renderReviews();
  });

  // Initial load: show 3 reviews if available
  if (reviews.length > 0) {
    currentIndex = chunkSize;
  } else {
    currentIndex = 0;
  }
  renderReviews();

  // Handle new review submission
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reviewerName').value.trim();
    const role = document.getElementById('reviewerRole').value;
    const text = document.getElementById('reviewText').value.trim();
    const ratingInputs = document.querySelectorAll('input[name="reviewRating"]');
    let ratingValue = 0;
    for (const input of ratingInputs) {
      if (input.checked) {
        ratingValue = parseInt(input.value, 10);
        break;
      }
    }

    if (!name || !text || ratingValue === 0) {
      reviewMessage.textContent = 'Please fill out all fields and select a rating.';
      return;
    }

    // Create new review object
    const newReview = {
      id: Date.now(),
      name,
      role,
      rating: ratingValue,
      text,
      date: Date.now() // numeric timestamp
    };

    // Push to array and save to localStorage
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Reset form
    reviewForm.reset();
    reviewMessage.textContent = 'Thanks! Your review has been submitted.';

    // Show newest 3 again
    currentIndex = chunkSize;
    renderReviews();
  });


  // =============== FAQ COLLAPSIBLE LOGIC ===============
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const faqItem = toggleBtn.closest('.faq-item');
      faqItem.classList.toggle('open');

      // Change the button text from '+' to '-' or vice versa
      toggleBtn.textContent = toggleBtn.textContent === '+' ? '–' : '+';
    });
  });
});
