function saveTransaction(){
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

let transactions = [];

let storedTransactions = localStorage.getItem("transactions");

if(storedTransactions){
    transactions = JSON.parse(storedTransactions);
}

const transactionForm = document.getElementById("transaction-form");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transaction-list");

const balanceValue = document.getElementById("balance-value");
const incomeValue = document.getElementById("income-value");
const expenseValue = document.getElementById("expense-value");

transactionForm.addEventListener("submit", function(event) {
    event.preventDefault(); //In form cases the browser default behaviour is to send the GET/POST request and reload the page so to stop this behaviour we use preventDeafult method and this event object we get from the browser whenever any event gets fire.

    const selectValue = typeInput.value;
    const amountValue = Number(amountInput.value); //here we use number method because .value methods gives value in string data types always.
    const categoryValue = categoryInput.value;
    const dateValue = dateInput.value;

    if (!selectValue || amountValue <= 0 || !dateValue || !categoryValue) { //this is defensive programming to stop function execution in case if people don't selectValue and amount is less than or equal to 0 and if the dateValue is empty and category value is empty.
        return;
    }

    const transaction = {
        id: Date.now(),
        type: selectValue,
        amount: amountValue,
        category: categoryValue,
        date: dateValue
    }

    transactions.push(transaction); //push method is used to push element at the last index of the array.
    transactionForm.reset(); //reset method is used to reset the input from forms input.


    renderTransactions();
    saveTransaction();
    updateSummary();
});

function formatDate(dateString){
    const dateObj = new Date(dateString); //This new Date() creats a date object which is not in a human readable form it look like this "[year:2026, month:3, day:22]".
    return dateObj.toLocaleDateString(); //then we use toLocaleDateString method which coverts the object into human readable form like this "22/03/2026".
}

function renderTransactions() {
    transactionList.innerHTML = "";

    if(transactions.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = "No transactions added yet.";
        emptyMessage.classList.add("empty-state");
        transactionList.appendChild(emptyMessage);
        return
    }

    transactions.forEach(function(transaction) {
        const parentDiv = document.createElement('div');
        parentDiv.classList.add("transaction-item");

        const infoDiv = document.createElement('div');
        const actionDiv = document.createElement('div');
        

        const categoryElement = document.createElement("p");
        categoryElement.textContent = transaction.category;

        const dateElement = document.createElement("span");
        dateElement.textContent = formatDate(transaction.date)

        const amountElement = document.createElement("span");

        let formattedAmount;

        if(transaction.type === "income"){
            formattedAmount = "+ ₹" + transaction.amount;
            amountElement.classList.add("income-amount");
        } else {
            formattedAmount = "- ₹" + transaction.amount;
            amountElement.classList.add("expense-amount");
        }

        amountElement.textContent = formattedAmount;

        infoDiv.append(categoryElement, dateElement, amountElement);
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function(){
            transactions = transactions.filter(item => {
                return item.id !== transaction.id;
            })

            renderTransactions();
            saveTransaction();
            updateSummary();
        })

        actionDiv.appendChild(deleteButton);

        parentDiv.append(infoDiv, actionDiv);
        transactionList.appendChild(parentDiv);
    });
}

function updateSummary() {
    const totalIncome = transactions.reduce((acc, transaction) => 
        transaction.type === "income" ? acc + transaction.amount : acc 
    , 0);

    const totalExpense = transactions.reduce((acc, transaction) =>
        transaction.type === "expense" ? acc + transaction.amount : acc
    , 0);

    const balance = totalIncome - totalExpense;

    balanceValue.textContent = "₹" + balance;
    incomeValue.textContent = "₹" + totalIncome;
    expenseValue.textContent = "₹" + totalExpense;

    //Here we remove and also add the class so prevent showing the positive balance in red color but instead of writing this 4 lines of code you can also use toggle here toggle is a method in which a second parameter takes a condition in case of condition gets true then your class gets add and is case of false it gets removed.

    // balanceValue.classList.toggle("negative-balance", balance < 0);

    if(balance < 0) {
        balanceValue.classList.add("negative-balance");
    } else {
        balanceValue.classList.remove("negative-balance");
    }
}

renderTransactions();
updateSummary();