let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

function switchTheme () {
    if (localStorage.getItem("theme")) {
        const theme = localStorage.getItem("theme");
        $(".switch-theme").innerText = `theme: ${theme}`;
        $("html").setAttribute("data-theme",theme);
    }
    $(".switch-theme").addEventListener("click", function () {
        const theme = $("html").getAttribute("data-theme");
        const newTheme = theme=="dark"?"light":"dark";
        $("html").setAttribute("data-theme",newTheme);
        localStorage.setItem("theme", newTheme);
        this.innerText = `theme: ${newTheme}`;
    })
}

function fuckForm () {
    // console.log($$("form"))
    ($$("form")).forEach(
        el=>{
            el.addEventListener("submit", function (e) {
                e.preventDefault();
            })
        }
    )
}


function findParent(input, target, limit = 10) {
    let objInput, i = 1;
    // find object is objInput
    switch (typeof objInput) {
        case "string":
            let tmp = (input[0]==".")?input:"."+input;
            objInput = $(tmp);
            break;
    
        default:
            objInput = objInput;
            break;
    }
    // configure target
    let objTarget = (target[0]==".")?target:"."+target;
    try {
        if (objInput===undefined) throw new Error(`Can't find the parent as the input is invalid `)
        while (!objInput.matches(objTarget) ) {
            objInput = objInput.parentNode; i++;
            if (i>limit) throw new Error(`Can't find the parent: ${objTarget} from ${""+objInput}`)
        }
        return objInput; 
    } catch (error) {
        console.log(error.message)
        return false;
    }    
} 

document.addEventListener("DOMContentLoaded", () => {
    switchTheme(); fuckForm();
})