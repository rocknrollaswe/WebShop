var products = []; 




document.addEventListener(
    "click", 
    function(event){
        if (event.target.matches(".modalProductContainer"))
        {
            app.closeModal(); 
        }
    
    },false
)



window.onload = async function () {
    await fetchData();
    app.list = products;
}




async function fetchData() {

    await axios.get('products/produkter.json')

        .then(response => {
            products = response.data;
            
            app.favorites = products.filter(item => item.ShowFirst === true);
           
            console.log(app.favorites);

        })
        .catch(error => {
            console.log("Something went wrong:" + error)
        })
        .finally(() => {
            app.randomFavSamples = getRandomSamplesFromFavorites(app.favorites); 
            app.loading = false;
        })

}


function getRandomSamplesFromFavorites(array){
    var randomIndex;
    var randomFirstObj;
    var randomNewObj; 
    let randomizedArray = []; 
    
    for (let index = 0; index < 3; index++) {
        randomIndex = Math.floor(Math.random() * array.length);
        
        if(index === 0){
            randomFirstObj = array[randomIndex];
            randomizedArray.push(randomFirstObj);
            continue; 
        }

        randomNewObj = array[randomIndex]; 
       
        if(randomNewObj.ID === randomFirstObj.ID){
            index -= 1; 
            continue; 
        }
        else{
            randomizedArray.push(randomNewObj); 
            continue; 
        }
        
    }
    console.log(randomizedArray);
    return randomizedArray; 
} 

function getGUID() {
    var u = '', i = 0;
    while (i++ < 36) {
        var c = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i - 1],
            r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        u += (c == '-' || c == '4') ? c : v.toString(16)
    }
    return u;
}

//Komponenter
Vue.component('logotype', {

    data: function () {
        return {
           logo: 'images/logocut.png' //'WebShop/images.logocut.png'
        }
    },

    template: `<div class="logo"><h1 style="display:none;">The Store</h1><img id="bigLogo" v-bind:src="logo"/></div>`

})


//FAVORITES-COMPONENT
//-----------------------------------------------------------
Vue.component('favorites', {

    data: function () {
        return {

            list: app.randomFavSamples

        }
    },

    methods: {
        movingToCart(itemID) {      // workaround connecting the component to the Vue-instance
            app.AddToCart(itemID);

        },

        alertShowModal: function (ID) {
            app.showModal(ID);
        }

    },

    template: `<div>      
                    <div class="allItems">
                        <div class="card" v-for="item in list" v-bind:key="item.ID"  v-on:click="alertShowModal(item.ID)">
                            <h2>{{item.Title}}</h2>
                            <img :src="item.Img">
                            <h2>{{item.Price}} kr</h2>
                        </div>
                    </div>
                </div>`

})




//--------------------------------------------------------------------
Vue.component('sweaters', {

    data: function () {
        return {

            list: app.list.filter(item => item.Category === 'SWEATER')

        }
    },

    methods: {
        movingToCart(itemID) {      // workaround connecting the component to the Vue-instance
            app.AddToCart(itemID);

        },

        alertShowModal: function (ID) {
            app.showModal(ID);
        }

    },

    updated(){
        this.list =  app.list.filter(item => item.Category === 'SWEATER');
    },

    template: `<div>
                    <div class="allItems">
                        <div class="card" v-for="item in list" v-bind:key="item.ID"  v-on:click="alertShowModal(item.ID)">
                            <h2>{{item.Title}}</h2>
                            <img :src="item.Img">
                            <h2>{{item.Price}} kr</h2>
                        </div>
                    </div>
                </div>`

})
//----------------------------------------------------------------------
var pants = Vue.component('pants', {

    data: function () {
        return {

            list: app.list.filter(item => item.Category === 'PANTS')

        }
    },

    methods: {
        movingToCart(itemID) {      // workaround connecting the component to the Vue-instance
            app.AddToCart(itemID);

        },

        alertShowModal: function (ID) {
            app.showModal(ID);
        }

    },

    template: `<div>
                    <div class="allItems">
                        <div class="card" v-for="item in list" v-bind:key="item.ID"  v-on:click="alertShowModal(item.ID)">
                            <h2>{{item.Title}}</h2>
                            <img :src="item.Img">
                            <h2>{{item.Price}} kr</h2>
                        </div>
                    </div>
                </div>`

})
//-------------------------------------------------------------------------
var underwear = Vue.component('underwear', {

    data: function () {
        return {

            list: app.list.filter(item => item.Category === 'UNDERWEAR')

        }
    },

    methods: {
        movingToCart(itemID) {      // workaround connecting the component to the Vue-instance
            app.AddToCart(itemID);

        },

        alertShowModal: function (ID) {
            app.showModal(ID);
        }

    },

    template: `<div>
                    
                    <div class="allItems">
                        <div class="card" v-for="item in list" v-bind:key="item.ID"  v-on:click="alertShowModal(item.ID)">
                            <h2>{{item.Title}}</h2>
                            <img :src="item.Img">
                            <h2>{{item.Price}} kr</h2>
                        </div>
                    </div>
                </div>`

})

//------------------------------------------------------------------------------

Vue.component('modal', {

    data: function () {
        return {
            modalProduct: app.modalProduct
        }
    },

    methods: {
        movingToCart(itemID) {      // workaround connecting the component to the Vue-instance
            app.AddToCart(itemID);
        },

        alertDecreaseStock: function (ID) {
            console.log('decreasing stock')
            app.decreaseStock(ID);
        },

        alertCloseModal: function () {
            app.closeModal();
        }
    },

    template: `<div class="modalProductContainer"><div class="card modal"><button id="backButton" class="buyButton animatedButton"  v-on:click="alertCloseModal()">Tillbaka</button>
                <h2>{{modalProduct.Title}}</h2><p>{{modalProduct.Description}}</p><br><img :src="modalProduct.Img"><p id="stockInfo">I lager: {{modalProduct.InStock}}</p><h2 id="price">{{modalProduct.Price.toFixed(2)}} :-</h2>
                <button class="buyButton animatedButton" v-on:click="movingToCart(modalProduct.ID); alertDecreaseStock(modalProduct.ID)"><strong>Lägg i varukorg</strong></button></p></div></div></div></div>`

})




//--------------------------------------------------------
Vue.component('cart', {

    data: function () {
        return {

            cartList: app.cart,
            localTotal: app.totalAmount.toFixed(2),
            exlusiveTax:  app.beforeTax.toFixed(2),
            currentLoopID: ''
        }
    },

    methods: {
        GoToPayment: function () {
            app.Payment();
        },

        alertRemoveObj: function(ID){
            app.removeObj(ID);
            app.cancelPaymentForm(); 
        }
    },

    updated(){
        this.localTotal = app.totalAmount.toFixed(2); 
        this.exlusiveTax = app.beforeTax.toFixed(2);  
    },
    

    template: `<div>
                    <div class="cartContainer" v-if="cartList.length === 0">
                        <h2 class="cartInfoHeader">Du har för närvarande inga produkter i din varukorg!</h2>
                    </div>  
                    <div class="cartContainer" v-if="cartList.length > 0">
                        <h2 class="cartInfoHeader">Produkter i din varukorg:</h2>
                        <ul>
                            <li v-for="item in cartList">
                                <img id="removeImg" v-on:click="alertRemoveObj(item.ID)" src="/icons/remove3.png" style="width: 30px;">
                                <h3>{{item.Title}}</h3>
                                <h4>{{item.Price.toFixed(2)}} :-</h4>
                                <img v-bind:src="item.Img"/> 
                            </li> 
                        </ul> 
                        <hr><div class="totalWPaymentButton"><div><h2>TOTAL: {{localTotal}} kr</h2><h4>exkl. moms {{exlusiveTax}} kr</h4></div><button class="animatedButton" v-on:click="GoToPayment()">Gå till betalning!</button></div>
                    </div>
               </div>`
})

//------------------------------------------------------
Vue.component('payment', {

    data: function(){
        return {
           

            localTotal: app.totalAmount.toFixed(2),
            exlusiveTax: app.beforeTax.toFixed(2)


        }
    },
    methods: {

        alertChangePage: function(page){
            app.changePage(page);
        },

        alertMakePayment: function(){
            app.makePayment(); 
        }
    },

    updated(){
            this.localTotal = app.totalAmount.toFixed(2);
            this.exlusiveTax = app.beforeTax.toFixed(2)
    },

    template:  `<div class="paymentForm">
                    <div>
                        <h2>Snart klara!</h2><br>
                        <p>Innan DU kan slutföra ditt köp hos oss behöver vi några uppgifter! </p>
                        <button class="animatedButton" style="margin-top:30px; background-color: darkorange;" v-on:click="alertChangePage('startPage')">Gå tillbaka till butiken!</button>
                    </div>
                    <form>
                        <fieldset class="nameAddress">
                            <legend>Namn och adress: </legend>
                            <label for="fname">Förnamn: </label><input type="text" id="fname" name="fname"><br>
                            <label for="lname">Efternamn: </label><input type="text" id="lname" name="lname"><br>

                            <label for="address">Adress: </label><input type="text" id="address" name="adress"><br>
                            <label for="postnr">Postnummer: </label><input type="text" id="postnr" name="postnr"><br>
                            <label for="email">Email: </label><input type="email" id="email" name="email"><br>
                        </fieldset>

                        <fieldset class="Card">
                            <legend>Kortuppgifter: </legend>
                            <label for="cardnr">Kortnummer: </label><input id="cardnr" type="tel"
                                inputmode="numeric" pattern="[0-9\s]{13,19}" autocomplete="cc-number" maxlength="19"
                                placeholder="xxxx xxxx xxxx xxxx">
                            <label for="cardDate">Utgångsdatum: </label>
                                <select name='expireMM' id='expireMM'>
                                    <option value=''>Månad</option>
                                    <option value='01'>Januari</option>
                                    <option value='02'>Februari</option>
                                    <option value='03'>Mars</option>
                                    <option value='04'>April</option>
                                    <option value='05'>Maj</option>
                                    <option value='06'>Juni</option>
                                    <option value='07'>Juli</option>
                                    <option value='08'>Augusti</option>
                                    <option value='09'>September</option>
                                    <option value='10'>Oktober</option>
                                    <option value='11'>November</option>
                                    <option value='12'>December</option>
                                </select>
                                <select name='expireYY' id='expireYY'>
                                    <option value=''>År</option>
                                    <option value='21'>2021</option>
                                    <option value='22'>2022</option>
                                    <option value='24'>2024</option>
                                    <option value='25'>2025</option>
                                    <option value='26'>2026</option>
                                </select>
                                <input class="inputCard" type="hidden" name="expiry" id="expiry" maxlength="4" /><br>
                                <label for="cvc">CVC: </label><input type="text" max="3" name="cvc" id="cvc"><br>

                                <label for="visa"><img style="width: 100px" src="icons/Visa.png"
                                    alt="visa-card"></label> <input type="radio" name="cardType" value="visa"
                                        id="visa">
                                <label for="mastercard"><img style="width: 100px" src="icons/masterCard.png"
                                    alt="Mastercard"></label><input type="radio" name="cardType" value="mastercard"
                                    id="mastercard"><br>
                        </fieldset>
                        <fieldset>
                            <legend>Leverans</legend>
                            <label for="pickup">Hämta själv...</label><input type="radio" name="delivery"
                                value="pickup" id="pickup"><br>
                            <label for="delivery">Få hemskickat!</label><input type="radio" name="delivery"
                                value="delivery" id="delivery">
                        </fieldset>

                        <fieldset>
                            <legend>Kvitto och bekräftan: </legend>
                            <div>
                            <h2><strong>Total: {{localTotal}} kr</strong></h2>
                            <h4>exkl.moms: {{exlusiveTax}} kr</h4>
                            </div> 
                            
                            <button v-on:click="alertMakePayment()">Slutför betalning!</button>
                        </fieldset>
                    </form>
                </div>`

})




//VUE INSTANS -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var app = new Vue({
    el: '#bigVue',

    data: function () {
        return {
            currentPage: 'startPage',
            payment: false,
            showModalProduct: false,
            modalProduct: {},
            loading: true,
            list: [],
            favorites: [],
            randomFavSamples: [],
            cart: [],
            totalAmount: 0,
            beforeTax: 0,

            inputID2: '',
            inputTitle2: '',
            inputPrice2: '',
            inputDescription2: '',
            inputImg2: '',
            inputHowMany2: '',
            inputShowFirst2: '',
            inputCategory2: '',
            categories: {
                1: { id: 1, val: 'Tröja' },
                2: { id: 2, val: 'Byxa' },
                3: { id: 3, val: 'Underkläder' }
            },
            

        }
    },

    methods: {
        changePage: function (page) {
            
            this.currentPage = page
            console.log(page)
        },



        AddToCart: function (ID) {
            console.log(ID)

            var i = this.list.find(item => item.ID === ID);

            this.cart.push(i);
            this.countUpTotalAmount(i.Price)
            console.log(this.cart);

        },

        countUpTotalAmount: function (price) {
            console.log('inside function')

            this.totalAmount += price;
            this.beforeTax += (price - (price * 0.25));
            console.log(this.totalAmount);
            console.log(typeof (this.totalAmount))
        },

        reduceTotalAmount: function(price){
            console.log('reducing total amount...');

            this.totalAmount -= price; 
            this.beforeTax -= (price - (price * 0.25))
            console.log(this.totalAmount); 
        },

        Payment: function () {
            this.payment = true;
        },

        cancelPaymentForm: function(){
            this.payment = false; 
        },

        showModal: function (ID) {
            console.log('showModal activated');
            console.log(ID);

            try {
                this.modalProduct = this.list.find(item => item.ID === ID);
                this.showModalProduct = true;
                console.log(this.showModalProduct)
            }
            catch (error) {
                console.log('Product not found: ' + error);
            }
        },

        closeModal: function () {
            console.log('closing modal');
            this.showModalProduct = false;
            this.modalProduct = {};
        },

        decreaseStock: function (ID) {
            this.modalProduct = this.list.find(item => item.ID === ID);
            if (this.modalProduct.InStock > 0) {
                this.modalProduct.InStock -= 1;
            }
            else {
                alert("Det finns inga fler exemplar av den här produkten för närvarande.");
                return;
            }

        },

        increaseStock: function(ID){
            var itemToIncrease = this.list.find(item => item.ID === ID);

            itemToIncrease.InStock++; 
        },

        removeObj: function (ID) {

            var i  =  this.cart.map(item => item.ID).indexOf(ID);     
            var item = this.cart.find(item => item.ID === ID);

            console.log(ID); 
            console.log('item going in...')
            console.log('index of item: ')
            console.log(i)
            console.log(ID)
            var removed = this.cart.splice(i,1);
            console.log('item removed: ') 
            console.log(removed[0].ID); 
            this.increaseStock(ID); 
            this.reduceTotalAmount(item.Price); 
        },
        
        makePayment: function(){
            alert('Sådär! Ditt köp är nu slutfört! \nTack för att du handlar hos hos oss på The Store!')
            this.payment = false; 
            this.cart = []; 
            this.currentPage = 'startPage';
        },

        addProduct: function(product){
            try{
                if(product !== null){
                this.list.push(product);} 
                console.log('product pushed');
                console.log(this.list); 
            }
            catch(error){
                console.log('Something\' wrong:' + error)
            }
            
        }




    },

    created() {
       
        console.log('Vue Object created')
        console.log(this.list)

    },
})
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------
Vue.component('admin', {

    data: function () {

        return {

            list: app.list,
            inputID: '',
            inputTitle: '',
            inputPrice: '',
            inputDescription: '',
            inputImg: '',
            inputHowMany: '',
            inputShowFirst: '',
            inputCategory: '',
            categories: {
                1: { id: 1, val: 'Tröja' },
                2: { id: 2, val: 'Byxa' },
                3: { id: 3, val: 'Underkläder' }
            },

            inputID2: '',
            inputTitle2: '',
            inputPrice2: '',
            inputDescription2: '',
            inputImg2: '',
            inputHowMany2: '',
            inputShowFirst2: '',
            inputCategory2: '',
            categories: {
                1: { id: 1, val: 'SWEATER' },
                2: { id: 2, val: 'PANTS' },
                3: { id: 3, val: 'UNDERWEAR' }
            }, 
           


            chosenProductToChange: ''


        }

    },

    methods: {

        setNewProduct: function () {

            console.log("setting new product...")
            var newId = getGUID();

            let product = { ID: newId, Category: this.inputCategory, Title: this.inputTitle, Price: this.inputPrice, Description: this.inputDescription, Img: this.inputImg, ShowFirst: false, InStock: this.inputHowMany }
         
            app.list.push(product);
        },

        SetToFavorite: function(ID){
            var itemToFavorite = app.list.find(item => item.ID === ID); 
            itemToFavorite.ShowFirst = true; 
            app.favorites.push(itemToFavorite);
            console.log('Current favorite-amount:'); 
            console.log(app.favorites.length);
        },
        

        RemoveFavorite: function(ID){
            
            var itemToRemove = app.list.find(item => item.ID === ID); 
            itemToRemove.ShowFirst = false; 
            var i  =  app.list.map(item => item.ID).indexOf(ID); 
            app.favorites.splice(i, 1);
            console.log('Current favorite-amount:'); 
            console.log(app.favorites.length);
            
        },

        
        changeProduct: function(ID){
            var itemToChange = app.list.find(item => item.ID === ID)

            console.log(itemToChange.ID);
            console.log(itemToChange.Title); 

            itemToChange.Title = this.inputTitle2; 
            itemToChange.Price = this.inputPrice2; 
            itemToChange.Description = this.inputDescription2; 
            itemToChange.Img = this.inputImg2; 
            itemToChange.InStock = this.inputHowMany2; 
            itemToChange.Category = this.inputCategory2; 
        }, 

        fetchProductToChange: function(ID){
            console.log(ID); 
            if(!ID){
                alert('du måste välja en produkt först!')
                return; 
            }
            var itemToChange = app.list.find(item => item.ID === ID)

            console.log(itemToChange.ID);
            console.log(itemToChange.Title); 

            this.inputTitle2 = itemToChange.Title;
            this.inputPrice2 = itemToChange.Price; 
            this.inputDescription2 = itemToChange.Description; 
            this.inputImg2 = itemToChange.Img;
            this.inputHowMany2 = itemToChange.InStock;
            this.inputCategory2 = itemToChange.Category; 

        }

    },


    template:  `<div>
                    <div class="adminModal addProductModal" ><h2>Lägg till en ny produkt: </h2>
                        <input type="text" placeholder="Namn på produkten" v-model="inputTitle"/>
                        <br><input type="number" step="any" min="1" max="5000" placeholder="Pris på produkten" v-model="inputPrice"/>
                        <br><select v-model="inputCategory" selected="Kategori"> 
                                <option value="" disabled selected hidden> --- Välj kategori --- </option>
                                <option v-for="item in categories" :value="item.val" :key="item.id">{{item.val}}</option>
                            </select>
                        <br><textarea  rows="5" cols="27" placeholder="Beskrivning av produkten" v-model="inputDescription"/>
                        <br><input type="text" placeholder="BildUrl på produkten" v-model="inputImg"/>
                        <br><label for="howMany">Antal ex: </label><input type="number" min="0" max="99" v-model="inputHowMany"> 
                        <br><button style="margin-top: 20px;" v-on:click="setNewProduct()">Lägg till ny produkt!</button>
                    </div>



                    <div class="adminModal changeProductModal" ><h2>Ändra befintlig produkt: </h2>
                        <label for="choose">Välj produkt: </label><br><select id="choose" v-model="chosenProductToChange">
                        <option value=''>--Välj produkt--</option>
                        <option v-for="item in list" v-bind:value="item.ID" >{{item.Title}}</option>
                        </select>
                         <button @click="fetchProductToChange(chosenProductToChange)">HämtaProdukt</button>
                        <input type="text" placeholder="Namn på produkten" v-model="inputTitle2"/>
                        <br><input type="number" step="any" min="1" max="5000" placeholder="Pris på produkten" v-model="inputPrice2"/>
                        <br><select v-model="inputCategory2" selected="Kategori"> 
                            <option value="" disabled selected hidden> --- Välj kategori --- </option>
                            <option v-for="item in categories" :value="item.val" :key="item.id">{{item.val}}</option>
                            </select>
                    <br><textarea  rows="5" cols="27" placeholder="Beskrivning av produkten" v-model="inputDescription2"/>
                    <br><input type="text" placeholder="BildUrl på produkten" v-model="inputImg2"/>
                    <br><label for="howMany">Antal ex: </label><input type="number" min="0" max="99" v-model="inputHowMany2"> 
                    <br><button style="margin-top: 20px;" v-on:click="changeProduct(chosenProductToChange)">Ändra på produkt!</button>
                    </div>



                    <div class="allItems">
                        <div class="adminProduct" :class="[item.ShowFirst ? 'favorites' : 'not']" v-for="item in list" v-bind:key="item.ID">
                            <h4>ID: {{item.ID}}</h4><h5>{{item.Category}}</h5><h2>{{item.Title}}</h2><br><h4>{{item.Price}} kr</h4><p>{{item.Description}}</p><img :src="item.Img">
                            <button v-on:click="SetToFavorite(item.ID)" v-if="!item.ShowFirst" id="addFavoriteButton">Sätt som favorit</button><button v-on:click="RemoveFavorite(item.ID)" v-if="item.ShowFirst" id="addFavoriteButton">Ta bort som favorit</button> 
                        </div>
                    </div>     
                    <div class="adminModalContainer">
                    
                </div>    
                </div>`

})

//------------------------------------
Vue.component('admin-prod-list', {

    data: function () {
        return {
            list: app.list,
            favoriteCounter: app.favorites.length
        }
    },

    methods: {

        alertSetToFavorite: function(ID){
            setToFavorite(ID); 
            
        },

        alertRemoveFavorite: function(ID){
            removeFavorite(ID); 
            
        }

    },
    
    updated(){
        this.favoriteCounter = app.favorites.length; 
    },

  
    template: `<div class="allItems"><div class="adminProduct" :class="[item.ShowFirst ? 'favorites' : 'not']" v-for="item in list" v-bind:key="item.ID">
     <h4>ID: {{item.ID}}</h4><h5>{{item.Category}}</h5><h2>{{item.Title}}</h2><br><h4>{{item.Price.toFixed(2)}} kr</h4><p>{{item.Description}}</p><img :src="item.Img">
    <button v-on:click="alertSetToFavorite(item.ID)" v-if="!item.ShowFirst" id="addFavoriteButton">Sätt som favorit</button><button v-on:click="alertRemoveFavorite(item.ID)" v-if="item.ShowFirst" id="addFavoriteButton">Ta bort som favorit</button></div></div></div>`

})


