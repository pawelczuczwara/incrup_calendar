'use strict'

const toastInfo = document.querySelector('#toast_info');

class CreateContent
{
    constructor(data, template, entry) {
        this.data           = data;
        this.template_class = template;
        this.entry_node     = document.querySelector(entry);
    }

    _getTemplate() {
        let html = document.querySelector(this.template_class).innerHTML;
        return Handlebars.compile(html);
    }

    _insertHTML(html) {
        this.entry_node.insertAdjacentHTML('beforeend', html);
    }

    createHTML() {

        let compiled_html       = '';
        const compiled_template = this._getTemplate();

        for (let content of this.data) {
            compiled_html = compiled_html + compiled_template(content);
        }

        this._insertHTML(compiled_html);
    }

}

var timeToday = () => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    };
    return [{ date_today: new Date(new Date().getTime()).toLocaleString("en", options) }]

}
console.log(timeToday())
// creates dates array of objects for template
const timeFrom = (X) => {
    let dates = [];
    const options_long = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short"
    };
    const options_short = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        weekday: "short"
    };
    
    for (let I = 1; I < Math.abs(X - 1); I++) {
        const date_serial = new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000);
        const date_day    = new Date(date_serial).getDay();
        
        if (date_day != 0 && date_day != 6) {
            let day = {
                date_plus:      I,
                date_plus_days: ((I <= 1) ? 'day' : 'days'),
                date_full:      new Date(date_serial).toLocaleString("en", options_long),
                date_short:      new Date(date_serial).toLocaleString("en", options_short)
            }
            dates.push(day);
        }
    }
    return dates;
}

function CopyToClipboard(containerid) {
    //console.log('copy: ' + containerid);
    if (window.getSelection) {
        if (window.getSelection().empty) { // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) { // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) { // IE?
        document.selection.empty();
    }

    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
    }
    // window.close();
    toastInfo.classList.remove('toast_hidden');

    setTimeout(function(){ 
        toastInfo.classList.add('toast_hidden');
        window.getSelection().removeAllRanges();
    }, 2000);
}

function buttonClick(element) {
    CopyToClipboard(element.toElement.previousElementSibling.id);
}

function textClick(element) {
    CopyToClipboard(element.toElement.id);
}


function init() {
    console.log("init01");
    const today     = new CreateContent(timeToday(),  '.today_template',   '.timeline_year_put');
    const day_prj   = new CreateContent(timeFrom(-7), '.day_template',     '.timeline_put');

    //menu   .createHTML();
    today  .createHTML();
    day_prj.createHTML();
    
    //add event listeners to copy texts
    const daysButtons = document.getElementsByClassName('b1');
    const daysTexts = document.getElementsByClassName('t1');

    Array.from(daysButtons).forEach(function(element) {
        element.addEventListener('click', buttonClick);
    }); 
    Array.from(daysTexts).forEach(function(element) {
        element.addEventListener('click', textClick);
    });

};
init();

