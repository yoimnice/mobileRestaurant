import { menuArray } from './data.js';
import * as MyFn from './rating.js';

let renderedOrderArray = [];
let orderedItems = [];
let menu = [];

// Events

window.addEventListener('load', function(){
    oneTimeRender();
    render();
});

document.addEventListener('click', function(e){
    if(e.target.id === 'add-btn'){
        addToList(e.target.dataset.add);
    } else if(e.target.id === 'submit-order'){
        openModal();
        document.querySelector('#modal-background').innerHTML = renderModal();
        modalevent();
    } else if (e.target.id === 'modal-background'){
        closeModal();
        location.reload();
    } else if (e.target.dataset.remove){
        removeFromList(e.target.dataset.remove);
    } else if(e.target.id === 'rating-submission'){
        console.log(e.target.id);
        modalRatingEvent();
    };
})

// Functions

function addToList(item){
    const targetItem = menu.filter(function(food){
        return food.uuid === item;
    })[0];
    checkContainsObject(targetItem);
    render();
    checkForDiscount();
}

function removeFromList(uuid){
    const uuidToMatch = uuid;
    let count = 0;
    for (let i = 0; i < orderedItems.length; i++){
        if (orderedItems[i].uuid === uuidToMatch){
            orderedItems.splice(i, 1);
            i--; // Decrement the counter to account for the removed element
            count++;
        }
    }
    for (let i = 0; i < renderedOrderArray.length; i++){
        if (renderedOrderArray[i].uuid === uuidToMatch){
            renderedOrderArray.splice(i, 1);
        }
    }
    render();
}

// data

function checkContainsObject(obj){
    let id = obj.uuid;
    let check = renderedOrderArray.find(c => c.uuid === id);
    if(renderedOrderArray.length === 0){
        renderedOrderArray.unshift(obj);
    } else {
        if (check === undefined){
            renderedOrderArray.unshift(obj);
        } else {
        }
    }
    orderedItems.push(obj);
}

function modalevent(){
    document.querySelector('.payment-form').addEventListener('submit', (event) => {
    closeModal();
    renderedOrderArray = [];
    orderedItems = [];
    menu = [];
    render();
    openModal();
    document.querySelector('#modal-background').innerHTML = renderEndMessage();
    event.preventDefault();
});
}

function modalRatingEvent(){
    closeModal();
    location.reload();
}

function checkForDiscount(){
    let discount = false;
    let includesDrank = false;
    let includesMeal = false;

    const matchIfDrank = "drank";
    const matchIfMeal = "food";

    renderedOrderArray.filter(function(item){
        if(item.type === matchIfDrank){
            includesDrank = true;
        } else if (item.type === matchIfMeal){
            includesMeal = true;
        }
    })
    if(includesDrank && includesMeal === true){
        discount = true;
    }
    return discount;
}
// calculations

function calculatePercentage(number, percentage) {
    return (number * percentage) / 100;
}


function getSumOfRenderedItems(){
    let totalPrice = 0;
    orderedItems.filter(function(object){
        totalPrice += object.price;
    });
    if(checkForDiscount()){
        totalPrice = totalPrice - calculatePercentage(totalPrice, 10);
    }
    return totalPrice;
}

function amountPrice(amount, price){
    let sum = amount * price;
    return sum;
}

function addComma(array){
    return array.join(", ");
}

function amountOfItems(item){
    let amount = 0
    orderedItems.filter(function(object){
        if(object.name === item.name){
            amount += 1;
        } else {
        }
    })
    return amount;
}

// RENDERING

function renderDiscountMessage(){
    let discountMessage = ``;
    if(checkForDiscount()){
    discountMessage = `
    <h4 class='red'>+  'meal deal' discount: 10%<h4>
    `
    }
    return discountMessage;
}


function renderEndMessage(){
    let endMessageHTML = ``;
    endMessageHTML = `
    <div class="end-message">
        <p>Thank you for your order!</p>
        <p>Your order is on its way</p>
    </div>
    ${MyFn.renderRating()}
    `
    return endMessageHTML;
}

function renderModal(){
    let modalHTML = ``;
    modalHTML = `
    <div class="modal-window">
        <div class="modal-header">
            <h1>Enter Card Details</h1>
        </div>
        <form class="payment-form">
            <input class="modal-input" type="text" name="name" id="name" required placeholder="Enter your name">
            <input class="modal-input" type="number" name="card" id="card-details" required placeholder="Enter card number">
            <input class="modal-input" type="number" name="CVV" id="CVV" required placeholder="Enter CVV">
            <button type="submit" class="order-btn">Pay</button>
        </form>
    </div>`
    return modalHTML;
}

function openModal(){
    document.querySelector('.modal-container').classList.remove('non-visible');
}

function closeModal(){
    document.querySelector('.modal-container').classList.add('non-visible');
}

function getFoodListHTML(){
    let foodListHTML = ``;
    menuArray.filter(function(foodItem){
        menu.push(foodItem);
    })
    menu.forEach(function(food){
        foodListHTML += `
        <div class="food-item">
            <div class="food-pic-container">
                <img src="${food.image}" class="food-pic">
            </div>
            <div class="food-info">
                <div class='food-info-element'>
                    <h2>${food.name}</h2>
                    <p class='gray'>${addComma(food.ingredients)}</p>
                </div>
                <div class='food-info-element'>
                    <h2>${food.price}$</h2>
                </div>
            </div>
            <div class="order-btn-container">
                <i data-add="${food.uuid}" id="add-btn" class="fa fa-plus-circle" style="font-size: 3em;" aria-hidden="true"></i>
            </div>
        </div>
    `
})
    return foodListHTML;
}

function getOrderHTML(){
    let orderListHTML = ``;
    renderedOrderArray.forEach(function(item){
        orderListHTML = `
        <div class='order-phrase-container'>
            <h3>Your order</h3>
        </div>
        <div class="ordered-items-container">
        </div>
        <div class="total-price-container">
            <h4>Total price:</h4>
            ${renderDiscountMessage()}
            <h4>${getSumOfRenderedItems()}</h4>
        </div>
        <div class="order-container">
            <button id="submit-order"class="order-btn">Complete order</button>
        </div>
        `
    })
    return orderListHTML;
}

function getOrderItemHTML(){
    let orderedItemHTML = ``;
    renderedOrderArray.forEach(function(item){
    orderedItemHTML +=
        `
        <div class="ordered-item">
            <h4>${item.name}</h4>
            <h5 data-remove="${item.uuid}" class="remove-btn">Remove</h5>
            <h4 class="item-amount">x${amountOfItems(item)}</h4>
            <h4 class="price-text">${amountPrice(amountOfItems(item), item.price)}</h4>
        </div>
        `
    })
    return orderedItemHTML;
}

function render(){
    document.querySelector('.order-list').innerHTML = getOrderHTML();
    if(renderedOrderArray.length > 0){
        document.querySelector('.ordered-items-container').innerHTML =  getOrderItemHTML();
    }
}

function oneTimeRender(){
    document.querySelector('.food-list').innerHTML = getFoodListHTML();
}