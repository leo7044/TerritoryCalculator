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

function focusField(Id)
{
    $('#' + Id)[0].style.border = '3px solid black';
}

function defocusField(Id)
{
    $('#' + Id)[0].style.border = '';
}

function clickField(Id)
{

}