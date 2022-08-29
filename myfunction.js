


function isalpha(letter){
    return letter.toLowerCase() != letter.toUpperCase();
}

function PurifyString(word){
    result ="";
    if (word.length>0){
        for(let i =0;i<word.length;i++){
            if (isalpha(word[i])){
                result+=word[i];
            }
        }
    }
    return result.toLowerCase()
   
}
console.log(PurifyString("M_ujeeb-abiola"))
module.exports= PurifyString;