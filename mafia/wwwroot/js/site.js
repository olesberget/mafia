document.addEventListener("DOMContentLoaded", function() {
    var isHovered = false;
    var hoverButton = document.getElementById("hoverButton");
    var nav = document.getElementById("nav");

    hoverButton.addEventListener("mouseover", function() {
        toggleNav(true);
    });

    hoverButton.addEventListener("mouseout", function() {
        toggleNav(false);
    });

    nav.addEventListener("mouseover", function() {
        toggleNav(true);
    });

    nav.addEventListener("mouseout", function() {
        toggleNav(false);
    });


    document.addEventListener("mouseout", function(event) {
        if (!nav.contains(event.relatedTarget) && !hoverButton.contains(event.relatedTarget)) {
            isHovered = false;
            nav.style.display = "none";
        }
    });

    function toggleNav(show) {
        if (show) {
            nav.style.display = "block";
            isHovered = true;
        } else {
            if (!isHovered) {
                nav.style.display = "none";
            }
        }
    }

});

document.addEventListener("DOMContentLoaded", function() {
    const characterContainers = Array.from(document.querySelectorAll('.character-container'));

    characterContainers.forEach((container, index) => {
        container.addEventListener('mouseenter', function() {
            characterContainers.forEach((otherContainer, otherIndex) => {
                let translateValue = 0;
                if (otherIndex < index) {
                    translateValue = -50; // Move left
                } else if (otherIndex > index) {
                    translateValue = 50; // Move right
                }
                otherContainer.style.transform = `translateX(${translateValue}px)`;
            });
        });
        container.addEventListener('mouseleave', function() {
            characterContainers.forEach(otherContainer => {
                otherContainer.style.transform = 'translateX(0)'; // Reset position
            });
        });
    });
});

/* ADD LARGER COMMENT HERE */