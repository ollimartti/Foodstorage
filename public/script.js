// Fetch product_tbl data from database and write it to html table

function loadTableData(){
  
  fetch('/list')

  .then(function(response){
   return response.json();
})

.then(function(products){
   let placeholder = document.querySelector("#data-output");
   let out = "";
   for(let product of products){
      out += `
         <tr>
         <td>${product.id}</td>
         <td>${product.prod_item}</td>
         <td>${product.prod_group}</td>
         <td>${product.prod_pvm}</td>
         </tr>
      `;
      //console.log(out);
   } 
   placeholder.innerHTML = out;
});
}

  // Fetch product_code_tbl data from database and write it to html table

function loadEanData(){
  
  fetch('/items')

  .then(function(response){
   return response.json();
})

.then(function(products){
   let placeholder = document.querySelector("#data-output");
   let out = "";
   for(let product of products){
      out += `
         <tr>
         <td>${product.ean_code}</td>
         <td>${product.product_name}</td>
         <td>${product.product_group}</td>
         </tr>
      `;
      //console.log(out);
   } 
   placeholder.innerHTML = out;
});
}

  // Dynamic search from product field in html table

function dynamicCellSearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

    // Find product name from database using EAN-code

function findProductName() {
  fetch('/code')

  .then(function(response){
   return response.json();
  })

  .then(function(prod){
    const placeholder = document.querySelector("#prod");
    const out = "";
    
     out = `${prodname.product_name}`; 
     //console.log(out);
    
    placeholder.innerHTML = out;
  });
}


const d = new Date();
document.getElementById("todayis").innerHTML = d.toDateString();

