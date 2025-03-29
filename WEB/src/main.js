// --------------------------------------------
// --- Utils ---
// --------------------------------------------

function FormatteDate(InputDate)
{
    const date = new Date(InputDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function FormatteDateInput(InputDate)
{
    const date = new Date(InputDate);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// --------------------------------------------
// --- Create new Task ---
// --------------------------------------------

function AddNewTask(button)
{
    const titre = document.getElementById('create_titre');
    const description = document.getElementById('create_description');
    const echeance = document.getElementById('create_echeance');
    const status = document.getElementById('create_status');
    const priorite = document.getElementById('create_priorite');
    const categorie = document.getElementById('create_categorie');
    const auteur_nom = document.getElementById('create_auteur_nom');
    const auteur_prenom = document.getElementById('create_auteur_prenom');
    const auteur_email = document.getElementById('create_auteur_email');
    const label_container = document.getElementById('create_label_container');

    let newTask = {
        titre: titre.value,
        description: description.value,
        echeance: echeance.value,
        status: status.value,
        priorite: priorite.value,
        categorie: categorie.value,
        auteur: {
            nom: auteur_nom.value || "anon",
            prenom: auteur_prenom.value || "",
            email: auteur_email.value || ""
        },
        etiquettes: []
    };

    for (var i = 0; i < label_container.children.length; i++) {
        const element = label_container.children[i];
        newTask.etiquettes.push(element.children[0].value);
    }

    
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        else {
            document.getElementById('create_popup').className = 'hidden';
            FetchAllTasks();
        }
        return;
    })
}

// --------------------------------------------
// --- Modif Task ---
// --------------------------------------------

function OpenModifPopup(id)
{
    document.getElementById('create_popup').className = 'hidden';

    const button = document.getElementById('modif_button').value = id;
    const titre = document.getElementById('modif_titre');
    const description = document.getElementById('modif_description');
    const echeance = document.getElementById('modif_echeance');
    const status = document.getElementById('modif_status');
    const priorite = document.getElementById('modif_priorite');
    const categorie = document.getElementById('modif_categorie');
    const auteur_nom = document.getElementById('modif_auteur_nom');
    const auteur_prenom = document.getElementById('modif_auteur_prenom');
    const auteur_email = document.getElementById('modif_auteur_email');
    const label_container = document.getElementById('modif_label_container');


    fetch('http://localhost:3000/tasks/' + id)
    .then(response => response.json())
    .then(data => {
        titre.value = data.titre;
        description.value = data.description;
        echeance.value = FormatteDateInput(data.echeance);
        status.value = data.status;
        priorite.value = data.priorite;
        categorie.value = data.categorie;
        auteur_nom.value = data.auteur.nom;
        auteur_prenom.value = data.auteur.prenom;
        auteur_email.value = data.auteur.email;
        document.getElementById('modif_popup').className = 'popup';
    });
}

function ModifTask(button)
{
    const titre = document.getElementById('modif_titre');
    const description = document.getElementById('modif_description');
    const echeance = document.getElementById('modif_echeance');
    const status = document.getElementById('modif_status');
    const priorite = document.getElementById('modif_priorite');
    const categorie = document.getElementById('modif_categorie');
    const auteur_nom = document.getElementById('modif_auteur_nom');
    const auteur_prenom = document.getElementById('modif_auteur_prenom');
    const auteur_email = document.getElementById('modif_auteur_email');
    const label_container = document.getElementById('modif_label_container');

    let newTask = {
        titre: titre.value,
        description: description.value,
        echeance: echeance.value,
        status: status.value,
        priorite: priorite.value,
        categorie: categorie.value,
        auteur: {
            nom: auteur_nom.value || "anon",
            prenom: auteur_prenom.value || "",
            email: auteur_email.value || ""
        },
        etiquettes: []
    };

    for (var i = 0; i < label_container.children.length; i++) {
        const element = label_container.children[i];
        newTask.etiquettes.push(element.children[0].value);
    }

    
    fetch('http://localhost:3000/tasks/' + button.value, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        else {
            document.getElementById('modif_popup').className = 'hidden';
            FetchAllTasks();
        }
        return;
    })
}

// --------------------------------------------
// --- Fetch and display Tasks ---
// --------------------------------------------

function ClearDisplayTasks()
{
    const taskDiv = document.getElementById("task_container");
    if (taskDiv) 
        taskDiv.innerHTML = '';
}

function DisplayTasks(task)
{
    const taskDiv = document.getElementById("task_container");
    
    let div = document.createElement('div');


    div.innerHTML = `<div class="task" onclick="OpenModifPopup('${task._id}')">
                        <div class="task_head">
                            <div class="m-demi m-y-1">
                                <h3 class="center-text m-0">${task.titre}</h3>
                            </div>
                            <div class="m-demi" style="max-height: 4em; overflow-y: auto; border: 1px solid #AAA; padding: 0.5em; border-radius: 0.5em;">
                                <p class="m-0">${task.description}</p>
                            </div>
                            <div class="m-demi m-y-1">
                                <p class="m-0">${FormatteDate(task.dateCreation)}</p>
                            </div>
                        </div>

                        <div class="m-t-1 flex-row">
                            <p class="m-0 m-r-1">
                                Status:
                            </p>
                            <p class="m-0">
                                ${task.status}
                            </p>
                        </div>
                        <div class="m-t-1 flex-row">
                            <p class="m-0 m-r-1">
                                priorité:
                            </p>
                            <p class="m-0">
                                ${task.priorite}
                            </p>
                        </div>
                        <div class="m-t-1 flex-row">
                            <p class="m-0 m-r-1">
                                Auteur:
                            </p>
                            <p class="m-0">
                                ${task.auteur.nom} ${task.auteur.prenom} ${task.auteur.email}
                            </p>
                        </div>
                        <div class="m-t-1 flex-row">
                            <p class="m-0 m-r-1">
                                Categorie:
                            </p>
                            <p class="m-0">
                                ${task.categorie}
                            </p>
                        </div>
                        <div class="m-t-1 flex-row">
                            <p class="m-0 m-r-1">
                                Echéance:
                            </p>
                            <p class="m-0">
                                ${FormatteDate(task.echeance)}
                            </p>
                        </div>
                    </div>`;

    taskDiv.appendChild(div);
}

function FetchAllTasks()
{
    ClearDisplayTasks();

    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                DisplayTasks(task);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// --------------------------------------------
// --- Gestion Label Task ---
// --------------------------------------------


function MinusLabelTask(button)
{
    console.log(button.parentElement.parentElement)
    const div = button.parentElement.parentElement;
    button.parentElement.remove();
        
    for (var i = 0; i < div.children.length; i++) {
        const element = div.children[i];
        element.id = 'create_label_' + i;
        element.children[0].id = 'create_label_input_' + i;
        element.children[0].placeholder = 'Etiquettes ' + i;
        element.children[1].value = i;
    }
}

function PlusLabelTask(button, idContainer)
{
    // <div id="create_label_0"><input class="size-80" type="text" id="create_label_input_0" placeholder="Etiquettes 0"><button class="size-10" value="0" onclick="MinusLabelTask(this)">-</button></div>
    const div = document.getElementById(idContainer);
    const divLabel = document.createElement('div');
    const id = div.children.length;
    divLabel.id = 'create_label_' + id;
    divLabel.innerHTML = `<input class="size-80" type="text" id="create_label_input_${id}" placeholder="Etiquettes ${id}"><button class="size-10" value="${id}" onclick="MinusLabelTask(this)">-</button>`;

    //divTask.innerHTML = '<input type="text" class="input-task" placeholder="Task" required><button class="minus-task" onclick="MinusLabelTask(this)">-</button>';
    div.appendChild(divLabel);

    divLabel.children[0].focus();
}



// --------------------------------------------
// --- On Start ---
// --------------------------------------------


function DebugDisplay()
{
    const task = {
        title: "Finir le projet MongoDB",
        description: "Implémenter les fonctionnalités CRUD pour l'application de gestion de tâches",
        dateCreation: "2023-11-15",
        statut: "En cours",
        priorite: "Haute",
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        categorie: "Développement"
    };

    DisplayTasks(task);
}

FetchAllTasks();