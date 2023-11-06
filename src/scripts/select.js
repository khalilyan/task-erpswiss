import { list, listUpdating,fetchData,getDataProducts } from './list.js';

const select_list = document.querySelector('.subCategoryList'); 
let current_products = []


const renderCategoryItem = (item) =>{
    select_list.insertAdjacentHTML('beforeend',
    `<li class="subItem" >
        <div class="toggle server_category">${item}<i class="toggle fa-solid fa-angle-down"></i></div>
        <div class="subCategoryItem"><label><input class='categoryCheckbox' type="checkbox">All ${item}</label></div>
    </li>`
    )

    // OPEN/HIDE EVENT
    const toggleButtons = document.querySelectorAll('.toggle');
    toggleButtons.forEach(button => {
        button.onclick = (e) => open_hide(e.currentTarget)
    });

    // FILTER EVENT
    const categoryCheckbox = document.querySelectorAll('.categoryCheckbox');
    const categoryName = document.querySelectorAll('.server_category');  
    categoryCheckbox.forEach((checkbox,index) => {
        checkbox.onchange = () => {
            let checked = checkbox.checked,
                name = categoryName[index].textContent;   

            filter(name,checked)
        }
    })

    //CLEAR EVENT
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.onclick = () => {
        categoryCheckbox.forEach(el=>el.checked = false);
        current_products.length = 0
        listUpdating(current_products,list)
        getDataProducts()

    }

    // RANGE RENDER
    priceRange()
    
}


const filter = async (categoryName,checked) => {
    try {
        let link = `https://fakestoreapi.com/products/category/${categoryName}`
        const res = await fetchData(link);
        
        if(checked){
            current_products.push(...res);    
        }else{
            current_products = current_products.filter((prod) => {
                return !res.some((item) => item.id === prod.id);
            });
        }
        if(current_products.length === 0){
            listUpdating(current_products,list)
            getDataProducts()
        } else {
            listUpdating(current_products,list)
        }
    } 
    catch (error) {
        console.error(error);
    }
}


const open_hide = async (btn) => {
    const nestedList = btn.nextElementSibling;
    const input = btn.nextElementSibling.querySelector('input');

    if (nestedList.style.display === 'none' || nestedList.style.display === '') {
        if(btn.className === 'toggle server_category'){
            input.checked = true
            await filter(btn.textContent,input.checked)
        }
        nestedList.style.display = 'block';
        btn.style.fontWeight = 900;
        btn.querySelector('i').setAttribute('class', 'toggle fa-solid fa-angle-up');
    } else {
        if(btn.className === 'toggle server_category'){
            input.checked = false
            await filter(btn.textContent,input.checked)
        }
        nestedList.style.display = 'none';
        btn.style.fontWeight = 100;
        btn.querySelector('i').setAttribute('class', 'toggle fa-solid fa-angle-down');
    }
}


async function fetchCategories(){
    try {
        const res = await fetchData('https://fakestoreapi.com/products/categories');
        res.forEach(item=>renderCategoryItem(item))
      } 
      catch (error) {
        console.error(error);
      }
}

const priceRange = () => {
        let input1 = document.querySelector('.min-price')
        let input2 = document.querySelector('.max-price')

        function validateRange(minPrice, maxPrice) {
        if (minPrice > maxPrice) {

            // Swap to Values
            let tempValue = maxPrice;
            maxPrice = minPrice;
            minPrice = tempValue;
        }

        minValue.innerHTML = "$" + minPrice;
        maxValue.innerHTML = "-$" + maxPrice;
        }


        [input1,input2].forEach((element) => {
        element.addEventListener("change", (e) => {
            let minPrice = parseInt(input1.value);
            let maxPrice = parseInt(input2.value);

            validateRange(minPrice, maxPrice);
        });
        });

        validateRange(input1.value, input2.value);
}

fetchCategories()


let minValue = document.getElementById("current-value");
let maxValue = document.getElementById("max-value");

