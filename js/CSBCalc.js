$(document).ready(function() {
    
    $('#swine').attr('checked',true);
    getSelectedAnimalConstants('swine');
    validateInput();
    $(".result").hide();
    
        $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
    
});

var selectedAnimalConstants;
var validForm;
var getSelectedAnimalConstants = function(selectedAnimal){
    var jsonUrl;
    var speciesImg;
    if(selectedAnimal=='swine'){
        jsonUrl='/data/swine_constants.json';
        speciesImg = "/img/Pig_Cap_SB.png";
     }else{
        jsonUrl='/data/poultry_constants.json';
         speciesImg = "/img/Chicken_Cap_SB.png";
     }
    var animalConstants = (function () {
        var json = null;
           $.ajax({
              'async': false,
              'global': false,
              'url': jsonUrl,
              'dataType': "json",
             'success': function (data) {
               json = data;
               }
          });
           return json;
    })();
  selectedAnimalConstants = animalConstants;
    $('.species').attr('src', speciesImg);
    $(".result").hide();
 }

var getCapSBInclusion = function(){
    var rmiSBMeal = $('#rmiSoybeanMeal').val();
    var rmiWheat = $('#rmiWheat').val();
    var capSBI;
    if(rmiWheat>0){
        capSBI = 0.5;
    }else if(rmiSBMeal>249){
        capSBI = 0.5;
    }else if(rmiSBMeal>199 && rmiSBMeal<250){
        capSBI = 0.4;
    }else if(rmiSBMeal>149 && rmiSBMeal<200){
        capSBI = 0.3;
    }else if(rmiSBMeal<150){
        capSBI = 0.2;
    }
    if((rmiSBMeal == 0 || rmiSBMeal == '') && (rmiWheat == 0 || rmiWheat == '')){
        $('#recommendedCSB').val(0);    
    }else{
         $('#recommendedCSB').val(capSBI);
    }
}

var computeSavingsAndCosts = function(){

    var rmpCorn = $('#rmpCorn').val();
    var rmpCoconutOil = $('#rmpCoconutOil').val();
    var rmpSoybeanMeal = $('#rmpSoybeanMeal').val();
    var rmpLysine = $('#rmpLysine').val();
    var rmpMethionine = $('#rmpMethionine').val();
    var rmpThreonine = $('#rmpThreonine').val();
    var rmpTryptophan = $('#rmpTryptophan').val();
    var rmpValine = $('#rmpValine').val();
    var capInclusion = $('#recommendedCSB').val();
    var rmiSoybeanMeal = $('#rmiSoybeanMeal').val();
    var rmiWheat = $('#rmiWheat').val();
    if(!validateInput()){
       // $('#exampleModal').modal('show');
        alert("Please provide the necessary inputs.")
        $(".result").hide();
        return;
    };
   
   
   
    var philsanMEperTon = selectedAnimalConstants.philsanMe * rmiSoybeanMeal;
    var philsanDigLysinePerTon = selectedAnimalConstants.philsanDigLysine * rmiSoybeanMeal;
    var philsanDigMetCysPerTon = selectedAnimalConstants.philsanDigMetCys * rmiSoybeanMeal;
    var philsanDigThreoninePerTon = selectedAnimalConstants.philsanDigThreonine * rmiSoybeanMeal;
    var philsanDigTrypPerTon = selectedAnimalConstants.philsanDigTryp * rmiSoybeanMeal;
    var philsanDigValPerTon = selectedAnimalConstants.philsanDigVal * rmiSoybeanMeal;
    
    var newMEperTon = selectedAnimalConstants.newME * rmiSoybeanMeal;
    var newDigLysinePerTon = selectedAnimalConstants.newDigLysine * rmiSoybeanMeal;
    var newDigMetCysPerTon = selectedAnimalConstants.newDigMetCys * rmiSoybeanMeal;
    var newDigThreoninePerTon = selectedAnimalConstants.newDigThreonine * rmiSoybeanMeal;
    var newDigTrypPerTon = selectedAnimalConstants.newDigTryp * rmiSoybeanMeal;
    var newDigValPerTon = selectedAnimalConstants.newDigVal * rmiSoybeanMeal;
    
    var MEswineSpareNutrientsPerTon = newMEperTon - philsanMEperTon;
    var digLysineSpareNutrientsPerTon = newDigLysinePerTon - philsanDigLysinePerTon;
    var digMetCysSpareNutrientsPerTon = newDigMetCysPerTon - philsanDigMetCysPerTon;
    var digThreonineSpareNutrientsPerTon = newDigThreoninePerTon - philsanDigThreoninePerTon;
    var trypSpareNutrientsPerTon = newDigTrypPerTon - philsanDigTrypPerTon;
    var valSpareNutrientsPerTon	= newDigValPerTon - philsanDigValPerTon;

    var savingsPerTonLysine = (digLysineSpareNutrientsPerTon/selectedAnimalConstants.lysineSpecs) * rmpLysine;
    var savingsPerTonMethionine = (digMetCysSpareNutrientsPerTon/selectedAnimalConstants.methionineSpecs) * rmpMethionine;
    var savingsPerTonThreonine =  (digThreonineSpareNutrientsPerTon/selectedAnimalConstants.threonineSpecs) * rmpThreonine;
    var savingsPerTonTryptophan = (trypSpareNutrientsPerTon/selectedAnimalConstants.tryptophanSpecs) * rmpTryptophan;
    var savingsPerTonValine = (valSpareNutrientsPerTon/selectedAnimalConstants.valineSpecs) * rmpValine;
    
    var savingsPerTonCoconutOil = (MEswineSpareNutrientsPerTon/selectedAnimalConstants.coconutSpecs) * rmpCoconutOil;
    
    var freeSpace = (digLysineSpareNutrientsPerTon/selectedAnimalConstants.lysineSpecs) + (digMetCysSpareNutrientsPerTon/selectedAnimalConstants.methionineSpecs) + (digThreonineSpareNutrientsPerTon/selectedAnimalConstants.threonineSpecs) + (trypSpareNutrientsPerTon/selectedAnimalConstants.tryptophanSpecs) + (valSpareNutrientsPerTon/selectedAnimalConstants.valineSpecs) + (MEswineSpareNutrientsPerTon/selectedAnimalConstants.coconutSpecs);
        
    
    var cornToFillUpSpace = freeSpace - capInclusion;
    
    var cornAddOnCost = cornToFillUpSpace * rmpCorn;
    var totalSavingsPerTon = savingsPerTonCoconutOil + savingsPerTonLysine + savingsPerTonMethionine + savingsPerTonThreonine + savingsPerTonTryptophan + savingsPerTonValine;
    
    var capsozymeSBAddOnCost = capInclusion * selectedAnimalConstants.capsozymeSBPrice;
   
    var totalAddOnCost = capsozymeSBAddOnCost + cornAddOnCost;
    var soybeanMealCostPerTon = rmpSoybeanMeal * rmiSoybeanMeal;
    var netSavingsPerTon = totalSavingsPerTon - totalAddOnCost;
    var netSavingsPerKg = netSavingsPerTon/1000;
    var netSavingsPerBag = netSavingsPerKg * 50;
    var soybeanMealWithCapsozymeSBCostPerTon = soybeanMealCostPerTon - netSavingsPerTon;
    var soybeanMealWithCapsozymeSBCostPerKg = soybeanMealWithCapsozymeSBCostPerTon/rmiSoybeanMeal;
    var soybeanCostReduction = rmpSoybeanMeal - soybeanMealWithCapsozymeSBCostPerKg;
    var netSavingsPerThouTon = netSavingsPerTon * 1000;
    soybeanMealWithCapsozymeSBCostPerKg = soybeanMealWithCapsozymeSBCostPerKg || 0;
    soybeanCostReduction = soybeanCostReduction || 0;
       
    $(".result").show();
   
    $('#savePerKg').html("PhP " + netSavingsPerKg.toFixed(2));
    $('#savePerBag').html("PhP " + netSavingsPerBag.toFixed(2));
    $('#savePerTon').html("PhP " + netSavingsPerTon.toFixed(2));
    $('#savePerThouTon').html("PhP " + netSavingsPerThouTon.toFixed(2));
    $('#SBMPriceFrom').html(" PhP "+ parseInt(rmpSoybeanMeal).toFixed(2) + " ");
    $('#SBMPriceTo').html(" PhP " + soybeanMealWithCapsozymeSBCostPerKg.toFixed(2) + " ");
    $('#SBMCostRed').html("PhP <span class='emphasize'>" + soybeanCostReduction.toFixed(2) + "</span>" + " /kg.");
    $('#goToResult')[0].click();
}

var validateInput = function(){
        var inputArray  = [$('#rmpCorn'), $('#rmpCoconutOil'), $('#rmpSoybeanMeal'), $('#rmpLysine'), $('#rmpMethionine'), $('#rmpThreonine'), $('#rmpTryptophan'), $('#rmpValine'), $('#rmiSoybeanMeal'), $('#rmiWheat')];
    
    for(var i =0; i<inputArray.length; i++){
       if($(inputArray[i]).hasClass('invalid')){
            validForm = false;
           break;
        }else{
            validForm = true;
        }
    }
    return validForm;

}

var validateSingleInput = function(input){
        if(!$(input).val()){
            $(input).addClass("invalid");
            validForm = false;
        } else{
            $(input).removeClass("invalid");
        }

    validateInput();
}

var clearInputFields = function(){
    $("input[type=number], textarea").val("");
    $('#savePerKg').html("");
    $('#savePerBag').html("");
    $('#savePerTon').html("");
    $('#savePerThouTon').html("");
    $('#SBMPriceFrom').html("");
    $('#SBMPriceTo').html("");
    $('#SBMCostRed').html("");
    var inputArray  = [$('#rmpCorn'), $('#rmpCoconutOil'), $('#rmpSoybeanMeal'), $('#rmpLysine'), $('#rmpMethionine'), $('#rmpThreonine'), $('#rmpTryptophan'), $('#rmpValine'), $('#rmiSoybeanMeal'), $('#rmiWheat')];
    for(var i =0; i<inputArray.length; i++){
        validateSingleInput(inputArray[i]);
    }
    $('#goToTop')[0].click();
    $(".result").hide();
}

$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});


   
