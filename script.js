const menu = [
    { name: "🍕 Pizza", price: 250 },
    { name: "🍔 Burger", price: 120 },
    { name: "🍝 Pasta", price: 180 },
    { name: "🥪 Sandwich", price: 100 },
    { name: "🍟 French Fries", price: 90 },
    { name: "🧋 Cold Coffee", price: 150 },
    { name: "🍹 Mojito", price: 130 },
    { name: "🍨 Ice Cream", price: 80 }
];

const menuSelect = document.getElementById("menu");

menu.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} - ₹${item.price}`;
    menuSelect.appendChild(option);
});

let bill = [];

function addItem() {
    const selected = document.getElementById("menu").value;
    const qty = parseInt(document.getElementById("qty").value, 10);

    if (selected === "" || qty <= 0) {
        alert("Please select an item and quantity.");
        return;
    }

    const item = menu.find((food) => food.name === selected);

    bill.push({
        name: item.name,
        price: item.price,
        qty: qty,
        total: item.price * qty
    });

    displayBill();
}

function displayBill() {
    const body = document.getElementById("billBody");
    body.innerHTML = "";

    if (bill.length === 0) {
        body.innerHTML = `<tr><td colspan="4" class="empty-state">Your bill is empty. Add a few items to get started.</td></tr>`;
        updateSummary(0);
        return;
    }

    let subtotal = 0;

    bill.forEach((item) => {
        subtotal += item.total;
        body.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${item.qty}</td>
                <td>₹${item.total}</td>
            </tr>
        `;
    });

    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const gst = subtotal * 0.18;
    const grand = subtotal + gst;

    document.getElementById("subtotal").innerHTML = subtotal.toFixed(2);
    document.getElementById("gst").innerHTML = gst.toFixed(2);
    document.getElementById("grandTotal").innerHTML = grand.toFixed(2);
}

function clearBill() {
    bill = [];
    displayBill();

    document.getElementById("qty").value = 1;
    document.getElementById("menu").selectedIndex = 0;
}

function printBill() {
    if (bill.length === 0) {
        alert("Add items before printing the bill.");
        return;
    }

    window.print();
}

function downloadBill() {
    if (bill.length === 0) {
        alert("Add items before downloading the bill.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const subtotal = bill.reduce((sum, item) => sum + item.total, 0);
    const gst = subtotal * 0.18;
    const grand = subtotal + gst;

    doc.setFontSize(20);
    doc.text("Fresh Bite Cafe", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${document.getElementById("billDate").textContent}`, 14, 30);
    doc.text("Receipt", 14, 38);

    let y = 48;
    doc.text("Item", 14, y);
    doc.text("Qty", 90, y);
    doc.text("Total", 140, y);
    y += 8;

    bill.forEach((item) => {
        doc.text(item.name, 14, y);
        doc.text(String(item.qty), 90, y);
        doc.text(`₹${item.total}`, 140, y);
        y += 8;
    });

    y += 6;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, y);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 14, y + 8);
    doc.setFontSize(14);
    doc.text(`Grand Total: ₹${grand.toFixed(2)}`, 14, y + 20);

    doc.save("restaurant-bill.pdf");
}

document.getElementById("billDate").textContent = new Date().toLocaleDateString();
displayBill();