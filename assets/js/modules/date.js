let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
export default class DatePicker {
    
    #adjust() {
        const _this = this
        function defaultVisibility(id) {
            $(`${id}`).setAttribute("data-display-calendar","false")
        }
        function slider(id) {
            _this.swip = new Swiper(`${id} .calendar__month`,{
                direction: 'horizontal',
                slidesPerView: 1,
                autoHeight:true,
                navigation: {
                    nextEl: `${id} .calendar__navigate--next`,
                    prevEl: `${id} .calendar__navigate--prev`,
                },
                spaceBetween: 25,
                on: {
                    
                }
            })
        }
        defaultVisibility(this.id);
        slider(this.id);
    }
    switchVisibility(val = "") {
        const id = this.id;
        // alert(11)
        if ($(id)!==undefined) {
            if (typeof(val)=="string") {
                if ($(id)?.matches('.form__input--focus')) {
                    $(id)?.classList.remove('form__input--focus');
                } else {
                    $(id)?.classList.add('form__input--focus');
                }
            } else {
                if (val) {
                    $(id)?.classList.add('form__input--focus');
                } else {
                    $(id)?.classList.remove('form__input--focus');
                }
            }
        }
    }
    #runEvent() {
        const id = this.id;
        const _this = this;
        $(`${id} .date__box`).addEventListener("click",  (e)=>{
            $$('.form__input').forEach(el=>{
                if (!el.matches(`${id}`)) el.classList.remove("form__input--focus");
            })
            this.switchVisibility();e.stopPropagation();
        })

        document.addEventListener("click", (e)=>{
            console.log(e.target);
            if (!e.target.matches(`${id} *`)) {
                if (this.drag) {
                    this.drag = false
                } else {
                    this.switchVisibility(false); 
                }
            }
        })
        this.swip.on("sliderFirstMove", ()=>{
            this.drag = true;
            console.log(Math.random());
            console.log(_this.swip.activeIndex)
        })
        
    }

    jump() {
        this.swip.slideTo(1); // test
    }
    constructor (formID, config) {
        this.drag = false;
        this.id = formID;
        this.#adjust();
        this.#runEvent();
    }
}

// 181 and 222px
