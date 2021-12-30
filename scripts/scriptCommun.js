////////////////////////////////////////////////////
//desactivation du div input and winnerDiv
const hideDiv = () =>{
    $("#simpleWinner").hide();
    $("#bestWinner").hide();
}

/////////////////////////////////////////////////////////////////////////////
//Création du tableau html des meilleurs scores
const generateTableWinner = (size) =>{

    let tableofBetter = $("<table>");

    let thead = $("<thead>");
    let trh = $("<tr>");
    let tdh1 = $("<td>").text("Ranking");
    let tdh2 = $("<td>").text("Name");
    let tdh3 = $("<td>").text("nbPenality");
    let tdh4 = $("<td>").text("gameTime");

    thead.append(trh.append(tdh1, tdh2, tdh3, tdh4));

    let tbody = $("<tbody>");

    for(let index = 0; index < size; index++){
        let tr = $("<tr>");
        tr.attr("id", "tr"+index);

        let td1 = $("<td>").text(index+1);
        let td2 = $("<td>").text("-");
        let td3 = $("<td>").text("-");
        let td4 = $("<td>").text("-");
        tbody.append(tr.append(td1, td2, td3, td4));
    }
    $("#tableBestWin").append(tableofBetter.append(thead, tbody));
    tableofBetter.css('text-align', 'center');
}

//declaration de variables
var lettreOk, nbPenality;
var beginGameTime, timePlaying;
var indexCanvaDuPendus = 0;
var nbChance;
var bestPlayer;

//nameButtonPlay
const buttonRePlay = ()=>{
    $("#play").text("Essayer un autre mot");
}

/////////////////////////////////////////////////////////////////////////////
//initialisation du tableau des meilleurs vainqueurs
function playerWin(){
    this.name="";
    this.penality=10000;
    this.time=10000;
} 

const initBestPlayerArray = (size) =>{  
    bestPlayer = [];
    //initialisation du tableau
    for (let i=0;i<size;i++)     
        bestPlayer[i] = new playerWin();

    //console.log(bestPlayer);
}

//////////////////////////////////////////////////////////////
//initialisation du mot avec des "_"
const initWord = (word, wordHidden) =>{
    for(let index=0; index < word.length; index++)
    wordHidden[index]= "_";
    //console.log(wordHidden.join(" "));
}

///////////////////////////////////////////////////
//init : $(".hideCanva").hide(), nbChance, wordUser or wordCompute (wordArray), motRandom or letterRandom (random), 
//nbPenality, message html of nbChance ($("#message").html('<h4>'+'nombre de coup : '+nbChance+'</h4>'))
//and display hidden word ($("#hiddenWord").text(wordCompute.join(" ")))
const hideAndInit = (nbChanceValue, wordArray, randomWordOrLetter) =>{
     //hideCanva
     $(".hideCanva").hide();
     nbChance = nbChanceValue;
     wordArray = [];
     //countLetter = 0;
     randomWordOrLetter="";
     nbPenality = 0;
     //console.log("word utili : "+wordCompute);
         
     $("#message").html('<h4>'+'nombre de coup : '+nbChance+'</h4>');
 
     $("#hiddenWord").text(wordArray.join(" "));
}

//sous fonction de verification : parcour des lettres du mots a trouvé
const checkLettersWordHidden = (letter, wordRandomOrUser, word, canva) =>{
    lettreOk = false;
    for(let index=0; index < wordRandomOrUser.length; index++){
        if(letter == wordRandomOrUser[index]){
            //console.log("index : "+index+" : "+wordRandomOrUser[index]);
            word[index] = wordRandomOrUser[index];
            lettreOk = true;

            //ajout du son reussite
            $('audio#mp3_reussite')[0].play();

            $("#hiddenWord").text(word.join(" "));
        }           
    }

    if(lettreOk == false){
        $("."+canva[indexCanvaDuPendus]).show();
        indexCanvaDuPendus++;      
        nbChance--;
        nbPenality++;
        //console.log("nb change "+nbChance);

        //ajout du son échec
        $('audio#mp3_echec')[0].play();

        $("#message").html('<h4>'+'nombre de coup : '+nbChance+'</h4>');
    }
    //console.log("user word "+word.join(" "));
    statuJeu();   
}

///////////////////////////////////////////
 //fin du temps de jeu et calcul du temps de jeu du vainqueur
 const getTimePlayer = () =>{
    timePlaying = Math.round((new Date() - beginGameTime.getTime())/1000);
 }
//Hide pendu image
const hidePendu = () =>{
    $("#penduLost").hide();
}

//put timePlaying and penality in Array
const timePlayingAndPenality = (size)=>{
    bestPlayer[size].penality = nbPenality;
    bestPlayer[size].time = timePlaying;
}

//trie du tableau
const sortArray = ()=>{

    bestPlayer.sort(function(a, b){
        if(a.penality == b.penality)
            return a.time - b.time;
        return a.penality - b.penality;
    });
}

/////////////////////////////////////////////////////////////////////////////////////////
const displayBestWinner = ()=>{
    //affichage du tableau des 10 meilleurs scores
    for(let i=0; i<bestPlayer.length; i++)
        if(bestPlayer[i].name !="")
            $("#tr"+i).html('<td>'+(i+1)+'</td><td>'+bestPlayer[i].name+'</td><td>'+bestPlayer[i].penality+'</td><td>'+bestPlayer[i].time+'</td>'); 
}

//////////////////////////////////////////////////////////
//init loacl storage
const initLocalStorage = () =>{
    localStorage["savePerson"] = JSON.stringify(bestPlayer); 
}

//chargement du tableau meilleurs
const loadStorageArray = () =>{
    if(localStorage["savePerson"]!=undefined){
        bestPlayer = JSON.parse(localStorage["savePerson"]);
        displayBestWinner();
    }
}

//////////////////////////////////////////////////////////////
//audios defaite et victoire
const playDefeatSong = () =>{
    $('audio#mp3_defaite')[0].play();
}

const playWinSong = () =>{
    $('audio#mp3_victoire')[0].play();
}