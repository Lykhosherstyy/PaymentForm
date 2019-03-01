function luhnCheck(val) {
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
        let intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) == 0;
}

function inputValueReplace(val) {
    return val.replace( / - /g,'');
}

const validator = {
    'card_number': (input) => {
        const inputVal = inputValueReplace(input.value),
            regex = new RegExp("^[0-9]{16}$");

        if (!regex.test(inputVal)){
            return true;
        }

        return !luhnCheck(inputVal);
    },
    'expire_date': (input) => {
        const monthYear = input.value.split('/'),
            regexMonth = new RegExp("^(0[1-9]|1[012])$"),
            regexYear = new RegExp("^[0-9]{2}$");

        if(!regexMonth.test(monthYear[0]) || !regexYear.test(monthYear[1]) ){
            return true;
        }
        return false;
    },
    'cvv': (input) => {
        var regexCvv= new RegExp("^[0-9]{3}$");

        if(!regexCvv.test(input.value)){
            return true;
        }
        return false;
    }
};

const formControl = {
    init:function() {
        let form = document.querySelectorAll('.payment_form')[0];

        this.bindListeners();

        form.onsubmit = () => this.checkForm();
    },
    bindListeners:function() {
        this.validateFields = document.querySelectorAll('.validate');

        for (let i = 0; i < this.validateFields.length;i++){
            let field = this.validateFields[i];

            field.addEventListener("change", () => {
                field.classList.remove("input-error");
                if(validator[field.id](field)){
                    this.onError(field);
                }
            });
        }

        this.moveWhenFull('#card_number','#expire_date').moveWhenFull('#expire_date','#cvv');
    },
    checkForm:function() {
        for (let i = 0; i < this.validateFields.length; i++){
            let field = this.validateFields[i];

            if(validator[field.id](field)){
                this.onError(field);
                return false;
            }

            field.classList.remove("input-error");
        }

        /* */
        setTimeout(() => {
            this.showMessage('success');
        }, 1000);

        return false;

    },
    showMessage:function(type) {
        let messageBox = document.getElementById(type + '_message');

        messageBox.classList.remove('hide');

        setTimeout(() => {
            messageBox.classList.add('hide');
        }, 4000);
    },
    moveWhenFull:function(input, nextFieldId) {
        let el = document.querySelectorAll(input)[0],
            nextEl = document.querySelectorAll(nextFieldId)[0];

        el.addEventListener("input", () => {

            if(!el || !nextEl) {
                return;
            }
            if(input == '#card_number'){
                this.checkCardType(el.value);
            }
            if (el.value.length >= el.maxLength) {
                nextEl.removeAttribute('disabled');
                nextEl.focus();
            }
        });
        return this;
    },
    onError: function(input){
        input.classList.add("input-error");
        input.focus();
    },
    checkCardType: function(cardNum){
        let regexMap = [
                {regEx: /^4/ig, cardType: "VISA"},
                {regEx: /^5[1-5]([0-9]{4})/, cardType: "MASTERCARD"},
                {regEx: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/, cardType: "MAESTRO"}
            ],
            payCardType = '';


        for (var j = 0; j < regexMap.length; j++) {
            if (inputValueReplace(cardNum).match(regexMap[j].regEx)) {
                payCardType = regexMap[j].cardType;
                break;
            }
        }

        switch (payCardType) {
            case 'VISA':
                this.showCardImg(1);
                break
            case 'MASTERCARD':
                this.showCardImg(2);
                break
            case 'MAESTRO':
                this.showCardImg(3);
                break
            default:
                this.showCardImg(0);
                break
        }

    },
    showCardImg: function(iconPos){
        let rightIcon = document.querySelectorAll('.right-icon')[0];

        [].forEach.call(rightIcon.children, function(el,i) {
            if(i == iconPos){
                el.classList.remove("hide");
            }
            else{
                el.classList.add("hide");
            }
        });

    }
}

formControl.init();

// window.formControl = formControl; // если захотим вызвать метод init в html