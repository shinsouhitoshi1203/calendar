let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
export default class DatePicker {
    

    #adjust() {
        const _this = this;
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

    loadMonth([yyyy,mm,daySelected], dir="next") {
        const _this = this;

        if (!["prev", "next"].includes(dir)) {
            throw new Error ("co loi xay ra. fuck you")
        }

        function monthRender(start, numberDay, hash) {
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
            const htmls = `<div class="swiper-slide" data-legit="true" data-node="${hash}"><div class="calendar__row row gx-0 row-cols-7" calendar-cell="day-list">${raw}</div></div>`
            return htmls;
        }

        function renderDynamic([yyyy,mm]) {
            let hash = _this.hashToString([yyyy,mm]);
            let cal = new Date(`${yyyy}-${mm}-01`);
            let start = (cal.getDay());
            let numberDay = _this.dates[mm](yyyy);
    
            return monthRender(start, numberDay, hash);
        }

        yyyy = yyyy*1; mm = mm*1;

        if (dir=="next") {
            // insert a node and prev one
            let htmls = renderDynamic([yyyy,mm])
            this.swip.appendSlide(htmls);


            const [yM, mM] = this.prev([yyyy,mm]);
            htmls = renderDynamic([yM,mM])
            if (!this.isExist([yM, mM])) this.swip.prependSlide(htmls);

        } else if (dir=="prev") {
            let htmls = renderDynamic([yyyy,mm])
            this.swip.prependSlide(htmls);
        } 
    }
    isExist([yyyy,mm]) {
        const hash = this.hashToString([yyyy,mm])
        const element = $(`${this.id} .swiper-slide[data-node="${hash}"]`);
        if (  element!=null ) {
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
        if ($$(`${this.id} .swiper-slide[data-legit="true"]`).length==0) {
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
        // const _this = this;

        // open the calendar and handle stuff
        $(`${id} .date__box`).addEventListener("click",  (e)=>{

            // "onblur" event copycat [pt.1]
            $$('.form__input').forEach(el=>{
                if (!el.matches(`${id}`)) el.classList.remove("form__input--focus");
            })

            this.switchVisibility();

            this.openCalendar();
            // skip the blank slide(temp)
            this.swip.slideTo(1)
            this.#updateHeaderText();

            e.stopPropagation();
        })

        // "onblur" event copycat [pt.2]
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

        this.swip.on("slideChange", (a)=>{
            this.#updateHeaderText();
        });

        // only load the previous month
        this.swip.on("touchEnd", (a)=>{
            setTimeout(()=>{this.move("prev")},0)
        });

        this.swip.on("sliderFirstMove", (a)=>{
            this.drag = true;

            if (a.touches.diff > 0 ) {
                // clone the previous month 
                console.log("prev"); 
                //move("prev");
            } else {
                // clone the next month
                console.log("next");
                this.move("next");
            }
        })

        this.swip.on("sliderMove", (a)=> {
            
        })
        
    }

    // only for navigating to previous month
    move(dir) {
        if (!["next", "prev"].includes(dir)) throw new Error ("Fuck you, donkey!");

        const curSlide = this.swip.slides[this.swip.realIndex];
        const curNode = curSlide.getAttribute("data-node").split(".");
        const targetNode = (dir=="prev")?this.prev(curNode):this.next(curNode);
        if (!this.isExist(targetNode)) {
            this.loadMonth(targetNode, dir);
        } 
    }

    #updateHeaderText() {
        const dataNode = this.getMeta(this.getCurrentSlide()).dataNode;
        let [yyyy,mm] = this.hashSplit(dataNode);
        console.log(yyyy,mm);
        $(`${this.id} .calendar__move`).innerText = this.months[mm]+" "+yyyy;
    }
    next([yyyy,mm]) {
        yyyy = Number.parseInt(yyyy); mm = Number.parseInt(mm);
        return (mm==12)?[yyyy+1,1]:[yyyy, mm+1];
    }
    prev([yyyy,mm]) {
        yyyy = Number.parseInt(yyyy); mm = Number.parseInt(mm);
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
    hashToString([yyyy,mm, dd]) {
        if (dd===undefined) dd = 0;
        if (!Number.isInteger(yyyy) || !Number.isInteger(mm) || !Number.isInteger(dd)) {
            // who knows if a month include a day? so I included the dd check with triple and double if
            if ((mm[0]==0) && (mm.length!=1)) ;else if (mm<10) mm = "0" + mm + "";

            dd = (dd==0) ? "" : ( (dd<10)?(".0"+dd+""):("."+dd+"") ) ;
            return `${yyyy}.${mm}${dd}`; 
        } else {
            if (mm<10) mm = "0" + mm + "";
            dd = (dd==0) ? "" : ( (dd<10)?(".0"+dd+""):("."+dd+"") );

            return `${yyyy}.${mm}${dd}`;
        }
    }
    hashSplit(dataNode) {
        const curNode = dataNode.split(".");
        let yyyy = curNode[0]*1;
        let mm = curNode[1]*1;
        return [yyyy,mm];
    }

    getCurrentSlide() {
        return this.swip.slides[this.swip.realIndex];
    }
    getSlideFromNode(inputNode) {
        return $(`${this.id} .swiper-slide[data-node="${hash}"]`);
    }
    getMeta(inputObj) {
        if (inputObj.getAttribute("data-legit")=="false") inputObj = inputObj.nextSibling;
        return {
            obj: inputObj,
            dataNode: inputObj.getAttribute("data-node")
        }
    }
    constructor (formID, config) {
        this.drag = false; // use to prevent from closing calendar when dragging to out of the calendar
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