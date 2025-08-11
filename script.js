const siteWeb = document.getElementById("site-web");
const size = document.getElementById("size");
const numberCharacters = document.getElementById("number-characters");

const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const digitCheck = document.getElementById("digit");
const symbolCheck = document.getElementById("symbol");

const generateBtn = document.getElementById("generate");
const showPassword  = document.getElementById("generate-password");
const passwordResult = document.getElementById("password-result");

const globalStrongOfPassword = document.getElementById("global-strong-of-password");
const strongOfPassword = document.getElementById("strong");
const textOfPasswordStrong = document.getElementById("text-of-password-strong");

const copyToClipboard = document.getElementById("copy-to-clipboard");
const passwordCopied = document.getElementById("password-copied");
const preservedPassword = document.getElementById("preserved-password");
const savedPassword = document.getElementById("save-password");
const passwordToSave = document.getElementById("password-to-save");

const totalNumberOfPassword = document.getElementById("totalNumberOfPassword");
const totalOfStrongPassword = document.getElementById("totalOfStrongPassword");
const moySize = document.getElementById("moySize");

const allPasswords = document.getElementById("all-passwords");


const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    digit: '1234567890',
    symbol: '?./;:,@^$#!',
}

let listOfAllPasswords = [];
let listOfStrongPasswords = [];
let totalOfLength = 0;
let passwordCounter = 0;

totalNumberOfPassword.innerText = String(listOfAllPasswords.length);
totalOfStrongPassword.innerText = String(listOfStrongPasswords.length);
moySize.innerText = String(totalOfLength);


generateBtn.addEventListener("click", generatePassword);
size.addEventListener("input", showLengthOfPassword);
copyToClipboard.addEventListener('click', copyPasswordToClipboard);

savedPassword.addEventListener('click', () =>{
    const password = passwordResult.value;
    updateUI(password);
})



function generatePassword() {
    let sizeOfPassword = size.value;
    let numberOfOptions = 0;
    let selectChars = '';
    let password = '';
    if (siteWeb.value === "") {
        alert('Veuillez entrer un site web pour générer un mot de passe');
        return null;
    }

    if (size.value !== "") {
        if (uppercaseCheck.checked) { selectChars += characters.uppercase; numberOfOptions ++; }
        if (lowercaseCheck.checked) { selectChars += characters.lowercase; numberOfOptions ++; }
        if (digitCheck.checked) { selectChars += characters.digit; numberOfOptions ++; }
        if (symbolCheck.checked) { selectChars += characters.symbol; numberOfOptions ++; }
    }

    if (numberOfOptions < 2 ) {
        alert('Vous devez sélectionner au moins deux types de caractères pour votre mot de passe');
        return null;
    }
    for (let i = 0; i < sizeOfPassword; i++) {
        const selectedChar = Math.floor(Math.random() * selectChars.length);
        password += selectChars[selectedChar];
    }
    calculateStrengthOfPassword(password);
    showGeneratePassword(password);
    optionToSavePassword(password);

    return password;
}


function calculateStrengthOfPassword(password) {

    let score = 0;

    // Longueur (0-30 points)
    if (password.length >= 12) {
        score += 30;
    } else if (password.length >= 8) {
        score += 20;
    } else if (password.length >= 6) {
        score += 10;
    }

    // Variété des caractères (0-40 points)
    let varietyScore = 0;
    if (/[a-z]/.test(password)) varietyScore += 10;
    if (/[A-Z]/.test(password)) varietyScore += 10;
    if (/[0-9]/.test(password)) varietyScore += 10;
    if (/[^a-zA-Z0-9]/.test(password)) varietyScore += 15; //

    score += varietyScore;


    // Bonus pour mélange de types consécutifs
    if (/[a-z][A-Z]|[A-Z][a-z]/.test(password)) score += 5;
    if (/[a-zA-Z][0-9]|[0-9][a-zA-Z]/.test(password)) score += 5;
    if (/[a-zA-Z0-9][^a-zA-Z0-9]/.test(password)) score += 10;

    updatePasswordStrengthDisplay(score);

    return score;
}



function updatePasswordStrengthDisplay(score) {
    globalStrongOfPassword.style.display = 'flex';

    // Mettre à jour le score affiché
    textOfPasswordStrong.innerText = String(score);

    // Récupérer la barre de progression (input range)
    const strengthBar = document.getElementById('strength-bar');

    // Mettre à jour la valeur de l'input
    strengthBar.value = score;
    strongOfPassword.value = Number(score);

    // Nettoyer les classes précédentes du score
    textOfPasswordStrong.classList.remove('text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500');

    // Définir les couleurs selon le score
    let textClass = '';
    let barStyle = '';

    if (score >= 80) {
        textClass = 'text-green-500';
        barStyle = 'background: linear-gradient(to right, #10b981 0%, #10b981 100%);'; // Vert
    } else if (score >= 65) {
        textClass = 'text-green-500';
        barStyle = 'background: linear-gradient(to right, #22c55e 0%, #22c55e 100%);'; // Vert clair
    } else if (score >= 50) {
        textClass = 'text-yellow-500';
        barStyle = 'background: linear-gradient(to right, #eab308 0%, #eab308 100%);'; // Jaune
    } else if (score >= 30) {
        textClass = 'text-orange-500';
        barStyle = 'background: linear-gradient(to right, #f59e0b 0%, #f59e0b 100%);'; // Orange
    } else {
        textClass = 'text-red-500';
        barStyle = 'background: linear-gradient(to right, #ef4444 0%, #ef4444 100%);'; // Rouge
    }

    // Appliquer les styles
    textOfPasswordStrong.classList.add(textClass);
    strengthBar.style.cssText = barStyle + ' height: 12px; border-radius: 6px; appearance: none; cursor: default;';

    // Cacher le thumb du slider
    const style = document.createElement('style');
    style.textContent = `
        #strength-bar::-webkit-slider-thumb { display: none; }
        #strength-bar::-moz-range-thumb { display: none; }
    `;
    if (!document.querySelector('#strength-bar-style')) {
        style.id = 'strength-bar-style';
        document.head.appendChild(style);
    }
}

function createStrengthLabel() {
    const label = document.createElement('span');
    label.id = 'strength-label';
    label.classList.add('ml-2', 'text-sm', 'font-medium');
    textOfPasswordStrong.parentNode.appendChild(label); // ✅ Cette ligne était manquante !
    return label;
}




function showLengthOfPassword() {
    numberCharacters.style.display = "flex";
    numberCharacters.innerText = size.value;
}

function showGeneratePassword(password) {
    showPassword.style.display = "flex";
    passwordResult.value = password;
}

function copyPasswordToClipboard(password) {
    navigator.clipboard.writeText(passwordResult.value);
    passwordCopied.style.display = "flex";
    passwordCopied.innerText = 'Mot de passe copié';
    setTimeout(() => {
        passwordCopied.style.display = "none";
    }, 2000);
}


function optionToSavePassword(password) {
    preservedPassword.style.display = "flex";
    passwordToSave.innerText = password;
    setTimeout(() => {
        preservedPassword.style.display = "none";
    }, 20000);
}


function updateListOfPassword(password) {

    const scoreValue = calculateStrengthOfPassword(password);

    let newPassword = {
        id : passwordCounter++,
        title: password,
        strong: scoreValue,
        length: size.value,
        date: new Date().toLocaleString(),
    };

    listOfAllPasswords.push(newPassword);

    totalNumberOfPassword.innerText = String(listOfAllPasswords.length);

    if (newPassword.strong > 50 ) {
        listOfStrongPasswords.push(newPassword);
    }

    totalOfStrongPassword.innerText = String(listOfStrongPasswords.length);

    return newPassword;
}


function updateUI(password) {

    let newPassword = updateListOfPassword(password);

    const itemDiv = document.createElement("div");
    allPasswords.appendChild(itemDiv);
    allPasswords.prepend(itemDiv)
    itemDiv.className = "item";
    itemDiv.classList.add('bg-white', 'flex', 'border-l-3', 'border-blue-500', 'rounded-md', 'p-2', 'justify-between');

    const passwordDetails = document.createElement('div');
    passwordDetails.classList.add('flex' , 'flex-col');
    itemDiv.appendChild(passwordDetails);

    const h1PasswordDetails = document.createElement('h1');
    h1PasswordDetails.classList.add('font-bold', 'text-sm');
    h1PasswordDetails.textContent = newPassword.title;
    passwordDetails.appendChild(h1PasswordDetails);

    const datePasswordDetails = document.createElement('p');
    datePasswordDetails.classList.add('text-sm', 'text-gray-500');
    datePasswordDetails.textContent = newPassword.date;
    passwordDetails.appendChild(datePasswordDetails);

    const strongPasswordDetails = document.createElement('p');
    strongPasswordDetails.classList.add('text-sm', 'text-gray-500');
    strongPasswordDetails.textContent = 'Force : ' +  newPassword.strong + '/100';
    passwordDetails.appendChild(strongPasswordDetails);


    const passwordOptions = document.createElement('div');
    passwordOptions.classList.add('flex', 'flex-col', 'gap-2', 'justify-center', 'items-center', 'sm:w-auto', 'sm:flex-row', 'w-full');
    itemDiv.appendChild(passwordOptions);

    const copyMyPassword = document.createElement('button');
    copyMyPassword.id = 'decision-to-copy-password';
    copyMyPassword.classList.add('bg-green-500', 'rounded-md', 'text-white', 'text-sm', 'px-2', 'py-1', 'rounded-sm', 'w-full', 'sm:w-auto', 'min-w-20');
    copyMyPassword.innerText = 'Copier';
    passwordOptions.appendChild(copyMyPassword);

    const deleteMyPassword = document.createElement('button');
    deleteMyPassword.id = 'decision-to-delete-password';
    deleteMyPassword.classList.add('bg-red-500', 'rounded-md', 'text-white', 'text-sm', 'px-2', 'py-1', 'rounded-sm', 'w-full', 'sm:w-auto', 'min-w-20');
    deleteMyPassword.innerText = 'Supprimer';
    passwordOptions.appendChild(deleteMyPassword);

    const decisionToCopyPassword = document.getElementById('decision-to-copy-password')
    const decisionToDeletePassword = document.getElementById('decision-to-delete-password');

    decisionToCopyPassword.addEventListener('click', copyPasswordToClipboard);
    decisionToDeletePassword.addEventListener('click', () =>{
        allPasswords.removeChild(itemDiv);

        const passwordId = newPassword.id;
        listOfAllPasswords = listOfAllPasswords.filter(pwd => pwd.id !== passwordId);

        listOfStrongPasswords = listOfStrongPasswords.filter(pwd => pwd.id !== passwordId);

        updateStatistics();
    });

    updateStatistics();
}


function updateStatistics() {
    // Total des mots de passe
    totalNumberOfPassword.innerText = String(listOfAllPasswords.length);

    // Total des mots de passe forts
    totalOfStrongPassword.innerText = String(listOfStrongPasswords.length);

    // Moyenne des longueurs
    if (listOfAllPasswords.length > 0) {
        let sumOfLength = 0;
        for (let pwd of listOfAllPasswords) {
            sumOfLength += Number(pwd.length);
        }
        totalOfLength = (sumOfLength / listOfAllPasswords.length).toFixed(1);
        moySize.innerText = String(totalOfLength);
    } else {
        moySize.innerText = '0';
    }
}











/**generateBtn.addEventListener('click', generatePassword);

size.addEventListener('input', (event) => {
    numberCharacters.style.display = 'flex';
    numberCharacters.innerText = size.value;
});

function generatePassword () {

    let selectChars = '';
    let numberOfOptions = 0;

    if (uppercaseCheck.checked) { selectChars += characters.uppercase ; numberOfOptions++; }
    if (lowercaseCheck.checked) { selectChars += characters.lowercase ; numberOfOptions++; }
    if (digitCheck.checked) { selectChars += characters.digit ; numberOfOptions++; }
    if (symbolCheck.checked) { selectChars += characters.symbol ; numberOfOptions++; }

    if (selectChars.length < 1) {
        alert("Vous devez choisir au moins une option pour votre mot de passe");
    }

    const length = size.value;

    let password = '';

    for (let i = 0; i < length; i++) {
        const slectedCharacters = Math.floor(Math.random() * selectChars.length);
        password += selectChars[slectedCharacters];
    }

    passwordResult.style.display = 'flex';
    passwordResult.value = password ;

    preservedPassword.style.display = 'flex';
    passwordToSave.textContent = password  ;


    textOfPasswordStrong.innerText = '';
    textOfPasswordStrong.classList.remove('text-green-500', 'text-red-500', 'text-orange-500');

    if (passwordResult.value.length > 8) {
        if (numberOfOptions >= 3) {
            reelStrong = 20;
            textOfPasswordStrong.style.display = 'flex';
            textOfPasswordStrong.classList.add('text-green-500');
            textOfPasswordStrong.innerText = '100'
        }else {
            reelStrong = 10;
            textOfPasswordStrong.style.display = 'flex';
            textOfPasswordStrong.classList.add('text-orange-500');
            textOfPasswordStrong.innerText = '50'
        }
    }else{
        if (numberOfOptions < 2) {
            reelStrong = 0;
            textOfPasswordStrong.style.display = 'flex';
            textOfPasswordStrong.classList.add('text-red-500');
            textOfPasswordStrong.innerText = '0'
        }
        else{
            reelStrong = 10;
            textOfPasswordStrong.style.display = 'flex';
            textOfPasswordStrong.classList.add('text-orange-500');
            textOfPasswordStrong.innerText = '50'
        }
    }

    let strength = document.getElementById('text-of-password-strong').textContent;


    return password ;
}


copyToClipboard.addEventListener('click', (event) => {
    navigator.clipboard.writeText(passwordResult.value);
    passwordCopied.style.display = 'flex';
    passwordCopied.textContent = 'Mot de passe copié !';
    setTimeout(() =>{
        passwordCopied.style.display = 'none';
    }, 2000)
})


savedPassword.addEventListener('click', (event) => {
    preservedPassword.style.display = 'none';
    allPasswords.style.display = 'flex';

    totalPassword += 1;
    const newContainer = document.createElement('div');
    allPasswords.appendChild(newContainer);
    allPasswords.prepend(newContainer);
    newContainer.style.backgroundColor = "white";
    newContainer.classList.add('flex', 'justify-between','bg-white', 'p-3', 'rounded-md', 'border-l-3', 'border-blue-500');

    const passwordDetails = document.createElement('div');
    newContainer.appendChild(passwordDetails);
    passwordDetails.classList.add('flex', 'flex-col', 'text-sm', 'font-bold');

    const thePassword = document.createElement('span');
    passwordDetails.appendChild(thePassword);
    thePassword.innerText = passwordResult.value;

    const passwordDate = document.createElement('p');
    passwordDetails.appendChild(passwordDate);
    passwordDate.innerText = new Date().toLocaleString();
    passwordDate.classList.add('text-[10px]','text-gray-700');

    const passwordStrength = document.createElement('p');
    passwordDetails.appendChild(passwordStrength);
    passwordStrength.innerText = 'Force : 50/100';
    passwordStrength.classList.add('text-[10px]','text-gray-700');


    const actionsOnPassword = document.createElement('div');
    const passwordCopy = document.createElement('button');
    const passwordDelete = document.createElement('button');
    passwordCopy.innerText = 'Copier';
    passwordDelete.innerText = 'Supprimer';
    actionsOnPassword.appendChild(passwordCopy);
    actionsOnPassword.appendChild(passwordDelete);
    newContainer.appendChild(actionsOnPassword);

    actionsOnPassword.classList.add('flex', 'gap-2', 'justify-center', 'items-center');
    passwordCopy.classList.add('bg-green-500', 'text-white', 'text-sm', 'px-2', 'py-1', 'rounded-sm');
    passwordDelete.classList.add('bg-red-500', 'text-white', 'text-sm', 'px-2', 'py-1', 'rounded-sm')

    totalNumberOfPassword.innerText = totalPassword;
    allStrongs.push(reelStrong);

    totalStrong = 0;

    for (let i = 0; i < allStrongs.length; i++) {
        totalStrong += Number(allStrongs[i]);
    }

    moyOfAllStrong = totalStrong/allStrongs.length;

    moySize.innerText = moyOfAllStrong;

}) **/
















