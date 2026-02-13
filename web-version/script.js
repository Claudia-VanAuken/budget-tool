let currentBalance = 0;

// 1. Function to set the starting income (Combined with Modal logic)
function setIncome() {
    const incomeInput = document.getElementById('income-input');
    
    currentBalance = Number(incomeInput.value);
    
    // Automatically close the pop-up and update everything
    toggleModal();
    updateDisplay();
    saveToLocalStorage();
    incomeInput.value = "";
}

// 2. Function to add expenses (Combined with History and Saving)
function addExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const list = document.getElementById('expense-list');
    
    const cost = Number(amountInput.value);
    currentBalance -= cost;
    
    // Create the history item
    const listItem = document.createElement('li');
    listItem.textContent = `${nameInput.value}: -$${cost.toFixed(2)}`;
    list.appendChild(listItem);

    // Clear and Save
    nameInput.value = "";
    amountInput.value = "";
    updateDisplay();
    saveToLocalStorage();
}

// 3. Keep your addExtraIncome and ToggleModal as they are
function addExtraIncome() {
    const sourceInput = document.getElementById('income-source');
    const amountInput = document.getElementById('extra-income-amount');
    const list = document.getElementById('expense-list');
    
    const extraMoney = Number(amountInput.value);
    
    if (extraMoney > 0) {
        currentBalance += extraMoney;
        const listItem = document.createElement('li');
        listItem.textContent = `${sourceInput.value}: +$${extraMoney.toFixed(2)}`;
        listItem.style.borderLeft = "5px solid #28a745";
        list.appendChild(listItem);

        sourceInput.value = "";
        amountInput.value = "";
        updateDisplay();
        saveToLocalStorage();
    }
}

function toggleModal() {
    const modal = document.getElementById('income-modal');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

// 4. Update the screen (Make sure this exists!)
function updateDisplay() {
    const balanceDisplay = document.getElementById('balance-display');
    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
}

// 5. Storage Logic (Wait—check the "T" in TransactionHistory!)
function saveToLocalStorage() {
    localStorage.setItem('totalBalance', currentBalance);
    const listHTML = document.getElementById('expense-list').innerHTML;
    localStorage.setItem('TransactionHistory', listHTML); 
}

function loadFromLocalStorage() {
    const savedBalance = localStorage.getItem('totalBalance');
    const savedHistory = localStorage.getItem('TransactionHistory');

    if (savedBalance !== null) {
        currentBalance = parseFloat(savedBalance);
        updateDisplay();
    }
    if (savedHistory !== null) {
        document.getElementById('expense-list').innerHTML = savedHistory;
    }
}

loadFromLocalStorage();
