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
                watchOverflow:false,
                spaceBetween: 25,
                on: {
                    
                }
            })
        }
        function modifyValue(id) {
            const hash = $(`${id}`).getAttribute("data-date");
            if (_this.match(hash)) {
                $(`${id} .date__txt-real`).innerText = hash;
            } else {
                $(`${id} .date__txt-real`).innerText = "yyyy.mm.dd";
                $(`${id}`).setAttribute("data-date","null");
            }
        }

        // run
        defaultVisibility(this.id);
        slider(this.id);
        modifyValue(this.id);
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

    loadMonth([yyyy,mm,daySelected]) {
        yyyy = yyyy*1; mm = mm*1;
        const _this = this;
        let hash = `${yyyy}.${mm<10?'0'+mm+"":mm}`;
        let cal = new Date(`${yyyy}-${mm}-01`);
        let start = (cal.getDay());
        let numberDay = this.dates[mm]();
        // set the text of calendar's header
        $(`${this.id} .calendar__move`).innerText = this.months[mm]+" "+yyyy;

        function monthRender(start, numberDay) {
            let raw = "";
            // load from previous month
            if (start > 0) {
                let prevMonth = _this.prev([yyyy, mm])[1];
                let prevNumDate = _this.dates[prevMonth](yyyy);

                let cnt = start-1;
                for (let i = prevNumDate; i>=21 ;--i) {
                    raw = `<div class="col day day-outside">${i}</div>\n` + raw;
                    --cnt;
                    if (cnt==-1) break;
                }
            }
            // load current month
            for (let i = 1; i<=numberDay; ++i) {
                let daySelectedInjection = (daySelected==i)?" day-selected ":"";

                raw += `<div class="col day${daySelectedInjection}">${i}</div>\n`;
            }
            // load next:
            // if over 35.. else..
            let cnt = 0;
            if (start + numberDay > 35) {
                for (let i = start + numberDay; i<=41; ++i) {
                    cnt++;
                    raw += `<div class="col day day-outside">${cnt}</div>\n`;
                } 
            } else {
                for (let i = start + numberDay; i<=34; ++i) {
                    cnt++;
                    raw += `<div class="col day day-outside">${cnt}</div>\n`;
                } 
            }
            const htmls = `<div class="swiper-slide" data-node="${hash}"><div class="calendar__row row gx-0 row-cols-7" calendar-cell="day-list">${raw}</div></div>`
            return htmls;
        }

        this.swip.appendSlide(monthRender(start, numberDay));
    }
    isExist([yyyy,mm]) {
        const hash = this.hashToString([yyyy,mm])
        console.log(`${this.id} .swiper-slide[data-node="${hash}"]`,hash);
        const element = $(`${this.id} .swiper-slide[data-node="${hash}"]`);
        if (  element != null ) {
            return true;
        } else {
            return false;
        }
    }
    openCalendar() {
        function retrieveCurrent() {
            let mm = new Date().getMonth() + 1;
            let yyyy = new Date().getFullYear();
            return [yyyy, mm];
        }
        let currentYYMM = retrieveCurrent();
        const hash = $(`${this.id}`).getAttribute("data-date");
        // fill the calendar
        if ($$(`${this.id} .swiper-slide`).length==0) {
            // completely new 

            if (this.match(hash)) {
                this.loadMonth(hash.split("."));
            } else {
                if (!this.isExist(currentYYMM)) {
                    $(`${this.id}`).setAttribute("data-date", "null");
                    this.loadMonth(currentYYMM);
                } else {

                }
            }
            

        } else {
            // has something to test for real

            if ($(`${this.id}`).getAttribute("data-date")=="null") {
                // create object
                if (!this.isExist(currentYYMM)) {
                    let currentYYMM = retrieveCurrent();
                    console.log(currentYYMM)
                    this.loadMonth(currentYYMM);
                } else {
                    // navigate to the slide (will do later)
                    console.log("what the hell are you going do")
                }
            } else {
                if (!this.isExist(hash.split("."))) {
                    this.loadMonth(hash.split("."));
                } else {
                    // navigate to the slide (will do it later)
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
            this.switchVisibility();

            this.openCalendar();

            e.stopPropagation();
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
            console.log(_this.swip.slides[_this.swip.realIndex])
        })
        this.swip.on("sliderMove", (a,b)=> {
            if (this.posX!=null) {
                if (this.posX > b.pageX) console.log("left"); else console.log("right");
                this.posX = b.pageX
            } else {
                this.posX = b.pageX
            }
            console.log(b.pageX)
        })
        
    }
    jump() {
        this.swip.slideTo(1); // test
    }

    next([yyyy,mm]) {
        return (mm==12)?[yyyy+1,1]:[yyyy, mm+1];
    }
    prev([yyyy,mm]) {
        return (mm==1)?[yyyy-1,12]:[yyyy, mm-1];
    }
    match(hash) {
        const reg = new RegExp(/^[12][0-9]{3}[.][10][0-9]{1}[.][3210][0-9]{1}/ig)
        if (hash.match(reg)!=null) {
            const s=hash.split(".");
            if (s[1]*1 == 0|| s[1]*1 > 12 ) {
                return false; 
            } else {
                if (s[2] == 0|| s[2] > this.dates[s[1]*1](s[0]*1) ) return false;
            }
            return true;
        } else return false;
    }
    hashToString([yyyy,mm]) {
        return yyyy + "." + mm + "";
    }

    constructor (formID, config) {
        this.drag = false;
        this.id = formID;
        this.posX = null;
        // data
        this.months = ["NaM","January","February","March","April","May","June","July","August","September","October","November","December"];
        this.dates = [-1,()=>31,function(yr=2024){return ( ((yr%100==0)&&(yr%400==0)) || ((yr%4==0)&&(yr%100!=0)) ) ? 29 : 28},()=>31,()=>30,()=>31,()=>30,()=>31,()=>31,()=>30,()=>31,()=>30,()=>31];
 

        // actions
        this.#adjust();
        this.#runEvent();

        // console.log(this.dates[3]())
    }
}

// 181 and 222px
// 