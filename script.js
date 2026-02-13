const storyText = `Es war einmal in den Tiefen der Hackerwerkstatt-Server... 

Ein kleiner Programmfehler, der eigentlich gelöscht werden sollte, weigerte sich zu gehen. Er nannte sich "Pixl". 

Während andere Bugs nur Chaos anrichteten, wollte Pixl etwas anderes: Ordnung im Datenstrom. Er begann, verlorene Code-Fragmente zu sammeln und das System von innen heraus zu stabilisieren.

Man sagt, wenn nachts die Monitore in der Werkstatt flackern, ist es Pixl, der gerade ein kritisches Update einspielt...`;

function typeWriter(text, elementId, delay = 50) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }
    
    type();
}

document.addEventListener('DOMContentLoaded', () => {
    typeWriter(storyText, 'story-content', 40);
});
