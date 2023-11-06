export const list = document.querySelector('.BrandsList');
const rowAboutPage = document.querySelector('.rowAboutPage');
const my_cart_quantity = document.querySelector('.my_cart_quantity');

// STATE

const cart = [];
const liked = [];
const cart_unique = new Set();



// WORKING WITH RENDERING


const listRendering = (product,data) => {
    list.insertAdjacentHTML('beforeend',`
        <div class="BrandContainer">
        <div class="aboutBrandWrapper">
            <div class="BrandCover">Brand_Nmae</div>
            <div class="aboutBrand">
                <h1 class="BrandTitle">${product.title}</h1>
                <p class="aboutBrandTxt">${product.description}</p>
                <a class="showMore">Learn more</a>
            </div>
        </div>
        <div class="brand_products_list">
            <div class="product_item">
                <div class="product_image_container">
                    <a href="#">
                        <img class="prodImage" src="${product.image}" alt="product_image">
                    </a>
                </div>

                <span class="product_info">
                    <span class="product_name_size">
                        <label>${product.title}</label>
                        <p>${product.rating.rate} x ${product.rating.count} ml</p>
                    </span>

                    <span class="cart_info">
                        <p>$ ${product.price}</p>
                        <button id='addToCartBtn'>+<i class="fa-solid fa-bag-shopping" style="color: #ffffff" added='false'></i></button>
                    </span>
                </span>
                    <span class="heart"><i class="like ${!product.liked?'fa-regular':'fa-solid'} fa-heart"></i></span>
            </div>
        </div>
        </div>`
    )

    //CART EVENT
    const addToCartBtn = list.lastElementChild.querySelector('#addToCartBtn');
    addToCartBtn.onclick = () => {
        addToCart(product);
    };

    //LIKE EVENNT
    const likeBtn = list.lastElementChild.querySelector('.fa-heart');
    likeBtn.onclick = (e) =>{
        like(product,e)
    }

    //SHOW MORE/LESS EVENT
    const show_more_less = list.lastElementChild.querySelector('.showMore');
    let  prevEl = show_more_less.previousElementSibling,
         more = prevEl.innerHTML,
         less = prevEl.innerHTML.slice(0,388)+'...';
    if(prevEl.innerHTML.length<=388){
        show_more_less.style.display = 'none'
    } else {
        prevEl.innerHTML = less
    }
    show_more_less.onclick = (e) =>{
        textMoreLess(e,more,less,prevEl)
    }

    //SORT EVENT
    const selectTag = document.getElementById('sortingVariants');
    selectTag.onchange = () => {
        Sort(selectTag,data)
    }

    // GET RESULTS
    const results = document.getElementById('results');
    results.textContent = `${data.length} Results`
} 

const addToCart = async (data) => {
    if(data){
        cart.push(data)
        cart_unique.add(data.id)
        await fetch('https://fakestoreapi.com/carts',{
            method:"POST",
            body:JSON.stringify(data)
        }).then(res=>console.log('added to cart: ',res))
    }
    my_cart_quantity.style.display = 'inline-block'
    my_cart_quantity.innerHTML = cart_unique.size
}


const textMoreLess = (e,more,less,prevEl) => {    
        const btn = e.target        
        if(prevEl.innerHTML.length===391){
            prevEl.innerHTML = more
            btn.innerHTML = 'Learn less'
        } else {
            prevEl.innerHTML = less
            btn.innerHTML = 'Learn more'
        }
}


const like = async (data,e) => {
    fetch(`https://fakestoreapi.com/products/${data.id}`,{
            method:"PUT",
            body:JSON.stringify({...data,liked: true})
        }).then(res=>res.json())        

    if(e.target.style.opacity==='0.7'){
        liked.pop(data)
        e.target.style.opacity=1
        e.target.setAttribute('class','fa-regular fa-heart')
    } else {
        liked.push(data)
        e.target.style.opacity='0.7'
        e.target.setAttribute('class','fa-solid fa-heart')
    }
}


export const listUpdating = (data,list) => {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    data.map((prod)=>{
        listRendering(prod,data)
    })
}


export function Sort(select,data) {
        let selectedOption = select.value;
        
        if (selectedOption === "opt1") {
            data.sort((a,b)=>b.price-a.price)
            listUpdating(data,list);
    
        } else if (selectedOption === "opt2") {
            data.sort((a,b)=>a.price-b.price)
            listUpdating(data,list);
    
        } else if (selectedOption === "opt3") {
            data.sort((a,b)=>b.title[0]>a.title[0]?-1:1)
            listUpdating(data,list);
        } else if (selectedOption === "opt4") {
            data.sort((a,b)=>b.title[0]>a.title[0]?1:-1)
            listUpdating(data,list);
        }   
} 






// WORKING WITH DATA

export async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json(); 
        return data;
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

export async function getDataProducts(){
    try {
        const res = await fetchData('https://fakestoreapi.com/products');
        res.map((product)=>{
            listRendering(product,res);
        })
      } 
      catch (error) {
        console.error(error);
      }
}

async function fetchDataCart(){
    try {
        const res = await fetchData('https://fakestoreapi.com/carts');
        cart.concat(res);
        cart_unique.add(...res)
        addToCart()
      } 
      catch (error) {
        console.error(error);
      }
}

async function fetchLikedProducts(){
     try {
        const res = await fetchData('https://fakestoreapi.com/products');
        const likedProducts = res.filter(item=>item.liked === false);
        liked.push(...likedProducts)
      } 
      catch (error) {
        console.error(error);
      }
}



getDataProducts()
fetchDataCart()
fetchLikedProducts()



