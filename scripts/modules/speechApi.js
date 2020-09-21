export default function speakFunction() {
  const utterance = new SpeechSynthesisUtterance;

  const setTextMessage = text => {
    utterance.text = text;
  };

  const speakText = () => {
    speechSynthesis.speak(utterance);
  };

  const stopText = () => {
    speechSynthesis.cancel();
  };

  const selectVoices = () => {
    const englishVoice1 = voices.find(voice => voice.name === 'Google US English');
    const englishVoice2 = voices.find(voice => voice.name === 'Microsoft Aria Online (Natural) - English (United States)');
    const englishVoice3 = voices.find(voice => voice.name === 'English United States');
    if (englishVoice1) {
      utterance.voice = englishVoice1;
      utterance.lang = englishVoice1.lang;
    } else if (englishVoice2) {
      utterance.voice = englishVoice2;
      utterance.lang = englishVoice2.lang;
    } else if (englishVoice3) {
      utterance.voice = englishVoice3;
      utterance.lang = englishVoice3.lang;
    }
  };

  let voices = speechSynthesis.getVoices();
  if (voices.length !== 0) {
    selectVoices();
  } else {
    speechSynthesis.addEventListener('voiceschanged', () => {
      voices = speechSynthesis.getVoices();
      selectVoices();
    });
  }

  const clearPokeId = /(?:\w{1,3}\.\s)/g;
  const cards = document.querySelectorAll(".card");

  const cardTitle = document.querySelectorAll('.card-title');

  const cardType = document.querySelectorAll('.card-type');

  const descriptionText = document.querySelectorAll('.card-descrip');

  cards.forEach((card, index) => {

    card.addEventListener('click', () => {
      setTextMessage(
        `
          ${cardTitle[index].innerText.replace(clearPokeId, '')}.
          type.
          ${cardType[index].innerText}.
          ${descriptionText[index].innerText}
          `
      );
      speakText();
    });
  });

  const stop = document.querySelector('.stop');
  stop.addEventListener('click', () => {
    stopText();
  });
};