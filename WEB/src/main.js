



function AddNewTask(button)
{
    const titre = document.getElementById('create_titre');
    const description = document.getElementById('create_description');
    const echeance = document.getElementById('create_echeance');
    const status = document.getElementById('create_status');
    const priorite = document.getElementById('create_priorite');
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
        auteur: {
            nom: auteur_nom.value || "anon",
            prenom: auteur_prenom.value || "anon",
            email: auteur_email.value || "anon"
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
    .then(response => console.log(response))
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