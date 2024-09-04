document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    const cursorElement = document.querySelector('.cursor');
    const welcomeMsgs = [
        "UHS STEM-Ed presents...",
        "A Math Challenge!",
        "Answer correctly, earn a prize!",
        "Ready?"
    ];
    let messageIndex = 0;

    function typewriterEffect() {
        function typeMessage(message) {
            let i = 0;
            typewriterElement.textContent = '';

            function type() {
                if (i < message.length) {
                    typewriterElement.textContent += message.charAt(i);
                    i++;
                    setTimeout(type, 75); // Typing speed
                } else {
                    setTimeout(eraseMessage, 900); // Wait before erasing
                }
            }

            function eraseMessage() {
                if (typewriterElement.textContent.length > 0) {
                    typewriterElement.textContent = typewriterElement.textContent.slice(0, -1);
                    setTimeout(eraseMessage, 20); // Erasing speed 
                } else {
                    messageIndex = (messageIndex + 1) % welcomeMsgs.length;
                    setTimeout(() => typeMessage(welcomeMsgs[messageIndex]), 800); // Pause before the next message
                }
            }
            type();
        }
        typeMessage(welcomeMsgs[messageIndex]);
    }
    // Initialize the typewriter effect
    typewriterEffect();
});