/* =============================================
   ONLINE LIBRARY PORTAL — edit-book.js
   Handles: form validation, nav active state,
   delete confirmation modal, toast notifications
   ============================================= */

"use strict";

/* ── Helpers ── */
const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);

/* ──────────────────────────────────────────────
   Toast Notification System
   ────────────────────────────────────────────── */
function showToast(message, type = "info", duration = 3500) {
  let container = qs(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hiding");
    toast.addEventListener("animationend", () => toast.remove());
  }, duration);
}

/* ──────────────────────────────────────────────
   Field Validation Utilities
   ────────────────────────────────────────────── */
function setFieldState(input, errorEl, isValid, message = "") {
  input.classList.toggle("input-error", !isValid);
  input.classList.toggle("input-ok",    isValid);
  if (errorEl) {
    errorEl.textContent = isValid ? "" : message;
    errorEl.classList.toggle("visible", !isValid);
  }
  return isValid;
}

function validateRequired(input, errorEl, fieldName) {
  const val = input.value.trim();
  return setFieldState(input, errorEl, val !== "", `${fieldName} is required.`);
}

function validateMinLength(input, errorEl, fieldName, min) {
  const val = input.value.trim();
  if (val === "") return setFieldState(input, errorEl, false, `${fieldName} is required.`);
  return setFieldState(input, errorEl, val.length >= min,
    `${fieldName} must be at least ${min} characters.`);
}

/* ──────────────────────────────────────────────
   Active Navigation Highlight
   ────────────────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header nav ul li a").forEach(link => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === page || href.endsWith(page));
  });
}

/* ──────────────────────────────────────────────
   Delete Confirmation Modal
   ────────────────────────────────────────────── */
function initDeleteModal() {
  // Build modal if it doesn't exist
  if (!qs(".modal-overlay")) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "deleteModal";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <h3 id="modalTitle">⚠️ Confirm Deletion</h3>
        <p>Are you sure you want to delete this book? This action is <strong>permanent</strong> and cannot be undone.</p>
        <div class="modal-buttons">
          <button class="btn btn-ghost" id="cancelDelete">Cancel</button>
          <button class="btn btn-danger" id="confirmDelete">Yes, Delete Book</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  const overlay       = $("deleteModal");
  const cancelBtn     = $("cancelDelete");
  const confirmBtn    = $("confirmDelete");

  // Find the delete form/button
  const deleteSection = qs("section:last-of-type") || qs(".delete-card");
  const deleteForm    = deleteSection?.querySelector("form");

  if (deleteForm) {
    deleteForm.addEventListener("submit", e => {
      e.preventDefault();
      overlay.classList.add("open");
    });
  }

  // Also hook standalone delete button (no form wrapper)
  const standaloneDel = qs(".btn-danger[data-action='delete']");
  if (standaloneDel) {
    standaloneDel.addEventListener("click", () => overlay.classList.add("open"));
  }

  cancelBtn?.addEventListener("click", () => overlay.classList.remove("open"));

  confirmBtn?.addEventListener("click", () => {
    overlay.classList.remove("open");
    showToast("Book deleted successfully.", "success");
    setTimeout(() => (location.href = "available-books.html"), 1600);
  });

  // Close on backdrop click
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") overlay.classList.remove("open");
  });
}

/* ──────────────────────────────────────────────
   Edit Book Form Validation & Submission
   ────────────────────────────────────────────── */
function initEditForm() {
  const form = qs("form:not([action='available-books.html'])") ||
               document.querySelector("main form");
  if (!form) return;

  /* Inject error elements next to each field */
  function ensureError(inputId, label) {
    const input = $(inputId);
    if (!input) return null;
    let err = document.getElementById(`err_${inputId}`);
    if (!err) {
      err = document.createElement("span");
      err.id = `err_${inputId}`;
      err.className = "field-error";
      err.setAttribute("role", "alert");
      input.parentNode.appendChild(err);
    }
    return err;
  }

  const errBookId     = ensureError("book_id",     "Book ID");
  const errBookName   = ensureError("book_name",   "Book Name");
  const errBookAuthor = ensureError("book_author", "Author");
  const errCategory   = ensureError("category",    "Category");
  const errDesc       = ensureError("description", "Description");

  /* Live validation on blur */
  $("book_id")     ?.addEventListener("blur", () => validateRequired($("book_id"),     errBookId,     "Book ID"));
  $("book_name")   ?.addEventListener("blur", () => validateMinLength($("book_name"),  errBookName,   "Book Name", 2));
  $("book_author") ?.addEventListener("blur", () => validateMinLength($("book_author"),errBookAuthor, "Author",    2));
  $("category")    ?.addEventListener("blur", () => validateRequired($("category"),    errCategory,   "Category"));
  $("description") ?.addEventListener("blur", () => validateMinLength($("description"),errDesc,       "Description", 10));

  /* Clear error styling on input */
  ["book_id","book_name","book_author","category","description"].forEach(id => {
    $(id)?.addEventListener("input", () => {
      $(id).classList.remove("input-error");
      document.getElementById(`err_${id}`)?.classList.remove("visible");
    });
  });

  /* Full validation on submit */
  form.addEventListener("submit", e => {
    e.preventDefault();

    const checks = [
      validateRequired($("book_id"),     errBookId,     "Book ID"),
      validateMinLength($("book_name"),  errBookName,   "Book Name", 2),
      validateMinLength($("book_author"),errBookAuthor, "Author",    2),
      validateRequired($("category"),    errCategory,   "Category"),
      validateMinLength($("description"),errDesc,       "Description", 10),
    ];

    const allValid = checks.every(Boolean);

    if (!allValid) {
      showToast("Please fix the highlighted fields before saving.", "error");
      // Scroll to first error
      const firstErr = form.querySelector(".input-error");
      firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstErr?.focus();
      return;
    }

    // Simulate save
    showToast("Changes saved successfully! Redirecting…", "success");
    setTimeout(() => (location.href = "available-books.html"), 1800);
  });

  /* Reset button feedback */
  const resetBtn = form.querySelector('[type="reset"]');
  resetBtn?.addEventListener("click", () => {
    form.querySelectorAll(".input-error, .input-ok").forEach(el => {
      el.classList.remove("input-error", "input-ok");
    });
    form.querySelectorAll(".field-error").forEach(el => el.classList.remove("visible"));
    showToast("Form has been reset.", "info", 2000);
  });
}

/* ──────────────────────────────────────────────
   Upgrade raw HTML to styled structure
   (adds CSS classes without rewriting HTML)
   ────────────────────────────────────────────── */
function applyStructure() {
  const main = qs("main");
  if (!main) return;

  /* Wrap each major section in a .card */
  function wrapSection(heading, extraClass = "") {
    const h2 = [...main.querySelectorAll("h2")].find(
      el => el.textContent.trim().startsWith(heading)
    );
    if (!h2) return;

    // gather siblings until next h2, hr, or section
    const siblings = [];
    let el = h2.nextElementSibling;
    while (el && el.tagName !== "H2" && el.tagName !== "HR" && el.tagName !== "SECTION") {
      siblings.push(el);
      el = el.nextElementSibling;
    }

    const card = document.createElement("div");
    card.className = `card ${extraClass}`.trim();

    // Section header
    const iconMap = { "Book Details": "📖", "Edit Book": "✏️", "Delete Book": "🗑️" };
    const icon = iconMap[heading] || "📌";
    const hdr = document.createElement("div");
    hdr.className = "section-header";
    hdr.innerHTML = `<div class="section-icon">${icon}</div>`;
    hdr.appendChild(h2.cloneNode(true));

    card.appendChild(hdr);
    siblings.forEach(s => card.appendChild(s.cloneNode(true)));

    h2.parentNode.insertBefore(card, h2);
    h2.remove();
    siblings.forEach(s => s.remove());
    return card;
  }

  wrapSection("Book Details", "book-details-card-wrapper");
  wrapSection("Edit Book",    "edit-card");
  wrapSection("Delete Book",  "delete-card");

  // Remove orphan hr
  main.querySelectorAll("hr").forEach(hr => hr.remove());

  // Style book details inner content
  const detailsCard = qs(".book-details-card-wrapper");
  if (detailsCard) {
    detailsCard.classList.remove("book-details-card-wrapper");
    detailsCard.classList.add("book-details-card");

    // Find img and info paragraphs
    const img = detailsCard.querySelector("img");
    const h3  = detailsCard.querySelector("h3");
    const ps  = [...detailsCard.querySelectorAll("p")];

    const coverDiv = document.createElement("div");
    coverDiv.className = "book-cover";

    const infoDiv = document.createElement("div");
    infoDiv.className = "book-info";

    if (h3) infoDiv.appendChild(h3);

    // Build meta list
    const ul = document.createElement("ul");
    ul.className = "book-meta";

    let descPara = null;
    ps.forEach(p => {
      const text = p.textContent;
      if (text.includes("Description:")) {
        descPara = p;
      } else if (text.includes(":")) {
        const li = document.createElement("li");
        const strong = p.querySelector("strong");
        if (strong) {
          li.innerHTML = p.innerHTML;
          // Status badge
          if (strong.textContent.includes("Status")) {
            const val = text.replace("Status:", "").trim();
            const badge = document.createElement("span");
            badge.className = `badge ${val.toLowerCase() === "available" ? "badge-available" : "badge-unavailable"}`;
            badge.textContent = val;
            li.innerHTML = `<strong>Status:</strong>`;
            li.appendChild(badge);
          }
        }
        ul.appendChild(li);
      }
    });

    infoDiv.appendChild(ul);

    if (descPara) {
      const descDiv = document.createElement("div");
      descDiv.className = "book-description";
      const descText = descPara.textContent.replace("Description:", "").trim();
      descDiv.textContent = descText;
      infoDiv.appendChild(descDiv);
    }

    // Clear card content after header
    const header = detailsCard.querySelector(".section-header");
    [...detailsCard.children].forEach(child => {
      if (child !== header) child.remove();
    });

    if (img) {
      coverDiv.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "book-cover-placeholder";
      placeholder.textContent = "📚";
      coverDiv.appendChild(placeholder);
    }

    detailsCard.appendChild(coverDiv);
    detailsCard.appendChild(infoDiv);
  }

  // Style edit form
  const editCard = qs(".edit-card");
  if (editCard) {
    const form = editCard.querySelector("form");
    if (form) {
      // Wrap form divs in grid
      const formDivs = [...form.querySelectorAll(":scope > div")];
      const grid = document.createElement("div");
      grid.className = "form-grid";

      formDivs.forEach(div => {
        div.classList.add("form-group");
        const inputId = div.querySelector("input,select,textarea")?.id;

        // Full-width fields
        if (inputId === "description" || inputId === "book_id") {
          div.classList.add("span-full");
        }

        // Add required star to labels
        div.querySelectorAll("label").forEach(lbl => {
          if (!lbl.querySelector(".required")) {
            lbl.innerHTML += ' <span class="required" aria-hidden="true">*</span>';
          }
        });

        grid.appendChild(div.cloneNode(true));
      });

      formDivs.forEach(d => d.remove());
      form.insertBefore(grid, form.querySelector("fieldset") || form.firstChild);

      // Style fieldset radio group
      const fieldset = form.querySelector("fieldset");
      if (fieldset) {
        const radioGroup = document.createElement("div");
        radioGroup.className = "radio-group";
        const radios = [...fieldset.querySelectorAll("input[type='radio']")];
        radios.forEach(radio => {
          const lbl = fieldset.querySelector(`label[for="${radio.id}"]`);
          const wrapper = document.createElement("label");
          wrapper.className = "radio-option";
          wrapper.appendChild(radio.cloneNode(true));
          if (lbl) wrapper.appendChild(document.createTextNode(" " + lbl.textContent.trim()));
          radioGroup.appendChild(wrapper);
        });
        // Clear fieldset internals
        [...fieldset.querySelectorAll("label,input")].forEach(el => el.remove());
        fieldset.appendChild(radioGroup);
        grid.classList.add("span-full");
      }

      // Wrap buttons
      const btns  = [...form.querySelectorAll("button")];
      const links = [...form.querySelectorAll("a")];
      const btnRow = document.createElement("div");
      btnRow.className = "btn-row";

      btns.forEach((btn, i) => {
        if (btn.type === "submit")  btn.className = "btn btn-primary";
        if (btn.type === "reset")   btn.className = "btn btn-secondary";
        btn.remove();
        btnRow.appendChild(btn);
      });
      links.forEach(a => {
        a.className = "btn btn-ghost";
        a.remove();
        btnRow.appendChild(a);
      });

      form.appendChild(btnRow);
    }
  }

  // Style delete section
  const deleteCard = qs(".delete-card");
  if (deleteCard) {
    deleteCard.style.cssText = "";

    // Insert warning box
    const existingP = deleteCard.querySelector("p");
    if (existingP && !deleteCard.querySelector(".delete-warning")) {
      const warn = document.createElement("div");
      warn.className = "delete-warning";
      warn.innerHTML = `
        <span class="warn-icon">⚠️</span>
        <p>${existingP.textContent}</p>`;
      existingP.replaceWith(warn);
    }

    // Style delete button
    const delBtn = deleteCard.querySelector("button[type='submit']");
    if (delBtn) {
      delBtn.className = "btn btn-danger";
      delBtn.innerHTML = "🗑️ Delete Book";
    }
  }
}

/* ──────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  applyStructure();       // upgrade HTML structure with CSS classes
  initEditForm();         // attach form validation
  initDeleteModal();      // attach delete confirmation
});
