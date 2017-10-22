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
    var strHtml = '<option value="">select alliance...</option>';
    for (var key in objectAlliances)
    {
        strHtml += '<option value="' + objectAlliances[key.toString()].NameId + '">' + objectAlliances[key.toString()].Name + '</option>';
    }
    $('#alliance')[0].innerHTML = strHtml;
    if ($('#' + Id + 'BaseLevel')[0])
    {
        $('#btnRemoveField').removeClass('hide');
        document.formUpdate.baseLevel.value = $('#' + Id + 'BaseLevel')[0].innerHTML;
        document.formUpdate.alliance.value = $('#' + Id + 'Alliance')[0].innerHTML.replace('&nbsp;', ' ');
        changeAlliance();
    }
    else
    {
        $('#btnRemoveField').addClass('hide');
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
        for (var y in arrayFields)
        {
            for (var x in arrayFields[y])
            {
                var field = arrayFields[y][x];
                if ($('#field' + field.y + field.x)[0])
                {
                    updateFieldColor(field, arrayFieldsFull);
                }
            }
        }
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
    var sumForgotten = parseFloat(0);
    var sumAlliance1 = parseFloat(0);
    var sumAlliance2 = parseFloat(0);
    var sumAlliance3 = parseFloat(0);
    var sumAlliance4 = parseFloat(0);
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
        if (arrayFieldsFull.length != 0)
        {
            // Array enthält Einträge
            for (var key in arrayFieldsFull)
            {
                var externField = arrayFieldsFull[key];
                var externX = externField.x;
                var externY = externField.y;
                var externBaseLevel = externField.BaseLevel;
                var externAlliance = externField.Alliance;
                var externRange = objectAlliances[externAlliance].Range;
                var differenceToExternField = Math.sqrt(Math.pow(externX - curX, 2) + Math.pow(externY - curY, 2));
                if (differenceToExternField <= externRange)
                {
                    var fieldSumToExtern = parseFloat((parseFloat(externRange) - differenceToExternField) / parseFloat(externRange));
                    var additionalSum = parseFloat(externBaseLevel) * fieldSumToExtern;
                    switch (externAlliance)
                    {
                        case 'Forgotten':
                        {
                            sumForgotten += additionalSum;
                            break;
                        }
                        case 'Alliance 1':
                        {
                            sumAlliance1 += additionalSum;
                            break;
                        }
                        case 'Alliance 2':
                        {
                            sumAlliance2 += additionalSum;
                            break;
                        }
                        case 'Alliance 3':
                        {
                            sumAlliance3 += additionalSum;
                            break;
                        }
                        case 'Alliance 4':
                        {
                            sumAlliance4 += additionalSum;
                            break;
                        }
                        default:
                        {
                            break;
                        }
                    }
                }
            }
            var maxSum = Math.max(sumForgotten, sumAlliance1, sumAlliance2, sumAlliance3, sumAlliance4);
            if (maxSum)
            {
                switch (maxSum)
                {
                    case sumForgotten:
                    {
                        $('#field' + curY + curX)[0].style.backgroundColor = objectAlliances["Forgotten"].Color;
                        break;
                    }
                    case sumAlliance1:
                    {
                        $('#field' + curY + curX)[0].style.backgroundColor = objectAlliances["Alliance 1"].Color;
                        break;
                    }
                    case sumAlliance2:
                    {
                        $('#field' + curY + curX)[0].style.backgroundColor = objectAlliances["Alliance 2"].Color;
                        break;
                    }
                    case sumAlliance3:
                    {
                        $('#field' + curY + curX)[0].style.backgroundColor = objectAlliances["Alliance 3"].Color;
                        break;
                    }
                    case sumAlliance4:
                    {
                        $('#field' + curY + curX)[0].style.backgroundColor = objectAlliances["Alliance 4"].Color;
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            else
            {
                $('#field' + curY + curX)[0].style.backgroundColor = '';
            }
        }
        else
        {
            $('#field' + curY + curX)[0].style.backgroundColor = '';
        }
    }
}