const openChooseLang = (blockSelector, btnSelector) => {
    const block = document.querySelector(blockSelector),
          btn = block.querySelector(btnSelector);

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
};

openChooseLang('.main', '.lang__setlang');