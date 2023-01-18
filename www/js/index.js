document.addEventListener("deviceready", loadContacts, false);


function loadContacts(){
    let options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ['name']

    navigator.contacts.find(fields, showContacts, onError, options);
}

function showContacts(contacts){
    let code =''
    for (let i = 0; i < contacts.length; i++) {
        code += `
            <li onclick="showOneContact(${contacts[i].id})">
                <a href="#">
                    <img src="./img/avatar.jpg">
                    <h5>${contacts[i].name.formatted}</h5>
                    <p>${contacts[i].phoneNumbers[0].value}</p>
                </a>
            </li>
        `

        // let contact = contacts[i]
        // let newContact = "<li><a href=''> <img src='"+chooseRandomImage()+"'> <h5>" + contact.name.formatted + "</h5><p>"+contact.phoneNumbers[0].value+"</p></a></li>"
        // contactlist.innerHTML += newContact;
    }
    contactlist.innerHTML = code
    // il faut demander à jquery de se raffraichier pour ajouter les classes
    $(contactlist).listview('refresh')
}

function showOneContact(id){
    // modifier les éléments dans la nouvelle page
    var options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
    //navigator.contacts.find(fields, showContacts, onError, options);
    var contact = navigator.contacts.find(["id"], (contacts) => {
        window.location = "#page2"
        for (let i=0; i < contacts.length; i++){
            
            document.getElementById("contact-Name").textContent = contacts[i].name.familyName;
            document.getElementById("contactFirst-Name").textContent = contacts[i].name.givenName;
            document.getElementById("contactMobile-Number").textContent = contacts[i].phoneNumbers[0].value;
            document.getElementById("contactPhone-Number").textContent = contacts[i].phoneNumbers[1].value;
            document.getElementById("contact-Email").textContent = contacts[i].emails[0].value;
        }
        //window.location = "#page2"
        
    }, (contactError) => {
        alert("erreur")
    }, options)

    $("#delete-button").on("click", () => {
        let delOk = confirm("Voulez vous supprimer le contact")
        if (delOk === true ){
            var options = new ContactFindOptions();
            options.filter = id;
            options.multiple = false;
            //navigator.contacts.find(fields, showContacts, onError, options);
            var contact = navigator.contacts.find(["id"], (contacts) => {
                contacts[0].remove((contact) => {
                    alert("Contact supprimé avec succès")
                    window.location = "#page1"
                    loadContacts()
                }, (contactError) => {
                    alert("erreur")
                })
            }, (contactError) => {
                alert("erreur")
            }, options)
        }
        else{
            return;
        }
    })
    
}

// suppresion d'un contact
function deleteContact(id){
    let delOk = confirm("Voulez vous supprimer le contact")
    if (delOk === true ){
        var options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
    //navigator.contacts.find(fields, showContacts, onError, options);
    var contact = navigator.contacts.find(["id"], (contacts) => {
        contacts[0].remove((contact) => {
            alert("Contact supprimé avec succès")
            window.location = "#page1"
        }, (contactError) => {
            alert("erreur")
        })
    }, (contactError) => {
        alert("erreur")
    }, options)
    }
    else{
        return;
    }

    
}

// modification d'un contact
function showEditContactForm(id){
    var options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
    //navigator.contacts.find(fields, showContacts, onError, options);
    var contact = navigator.contacts.find(["id"], (contacts) => {
        window.location = "#page3"
        for (let i=0; i < contacts.length; i++){
            document.getElementById("contactNameEdit").value = contacts[i].name.familyName;
            document.getElementById("contactFirstNameEdit").value = contacts[i].name.givenName;
            document.getElementById("contactMobileNumberEdit").value = contacts[i].phoneNumbers[0].value;
            document.getElementById("contactPhoneNumberEdit").value = contacts[i].phoneNumbers[1].value;
            document.getElementById("contactEmailEdit").value = contacts[i].emails[0].value;
        }
        //window.location = "#page2"
    }, (contactError) => {
        alert("erreur")
    }, options)
}

// annulation de la modification
function annulerModification(){
    history.go(-1);
}


function onError(contactError) {
    console.log(contactError);
    alert('Erreur de chargement des contacts');
}

function addContact(){
    $("#add-button").hide();
    $("#add-form").show()
   
}

function annuler(){
    $("#add-form").hide()
    $("#add-button").show();
}

function ajouterContact(){
    nom = contactName.value
    prenom = contactFirstName.value
    numeroPortable = contactMobileNumber.value
    numeroFixe = contactPhoneNumber.value
    email = contactEmail.value

    // verifier le champ nom n'est pas vide
    if (nom == "" || prenom == ""){
        alert("Le nom est obligatoire")
        ccontactName.value=""
        contactFirstName.value=""
        contactPhoneNumber.value=""
        contactMobileNumber.value=""

        contactName.focus()
        return
    }
    // verifier si le numero est bien un chiffre
    if(isNaN(numeroPortable) || isNaN(numeroFixe)){
        alert("Le numéro de téléphone n'est pas valide")
        contactName.value=""
        contactFirstName.value=""
        contactPhoneNumber.value=""
        contactMobileNumber.value=""

        contactName.focus()
        return
    }

    // enregistrer le contact en utilisant cordova-plugins
    var myContact = navigator.contacts.create({"displayName": prenom})

    // myContact.name = new ContactName(null, prenom, nom)

    let name = new ContactName()
    name.givenName = prenom
    name.familyName = nom
    
    myContact.name = name

    myContact.phoneNumbers = [new ContactField('mobile', numeroPortable, true), new ContactField('home', numeroFixe, false)]
    myContact.emails = [new ContactField('email', email, true)]
    myContact.save(onSuccess, onError)
    // verifier le champ numero est bien un numero
    // if (isNaN(numero)){
    //     alert("Le numéro de téléphone n'est pas valide")
    //     contactName.value=""
    //     contactNumber.value=""

    //     contactName.focus()
    //     return
    // }

    // let newContact = "<li><a href=''> <img src='"+chooseRandomImage()+"'> <h5>" + nom + "</h5><p>"+numero+"</p></a></li>"

    // contactlist.innerHTML += newContact;
    // // il faut demander à jquery de se raffraichier pour ajouter les classes
    // $(contactlist).listview('refresh')

    // contactName.value=""
    // contactNumber.value=""

    // contactName.focus()
    
}

function onSuccess(contact){
    alert("Contact ajouté avec succès")
    $("#add-form").hide()
    $("#add-button").show();

    contactName.value=""
    contactFirstName.value=""
    contactPhoneNumber.value=""
    contactMobileNumber.value=""

    contactName.focus()
    loadContacts()
    $(contactlist).listview('refresh')
}

function onError(contactError) {
    alert('Erreur de chargement des contacts');
}

function chooseRandomImage(){
    iconsLocation = ["./img/avatar.jpg", "./img/avatar.jpg", "./img/avatar-black-woman2.jpg", "./img/avatar-black-woman1.jpg"]
    // get random number between 0 and 3
    randomIndex = Math.round((Math.random()) * 3)
    console.log(randomIndex)
    return iconsLocation[randomIndex]
}

// verifier si la page 2 est chargée
$(document).on("pageaftershow", "#page2", function(){
    // recuperer les parametres de la page 2
    let params = getParams()
    alert(params.names)
    alert(params.phoneNumbers)
    // afficher les parametres dans la page 2
    $("#contact-name").text(params.names)
    $("#contact-number").text(params.phoneNumbers)
})

// page 2
function editContact(){

}

function deleteContact(){
    
}

