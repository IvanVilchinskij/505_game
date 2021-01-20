const linkScrol = () => {
    let linksNav = document.querySelectorAll('[href^="#"]');

    linksNav.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let hash = this.href.replace(/[^#]*(.*)/, '$1');

            smoothScroll(hash, 1000);
        });
    });

    function smoothScroll(tr, duration) {
        let target = document.querySelector(tr),
            tragetPosition = target.getBoundingClientRect().top,
            stratPosition = window.pageYOffset,
            differPositions = tragetPosition - stratPosition,
            windowHeight = document.documentElement.clientHeight,
            distance = (differPositions > windowHeight) ? differPositions : tragetPosition,
            startTime = null;

        requestAnimationFrame(animation);
            
        function animation(currentTime) {
            if (startTime === null) {
                startTime = currentTime;
            }

            let timeElapsed = currentTime - startTime,
                run = ease(timeElapsed, stratPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        function ease(timeElapsed, stratPosition, distance, duration) { 
  
            timeElapsed /= duration / 2;

            if (timeElapsed < 1) {
                return (distance / 2) * timeElapsed * timeElapsed + stratPosition;
            }
            timeElapsed--;

            return -(distance / 2) * (timeElapsed * (timeElapsed - 2) - 1) + stratPosition;
        }
    }
};

linkScrol();


