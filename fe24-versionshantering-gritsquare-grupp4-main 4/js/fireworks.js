export function triggerFireworks() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement("div");
            firework.classList.add("firework");

           
            const colors = ["red", "blue", "yellow", "green", "purple", "orange"];
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            firework.style.left = x + "px";
            firework.style.top = y + "px";

            document.body.appendChild(firework);

            
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 50);
    }
}