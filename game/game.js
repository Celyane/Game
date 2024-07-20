// Boutons
let choixM = document.querySelector('#Cmagicien');
let choixG = document.querySelector('#Cguerrier');

// Champ de texte pour le nom
const nomInput = document.querySelector('#nom');

// Boutons submit et actions
const ok = document.querySelector('#ok');
const attaquerBtn = document.querySelector('#attaquer');
const coupSpecialBtn = document.querySelector('#coupSpecial');

// Images
const imgM = document.querySelector('#wizardP');
const imgG = document.querySelector('#warriorP');

// Zone de texte pour les informations de combat
const combatLog = document.querySelector('#combat-log');

// Cacher les images et boutons d'action avant sélection
imgM.style.display = "none";
imgG.style.display = "none";
attaquerBtn.style.display = "none";
coupSpecialBtn.style.display = "none";

// Variables pour les personnages sélectionnés
let personnageJoueur;
let personnageAdverse;

// Classe Personnage
class Personnage {
    constructor(pseudo, classe, sante, attaque) {
        this.pseudo = pseudo;
        this.classe = classe;
        this.sante = sante;
        this.attaque = attaque;
        this.niveau = 1;
    }

    get informations() {
        return `${this.pseudo} (${this.classe}) a ${this.sante} points de vie et est au niveau ${this.niveau}.`;
    }

    evoluer() {
        this.niveau++;
        this.logCombat(`${this.pseudo} passe au niveau ${this.niveau} !`);
    }

    verifierSante() {
        if (this.sante <= 0) {
            this.sante = 0;
            this.logCombat(`${this.pseudo} a perdu !`);
            return true;
        }
        return false;
    }

    attaquer(personnage, multiplicateur = 1) {
        const degats = this.attaque * multiplicateur;
        personnage.sante -= degats;
        const action = multiplicateur === 1 ? 'attaque' : 'attaque avec son coup spécial';
        this.logCombat(`${this.pseudo} ${action} ${personnage.pseudo} (${degats} dégâts).`);
        this.evoluer();
        return personnage.verifierSante();
    }

    coupSpecial(personnage) {
        return this.attaquer(personnage, 5);
    }

    logCombat(message) {
        const p = document.createElement('p');
        p.textContent = message;
        combatLog.appendChild(p);
        combatLog.scrollTop = combatLog.scrollHeight;
    }
}

// Classe Magicien
class Magicien extends Personnage {
    constructor(pseudo) {
        super(pseudo, "magicien", 170, 90);
    }
}

// Classe Guerrier
class Guerrier extends Personnage {
    constructor(pseudo) {
        super(pseudo, "guerrier", 350, 50);
    }
}

// Click pour choisir classe perso
choixM.addEventListener('click', () => ChoixPersonnage('magicien'));
choixG.addEventListener('click', () => ChoixPersonnage('guerrier'));

function ChoixPersonnage(classe) {
    let pseudo = nomInput.value.trim() || 'Joueur'; // Utiliser le nom saisi ou un nom par défaut

    if (classe === 'magicien') {
        personnageJoueur = new Magicien(pseudo);
        imgM.style.display = "block";
        imgG.style.display = "none";
        document.getElementById("choix").innerHTML = "Vous avez sélectionné le magicien";
        personnageAdverse = new Guerrier('Thor'); // Nom par défaut pour adversaire
    } else if (classe === 'guerrier') {
        personnageJoueur = new Guerrier(pseudo);
        imgG.style.display = "block";
        imgM.style.display = "none";
        document.getElementById("choix").innerHTML = "Vous avez sélectionné le guerrier";
        personnageAdverse = new Magicien('Oz'); // Nom par défaut pour adversaire
    }

    // Afficher les boutons d'action après sélection du personnage
    attaquerBtn.style.display = "inline-block";
    coupSpecialBtn.style.display = "inline-block";
    attaquerBtn.disabled = false;
    coupSpecialBtn.disabled = false;
}

// Gérer les actions des boutons
attaquerBtn.addEventListener('click', () => {
    if (personnageJoueur && personnageAdverse) {
        if (!personnageJoueur.verifierSante() && !personnageAdverse.verifierSante()) {
            if (personnageJoueur.attaquer(personnageAdverse)) return;
            if (personnageAdverse.attaquer(personnageJoueur)) return;
        }
    }
});

coupSpecialBtn.addEventListener('click', () => {
    if (personnageJoueur && personnageAdverse) {
        if (!personnageJoueur.verifierSante() && !personnageAdverse.verifierSante()) {
            if (personnageJoueur.coupSpecial(personnageAdverse)) return;
            if (personnageAdverse.coupSpecial(personnageJoueur)) return;
        }
    }
});
