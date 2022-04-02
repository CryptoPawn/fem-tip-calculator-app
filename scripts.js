// Classes
const CLASS_outlineError = "error-input";
const CLASS_selected = "selected";
const CLASS_inactive = "inactive";

// Inputs
const HTML_bill = "#bill";
const HTML_tip_button = ".tip-button";
const HTML_tip_custom = "#tip-custom";
const HTML_people = "#num-people";
const HTML_amount_tip = "#tip-amount";
const HTML_amount_total = "#total-amount";
const HTML_reset = "#reset";

// Other
const HTML_error_bill = "#error-bill";
const HTML_error_people = "#error-people";

var values = {
    bill: 0,
    tip: 0,
    people: 0
};


function toPortion(input) {
    if (input.includes("%")) {
        values.tip = Number(input.replace("%","")) / 100;
    } else {
        values.tip = Number(input) / 100;
    }
}

function updateButtonCSS(button) {
    $(HTML_tip_button).removeClass(CLASS_selected);
    $(button).addClass(CLASS_selected);
    $(HTML_tip_custom).val("")
}

function checkFields() {
    let $bill = $(HTML_bill);
    let $people = $(HTML_people);
    let $tip_c = $(HTML_tip_custom);
    let $tip_b = $(HTML_tip_button);

    if ($bill.val().toString() !== "" || $tip_c.val().toString() !== "" || $people.val().toString() !== ""  || $tip_b.hasClass(CLASS_selected)) {
        $(HTML_reset).removeClass(CLASS_inactive);
    } else {
        $(HTML_reset).addClass(CLASS_inactive);
    }
}

function checkIfEmpty(field) {
    let $bill = $(HTML_bill);
    let $people = $(HTML_people);
    let $error_b = $(HTML_error_bill);
    let $error_p = $(HTML_error_people);

    if (field = "bill") {
        if ($bill.val().toString() === "") {
            $bill.addClass(CLASS_outlineError);
            $error_b.css("display","inline");
        } else {
            $bill.removeClass(CLASS_outlineError);
            $error_b.css("display","none");
        }
    }

    if (field = "people") {
        if ($people.val().toString() === "") {
            $people.addClass(CLASS_outlineError);
            $error_p.css("display","inline");
        } else {
            $people.removeClass(CLASS_outlineError);
            $error_p.css("display","none");
        }
    }
}

function reset() {
    $(HTML_bill).val("")
    $(HTML_tip_button).removeClass(CLASS_selected);
    $(HTML_tip_custom).val("")
    $(HTML_people).val("")
    $(HTML_reset).addClass(CLASS_inactive);
     
    values.bill = 0;
    values.tip = 0;
    values.people = 0;

    amounts();
}

function shortenNumber(input) {
    if (input < 100) {
        input = input.toFixed(2);
    } else if (input <= 1000) {
        input = input.toFixed(1);
    } else if (input <= 10000) {
        input = Math.round(input);
    } else if (input <= 1000000) {
        input = Math.round(input/1000) + "k";
    } else if (input > 1000000) {
        input = input.toExponential(1).replace("+","");
    }
    return input;
}

function amounts() {
    total = shortenNumber(((values.bill + (values.bill * values.tip)) / values.people));
    tip = shortenNumber(((values.bill * values.tip) / values.people));

    if (total !== "Infinity" && isNaN(parseFloat(total)) === false) {
        $(HTML_amount_total).html("$" + total);
        $(HTML_amount_tip).html("$" + tip);
    } else {
        $(HTML_amount_total).html("$0.00");
        $(HTML_amount_tip).html("$0.00");
    }
}



$(document).ready(function() {
    $(HTML_bill).on("change paste keyup", function() {
        if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
        values.bill = Number($(this).val());
        amounts();
        checkFields();
    });
    $(HTML_bill).on("focusout", function() {
        checkIfEmpty("bill");
    });


    $(HTML_tip_button).on("click", function() {
        if ($(this).hasClass(CLASS_selected)) {
            $(HTML_tip_button).removeClass(CLASS_selected);
            values.tip = 0;
        } else {
            updateButtonCSS($(this));
            toPortion($(this).val());
        }
        amounts();
        checkFields();
    });
    $(HTML_tip_custom).on("change paste keyup", function() {
        $(HTML_tip_button).removeClass(CLASS_selected);

        if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);        
        if ($(this).val() === "0") {
            $(this).val("");
        };
        toPortion($(this).val());
        amounts();
        checkFields();
    });
    

    $(HTML_people).on("change paste keyup", function() {
        values.people = Number($(this).val());
        amounts();
        checkFields();
    });
    $(HTML_people).on("focusout", function() {
        checkIfEmpty("people");
    });




    $(HTML_reset).on("mouseup", function() {
        reset();
        amounts();
    });
});
