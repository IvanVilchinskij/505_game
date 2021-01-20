const cardSlider = ({sliderSelector,
            sliderWrapper,
            slideSelector, 
            nextBtnSelector, 
            dotsWrapperSelector, 
            dotSelector, 
            lineSelector,
            animDuration,
            animDelay,
            slidePart,            
        }) => {

    const slider = document.querySelector(sliderSelector),
          wrapper = slider.querySelector(sliderWrapper),
          slides = slider.querySelectorAll(slideSelector),
          btnNext = slider.querySelector(nextBtnSelector),
          dotsWrapper = slider.querySelector(dotsWrapperSelector),
          dots = slider.querySelectorAll(dotSelector),
          lines = slider.querySelectorAll(lineSelector);

    let newSlides = Array.from(slides),
        slideTransDur = animDuration,
        slideTransDelay = animDelay,
        partOfSLide = slidePart,
        isTouchSupported = ('ontouchstart' in window) ? true : false,
        EVENTS = {
        POINTER_DOWN : isTouchSupported ? 'touchstart' : 'mousedown',
        POINTER_UP   : isTouchSupported ? 'touchend'   : 'mouseup',
        POINTER_MOVE : isTouchSupported ? 'touchmove'  : 'mousemove',
        POINTER_CLICK : isTouchSupported ? 'touchend' : 'click'
        },
        X1, X2, Y1, Y2, clickMouse;



    setAttrAndDur(slides, 'data-num', '', true);
    setAttrAndDur(dots, 'data-dotnum', 'last-dot');
    setAttrAndDur(lines, 'data-line', 'last-line');

    flipSlide(newSlides);

    addELforBtn(btnNext, dotsWrapper);
    
    addELforSwipe(wrapper);

    function setAttrAndDur(arr, attrName, lastObjSelector, slidesDur=false) {
        arr.forEach((item, i) => {
            item.setAttribute(attrName, i);

            if (slidesDur) {
                item.style.transitionDuration = `${slideTransDur}ms`;
                item.style.transitionDelay = `${slideTransDelay}ms`;
            } else {
                item.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/3}ms`;

                if (i == arr.length - 1) {
                    item.classList.add(lastObjSelector);
                    item.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/2}ms`;
                }
            }
        });
    }
    
    function flipSlide(arr) {
        arr.forEach((slide, i) => {
            if (i != slides.length-1) {
                slide.style.zIndex = slides.length - i;
            }

            switch(i) {
                case 0:
                    toggleClasses({
                        item: slide,
                        addClass: 'current-slide',
                        removeClass1: 'third-slide',
                        removeClass2: 'prev-slide',
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'second-slide'
                    });
                    break;
                case 1:
                    toggleClasses({
                        item: slide,
                        addClass: 'second-slide',
                        removeClass1: 'current-slide',
                        removeClass2: 'prev-slide',
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'third-slide'
                    });
                    break;
                case 2:
                    toggleClasses({
                        item: slide,
                        addClass: 'third-slide',
                        removeClass1: 'current-slide',
                        removeClass2: 'prev-slide',
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'second-slide'
                    });
                    break;
                case (arr.length - 2):
                    toggleClasses({
                        item: slide,
                        addClass: 'prevprev-slide',
                        removeClass1: 'third-slide',
                        removeClass2: 'current-slide' ,
                        removeClass3: 'prev-slide',
                        removeClass4: 'second-slide'
                    });
                    break;
                case (arr.length - 1):
                    toggleClasses({
                        item: slide,
                        addClass: 'prev-slide',
                        removeClass1: 'third-slide',
                        removeClass2: 'current-slide' ,
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'second-slide'
                    });
                    slide.style.zIndex = slides.length+1;
                    break;
            }
        });
    }

    function toggleClasses({item, addClass, removeClass1, removeClass2, removeClass3, removeClass4}) {
        item.classList.remove(removeClass1);
        item.classList.remove(removeClass2);
        item.classList.remove(removeClass3);
        item.classList.remove(removeClass4);
        item.classList.add(addClass);
    }
    
    function addELforBtn(btn, dots) {
        btn.addEventListener(EVENTS.POINTER_CLICK, toNext, false);
        dots.addEventListener(EVENTS.POINTER_CLICK, toggleDots, false);
        wrapper.addEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function removeELforBtn(btn, dots){
        btn.removeEventListener(EVENTS.POINTER_CLICK, toNext, false);
        dots.removeEventListener(EVENTS.POINTER_CLICK, toggleDots, false);
        wrapper.removeEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function addELforSwipe(item) {
        item.addEventListener(EVENTS.POINTER_DOWN, onMouseDown, false);
        item.addEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
        item.addEventListener(EVENTS.POINTER_UP, onMouseUp, false);
        
    }

    function removeELforSwipe(item) {
        item.removeEventListener(EVENTS.POINTER_DOWN, onMouseDown, false);
        item.removeEventListener(EVENTS.POINTER_UP, onMouseUp, false);
        item.removeEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function toNext() {
        removeELforBtn(btnNext, dotsWrapper);
        removeELforSwipe(wrapper);
        
        let curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num'),
            lastDotNum = +slider.querySelector('.last-dot').getAttribute('data-dotnum');

        setupDurAndDel(slideTransDur, slideTransDelay, ((slideTransDur+slideTransDelay)/3), ((slideTransDur+slideTransDelay)/2));        

        if (curSlideNum == lastDotNum) {
            fromPointToPoint();
        } else {
            toSlide();

            activeDot();
        }

        if (isTouchSupported) {
            setTimeout(() => {
                addELforBtn(btnNext, dotsWrapper);
                addELforSwipe(wrapper);
            }, (slideTransDur+slideTransDelay+200));
        } else {
            setTimeout(() => {
                addELforBtn(btnNext, dotsWrapper);
                addELforSwipe(wrapper);
            }, (slideTransDur+slideTransDelay+100));
        }
        
        X1 = 0;
        X2 = 0;

        Y1 = 0;
        Y2 = 0;
    }

    function setupDurAndDel(slideDur, slideDel, elDur, lastElDur) {
        slides.forEach((item) => {
            item.style.transitionDuration = `${slideDur}ms`;
            item.style.transitionDelay = `${slideDel}ms`;
        });
        dots.forEach((dot, i) => {
            dot.querySelector('.slider__progress').style.transitionDuration = `${elDur}ms`;
            if (i == dots.length - 1) {
                dot.querySelector('.slider__progress').style.transitionDuration = `${lastElDur}ms`;
            }
        });
        lines.forEach((line, i) => {
            line.querySelector('.slider__progress').style.transitionDuration = `${elDur}ms`;
            if (i == lines.length - 1) {
                line.querySelector('.slider__progress').style.transitionDuration = `${lastElDur}ms`;
            }
        });
    }

    function fromPointToPoint(fromStartToEnd = false) {
        let a = (fromStartToEnd) ? (slides.length - 1) : 1;

        toSlide(a);

        dots.forEach((dot, i) => {
            let prevEl = dot.previousElementSibling,
                nextEl = dot.nextElementSibling,
                sumOfDurs = slideTransDur+slideTransDelay,
                totalDur = sumOfDurs / ((dots.length - 1));

            let parts = (i == dots.length - 1) ? 2 : 3;

            dot.querySelector('.slider__progress').style.transitionDuration = `${totalDur / parts}ms`;

            if (prevEl) {
                prevEl.querySelector('.slider__progress').style.transitionDuration = `${totalDur / parts}ms`;
            }

            if (nextEl) {
                nextEl.querySelector('.slider__progress').style.transitionDuration = `${totalDur / parts}ms`;
            }
                
            if (fromStartToEnd) {
                let k = (i == dots.length - 1) ? 1 : (1 / 3);

                setTimeout(() => {
                    if (prevEl) {
                        toggleActiveClass(prevEl, 'active-line');
                    } 

                    setTimeout( () => toggleActiveClass(dot, 'active-dot'), totalDur * k);

                    if (parts == 3) {
                        setTimeout( () => {
                            if (nextEl) {
                                toggleActiveClass(nextEl, 'active-line');
                            }
                        }, 2 * totalDur / 3);
                    }                    

                }, (i - 1) * totalDur);
            } else {
                setTimeout(() => {
                    if (nextEl) {
                        toggleActiveClass(nextEl, 'active-line', false);
                    }

                    if (parts == 2) {
                        setTimeout( () => toggleActiveClass(dot, 'active-dot', false), totalDur / (parts + 1));

                        setTimeout(() => {
                            if (prevEl) {
                                toggleActiveClass(prevEl, 'active-line', false);
                            } 
                        }, 2 * totalDur / (parts + 1)); 
                    } else if (parts == 3) {
                        setTimeout( () => toggleActiveClass(dot, 'active-dot', false), totalDur / parts);

                        setTimeout(() => {
                            if (prevEl) {
                                toggleActiveClass(prevEl, 'active-line', false);
                            }                      
                        }, 2 * totalDur / parts); 
                    }
                }, (dots.length - 1 - i) * totalDur);
            }
        });
    }

    function toSlide(a = 1) {
        shiftArray(newSlides, a);

        flipSlide(newSlides);

        removeELforSwipe(wrapper);

        removeELforBtn(btnNext, dotsWrapper);
    }

    function shiftArray(arr, cnt){
        newSlides = arr.slice(cnt).concat(arr.slice(0,cnt));
        return newSlides;
    }

    function toggleActiveClass(el, activeClass, add = true) {
        if (add) {
            el.classList.add(activeClass);
        } else {
            el.classList.remove(activeClass);
        }
    }
    
    function toggleDots(e) {
        const target = e.target,
              dotClassName = dotSelector.replace(/\./g, '');

        if (target.classList.contains(dotClassName) || target.classList.contains('slider__progress')) {
            let dotnum = +target.getAttribute('data-dotnum') || +target.parentElement.getAttribute('data-dotnum'),
                num = +document.querySelector('.current-slide').getAttribute('data-num'),
                res = dotnum - num,
                speedDur = Math.fround(slideTransDur/Math.fround(Math.sqrt(Math.abs(res)))),
                speedDel = Math.fround(slideTransDelay/Math.fround(Math.sqrt(Math.abs(res)))),
                sumSpeeds = speedDur + speedDel,
                dotsSpeed = (sumSpeeds / 3),
                timerSlide, timerDot;    
                
            const slideByDot = (parm) => {
                toSlide(parm);
                activeDot(dotsSpeed);

                timerSlide = setInterval(toSlide, sumSpeeds, parm);
                timerDot = setInterval(activeDot, sumSpeeds, dotsSpeed);

                setTimeout(() => {
                    addELforBtn(btnNext, dotsWrapper);
                    addELforSwipe(wrapper);

                    clearInterval(timerSlide);
                }, (Math.abs(res) - 1) * (sumSpeeds + 30));

                setTimeout(() => clearInterval(timerDot), (Math.abs(res) - 1) * (sumSpeeds + 30));
            };

            setupDurAndDel(speedDur, speedDel, dotsSpeed, (dotsSpeed * 3 / 2)); 
             
            if (res > 0) { 
                slideByDot();
            } else if (res < 0) {
                slideByDot(slides.length - 1);
            }
            
        }
    }

    function activeDot(speed=((slideTransDur+slideTransDelay)/3)) {
        let slideNum = +slider.querySelector('.current-slide').getAttribute('data-num');

        dots.forEach((dot, i) => {
            if (i <= slideNum && i!=0) {
                if (i == (slides.length - 1)) {
                    toggleActiveClass(dot.previousElementSibling, 'active-line');

                    setTimeout(() => toggleActiveClass(dot, 'active-dot'), (speed * 3 / 2));
                } else {
                    if (dot.previousElementSibling) {
                        toggleActiveClass(dot.previousElementSibling, 'active-line');
                    }

                    setTimeout(() => toggleActiveClass(dot, 'active-dot'), speed);

                    setTimeout(()=> {
                        if (dot.nextElementSibling) {
                            toggleActiveClass(dot.nextElementSibling, 'active-line');
                        }
                    }, (speed * 2));
                }
            }  else if (i > slideNum) {
                if (i == (slides.length - 1)) {
                    toggleActiveClass(dot, 'active-dot', false);
                    
                    setTimeout(() => {
                        if (dot.previousElementSibling) {
                            toggleActiveClass(dot.previousElementSibling, 'active-line', false);
                        } 
                    }, (speed * 3 / 2));
                } else {
                    setTimeout(() => {
                        if (dot.previousElementSibling) {
                            toggleActiveClass(dot.previousElementSibling, 'active-line', false);
                        } 
                    }, (speed * 2));
                    
                    setTimeout(() => toggleActiveClass(dot, 'active-dot', false), speed);
                    
                    if (dot.nextElementSibling) {
                        toggleActiveClass(dot.nextElementSibling, 'active-line', false);
                    }
                }
                
            } 
        });      
    }

    function onMouseMove(e) {
        let xNow = e.pageX - wrapper.getBoundingClientRect().left,
            yNow = e.pageY  - document.documentElement.scrollTop - wrapper.getBoundingClientRect().top,
            curSlide = slider.querySelector('.current-slide'),
            prevSlide = slider.querySelector('.prev-slide');
        
        
        let slideWidth = getFloatStyle(curSlide, 'width'),
            slideHeight = wrapper.offsetHeight,
            slideBorderHeightEnd = slideHeight/10,
            slideBorderEnd = slideWidth / 8.3;
        
        if (clickMouse && (X1 - xNow) > 0) {
            curSlide.style.transitionDuration = ``;
            curSlide.style.transitionDelay = '';
            curSlide.style.left = `${-(X1 - xNow)}px`;
            prevSlide.style.left = ``;
        } else if (clickMouse && (X1 - xNow) < 0) {
            prevSlide.style.transitionDuration = ``;
            prevSlide.style.transitionDelay = '';
            prevSlide.style.left = `calc(-85% + ${-(X1 - xNow)}px)`;
            prevSlide.style.opacity = '1';
            curSlide.style.left = ``;
        }

        if (clickMouse && ((xNow < slideBorderEnd && X1 > slideBorderEnd) || 
            (xNow > (slideWidth - slideBorderEnd) && X1 < slideWidth) || 
            (yNow < slideBorderHeightEnd && Y1 > 0) ||
            (yNow > (slideHeight - slideBorderHeightEnd) && Y1 < slideHeight))
            ) {
            onMouseUp(e);
        }
    }

    function getFloatStyle(el, prop) {
        return parseFloat(window.getComputedStyle(el, null).getPropertyValue(prop));
    }
    

    function onMouseUp(e) {
        let cordUp = getMouse(e);

        let curSlide = slider.querySelector('.current-slide'),
            prevSlide = slider.querySelector('.prev-slide');

        clickMouse = false;

        let slideWidth = getFloatStyle(curSlide, 'width');

        X2 = cordUp.x;
        Y2 = cordUp.y;

        if (X1 && X2) {
            if ((X1 - X2) > 0 && Math.abs(X1-X2)/slideWidth > 1/partOfSLide) {
                toNext();
            } else if ((X1 - X2) < 0 && Math.abs(X1-X2)/slideWidth > 1/partOfSLide) {
                toPrev();
            } else if (Math.abs(X1-X2)/slideWidth < 1/partOfSLide) {
                setupDurAndDel(slideTransDur, slideTransDelay, ((slideTransDur+slideTransDelay)/3), ((slideTransDur+slideTransDelay)/2));
            }   
        }

        curSlide.style.left = ``;
        prevSlide.style.left = ``;
        prevSlide.style.opacity = '';
    }
  
    function getMouse(e) {
        let mx, my;
        if (isTouchSupported) {
            let touches = e.changedTouches;
            if (touches == undefined || touches.length > 1) {
                return false;
            }

            mx = (touches[0].pageX || touches[0].clientX) - wrapper.getBoundingClientRect().left;
            my = (touches[0].pageY || touches[0].clientY) - wrapper.getBoundingClientRect().top;
        } else {
            mx = (e.cleintX || e.pageX) - wrapper.getBoundingClientRect().left;
            my = (e.clientY || e.pageY) - wrapper.getBoundingClientRect().top;
        }
        return {
            x: mx,
            y: my
        };
    }

    function toPrev() {
        removeELforSwipe(wrapper);
        removeELforBtn(btnNext, dotsWrapper);

        let curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num');

        setupDurAndDel(slideTransDur, slideTransDelay, ((slideTransDur+slideTransDelay)/3), ((slideTransDur+slideTransDelay)/2)); 

        if (curSlideNum == 0) {
            fromPointToPoint(true);
        } else {
            toSlide((slides.length - 1));
            activeDot();
        }
        setTimeout(() => {
            addELforBtn(btnNext, dotsWrapper);
            addELforSwipe(wrapper);
        }, (slideTransDur+slideTransDelay+100));

        X1 = 0;
        X2 = 0;
        
        Y1 = 0;
        Y2 = 0;
    }

    function onMouseDown(e) {
        let down = getMouse(e);

        e.preventDefault(); 

        X1 = down.x;
        Y1 = down.y;
        clickMouse = true;

        return X1, Y1;
    }
}; 

cardSlider({
    sliderSelector: '.slider',
    sliderWrapper: '.slider__wrapper',
    slideSelector: '.slider__slide',
    nextBtnSelector: '.slider__next',
    dotsWrapperSelector: '.slider__dots',
    dotSelector: '.slider__dot',
    lineSelector: '.slider__line',
    animDuration: 500,
    animDelay: 0,
    slidePart: 6
});