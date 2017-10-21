// global vars
var arrayAlliances =
[
    ['Forgotten', 'Forgotten', 3.5, '#DDDD00'],
    ['Alliance 1', 'Alliance&nbsp;1', 2.5, '#2222FF'],
    ['Alliance 2', 'Alliance&nbsp;2', 2.5, '#22FF22'],
    ['Alliance 3', 'Alliance&nbsp;3', 2.5, '#FF2222'],
    ['Alliance 4', 'Alliance&nbsp;4', 2.5, '#22FFFF']
];

// on load of page
$(document).ready(function(){
    $('.field')
        .mouseenter(function() {
            focusField(this.id);
        })
        .mouseleave(function() {
            defocusField(this.id);
        })
        .click(function(){
            clickField(this.id);
        });
});

// mit der Maus ins Feld reinbewegen
function focusField(Id)
{
    $('#' + Id)[0].style.border = '3px solid black';
}

// mit der maus aus dem Feld rausbewegen
function defocusField(Id)
{
    $('#' + Id)[0].style.border = '';
}

// auf ein Feldklicken
function clickField(Id)
{
    document.formUpdate.reset();
    document.formUpdate.fieldId.value = Id;
    var strHtml = '';
    if ($('#' + Id + 'BaseLevel')[0])
    {
        $('#btnRemoveField').removeClass('hide');
    }
    else
    {
        strHtml += '<option value="">select alliance...</option>';
        $('#btnRemoveField').addClass('hide');
    }
    for (var key in arrayAlliances)
    {
        strHtml += '<option value="' + arrayAlliances[key][0] + '">' + arrayAlliances[key][1] + '</option>';
    }
    $('#alliance')[0].innerHTML = strHtml;
    if ($('#' + Id + 'BaseLevel')[0])
    {
        document.formUpdate.baseLevel.value = $('#' + Id + 'BaseLevel')[0].innerHTML;
        document.formUpdate.alliance.value = $('#' + Id + 'Alliance')[0].innerHTML.replace('&nbsp;', ' ');
    }
    $('#divEditField').removeClass('hide');
}

// wenn in formUpadte die alliance gewechselt wird
function changeAlliance()
{
    if (document.formUpdate.alliance.options[0].value == '')
    {
        document.formUpdate.alliance.options[0].remove();
    }
}

// click auf Update
function updateField(Id)
{
    var strHtml = '';
    strHtml += '<span id="' + Id + 'BaseLevel">' + document.formUpdate.baseLevel.value + '</span><br/>';
    strHtml += '<span id="' + Id + 'Alliance">' + document.formUpdate.alliance.selectedOptions[0].innerText;
    $('#' + Id)[0].innerHTML = strHtml;
    updateUI();
    cancelEdit();
    return false;
}

// click auf remove
function removeField()
{
    var Id = document.formUpdate.fieldId.value;
    $('#' + Id)[0].innerHTML = '';
    updateUI();
    cancelEdit();
    return false;
}

// click auf Abbrechen
function cancelEdit()
{
    $('#divEditField').addClass('hide');
    return false;
}

// ========================================
// nur für UserInterface
// ========================================

// Hintergrundfarben für alle Felder berechnen
function updateUI()
{
    try
    {
        var arrayFields = scanAllFieldsAsMatrix();
        console.log(arrayFields);
    }
    catch(e)
    {
        console.log(e);
    }
}

// erzeugt ein Array von allen Feldern
function scanAllFieldsAsMatrix()
{
    var arrayFields = new Array();
    /*for (var y = 0; y < 7; y++)
    {
        for (var x = 0; x < 7; x++)
        {
            console.log();
        }
    }*/
    for (var i = 0; i < $('.field').length; i++)
    {
        var arrayField = new Array();
        if ($('.field')[i].innerHTML != '')
        {
            var iInc = parseInt(i) + 1;
            arrayField[0] = $('#field' + iInc  + 'BaseLevel')[0].innerHTML;
            arrayField[1] = $('#field' + iInc  + 'Alliance')[0].innerHTML.replace('&nbsp;', ' ');
        }
        arrayFields.push(arrayField);
    }
    return arrayFields;
}