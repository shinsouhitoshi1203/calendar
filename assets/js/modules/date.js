let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
export default class DatePicker {
    
    #adjust() {
        function defaultVisibility(id) {
            $(`${id}`).setAttribute("data-display-calendar","false")
        }
        defaultVisibility(this.id);
    }
    #runEvent() {
        const id = this.id;
        $(`${id} .date__box`).addEventListener("click",  (e)=>{
            this.switchVisibility()
        })
    }

    switchVisibility(val = "") {
        const id = this.id;
        if ($(id).getAttribute("data-display-calendar")!==undefined) {
            if (typeof val=="string") {
                if ($(id)?.getAttribute("data-display-calendar")=="true") {
                    $(id)?.setAttribute("data-display-calendar","false")
                } else {
                    $(id)?.setAttribute("data-display-calendar","true")
                }
            } else {
                $(id)?.setAttribute("data-display-calendar",`${val}`);
            }
        }
    }
    
    constructor (formID, config) {
        this.id = formID;
        this.#adjust();
        this.#runEvent();
    }
}