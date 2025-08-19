const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    volume = wrapper.querySelector(".word i"),
    infoText = wrapper.querySelector(".info-text"),
    synonyms = wrapper.querySelector(".synonyms .list"),
    removeIcon = wrapper.querySelector(".search span");

let audio;

function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try another word.`;
    } else {
        wrapper.classList.add("active");

        let meanings = result[0].meanings[0];
        let definitions = meanings.definitions[0];

        // Handle phonetics safely
        let phoneticsText = result[0].phonetics.find(p => p.text) ? result[0].phonetics.find(p => p.text).text : "";
        let phoneticsAudio = result[0].phonetics.find(p => p.audio) ? result[0].phonetics.find(p => p.audio).audio : "";

        let phontetics = `${meanings.partOfSpeech}  ${phoneticsText ? "/" + phoneticsText + "/" : ""}`;

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;

        document.querySelector(".meaning span").innerText = definitions.definition || "Not available";
        document.querySelector(".example span").innerText = definitions.example || "Not available";

        // Audio handling
        if (phoneticsAudio) {
            audio = new Audio(phoneticsAudio);
            volume.style.display = "inline-block";
        } else {
            volume.style.display = "none";
        }

        // Synonyms handling
        if (!definitions.synonyms || definitions.synonyms.length === 0) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";

            definitions.synonyms.slice(0, 5).forEach((syn, i) => {
                let tag = `<span onclick="search('${syn}')">${syn}${i < 4 ? "," : ""}</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag);
            });
        }
    }
}

function search(word) {
    fetchApi(word);
    searchInput.value = word;
}

function fetchApi(word) {
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>...`;

    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then(response => response.json())
        .then(result => data(result, word))
        .catch(() => {
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try another word.`;
        });
}

searchInput.addEventListener("keyup", e => {
    let word = e.target.value.trim();
    if (e.key === "Enter" && word) {
        fetchApi(word);
    }
});

volume.addEventListener("click", () => {
    if (audio) {
        volume.style.color = "#4D59FB";
        audio.play();
        setTimeout(() => {
            volume.style.color = "#999";
        }, 800);
    }
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
