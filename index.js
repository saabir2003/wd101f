const getElement = (id) => document.getElementById(id);
const getElementsWithClass = (className) => document.getElementsByClassName(className);

let userEntries = [];

function fillTable() {
    const storedEntries = localStorage.getItem("user_entries");
    userEntries = storedEntries ? JSON.parse(storedEntries) : [];
    return userEntries;
}

userEntries = fillTable();

const username = getElement("name"),
  email = getElement("email"),
  password = getElement("password"),
  tc = getElement("tc"),
  dob = getElement("dob");

const errorMsg = getElementsWithClass("errormsg");
const form = getElement("form");

function verify(elem, message, condition) {
    if (condition) {
        elem.style.border = "2px solid red";
        elem.setCustomValidity(message);
        elem.reportValidity();
    } else {
        elem.style.border = "2px solid green";
        elem.setCustomValidity('');
    }
}

function checkDOB() {
    const age = new Date().getFullYear() - new Date(dob.value).getFullYear();
    return age >= 18 && age <= 55;
}

const messageName = "Username must be at least 3 characters long";
const messageEmail = "Email must be valid";
const messageAgree = "You must agree to the terms and conditions";
const messageDOB = "Your age must be between 18 and 55 to continue";

username.addEventListener("input", (e) => {
    const conditionName = username.value.length < 3;
    e.preventDefault();
    verify(username, messageName, conditionName);
});

email.addEventListener("input", (e) => {
    const conditionEmail = !(email.value.includes("@") && email.value.includes("."));
    e.preventDefault();
    verify(email, messageEmail, conditionEmail);
});

dob.addEventListener("input", (e) => {
    const conditionDOB = !checkDOB();
    e.preventDefault();
    verify(dob, messageDOB, conditionDOB);
});

tc.addEventListener("input", (e) => {
    const conditionAgree = !tc.checked;
    e.preventDefault();
    verify(tc, messageAgree, conditionAgree);
});

function makeObject() {
    const isChecked = tc.checked;
    return {
        name: username.value,
        email: email.value,
        password: password.value,
        dob: dob.value,
        checked: isChecked
    };
}

function displayTable() {
    const table = getElement("user-table");
    const entries = userEntries;
    let tableHTML = `<tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Dob</th>
                        <th>Accepted terms?</th>
                    </tr>\n`;
    for (let i = 0; i < entries.length; i++) {
        tableHTML += `<tr>
                        <td>${entries[i].name}</td>
                        <td>${entries[i].email}</td>
                        <td>${entries[i].password}</td>
                        <td>${entries[i].dob}</td>
                        <td>${entries[i].checked}</td>
                    </tr>\n`;
    }
    table.innerHTML = tableHTML;
}

form.addEventListener("submit", (e) => {
    const conditionAgree = !tc.checked;
    e.preventDefault();
    if (!conditionAgree) {
        const userObject = makeObject();
        userEntries.push(userObject);
        localStorage.setItem("user_entries", JSON.stringify(userEntries));
    }
    displayTable();
});

window.onload = () => {
    displayTable();
};
