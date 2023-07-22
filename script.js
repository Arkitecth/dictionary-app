class App {
    constructor() {
        this._body = document.querySelector("body"); 
        this._arrowDown = document.querySelector(".arrow-down"); 
        this._modal = document.querySelector(".modal"); 
        this._font = document.querySelector(".right .fonts p");
        this._slider = document.querySelector(".slider"); 
        this._moon = document.querySelector(".moon"); 
        this._text = document.querySelector("input[type='text']"); 
        this._ui = new UI(this._body, this._arrowDown, this._modal, this._font, this._moon, this._text); 
    }

    run() {
        this._arrowDown.addEventListener("click", () => {
            this._ui.arrowDownModal(); 
        })

        // Switch Fonts -> Select List Items in Modal View
        document.querySelectorAll('.modal ul li').forEach((element) => {
            element.addEventListener("click", () => {
                this._ui.switchFonts(element); 
            })
        })

        this._slider.addEventListener('click', this._ui.toggleDark.bind(this._ui))

        this._text.addEventListener('keypress', (e) => {
            if(e.key === "Enter") {
                if(this._text.value === "") {
                    this._ui.showTextErrorMessage(); 
                } else {
                    this._ui.hideTextErrorMessage(); 
                }
            }
        })
    }
}

class UI {
    constructor(body, arrowDown, modal, font, moon, text) {
        this.body = body
        this.arrowDown = arrowDown; 
        this.modal = modal; 
        this.font = font;
        this.moon = moon; 
        this.text = text;  
    }
    
    arrowDownModal() {
        this.modal.classList.toggle("display"); 
   }

   showTextErrorMessage() {
    this.text.classList.add('error'); 
    document.querySelector('.empty').classList.add('display'); 
   }

   hideTextErrorMessage() {
    this.text.classList.remove('error'); 
    document.querySelector('.empty').classList.remove('display'); 
   }

   toggleDark() {
    this.body.classList.toggle('dark'); 
    this.moon.classList.toggle('dark');
    this.text.classList.toggle('dark'); 
    this.modal.classList.toggle('dark'); 
   }

   switchFonts(element) {
    this.font.textContent = element.textContent; 
    this.body.style.fontFamily = element.textContent; 
    if(element.textContent === "Mono") {
        this.body.style.fontFamily = "MonoSpace"; 
    }
   }

}

const app = new App(); 
app.run(); 