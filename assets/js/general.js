var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
function switchTheme () {
    $(".switch-theme").addEventListener("click", function () {
        const theme = $("html").getAttribute("data-theme");
        console.log(theme);
        const newTheme = theme=="dark"?"light":"dark";
        $("html").setAttribute("data-theme",newTheme);
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

document.addEventListener("DOMContentLoaded", () => {
    switchTheme(); fuckForm();
})