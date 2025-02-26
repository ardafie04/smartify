document.addEventListener("alpine:init", () => {
    Alpine.data("dataProducts", (category = "smartphones", limit = 4) => ({
        products: [],
        search: "",
        error: { isError: false, message: '' },
        isNotFound: false,
        isLoading: false,
        init() {
            this.fetchProductsByCategory(category, limit);
        },
        async fetchProductsByCategory(category, limit) {
            this.isLoading = true;
            this.error = { isError: false, message: '' };
            try {
                const response = await fetch(`https://dummyjson.com/products/category/${category}?limit=${limit}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                this.products = result.products || [];
            } catch (error) {
                console.error("Failed to fetch products by category:", error);
                this.error = { isError: true, message: error.message };
            } finally {
                this.isLoading = false;
            }
        },
        async searchProducts(product) {
            this.isLoading = true;
            this.isNotFound = false;
            this.error = { isError: false, message: '' };
            if (!product) {
                await this.fetchProductsByCategory(category, limit);
                this.isLoading = false;
                return;
            }
            try {
                const response = await fetch(`https://dummyjson.com/products/search?q=${product}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                this.products = result.products.filter((p) => p.category === category);
                this.isNotFound = this.products.length === 0;
            } catch (error) {
                console.error("Failed to search products:", error);
                this.error = { isError: true, message: error.message };
            } finally {
                this.isLoading = false;
            }
        },
        viewProduct(productId) {
            window.location.href = `product-details.html?id=${productId}`;
        },
    }));

    Alpine.data("productDetail", () => ({
        product: {},
        currentImage: '',
        isLoading: true,
        error: { isError: false, message: '' },
        page: 'home',
        activeItem: 'home',
        iconMap: {
            "home": "fa-house",
            "smartphones": "fa-mobile-screen",
            "tablets": "fa-tablet-screen-button",
            "laptops": "fa-laptop",
            "mobile-accessories": "fa-headphones"
        },
        categoryMap: {
            "smartphones": "smartphones",
            "laptops": "laptops",
            "tablets": "tablets",
            "mobile-accessories": "mobile-accessories"
        },
        init() {
            this.page = this.getCurrentPage();
            this.activeItem = this.page;
            this.fetchProductDetails(this.getDefaultProductId());
        },
        getCurrentPage() {
            const path = window.location.pathname;
            return Object.keys(this.categoryMap).find(key => path.includes(key)) || 'home';
        },
        getDefaultProductId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id') || '2';
        },
        async fetchProductDetails(id) {
            this.isLoading = true;
            this.error = { isError: false, message: '' };
            try {
                const response = await fetch(`https://dummyjson.com/products/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                this.product = await response.json();
                this.currentImage = this.product.images?.[0] || 'https://placehold.co/400x400';
                this.page = this.categoryMap[this.product.category] || 'home';
                this.activeItem = this.page;
            } catch (error) {
                console.warn("Failed to fetch product details:", error);
                this.error = { isError: true, message: error.message };
            } finally {
                this.isLoading = false;
            }
        }
    }));
});

document.getElementById('searchToggle').addEventListener('click', () => {
  document.getElementById('searchDropdown').classList.toggle('hidden');
});

window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (window.scrollY > 300) {
      btn.classList.remove('opacity-0', 'invisible');
      btn.classList.add('opacity-100', 'visible');
  } else {
      btn.classList.add('opacity-0', 'invisible');
      btn.classList.remove('opacity-100', 'visible');
  }
});

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('smartphones')) return 'smartphones';
    if (path.includes('tablets')) return 'tablets';
    if (path.includes('laptops')) return 'laptops';
    if (path.includes('mobile-accessories')) return 'mobile-accessories';
    return 'home';
}


// State toggle for search dropdown
const searchToggle = document.getElementById('searchToggle');
const searchDropdown = document.getElementById('searchDropdown');
const searchIcon = document.getElementById('searchIcon');

let isSearchOpen = false; // Track dropdown state

searchToggle.addEventListener('click', () => {
    isSearchOpen = !isSearchOpen; // Toggle state

    if (isSearchOpen) {
        // Show dropdown and switch to 'X' icon
        searchDropdown.classList.remove('hidden');
        searchIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
    } else {
        // Hide dropdown and switch back to search icon
        searchDropdown.classList.add('hidden');
        searchIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        `;
    }
});

// Optional: Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!searchToggle.contains(event.target) && !searchDropdown.contains(event.target)) {
        isSearchOpen = false;
        searchDropdown.classList.add('hidden');
        searchIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        `;
    }
});

// Back to top button visibility
window.addEventListener('scroll', function() {
  const backToTopButton = document.getElementById('back-to-top');
  if (window.scrollY > 300) {
      backToTopButton.classList.remove('opacity-0', 'invisible');
      backToTopButton.classList.add('opacity-100', 'visible');
  } else {
      backToTopButton.classList.add('opacity-0', 'invisible');
      backToTopButton.classList.remove('opacity-100', 'visible');
  }
});
