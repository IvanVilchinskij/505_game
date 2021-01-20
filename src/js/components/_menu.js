const openMenu = (blockSelector, btnSelector, menuSelector, linkClass) => {
    const block = document.querySelector(blockSelector),
          btn = block.querySelector(btnSelector),
          menu = block.querySelector(menuSelector),
          body = document.body;

    btn.addEventListener('click', () => {
        toggleClass();
    });

    block.addEventListener('click', (e) => {
        let target = e.target;

        if (target.parentElement.classList.contains(linkClass)) {
            toggleClass();
        } else if (menu.classList.contains('active-menu') && target === block.firstElementChild) {
            toggleClass();
        }
    });

    function toggleClass() {
        btn.classList.toggle('active-menu');
        menu.classList.toggle('active-menu');
        body.classList.toggle('overflow-active');
    }
};

openMenu('.main', '.lang__burger', '.menu', 'nav__item--menu');