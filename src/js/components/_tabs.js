const tabs = () => {
    const progressBar = document.querySelector('.progress-bar'),
          tabDots = progressBar.querySelectorAll('.progress-bar__dot'),
          tabLines = progressBar.querySelectorAll('.progress-bar__line'),
          blocksWrapper = document.querySelector('.features__content'),
          blocks = blocksWrapper.querySelectorAll('.block'),
          titles = blocksWrapper.querySelectorAll('.block__title'),
          progresses = progressBar.querySelectorAll('.progress-bar__progress');

    let offsets = [],
        numOfBlock, res,
        durTime = 300;

    blocks.forEach((block, i) => {
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

    function getFloatStyle(el, prop) {
        return parseFloat(window.getComputedStyle(el, null).getPropertyValue(prop));
    }

    let a = getFloatStyle(blocks[0].lastElementChild, 'height'),
        b = getFloatStyle(blocks[0].firstElementChild, 'margin-bottom');
    blocks[0].style.marginBottom = `${a+b}px`;


    function setAtr(arr, atrName) {
        arr.forEach((item, i) => {
            item.setAttribute(atrName, i);
        });
    }

    setAtr(tabDots, 'data-progressDot');
    setAtr(tabLines, 'data-progressLine');
    setAtr(titles, 'data-title');
    setAtr(blocks, 'data-block');

    function control() {
        tabLines.forEach((line, i) => {
            let distance = offsets[i+1] - offsets[i] - 14;
            line.style.height = `${distance}px`;
        });

        requestAnimationFrame(control);
    }
    control();

    function activeBar(res) {  
        let delay = (3 - Math.abs(res))*durTime*2/(Math.abs(res)+1);

        console.log(delay);
        blocks.forEach((block, i) => {
            if (block.classList.contains('active')) {
                tabDots.forEach((dot, j) => {
                    if (j <= i && j !=0) {
                        if (res == 1) {
                            if (j==1) {
                                dot.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                                console.log(dot.firstElementChild);
                            } else if (j == 2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                console.log(dot.firstElementChild);
                            }
                            dot.classList.add('active-dot');
                        } else if (res == 2) {
                            if (j==1) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                dot.classList.add('active-dot');
                            } else if (j ==2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                setTimeout(()=> {
                                    dot.classList.add('active-dot'); 
                                }, 2*delay);
                            }
                        } 
                    } else {
                        if (res == -1) {
                            if (j==2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                dot.classList.remove('active-dot');
                            } else if (j==1) {
                                dot.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                                setTimeout(()=> {
                                    dot.classList.remove('active-dot'); 
                                }, delay/2);
                            }
                        } else if (res == -2) {
                            if (j==2) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                dot.classList.remove('active-dot');
                            } else if (j==1) {
                                dot.firstElementChild.style.transitionDuration = `${delay}ms`;
                                setTimeout(()=> {
                                    dot.classList.remove('active-dot'); 
                                }, 2*delay);
                            }
                        }                 
                    }
                });

                tabLines.forEach((line, j) => {
                    if (j <= i && j!=0) {
                        if (res == 2) {
                            line.firstElementChild.style.transitionDuration = `${delay}ms`;
                            setTimeout(() => {
                                line.classList.add('active');
                            }, delay);
                        } else if (res == 1){
                            line.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                            setTimeout(() => {
                                line.classList.add('active');
                            }, delay/2);
                        }        
                                              
                    } else {
                        if (res == -2) {
                            line.firstElementChild.style.transitionDuration = `${delay}ms`;
                            setTimeout(()=>{
                                line.classList.remove('active');
                            }, delay);
                        } else if (res == -1) {
                            line.firstElementChild.style.transitionDuration = `${delay/2}ms`;
                            line.classList.remove('active');
                        }                    
                                              
                    }
                });
            }
        });

        
    }

    function computeDistance() {
        titles.forEach((title, i) => {
            offsets[i] =  title.getBoundingClientRect().top;
        });
        requestAnimationFrame(computeDistance);
    }


    computeDistance();
    /* activeBar(); */
    

    blocksWrapper.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('title')) {
            let n = target.parentNode.getAttribute('data-block');
            res = n-numOfBlock;
            numOfBlock = n;
            let titleMb = getFloatStyle(target, 'margin-bottom');
            blocks.forEach((block, i) => {           
                if (i != n ) {
                    block.classList.remove('active');
                    block.style.marginBottom = ``;
                } else {
                    let heightBody = getFloatStyle(block.lastElementChild, 'height');
                    block.classList.add('active');
                    block.style.marginBottom = `${heightBody + titleMb}px`;

                }
                
                
            });
            console.log(res);
            
            activeBar(res);
            
        }
    });
};

tabs();