const tabs = () => {
    const progressBar = document.querySelector('.progress-bar'),
          tabDots = progressBar.querySelectorAll('.progress-bar__dot'),
          tabLines = progressBar.querySelectorAll('.progress-bar__line'),
          blocksWrapper = document.querySelector('.features__content'),
          blocks = blocksWrapper.querySelectorAll('.block'),
          titles = blocksWrapper.querySelectorAll('.block__title'),
          progresses = progressBar.querySelectorAll('.progress-bar__progress');

    let durTime = 300,
        a = getFloatStyle(blocks[0].lastElementChild, 'height'),
        b = getFloatStyle(blocks[0].firstElementChild, 'margin-bottom'),
        offsets = [],
        numOfBlock, res;

    blocks.forEach((block, i) => {
        if (i == 0) {
            block.style.marginBottom = `${a+b}px`;
        }

        if(block.classList.contains('active')) {
            numOfBlock = i;
        }
    });

    progresses.forEach((item, i) => {
        item.style.transitionDuration = `${durTime}ms`;

        if (i == progresses.length - 1) {
            item.style.transitionDuration = `${2*durTime}ms`;
        }
    });

    setAtr(tabLines, 'data-progressLine');
    setAtr(blocks, 'data-block');

    controlDistance();

    computeDistance();
    
    blocksWrapper.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('title')) {
            let n = target.parentNode.getAttribute('data-block');

            res = n - numOfBlock;
            numOfBlock = n;

            let titleMb = getFloatStyle(target, 'margin-bottom');

            blocks.forEach((block, i) => {           
                if (i != n ) {
                    block.classList.remove('active');
                    block.style.marginBottom = ``;
                    block.lastElementChild.style.top = `-10%`;
                } else {
                    let heightBody = getFloatStyle(block.lastElementChild, 'height'),
                        heightTitle = getFloatStyle(target, 'height');

                    block.classList.add('active');
                    block.lastElementChild.style.top = `calc(${heightTitle}px + 0.4em)`;
                    block.style.marginBottom = `${heightBody + titleMb}px`;
                }
            });
            
            activeBar(res);          
        }
    });

    function getFloatStyle(el, prop) {
        return parseFloat(window.getComputedStyle(el, null).getPropertyValue(prop));
    }

    function setAtr(arr, atrName) {
        arr.forEach((item, i) => {
            item.setAttribute(atrName, i);
        });
    }

    function controlDistance() {
        tabLines.forEach((line, i) => {
            let dotHeight = +getFloatStyle(tabDots[0], 'height'),
                distance = offsets[i+1] - offsets[i] - dotHeight;

            line.style.height = `${distance}px`;
        });

        requestAnimationFrame(controlDistance);
    }

    function computeDistance() {
        titles.forEach((title, i) => {
            offsets[i] =  title.getBoundingClientRect().top;
        });

        requestAnimationFrame(computeDistance);
    }
    
    function activeBar(res) {  
        let delay = (3 - Math.abs(res))*durTime*2/(Math.abs(res)+1);

        blocks.forEach((block, i) => {
            if (block.classList.contains('active')) {
                tabDots.forEach((dot, j) => {
                    if (j <= i && j != 0) {
                        if (res == 1) {
                            if (j == 1) {
                                dot.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                            } else if (j == 2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                            }
                            dot.classList.add('active-dot');
                        } else if (res == 2) {
                            if (j == 1) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                dot.classList.add('active-dot');
                            } else if (j == 2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                setTimeout(() => dot.classList.add('active-dot'), 2*delay);
                            }
                        } 
                    } else {
                        if (res == -1) {
                            if (j == 2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                dot.classList.remove('active-dot');
                            } else if (j == 1) {
                                dot.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                                setTimeout(()=> {
                                    dot.classList.remove('active-dot'); 
                                }, delay/2);
                            }
                        } else if (res == -2) {
                            if (j == 2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                dot.classList.remove('active-dot');
                            } else if (j == 1) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                setTimeout(() => dot.classList.remove('active-dot'), 2*delay);
                            }
                        }                 
                    }
                });

                tabLines.forEach((line, j) => {
                    if (j <= i && j != 0) {
                        if (res == 2) {
                            line.firstElementChild.style.transitionDuration = `${delay}ms`;

                            setTimeout(() => line.classList.add('active'), delay);
                        } else if (res == 1){
                            line.firstElementChild.style.transitionDuration = `${delay/2}ms`;

                            setTimeout(() => line.classList.add('active'), delay/2);
                        }                                   
                    } else {
                        if (res == -2) {
                            line.firstElementChild.style.transitionDuration = `${delay}ms`;
                            setTimeout(() => line.classList.remove('active'), delay);
                        } else if (res == -1) {
                            line.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                            line.classList.remove('active');
                        }                                                
                    }
                });
            }
        });  
    }   
};

tabs();