let currentBalance = 0;

// 1. Function to set the starting income
function setIncome() {
    const incomeInput = document.getElementById('income-input');
    const balanceDisplay = document.getElementById('balance-display');
    
    // Convert text to a number
    currentBalance = Number(incomeInput.value);
    
    // Update the screen
    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
    
    // Clear the input box
    incomeInput.value = "";
}

// 2. Function to subtract expenses
function addExpense() {
    const amountInput = document.getElementById('expense-amount');
    const balanceDisplay = document.getElementById('balance-display');
    
    const cost = Number(amountInput.value);
    
    // Subtract from our state
    currentBalance -= cost;
    
    // Update the screen
    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
    
    // Clear the box
    amountInput.value = "";
}

function toggleModal() {
    const modal = document.getElementById('income-modal');
    // If it's hidden, show it. If it's showing, hide it.
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

function setIncome() {
    const incomeInput = document.getElementById('income-input');
    const balanceDisplay = document.getElementById('balance-display');
    
    currentBalance = Number(incomeInput.value);
    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
    
    // Automatically close the pop-up after setting
    toggleModal();
}

function addExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const list = document.getElementById('expense-list');
    
    const cost = Number(amountInput.value);
    currentBalance -= cost;
    
    // Update balance on screen
    document.getElementById('balance-display').textContent = `$${currentBalance.toFixed(2)}`;

    // Create a new list item (li) for the history
    const listItem = document.createElement('li');
    listItem.textContent = `${nameInput.value}: -$${cost.toFixed(2)}`;
    list.appendChild(listItem);

    // Clear inputs
    nameInput.value = "";
    amountInput.value = "";
}
function addExtraIncome() {
    const sourceInput = document.getElementById('income-source');
    const amountInput = document.getElementById('extra-income-amount');
    const balanceDisplay = document.getElementById('balance-display');
    const list = document.getElementById('expense-list');
    
    const extraMoney = Number(amountInput.value);
    
    if (extraMoney > 0) {
        // Update the math
        currentBalance += extraMoney;
        
        // Update display
        balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;

        // Add to history with a "Positive" style
        const listItem = document.createElement('li');
        listItem.textContent = `${sourceInput.value}: +$${extraMoney.toFixed(2)}`;
        listItem.style.borderLeft = "5px solid #28a745"; // Green stripe for income!
        list.appendChild(listItem);

        // Clear inputs
        sourceInput.value = "";
        amountInput.value = "";
    }
}