// process.setMaxListeners(20);  // Set the limit to 20 (or adjust as needed)


let products = [];
let cart = [];
const MY_SERVER = 'http://localhost:3000/products';
const MY_CART = 'http://localhost:3000/cart';
const toast = document.getElementById("snackbar");


// Function to dynamically create product cards
const buildDisplay = () => {
    productsContainer.innerHTML = products.map(product =>
        `
        <div class="product-container card" style="width: 19rem;">
        <img src="./products/${product.image}"width="40px" height="300px" class="card-img-top" alt="${product.name}">
        <h5 class="card-title">${product.name}</h5>
        <p>price: ${product.price}</p>
        <button class="btn btn-success" onclick=addToCart(${product.id})>Add To Cart</button>
        <button class="btn btn-danger" onclick=removeFromCart(${product.id})>Remove From Cart</button>
    </div><br>`).join("");
}

const buildCart = () => {

    const filteredCart = cart.filter(item => item.quantity > 0);

    cartBody.innerHTML = filteredCart.map(item =>
        ` 
        <div class="product-container card" style="width: 20rem; margin-bottom:40px;" >
        <img src="./products/${item.image}"width="40px" height="300px" class="card-img-top" alt="${item.name}">
        <h5 class="card-title">${item.name}</h5>
        <p>price: ${item.price}</p>
        <p>quantity: ${item.quantity}</p></div>
        `).join('');
    cartBody.innerHTML += `<button class="btn btn-primary">Checkout</button>`
}
const getProducts = async () => {
    products = await axios.get(MY_SERVER);
    products = products.data;
    console.table(products);
    buildDisplay()
}

const getCart = async () => {
    cart = await axios.get(MY_CART);
    cart = cart.data;
    console.table(cart);
    buildCart();
}


const showToast = (message) => {
    toast.innerHTML = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// Function to add product to the cart
const addToCart = async (id) => {
    const selectedProduct = products.find(product => product.id === id);
    const cartProductIndex = cart.findIndex(item => item.id === id);

    if (cartProductIndex === -1) {
        // If not in the cart, add the full product with quantity 1
        selectedProduct.quantity = 1;
        cart.push(selectedProduct);
        cartProductIndex = cart.length - 1; // Update the index for the new item
    } else {
        // If already in the cart, increase the quantity
        cart[cartProductIndex].quantity++;
    }
    try {
        // Update the specific product in the cart array in the JSON file
        await axios.put(`${MY_CART}/${id}`, cart[cartProductIndex]);

        // Display a success message
        showToast(`Updated cart with ${selectedProduct.name}`);
    } catch (error) {
        console.error("Error updating cart:", error.message);
        // Handle the error as needed
        // For example, display an error message to the user
        alert("Error updating cart. Please try again later.");
    }
    // Update the products and cart arrays in the client
    await getProducts();
    await getCart();
}


const removeFromCart = async (id) => {
    const selectedProduct = products.find(product => product.id === id);
    const cartProductIndex = cart.findIndex(item => item.id === id);

    if (cartProductIndex > -1) {
        // If the item is in the cart, set its quantity to 0
        cart[cartProductIndex].quantity = 0;

        try {
            // Update the specific product in the cart array in the JSON file
            await axios.put(`${MY_CART}/${id}`, cart[cartProductIndex]);

            // Display a success message
            showToast(`Removed ${selectedProduct.name} from the cart`);
        } catch (error) {
            console.error("Error updating cart:", error.message);
            // Handle the error as needed
            // For example, display an error message to the user
            alert("Error updating cart. Please try again later.");
        }
    } else {
        // If the item is not in the cart, display a message
        alert(`${selectedProduct.name} is not in the cart`);
    }

    // Update the products and cart arrays in the client
    await getProducts();
    await getCart();
}

// Initialize products when the page loads
window.onload = getProducts;
getCart();