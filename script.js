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
                    this._ui.createUi(this._text.value); 
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
        this.handler= new DataHandler(); 
        this._id = 0; 
    }



    loadNotFound() {
        document.querySelector('.not-found').classList.add('flex-display')
    }

    removeNotFound() {
        document.querySelector('.not-found').classList.remove('flex-display')
    }

    clearUI() {
        document.querySelector('main').remove(); 
        let main = document.createElement('main');
        let search = document.querySelector('.search');  
        document.querySelector('body').insertBefore(main, search.nextElementSibling); 
    }

    createWordView(word,phonetic) {
        let section = document.createElement('section');
        section.classList.add('word-view') 
        section.innerHTML = `
            <div class="word-group">
            <h1>${word}</h1>
            <p>${phonetic}</p>
        </div>
        <img class="icon-play" src="assets/images/icon-play.svg" alt="icon-play">
        `
        document.querySelector('main').appendChild(section); 
    }


    createPartOfSpeech(speechPart) {
        let div = document.createElement('div');
        div.classList.add('speech-part-group'); 
        div.innerHTML = `
        <p class="speech-part">${speechPart}</p>
        <div class="grey-rule"></div>
        `
        document.querySelector('main').appendChild(div); 
    }

    createDefinitions(definitions) {
        let section = document.createElement('section');
        section.classList.add('description', `a-${this._id}`);
        section.innerHTML = `
        <p>Meaning</p>
          <ul id="b${this._id}">
          </ul>
        `
       ; 
       document.querySelector('main').appendChild(section); 
    
        //   Add List Item to Dom
       definitions.forEach((element) => {
        let li = document.createElement('li'); 
        let listItem = element.definition; 
        li.innerHTML = listItem; 
        document.querySelector(`#b${this._id}`).appendChild(li); 
     })
     
    }

    createSynonyms(synonyms) {
        if(synonyms.length != 0) {
            console.log(synonyms);
            let description =  document.querySelector(`.description.a-${this._id}`);
            let synonymn = document.createElement('p'); 
            synonymn.classList.add('synonymn');
            synonyms.forEach((element) => {
                synonymn.innerHTML = `Synonyms <span>${element}</span>`   
            })
            description.appendChild(synonymn)
        }
    }

    createExamples(defintions) {
        defintions.forEach((description) => {
            if(description.example != '' && description.example != undefined) {
                let ul =  document.querySelector(`#b${this._id}`);
                let example = document.createElement('p'); 
                example.classList.add('example');
                example.textContent = description.example; 
                ul.appendChild(example)
            }
        })
       
    }

    playAudio() {
        document.querySelector('.icon-play').addEventListener('click', () => {
            let audio = new Audio(this.handler.getAudioPart()); 
            audio.play(); 
        })
    }

    appendHeadingRule() {
        let hr = document.createElement('hr'); 
        document.querySelector('main').appendChild(hr); 
    }


    showSource() {
        let div = document.createElement('div'); 
        div.classList.add('source'); 
        div.innerHTML = `
         <p>Source </p>
         <span>
           <img class="new-window" src="assets/images/icon-new-window.svg" alt="new-window">
         </span>
        `
        document.querySelector('main').appendChild(div); 
        this.handler.getSource().forEach((source) => {
            let anchor = document.createElement('a'); 
            let img = document.querySelector('new-window'); 
            let sourceDiv = document.querySelector('.source'); 
            anchor.textContent = source; 
            anchor.style.color = "#757575"; 
            anchor.setAttribute('href', source)
            sourceDiv.insertBefore(anchor, img); 
        })
       
    }


   async createUi(word) {
    this.clearUI(); 
        try {
            let newWord = await this.handler.getWord(word); 
            let phonetic = this.handler.getPhonetic();
            let meanings = this.handler.getMeaning();
            this.removeNotFound(); 
            console.log(newWord)
            this.createWordView(newWord, phonetic); 
            this.playAudio(); 
            meanings.forEach((meaning) => {
                this.createPartOfSpeech(meaning.partOfSpeech); 
                this.createDefinitions(meaning.definitions);
                this.createExamples(meaning.definitions); 
                this.createSynonyms(meaning.synonyms);
                this._id += 1; 
            })
            this.appendHeadingRule(); 
            this.showSource(); 
           
        } 
        catch {
            this.loadNotFound();
        }
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

class DataHandler {
    constructor() {
        this._endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/`; 
        this._data = undefined;
    }

    async getWord(word) {
        try {
            const res = await fetch(`${this._endpoint}${word}`)
            const data = await res.json();
            if(!res.ok) {
                throw new Error('Request Failed'); 
            }
            this._data = data; 
            console.log(data) 
        
            return data[0].word;
        } catch (error) {
            throw error; 
        }
      
    }
    
    getPhonetic() {
        let audioEndPoint =  `https://api.dictionaryapi.dev/media/pronunciations/en/${this._data[0].word}-uk.mp3`
        let phoneticWord = this._data[0].word; 

        if(this._data[0].phonetic === undefined) {
            // Loop Through Phonetic Data Array of Object
            this._data[0].phonetics.forEach((phonetic) => {
                if(phonetic.text !== "" && phonetic.audio === audioEndPoint) {
                    phoneticWord = phonetic.text; 
                }
            })
            return phoneticWord
        } else {
            return this._data[0].phonetic; 
        }
    }

    getAudioPart() {
        let audioEndPoint =  `https://api.dictionaryapi.dev/media/pronunciations/en/${this._data[0].word}-uk.mp3`
            // Loop Through Phonetic Data Array of Object
            this._data[0].phonetics.forEach((phonetic) => {
                if(phonetic.audio !== "") {
                    audioEndPoint = phonetic.audio; 
                }
            })
        return audioEndPoint; 
    }
    getMeaning() {
        let meaningList = [] 
        this._data[0].meanings.forEach((meaning) => {
            meaningList.push(meaning)
        })
        return meaningList; 
    }

    getSource() {
        return this._data[0].sourceUrls; 
    }
    

}
const app = new App();  
app.run(); 