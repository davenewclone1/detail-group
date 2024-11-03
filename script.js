document.addEventListener('DOMContentLoaded', function() {
    // Поиск товаров
    const searchInput = document.querySelector('.popular_items__search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            const cards = document.querySelectorAll('.product_card');
            const parent = document.querySelector('.popular_items__cards');
            cards.forEach(card => {
                if (card.textContent.toLowerCase().includes(searchValue) || searchValue === '') {
                    card.classList.remove('hidden');
                    parent.insertBefore(card, parent.firstChild);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    const updateBasket = function(basket) {
        console.log('Updating basket:', basket);
        localStorage.setItem('basket', JSON.stringify(basket));
        updateCatalogWithBasket();
    }

    const updateCatalogWithBasket = function() {
        const basket = getBasket();
        const cards = document.querySelectorAll('.product_card');
        cards.forEach(card => {
            const productTitle = card.querySelector('.product_card__header').textContent;
            const basketItem = basket.find(item => item.title === productTitle);
            if (basketItem) {
                updateCardQuantity(card, basketItem.quantity);
                initializeQuantityControls(card, productTitle);
            } else {
                const quantityControls = card.querySelector('.quantity-controls');
                if (quantityControls) {
                    quantityControls.outerHTML = `<button class="product_card__btn">В корзину</button>`;
                    card.querySelector('.product_card__btn').addEventListener('click', addToBasketHandler);
                }
            }
        });
    };

    const getBasket = function() {
        const basket = JSON.parse(localStorage.getItem('basket')) || [];
        console.log('Retrieved basket:', basket);
        return basket;
    }

    const updateCardQuantity = function(productCard, count) {
        let quantityControls = productCard.querySelector('.quantity-controls');
        if (!quantityControls) {
            quantityControls = document.createElement('div');
            quantityControls.classList.add('quantity-controls');
            productCard.querySelector('.product_card__btn').replaceWith(quantityControls);
        }
        quantityControls.innerHTML = `
            <button class="decrement">-</button>
            <span class="quantity">${count}</span>
            <button class="increment">+</button>
        `;
    }

    const initializeQuantityControls = function(productCard, productTitle) {
        const quantityControls = productCard.querySelector('.quantity-controls');
        const decrementButton = quantityControls.querySelector('.decrement');
        const incrementButton = quantityControls.querySelector('.increment');
        const quantityDisplay = quantityControls.querySelector('.quantity');
        let count = parseInt(quantityDisplay.textContent);

        const updateCount = function() {
            quantityDisplay.textContent = count;
            let basket = getBasket();
            const itemIndex = basket.findIndex(item => item.title === productTitle);
            if (itemIndex > -1) {
                basket[itemIndex].quantity = count;
                if (count === 0) {
                    basket.splice(itemIndex, 1);
                    quantityControls.innerHTML = `<button class="product_card__btn">В корзину</button>`;
                    productCard.querySelector('.product_card__btn').addEventListener('click', addToBasketHandler);
                }
            } else if (count > 0) {
                basket.push({ title: productTitle, quantity: count });
            }
            updateBasket(basket);
        };

        decrementButton.addEventListener('click', function() {
            if (count > 0) {
                count--;
                updateCount();
            }
        });

        incrementButton.addEventListener('click', function() {
            count++;
            updateCount();
        });
    };

    const addToBasketHandler = function(event) {
        event.stopPropagation();
        const productCard = this.closest('.catalog_product_card') || this.closest('.product_card');
        const productTitle = productCard.querySelector('.product_card__header').textContent;
        const productPrice = parseInt(productCard.querySelector('.product_card__price').textContent.replace(/\D/g, ''));
        console.log('Product Price:', productPrice);
        let basket = getBasket();
        const itemIndex = basket.findIndex(item => item.title === productTitle);
        if (itemIndex > -1) {
            basket[itemIndex].quantity += 1;
            basket[itemIndex].price = productPrice;
        } else {
            basket.push({ title: productTitle, quantity: 1, price: productPrice });
        }
        updateBasket(basket);
        updateCardQuantity(productCard, basket[itemIndex > -1 ? itemIndex : basket.length - 1].quantity);
        initializeQuantityControls(productCard, productTitle);
    }

    document.querySelectorAll('.product_card__btn').forEach(btn => {
        const productCard = btn.closest('.catalog_product_card') || btn.closest('.product_card');
        const productTitle = productCard.querySelector('.product_card__header').textContent;
        const basket = getBasket();
        const item = basket.find(item => item.title === productTitle);
        if (item) {
            updateCardQuantity(productCard, item.quantity);
            initializeQuantityControls(productCard, productTitle);
        } else {
            btn.addEventListener('click', addToBasketHandler);
        }
    });

    document.querySelectorAll('.product_card__img').forEach(img => {
        img.addEventListener('click', function(event) {
            event.stopPropagation();
            const productCard = this.closest('.catalog_product_card');
            const productImgElement = productCard.querySelector('.product_card__img');
            const productTitle = productCard.querySelector('.product_card__header').textContent;
            const productPrice = productCard.querySelector('.product_card__price').textContent;
            const productInfo = productCard.querySelector('.product_card__info').textContent; // Получаем описание
            const modalImg = document.querySelector('#modal-img');
            const modalTitle = document.querySelector('#modal-title');
            const modalPrice = document.querySelector('#modal-price');
            const modalInfo = document.querySelector('#modal-info'); // Добавляем элемент для описания
            modalImg.style.backgroundImage = productImgElement.style.backgroundImage;
            modalTitle.textContent = productTitle;
            modalPrice.textContent = productPrice;
            modalInfo.textContent = productInfo; // Добавляем описание в модальное окно
            document.querySelector('.modal').style.display = 'block';
        });
    });

    document.querySelector('#close-btn').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
    });

    const initializeMainPageCards = function() {
        console.log('Initializing main page cards');
        const cards = document.querySelectorAll('.product_card');
        cards.forEach(card => {
            const productTitle = card.querySelector('.product_card__header').textContent;
            const basket = getBasket();
            const item = basket.find(item => item.title === productTitle);
            if (item) {
                updateCardQuantity(card, item.quantity);
                initializeQuantityControls(card, productTitle);
            } else {
                card.querySelector('.product_card__btn').addEventListener('click', addToBasketHandler);
            }
        });
    };

    initializeMainPageCards();
});
