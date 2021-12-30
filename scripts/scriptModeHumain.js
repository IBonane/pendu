//desactivation du div input and winnerDiv
hideDiv();
$("#nameWinnerInputDiv").hide();

//change tewt of replay button : $("#play").text("Essayer un autre mot");
buttonRePlay();
///////////////////////////////////////////////////////////////////
//localStorage.clear();
let motRandom = "";
//console.log(motRandom+" length = "+word.length);

const newWordGenerator = () =>{
    let index = Math.floor(Math.random() * word.length);
    motRandom = word[index].toUpperCase();
}
////////////////////////////////////////////////////////////////////
//création et initialisation du tableau de nom des touches
let nameButton = [];

const copyAlphabet = () =>{
    for(let index = 0; index < alphabet.length; index++){
        nameButton[index] = alphabet[index];
    }
}

////////////////////////////////////////////////////////////////
//Création des touche A,B,C....Z
const generateKeyPlaying = () =>{
    copyAlphabet();
    for(let index = 0; index < alphabet.length; index++){
        nameButton[index] = $('<button>').text(alphabet[index].toLocaleUpperCase());
        nameButton[index].attr('id', alphabet[index]);
        nameButton[index].attr('class', 'alphabetKey');
        $("#toucheAlphabet").append(nameButton[index]);
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////
//declaration de variables
let letter, wordUser = [];
let nameButtonPlay = $("#play");
let buttonLetter = $('button');
let letterWinDisable;
let LastIndex = 9;


/////////////////////////////////////////////////////////////////////////////
//initialisation du tableau des meilleurs vainqueurs
//tableau stockant le nom des 10 meilleures score
initBestPlayerArray(10);
/////////////////////////////////////////////////////////////
//generation du tableau des meilleurs au debut et des touche du jeu
let size = 10;
generateTableWinner(size);

generateKeyPlaying();
//////////////////////////////////////////////////////////////
//programme principal
$(document).ready(function(){
    //hideCanva
    // $(".hideCanva").hide();
    hideAndInit(5, wordUser, motRandom);
    //debut du temps de jeu
    beginGameTime = new Date();

    //console.log("word utili : "+wordUser);
    $('button').attr("disabled", false);
        
    // nameButtonPlay.text("Essayer un autre mot");
    $("#message").html('<h4>'+'nombre de coup : '+nbChance+'</h4>');
    newWordGenerator();
    initWord(motRandom, wordUser);
    //console.log(motRandom+" length = "+word.length);

    $("#hiddenWord").text(wordUser.join(" "));

    $(".alphabetKey").click(function(){
        letter = this.id.toUpperCase();
        letterWinDisable = $(this);
        //console.log("lettre : "+letter);
        letterWinDisable.attr("disabled", true);
        letterWinDisable.css("background-color", "red");
        letterWinDisable.css("color", "white");
        verifieLettre();
        
    });   
});
//////////////////////////////////////////////////////////////////////////////
//verification de la lettre
const verifieLettre = () => {

    for(let index=0; index < motRandom.length; index++)
        if(letter == motRandom[index])
            letterWinDisable.css("background-color", "green");

    checkLettersWordHidden(letter, motRandom, wordUser, canvaDuPendusModeHumain);   
}
///////////////////////////////////////////////////////////////////////////////////
//verification du statut du joueur : win or lost
const statuJeu = () =>{
    if (nbChance==0){
        //console.log("perdu !"+"\n"+"C'était : "+motRandom);
        $("#message").html('<h4>'+"Dommage, vous avez ratez !\nC'était : "+'<span style="color: blue">'+motRandom+'</span>'+'</h4>');
        $(".alphabetKey").attr("disabled", true);

        //ajout du son defaite
        playDefeatSong();

        return false;
    }
    if(wordUser.join("")==motRandom){
        //fin du temps de jeu et calcul du temps de jeu du vainqueur
        getTimePlayer();

        hidePendu();

        //console.log("gagné !");
        $(".alphabetKey").attr("disabled", true);

        if(nbPenality < bestPlayer[LastIndex].penality){

            $("#bestWinner").show();
            $("#message").html('<h4 id="centerMsg">'+'Bravo, vous avez trouvez ! <br/>vous faites parties des 10 meilleurs performances'+'</h4>');
            tenBestWinner();
        }

        else {

            $("#simpleWinner").show();
            $("#message").html('<h4 id="centerMsg">'+'Bravo, vous avez trouvez ! <br/>Mais, dommage vous ne faites pas parties des 10 meilleurs.'+
                                '<br/><span>nbPenalités = '+nbPenality+' | temps de jeu = '+timePlaying+'</span></h4>');
        }
                
        //ajout du son victoire
        playWinSong();

        return true;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
//recupération du nom du gagnant et ajout dans le tableau des 10 meilleurs
const tenBestWinner = () =>{
    //activation du div input
    $("#nameWinnerInputDiv").show();

    $("#nameWinnerInput").change(function(){

        bestPlayer[LastIndex].name = $("#nameWinnerInput").val().toLowerCase();
        timePlayingAndPenality(LastIndex);

        $("#nameWinnerInput").val(""); 
        $("#nameWinnerInputDiv").hide();

        //trie du tableau
        sortArray();

        displayBestWinner();
        initLocalStorage();        
    });        
}

////////////////////////////////////////////////////////////
////chargement du tableau meilleurs
loadStorageArray();

//////////////////////////////////////////////////////////////
//rechargement de la page
$("#play").click(function(){
    location.reload(true);
});