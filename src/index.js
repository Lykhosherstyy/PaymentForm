import "./scss/main.scss";

window.jQuery = window.$ = require('jquery');
require ("./../node_modules/jquery-mask-plugin/dist/jquery.mask.min");
require('./form.js');

$(document).ready(function(){
    $('#card_number').mask('0000 - 0000 - 0000 - 0000');
    $('#expire_date').mask('00/00');
    $('#cvc').mask('000');
});