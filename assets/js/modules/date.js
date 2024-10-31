let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

/* 

    slider note:
    
    1. ...
    2. ...
    3. procedure for opening a datebox calendar:
        a. open the calendar (focus the datebox, blur all of the other)
        b. identify whether the selected date has been made; otherwise, navigate to the current month.
        c. initialize a month and the previous of it. 
        d. move to the month with selected date
        e. update the header text of the calendar

    4. for cloning a previous month:
    - only use slidePrevTransitionEnd for requestMove("prev")
    - for the first time, be sure to add the previous one.


    5. month navigation:
     - only switch to a slide after the swiper has been updated. use eventListener: slidesUpdated
     - don't need to request a prev navigation

    6. remove all disable option in the next navigation button

*/
export default class DatePicker {
    #clone() {
        // will do it later
    }
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
            })
        }
        function modifyValue(id) {
            const hash = $(`${id}`).getAttribute("data-date");
            if (_this.match(hash)) {
                $(`${id} .date__txt-real > span`).innerText = hash;
            } else {
                $(`${id} .date__txt-real > span`).innerText = _this.defaultFormat;
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
        yyyy = yyyy*1; mm = mm*1;

        if (!["prev", "next"].includes(dir)) {
            throw new Error ("co loi xay ra. fuck you")
        }

        function monthRender(start, numberDay, hash, hasSelectedDay = false) {
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
                let daySelectedInjection = ((daySelected==i)&&(hasSelectedDay))?" day-selected ":"";

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

        function renderDynamic([yyyy,mm], hasSelectedDay = false) {
            let hash = _this.hashToString([yyyy,mm]);
            let cal = new Date(`${yyyy}-${mm}-01`);
            let start = (cal.getDay());
            let numberDay = _this.dates[mm](yyyy);
    
            return monthRender(start, numberDay, hash, hasSelectedDay);
        }

        if (dir=="next") {
            // insert a node and prev one
            let htmls = renderDynamic([yyyy,mm], true);
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
    moveToSelected() {
        const _this = this;
        const selectedDate = this.getDataDate(); 
        let indexSelected;
        function retrieveCurrent() {
            let mm = new Date().getMonth() + 1;
            let yyyy = new Date().getFullYear();
            return [yyyy, mm];
        }
        function findIndex(arrDate) {
            const slides = _this.swip.slides;
            const reducedSelection = _this.hashToString(arrDate ,true);
            const result = slides.findIndex((e)=>e.getAttribute("data-node")==reducedSelection);
            if (result ==-1) throw new Error("The item doesn't exist: " + arrDate.join("."))
            return result;
        }
        if (selectedDate!="null") {
            indexSelected = findIndex(selectedDate.split("."));
        } else {
            // move to today
            indexSelected = findIndex(retrieveCurrent());
        }
        this.swip.slideTo(indexSelected,200);
        
    }
    pickDayFrom(dayNode) {
        let dd = dayNode.innerText;
        dd = (dd<10)?"0"+dd+"":dd;
        const monthNode = dayNode.parentNode.parentNode;
        const yyyyMM = monthNode.getAttribute("data-node");
        const selectedDay = yyyyMM+"."+dd;
        
        $(`${this.id}`).setAttribute("data-date", selectedDay);
        this.#updateHeaderDateBox();

        $$(`${this.id} .day:not(.day-outside)`).forEach(
            el=>{
                el.classList.remove("day-selected");
            }
        )
        dayNode.classList.add("day-selected")
    }
    
    #runEvent() {
        const id = this.id;
        const _this = this;

        // pick a day 
        
        // $(`${id} .day:not(.day-outside)`).addEventListener("click", (e)=>{
        //     console.log(e.target.parentNode.parentNode);
        // })
        // keyboard navigation goes here . . . 
        window.addEventListener("keydown", function (e) {
            const key = e.key;
            function isInputDate(key) {
                key = key.replace(/Numpad/,"");
                if (["0","1","2","3","4","5","6","7","8","9", "/", ".", "-", "Backspace", "Delete"].includes(key)) return true;
                return false;
            }
            function requestNavigation(key) {
                switch (key) {
                    case 'ArrowLeft':
                        _this.swip.slidePrev(200);
                        break;
                    case 'ArrowRight':
                        _this.requestMove("next");
                        _this.swip.slideNext(200);
                        break;
                }
            }

            console.log(key);
            

            function requestInputDate(key) {
                // only allow the following list
                /* 
                    1. 2024-10-12, 2024.10.12, 2024/10/12 (yyyy mm dd)
                    2. (mm dd yyyy)
                */
                if (_this.inputKeyboard == "") {
                    $(`${id} .date__txt-real > span`).innerText = key;
                } else {
                    $(`${id} .date__txt-real > span`).innerText += key; 
                }
                _this.inputKeyboard += key;
            }
            
            
            if (_this.isFocus()) {
                if (['ArrowLeft','ArrowRight'].includes(key)) {
                    requestNavigation(key);
                } else if (isInputDate(key)) {
                    requestInputDate(key);
                } else {

                }
                return 0;
            }
        })
        // trigger next navigation
        $(`${id} .calendar__navigate--next`).addEventListener("click", ()=>{
            this.requestMove("next")
        })

        // open the calendar and handle stuff
        $(`${id} .date__box`).addEventListener("click",  (e)=>{

            // "onblur" event copycat [pt.1]
            $$('.form__input').forEach(el=>{
                if (!el.matches(`${id}`)) el.classList.remove("form__input--focus");
            })


            this.switchVisibility();
            this.openCalendar();
            this.moveToSelected();
            this.#updateHeaderText();
            e.stopPropagation();
        })

        // "onblur" event copycat [pt.2]
        document.addEventListener("click", (e)=>{
            console.log(e.target);
            if (!e.target.matches(`${id} *`)) {
                if (this.drag) {
                    this.drag = false;
                } else {
                    this.switchVisibility(false); 
                }
            }
        })

        this.swip.on("slideChange", (a)=>{
            this.#updateHeaderText();
        });

        // only load the previous month - prevent from unwanted glitch
        this.swip.on("slidePrevTransitionEnd", (a)=>{
            this.requestMove("prev")
        });

        this.swip.on("sliderFirstMove", (a)=>{
            this.drag = true;

            if (a.touches.diff > 0 ) {
                // clone the previous month 
                // console.log("prev"); 
                //move("prev");
            } else {
                // clone the next month
                // console.log("next");
                this.requestMove("next");
            }
        })

        this.swip.on("sliderMove", (a)=> {
            
        })
        this.swip.on("reachEnd", () => {
            setInterval(()=>{
                $(`${this.id} .calendar__navigate--next `).classList
                .remove("swiper-button-disabled");
                $(`${this.id} .calendar__navigate--next `).setAttribute("aria-disabled", "false");
                $(`${this.id} .calendar__navigate--next `).disabled = false;

                $(`${this.id} .calendar__navigate--prev `).classList
                .remove("swiper-button-disabled");
                $(`${this.id} .calendar__navigate--prev `).setAttribute("aria-disabled", "false");
                $(`${this.id} .calendar__navigate--prev `).disabled = false;
            },0)
        });

        this.swip.on("slidesUpdated", (a)=> {
            // only add event when new months are added.
            $$(`${this.id} .day:not(.day-outside)`).forEach(
                el=>{
                    el.onclick = function(e) {
                        _this.pickDayFrom(this)
                    }
                }
            )

            if (this.dir=="next") {
                this.dir = "none";
                this.swip.slideNext(200);
            }
        })
        
    }
    // only for navigating to previous month
    requestMove(dir) {
        if (!["next", "prev"].includes(dir)) throw new Error ("Fuck you, donkey!");

        const curSlide = this.swip.slides[this.swip.realIndex];
        const curNode = curSlide.getAttribute("data-node").split(".");
        const targetNode = (dir=="prev")?this.prev(curNode):this.next(curNode);
        if (!this.isExist(targetNode)) {
            this.loadMonth(targetNode, dir);
        } 
    }
    #updateHeaderDateBox() {
        $(`${this.id} .date__txt-real > span`).innerText = $(`${this.id}`).getAttribute("data-date");
    }
    #updateHeaderText() {
        const dataNode = this.getMeta(this.getCurrentSlide()).dataNode;
        let [yyyy,mm] = this.hashSplit(dataNode);
        // console.log(yyyy,mm);
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
    

    getCurrentSlide() {
        return this.swip.slides[this.swip.realIndex];
    }
    getSlideFromNode(inputNode) {
        return $(`${this.id} .swiper-slide[data-node="${inputNode}"]`);
    }
    getMeta(inputObj) {
        if (inputObj.getAttribute("data-legit")=="false") inputObj = inputObj.nextSibling;
        return {
            obj: inputObj,
            dataNode: inputObj.getAttribute("data-node")
        }
    }


    match(hash, dateFormat = "yyyy.mm.dd") {
        const _this = this;
        const regList = {
            ["yyyy.mm.dd"]: new RegExp(/^[12][0-9]{3}[.][10][0-9]{1}[.][3210][0-9]{1}/ig),
            ["yyyy/mm/dd"]: new RegExp(/^[12][0-9]{3}[/][10][0-9]{1}[/][3210][0-9]{1}/ig),
            ["yyyy-mm-dd"]: new RegExp(/^[12][0-9]{3}[-][10][0-9]{1}[-][3210][0-9]{1}/ig),
            ["mm-dd-yyyy"]: new RegExp(/^[10][0-9]{1}[-][3210][0-9]{1}[-][12][0-9]{3}/ig),
            ["mm/dd/yyyy"]: new RegExp(/^[10][0-9]{1}[/][3210][0-9]{1}[/][12][0-9]{3}/ig),
        }

        function check(reg, hash) {
            if (hash.match(reg)!=null) {
                const s=hash.split(".");
                if (s[1]*1 == 0|| s[1]*1 > 12 ) {
                    return false; 
                } else {
                    if (s[2] == 0|| s[2] > _this.dates[s[1]*1](s[0]*1) ) return false;
                }
                return true;
            } else return false;
        }

        let reg = regList[dateFormat];
        return check(reg, hash);
        
    }
    hashToString([yyyy,mm, dd], removeDay=false) {
        if (dd===undefined) dd = 0;
        if (!Number.isInteger(yyyy) || !Number.isInteger(mm) || !Number.isInteger(dd)) {
            // who knows if a month include a day? so I included the dd check with triple and double if
            if ((mm[0]==0) && (mm.length!=1)) ;else if (mm<10) mm = "0" + mm + "";

            if (!removeDay) {
                dd = (dd==0) ? "" : ( (dd<10)?(".0"+dd+""):("."+dd+"") ) ;
            } else {
                dd = "";
            }
        } else {
            if (mm<10) mm = "0" + mm + "";

            if (!removeDay) {
                dd = (dd==0) ? "" : ( (dd<10)?(".0"+dd+""):("."+dd+"") ) ;
            } else {
                dd = "";
            }

        }
        return `${yyyy}.${mm}${dd}`;
    }
    hashSplit(dataNode) {
        const curNode = dataNode.split(".");
        let yyyy = curNode[0]*1;
        let mm = curNode[1]*1;
        return [yyyy,mm];
    }
    convert(strInput, oldFormat, newFormat) {
        
    }

    getDataDate() {
        return $(`${this.id}`).getAttribute("data-date");
        // return #this.selected;
    }
    isFocus() {
        if ($(`${this.id}`).classList.contains("form__input--focus")) {
            return true;
        } else {
            return false;
        }
    }
    constructor (formID, config) {
        this.id = formID;
        // event variables
        this.drag = false; // use to prevent from closing calendar when dragging to out of the calendar
        this.posX = null;
        this.dir = "none";

        // input options
        this.inputKeyboard = "";
        this.defaultFormat = "yyyy.mm.dd";
    
        // data
        this.months = ["NaM","January","February","March","April","May","June","July","August","September","October","November","December"];
        this.dates = [-1,()=>31,function(yr=2024){return ( ((yr%100==0)&&(yr%400==0)) || ((yr%4==0)&&(yr%100!=0)) ) ? 29 : 28},()=>31,()=>30,()=>31,()=>30,()=>31,()=>31,()=>30,()=>31,()=>30,()=>31];
 

        // required ctions
        this.#clone();
        this.#adjust();
        this.#runEvent();

        console.log(this.convert("2024.10.09", "yyyy.mm.dd", "mm/dd/yyyy"));
        
    }
}