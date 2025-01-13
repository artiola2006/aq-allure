document.addEventListener('DOMContentLoaded', function () {

    loadProducts();
    updateGrandTotal();


    document.querySelectorAll('.product-row').forEach(row => {
        const quantityInput = row.querySelector('.product-quantity');
        const removeButton = row.querySelector('.remove-product');

        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                updateProduct(row);
                updateGrandTotal();
            });
        }

        if (removeButton) {
            removeButton.addEventListener('click', () => {
                removeProduct(row);
                updateGrandTotal();
            });
        }
    });


    document.querySelectorAll('.btn-outline-primary').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button);
        });
    });
});


function updateProduct(row) {
    const productId = row.id;
    const productName = row.querySelector('.product-name').textContent;
    const price = parseFloat(row.querySelector('.product-price').textContent.replace('$', ''));
    const quantity = parseInt(row.querySelector('.product-quantity').value, 10);
    const total = price * quantity;

    row.querySelector(`.product-total-${productId}`).textContent = `$${total.toFixed(2)}`;

    const products = JSON.parse(localStorage.getItem('cartProducts')) || {};
    products[productId] = { name: productName, price, quantity, total };
    localStorage.setItem('cartProducts', JSON.stringify(products));
}


function removeProduct(row) {
    const productId = row.id;

    const products = JSON.parse(localStorage.getItem('cartProducts')) || {};
    delete products[productId];
    localStorage.setItem('cartProducts', JSON.stringify(products));

    row.remove();
}


function updateGrandTotal() {
    const products = JSON.parse(localStorage.getItem('cartProducts')) || {};
    const grandTotal = Object.values(products).reduce((sum, product) => sum + product.total, 0);

    const grandTotalElement = document.getElementById('grand-total');
    if (grandTotalElement) {
        grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
    }
}


function loadProducts() {
    const products = JSON.parse(localStorage.getItem('cartProducts')) || {};
    const cartItems = document.getElementById('cart-items');


    while (cartItems.firstChild) {
        cartItems.removeChild(cartItems.firstChild);
    }

    for (const [productId, product] of Object.entries(products)) {
        const row = document.createElement('tr');
        row.id = productId;
        row.className = 'product-row';

        row.innerHTML = `
            <td>    
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid me-3" width='40'>
                    <span class="product-name">${product.name}</span>
                </div>
            </td>
            <td class="product-price">$${product.price.toFixed(2)}</td>
            <td>
                <div class="input-group w-50">
                    <button class="btn btn-outline-secondary" onclick="decreaseQuantity('${productId}')">-</button>
                    <input type="number" id="quantity-${productId}" class="form-control product-quantity" value="${product.quantity}" min="1" readonly>
                    <button class="btn btn-outline-secondary" onclick="increaseQuantity('${productId}')">+</button>
                </div>
            </td>
            <td class="product-total-${productId}">$${product.total.toFixed(2)}</td>
            <td>
                <button id="remove-${productId}" class="btn btn-danger btn-sm remove-product">Remove</button>
            </td>
        `;

        cartItems.appendChild(row);


        const quantityInput = row.querySelector('.product-quantity');
        const removeButton = row.querySelector('.remove-product');

        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                updateProduct(row);
                updateGrandTotal();
            });
        }

        if (removeButton) {
            removeButton.addEventListener('click', () => {
                removeProduct(row);
                updateGrandTotal();
            });
        }
    }
}

function addToCart(button) {

    const card = button.closest('.card');
    

    const productImage = card.querySelector('img').src;
    const productTitle = card.querySelector('.card-title').textContent;
    const productDescription = card.querySelector('.card-text').textContent;
    const productPrice = parseFloat(card.querySelector('.text-primary.fw-bold').textContent.replace('$', ''));


    const productId = productTitle.replace(/\s+/g, '-').toLowerCase();


    const product = {
        id: productId,
        name: productTitle,
        description: productDescription,
        price: productPrice,
        quantity: 1,
        total: productPrice,
        image: productImage
    };


    const cart = JSON.parse(localStorage.getItem('cartProducts')) || {};


    if (cart[productId]) {

        cart[productId].quantity += 1;
        cart[productId].total = cart[productId].price * cart[productId].quantity;
    } else {

        cart[productId] = product;
    }


    localStorage.setItem('cartProducts', JSON.stringify(cart));


    alert(`${productTitle} has been added to your cart!`);
}

function increaseQuantity(productId) {

    const cart = JSON.parse(localStorage.getItem('cartProducts')) || {};


    if (cart[productId]) {

        cart[productId].quantity += 1;


        cart[productId].total = cart[productId].price * cart[productId].quantity;


        var quantityElement = document.getElementById(`quantity-${productId}`);
        quantityElement.value = cart[productId].quantity;


        localStorage.setItem('cartProducts', JSON.stringify(cart));

        updateProduct(quantityElement.closest('.product-row'));

        updateGrandTotal();
    }
}

function decreaseQuantity(productId) {

    const cart = JSON.parse(localStorage.getItem('cartProducts')) || {};


    if (cart[productId]) {

        if (cart[productId].quantity > 1) {
            cart[productId].quantity -= 1;


            cart[productId].total = cart[productId].price * cart[productId].quantity;


            var quantityElement = document.getElementById(`quantity-${productId}`);
            quantityElement.value = cart[productId].quantity;


            localStorage.setItem('cartProducts', JSON.stringify(cart));

            updateProduct(quantityElement.closest('.product-row'));

            updateGrandTotal();
        }
    }
}



