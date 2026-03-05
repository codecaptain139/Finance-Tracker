let transactions = [];

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
    event.preventDefault(); //This is to stop the by default submission behaviour of form.

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
    updateSummary();
});

function formatDate(dateString){
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString();
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

    if(balance < 0) {
        balanceValue.classList.add("negative-balance");
    } else {
        balanceValue.classList.remove("negative-balance");
    }
}

renderTransactions();
updateSummary();