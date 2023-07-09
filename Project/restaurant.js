

//get form data
const dishName = document.getElementById('dishName');
const dishPrice = document.getElementById('dishPrice');
const dishQuantity = document.getElementById('dishQuantity');
const form = document.getElementById('myForm');
const tableForm = document.getElementById('tables');



//create save function

function onSubmit(e){
    e.preventDefault();

    const orderDetails={
        dishName : dishName.value,
        dishPrice : dishPrice.value,
        dishQuantity : dishQuantity.value,
        tableNo: document.getElementById('orderTable').options[document.getElementById('orderTable').value].value,
    }
    //posting the data to the sserver

    axios.post("https://crudcrud.com/api/1e1bd4c4c5414b5caf4833b72164d348/orderData",orderDetails)
    .then((response) => {

        //creating a table which gets added to the respective ordered table data;
        createTable(response.data);
    })

    .catch((error) => {
        console.error("Something went wrong");
    })
}


//create delete function


function deleteOrder(e){

    let targetElem = e.target;

    if(targetElem.id === 'delete'){
        if(confirm('Are you sure you want to delete?')){
            //fetching the table body on which the delete button was clicked
            const delBody = e.target.parentElement.parentElement.parentElement;

            //now we have to find out in which table is the body present so that we can delete it from that 
            //table's data.
            let deltable;
            if(delBody.name === 0) deltable = document.getElementById('firstTable');
            if(delBody.name === 1) deltable = document.getElementById('secondTable');
            if(delBody.name === 2) deltable = document.getElementById('thirdTable');


            //since there can be multiple table bodies we will find the index of the body to be deleted
            var tableBodies = deltable.querySelectorAll("tbody");
            var index = -1;
            tableBodies.forEach((tableBody,i) => {
                if(tableBody.id === delBody.id){
                    index = i;
                    return;
                }
            })

            //once we have found the index we will delete it form it parent
            deltable.removeChild(deltable.children[i]);


            //we will also delete the data from the server and will handle if there are any errors
            axios.delete(`https://crudcrud.com/api/1e1bd4c4c5414b5caf4833b72164d348/orderData/${delBody.id}`)

            .then((response)=>{
                console.log("Order Deleted Sucessfully")
            })

            .catch(error => {

                // Handle the error
                if (error.response) {
                  // The request was made and the server responded with a status code
                  console.log('Response status:', error.response.status);
                  console.log('Response data:', error.response.data);
                } 
                
                else if (error.request) {
                  // The request was made but no response was received
                  console.log('No response received:', error.request);
                } 
                
                else {
                  // Something happened in setting up the request that triggered an error
                  console.log('Error message:', error.message);
                }
                console.log('Error config:', error.config);
              });
        }
    }
}



// create table creation function
function createTable(orderDetails){
    //we have to find out on which table the order was receieved
    let table;
    let tableno = parseInt(orderDetails.tableNo);
    if(tableno===0) table = document.getElementById("firstTable");
    if(tableno===1) table = document.getElementById("secondTable");
    if(tableno===2) table = document.getElementById("thrirTable");
    table = tableno;


    //As now we have fetchd for which table the order was given, we can create a html table there,
    const newTable = document.createElement("table");
    newTable.class = 'table';

    //adding a body to the table
    const newBody = document.createElement('tbody');
    tbody.id = orderDetails._id;
    tbody.name = tableno;

    //adding a row to the table
    const newRow = document.createElement("tr");

    //adding cells to the table
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");

    //now after creating the cells we will populate it with the data 
    cell1.textContent = orderDetails.dishName;
    cell2.textContent = orderDetails.dishQuantity;
    cell3.textContent = parseInt(orderDetails.dishPrice)* parseInt(orderDetails.dishQuantity);
    var deleteButton = document.createElement("button");
    deleteButton.className = 'button-delete';
    deleteButton.id = 'delete';
    deleteButton.appendChild(document.createTextNode('Delete Order'));
    cell4.appendChild(deleteButton);

    // Now append the cells to the row and the row to the body and the body to the table
    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);
    newRow.appendChild(cell4);
    tbody.appendChild(newRow);
    table.appendChild(tbody);


    //Now we will empty the form data
    dishName.value ='';
    dishPrice.value='';
    dishQuantity.value='';
}



// create reload function

function loadOrderDeatails(e){


    axios.get("https://crudcrud.com/api/1e1bd4c4c5414b5caf4833b72164d348/orderData").then((response) => {

        //We have to check whether there is any saved data in the database
        let length = Object.keys(response.data).length  

        //If there is no data in the server then we have to show that there are no order
        if(length<1){
            console.log('No Orders ')
        }

        //If there is any data stored in the server then we will show the data in the webpage
        for(let i = 0;i<response.data.length;i++) {
            createTable(response.data[i])
        }
    })

    .catch((error) => {
        document.body.innerHTML= document.body.innerHTML+ "<h4> Something went wrong</h4>"
    });
}


//Adding Event Listeners

form.addEventListener('submit', onSubmit);
window.addEventListener('DOMContentLoaded', loadOrderDeatails); 
tableForm.addEventListener('click',deleteOrder);




