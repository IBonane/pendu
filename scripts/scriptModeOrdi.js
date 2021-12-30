//desactivation du div input and winnerDiv
hideDiv();
$("#nameWinnerInputDiv").show();
$("#nameWinnerInput").attr("placeholder", "Proposez un mot à la machine");

//change tewt of replay button : $("#play").text("Essayer un autre mot");
buttonRePlay();

///////////////////////////////////////////////////////////////////
//localStorage.clear();

/////////////////////////////////////////////////////////////////////////////////////////////
//declaration de variables
let letterRandom, wordCompute = [], wordUser = "";
let indexArrayAlphabet;
let LastIndex = 4;

/////////////////////////////////////////////////////////////////////////////
//tableau stockant le nom des 10 meilleures score
initBestPlayerArray(5);

/////////////////////////////////////////////////////////////
//generation du tableau des meilleurs au debut
let size = 5;
generateTableWinner(size);

//////////////////////////////////////////////////////////////
//programme principal
$(document).ready(function(){
    //1)init : $(".hideCanva").hide(), nbChance, wordUser or wordCompute (wordArray), motRandom or letterRandom (random), 
    //2)nbPenality, message html of nbChance ($("#message").html('<h4>'+'nombre de coup : '+nbChance+'</h4>'))
    //3)and display hidden word ($("#hiddenWord").text(wordCompute.join(" ")))
    hideAndInit(10, wordCompute, letterRandom);

    $("#nameWinnerInput").change(function(){
        let inputUser = $("#nameWinnerInput").val();
        wordUser = inputUser.toUpperCase();
        //console.log("lettre : "+wordUser);
        $("#nameWinnerInput").val("");
        $("#nameWinnerInputDiv").hide();

        //initialisation du mot avec des "_"
        initWord(wordUser, wordCompute);
        $("#hiddenWord").text(wordCompute.join(" "));

        //debut du temps de jeu
        beginGameTime = new Date();
        setInterval(function(){verifieLettre()}, 500);
        
    });   
});
//////////////////////////////////////////////////////////////////////////////
//verification de la lettre
const verifieLettre = () => {
            if(nbChance==0 || wordCompute.join("")==wordUser){
                return;
            }

            indexArrayAlphabet = Math.floor(Math.random() * alphabet.length);
            letterRandom = alphabet[indexArrayAlphabet];
            //console.log("lettre ordi : "+letterRandom)
            
            checkLettersWordHidden(letterRandom, wordUser, wordCompute, canvaDuPendusModeOrdi); 
}

///////////////////////////////////////////////////////////////////////////////////
//verification du statut du joueur : win or lost
const statuJeu = () =>{
    if (nbChance==0){
        //console.log("perdu !"+"\n"+"C'était : "+wordUser);
        $("#message").html('<h4>'+"Dommage, il a raté ! C'était : "+'<span style="color: blue">'+wordUser+'</span>'+'</h4>');

        //ajout du son defaite
        playDefeatSong();

        return false;
    }
    if(wordCompute.join("")==wordUser){
        //fin du temps de jeu et calcul du temps de jeu du vainqueur
        getTimePlayer();

        hidePendu();

        //console.log("gagné !");

        if(nbPenality < bestPlayer[LastIndex].penality){

            $("#bestWinner").show();
            $("#message").html('<h4 id="centerMsg">'+'Ooooh Yes, il a trouvé ! <br/>il fait parties des 5 meilleurs performances'+'</h4>');
            BestMachinesWinner();
        }

        else {
            $("#simpleWinner").show();
            $("#message").html('<h4 id="centerMsg">'+'Yes, il a trouvé ! <br/>Mais, dommage il ne fait pas partie des 5 meilleurs.'+
                                '<br/><span>nbPenalités = '+nbPenality+' | temps de jeu = '+timePlaying+'</span></h4>');
        }

        //ajout du son victoire
        playWinSong();

        return true;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
//recupération du nom du gagnant et ajout dans le tableau des 10 meilleurs
const BestMachinesWinner = () =>{

        //Choix du nom de la machine gagnante
        indexArrayMachine = Math.floor(Math.random() * nameWinnerCompute.length);

        bestPlayer[LastIndex].name = nameWinnerCompute[indexArrayMachine].toLowerCase();
        timePlayingAndPenality(LastIndex);

        // //trie du tableau
        sortArray();

        displayBestWinner();
        initLocalStorage();   
}

// //////////////////////////////////////////////////////////
// //chargement du tableau meilleurs
loadStorageArray();

//////////////////////////////////////////////////////////////
//rechargement de la page
$("#play").click(function(){
    location.reload(true);
});
