// global vars
var objectAlliances = new Object();

// on load of page
$(document).ready(function(){
    $.getJSON('js/objectAlliances.json', function(data){
        objectAlliances = data;
    });
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
    for (var key in objectAlliances)
    {
        strHtml += '<option value="' + objectAlliances[key.toString()].NameId + '">' + objectAlliances[key.toString()].Name + '</option>';
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
        var arrayFieldsFull = new Array();
        for (var y in arrayFields)
        {
            for (var x in arrayFields[y])
            {
                var field = arrayFields[y][x];
                if (field.BaseLevel)
                {
                    arrayFieldsFull.push(field);
                }
            }
        }
        for (var key in arrayFieldsFull)
        {
            updateFieldColor(arrayFieldsFull[key], arrayFieldsFull);
        }
        console.log(arrayFields);
        console.log(arrayFieldsFull);
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
    for (var y = 0; y < 7; y++)
    {
        var arrayX = new Array();
        for (var x = 0; x < 7; x++)
        {
            var arrayField = new Object();
            if ($('#field' + y + x + 'BaseLevel')[0])
            {
                arrayField.BaseLevel = $('#field' + y + x + 'BaseLevel')[0].innerHTML;
                arrayField.Alliance = $('#field' + y + x  + 'Alliance')[0].innerHTML.replace('&nbsp;', ' ');
            }
            arrayField.x = x;
            arrayField.y = y;
            arrayX.push(arrayField);
        }
        arrayFields.push(arrayX);
    }
    return arrayFields;
}

// färbt ein Feld ein
function updateFieldColor(field, arrayFieldsFull)
{
    var curX = field.x;
    var curY = field.y;
    // baseLevel existiert -> direkt einfärben
    if (field.BaseLevel)
    {
        var curBaseLevel = field.BaseLevel;
        var curAlliance = field.Alliance;
        $('#field' + curY + curX)[0].style.backgroundColor = objectAlliances[curAlliance.toString()].Color;
    }
    // Feld unbesetzt
    else
    {
    }
}