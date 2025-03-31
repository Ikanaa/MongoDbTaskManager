# MongoDB Task Manager

**Une application Web avec support MongoDB pour gérer des tâches ! 📋**

# Comment Utiliser

#### Prérequis :

[Installer Docker](https://docs.docker.com/desktop/setup/install/windows-install/)
Confirmer que docker tourne en tache de fond.

#### Commandes :

Se placer dans le répertoire principal, puis exécuter :
```sh
docker compose build | docker compose up -d
```

Pour kill le docker : 
```sh
docker compose down
```
#### Liens : 

[Web Interface](http://localhost:80/)
[API REST](http://localhost:3000/)
[Port MongoDB](http://localhost:27017/) (pour valider que la bdd fonctionne)

# Consigne du TP
### MongoDB Task Manager - Schéma de données

| Champ | Type | Description |
|-------|------|-------------|
| titre | String | Titre court de la tâche |
| description | String | Détail de la tâche |
| dateCreation | Date | Date de création de la tâche |
| echeance | Date | Date limite de la tâche |
| statut | String | "à faire", "en cours", "terminée", "annulée" |
| priorite | String | "basse", "moyenne", "haute", "critique" |
| auteur | Objet | { nom, prénom, email } |
| categorie | String | Type de tâche (perso, travail, projet, etc.) |
| etiquettes | Array de Strings | Liste de mots-clés |
| sousTaches | Tableau d'objets | titre, statut, échéance (facultatif) |
| commentaires | Tableau d'objets | auteur, date, contenu |
| historiqueModifications | Tableau d'objets | champModifie, ancienneValeur, nouvelleValeur, date |

## Routes possibles pour l'API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /tasks | Récupérer toutes les tâches |
| GET | /tasks/:id | Récupérer une tâche par son identifiant |
| POST | /tasks | Créer une nouvelle tâche |
| PUT | /tasks/:id | Modifier une tâche existante |
| DELETE | /tasks/:id | Supprimer une tâche |

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Fonctionnalités complémentaires obligatoires
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Filtrage des tâches

| Critère | Paramètre | Exemple | Description |
|---------|-----------|---------|-------------|
| Statut | statut | /tasks?statut=à faire | Tâches dans un état donné |
| Priorité | priorite | /tasks?priorite=haute | Filtrage par priorité |
| Catégorie | categorie | /tasks?categorie=perso | Filtrage par catégorie |
| Étiquette | etiquette | /tasks?etiquette=urgent | Recherche par étiquette |
| Date limite avant | avant | /tasks?avant=2025-03-31 | Tâches à terminer avant une date |
| Date limite après | apres | /tasks?apres=2025-03-24 | Tâches après une date |
| Texte libre | q | /tasks?q=rapport | Recherche dans titre/description |

#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Trier les résultats (par date, priorité, etc.).

| Critère | Paramètre | Exemple | Description |
|---------|-----------|---------|-------------|
| Date d'échéance | tri=echeance | /tasks?tri=echeance | Tri par date d'échéance |
| Priorité | tri=priorite | /tasks?tri=priorite | Tri par niveau de priorité |
| Date de création | tri=dateCreation | /tasks?tri=dateCreation | Tri par date de création |
| Ordre décroissant | ordre=desc | /tasks?tri=echeance&ordre=desc | Inverse l'ordre de tri |

#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Gérer les sous-tâches et commentaires.
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Optionnel) Historiser les modifications.

## Techologie Utilisé
- ### [MongoDB](https://www.mongodb.com/)
- ### [NodeJS](https://nodejs.org/) & [ExpressJS](https://expressjs.com/)
- ### [Docker](https://www.docker.com/)