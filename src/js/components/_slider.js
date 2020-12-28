const cardSlider = () => {
    const slider = document.querySelector('.slider'),
          wrapper = slider.querySelector('.slider__wrapper'),
          slides = slider.querySelectorAll('.slider__slide'),
          btnNext = slider.querySelector('.slider__next'),
          dotsWrapper = slider.querySelector('.slider__dots'),
          dots = slider.querySelectorAll('.slider__dot'),
          lines = slider.querySelectorAll('.slider__line');

    let newSlides = Array.from(slides),
        slideTransDur = 500,
        slideTransDelay = 0,
        isTouchSupported = ('ontouchstart' in window) ? true : false,
        EVENTS = {
        POINTER_DOWN : isTouchSupported ? 'touchstart' : 'mousedown',
        POINTER_UP   : isTouchSupported ? 'touchend'   : 'mouseup',
        POINTER_MOVE : isTouchSupported ? 'touchmove'  : 'mousemove',
        POINTER_CLICK : isTouchSupported ? 'touchend' : 'click'
        },
        X1, X2, clickMouse;

    function shiftArray(arr, cnt){
        newSlides = arr.slice(cnt).concat(arr.slice(0,cnt));
        return newSlides;
    }

    function workWithClass({item, addClass, removeClass1, removeClass2, removeClass3, removeClass4}) {
        item.classList.remove(removeClass1);
        item.classList.remove(removeClass2);
        item.classList.remove(removeClass3);
        item.classList.remove(removeClass4);
        item.classList.add(addClass);
    } 

    function toSwipe(arr) {
        arr.forEach((slide, i) => {
            if (i != slides.length-1) {
                slide.style.zIndex = slides.length - i;
            }
            switch(i) {
                case 0:
                    workWithClass({
                        item: slide,
                        addClass: 'current-slide',
                        removeClass1: 'third-slide',
                        removeClass2: 'prev-slide',
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'second-slide'
                    });
                    break;
                case 1:
                    workWithClass({
                        item: slide,
                        addClass: 'second-slide',
                        removeClass1: 'current-slide',
                        removeClass2: 'prev-slide',
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'third-slide'
                    });
                    break;
                case 2:
                    workWithClass({
                        item: slide,
                        addClass: 'third-slide',
                        removeClass1: 'current-slide',
                        removeClass2: 'prev-slide',
                        removeClass3: 'prevprev-slide',
                        removeClass4: 'second-slide'
                    });
                    break;
                case (arr.length - 2):
                    workWithClass({
                        item: slide,
                        addClass: 'prevprev-slide',
                        removeClass1: 'third-slide',
                        removeClass2: 'current-slide' ,
                        removeClass3: 'prev-slide',
                        removeClass4: 'second-slide'
                    });
                    break;
                case (arr.length - 1):
                    workWithClass({
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

    function onMouseDown(e) {
        e.preventDefault();
        let down = getMouse(e);
        X1 = down.x;
        clickMouse = true;
        return X1;
    }

    function onMouseUp(e) {
        let xUp = getMouse(e);
        let curSlide = slider.querySelector('.current-slide'),
        prevSlide = slider.querySelector('.prev-slide');
        clickMouse = false;
        X2 = xUp.x;
        if (X1 && X2) {
            if ((X1 - X2) > 0 && Math.abs(X1-X2)/502 > 1/6) {
                toNext();
            } else if ((X1 - X2) < 0 && Math.abs(X1-X2)/502 > 1/6) {
                toPrev();
            } else if (Math.abs(X1-X2)/502 < 1/6) {
                setUpDefDurAndDel(slideTransDur, slideTransDelay, ((slideTransDur+slideTransDelay)/3), ((slideTransDur+slideTransDelay)/2));
            }   
        }

        curSlide.style.left = ``;
        prevSlide.style.left = ``;
        prevSlide.style.opacity = '';
    }

    function onMouseMove(e) {
        let xNow = e.pageX - wrapper.getBoundingClientRect().left,
            curSlide = slider.querySelector('.current-slide'),
            prevSlide = slider.querySelector('.prev-slide');

        if (clickMouse && (X1 - xNow) > 0) {
            curSlide.style.transitionDuration = ``;
            curSlide.style.transitionDelay = '';
            curSlide.style.left = `${-(X1 - xNow)}px`;
            prevSlide.style.left = ``;
        } else if (clickMouse && (X1 - xNow) < 0) {
            prevSlide.style.transitionDuration = ``;
            prevSlide.style.transitionDelay = '';
            prevSlide.style.left = `calc(-100% + 118px + ${-(X1 - xNow)}px)`;
            prevSlide.style.opacity = '1';
            curSlide.style.left = ``;
        }

        if (clickMouse && ((xNow < 60 && X1 > 60) || (xNow > 502 && X1 < 502))) {
            onMouseUp(e);
        }
        
    }

    function toAddELSwipe(item) {
        item.addEventListener(EVENTS.POINTER_DOWN, onMouseDown, false);
        item.addEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
        item.addEventListener(EVENTS.POINTER_UP, onMouseUp, false);
        
    }

    function toRemoveELSwipe(item) {
        item.removeEventListener(EVENTS.POINTER_DOWN, onMouseDown, false);
        item.removeEventListener(EVENTS.POINTER_UP, onMouseUp, false);
        item.removeEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function toAddELBtn(btn, dots) {
        btn.addEventListener(EVENTS.POINTER_CLICK, toNext, false);
        dots.addEventListener(EVENTS.POINTER_CLICK, toggleDots, false);
        wrapper.addEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function toRemoveELBtn(btn, dots){
        btn.removeEventListener(EVENTS.POINTER_CLICK, toNext, false);
        dots.removeEventListener(EVENTS.POINTER_CLICK, toggleDots, false);
        wrapper.removeEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function toSlide(a=1) {
        shiftArray(newSlides, a);
        toSwipe(newSlides);
        toRemoveELSwipe(wrapper);
        toRemoveELBtn(btnNext, dotsWrapper);
    }

    function activeDot(speed=((slideTransDur+slideTransDelay)/3)) {
        let slideNum = +slider.querySelector('.current-slide').getAttribute('data-num');

        dots.forEach((dot, i) => {
            if (i <= slideNum && i!=0) {
                if (i == (slides.length - 1)) {
                    dot.previousElementSibling.classList.add('active-line');
                    setTimeout(() => {
                        dot.classList.add('active-dot');
                    }, (speed*3/2));
                } else {
                    if (dot.previousElementSibling) {
                        dot.previousElementSibling.classList.add('active-line');
                    }
                    setTimeout(()=> {
                        dot.classList.add('active-dot');
                    }, speed);
                    setTimeout(()=> {
                        if (dot.nextElementSibling) {
                            dot.nextElementSibling.classList.add('active-line');
                        }
                    }, (speed * 2));
                }
            }  else if (i > slideNum) {
                if (i == (slides.length - 1)) {
                    dot.classList.remove('active-dot');
                    setTimeout(() => {
                        if (dot.previousElementSibling) {
                            dot.previousElementSibling.classList.remove('active-line');
                        } 
                    }, (speed * 3/2));
                } else {
                    setTimeout(() => {
                        if (dot.previousElementSibling) {
                            dot.previousElementSibling.classList.remove('active-line');
                        } 
                    }, (speed * 2));
                    
                    setTimeout(()=> {
                        dot.classList.remove('active-dot');
                    }, speed);
                    
                    if (dot.nextElementSibling) {
                        dot.nextElementSibling.classList.remove('active-line');
                    }
                }
                
            } 
        });      
    }

    function fromPointToPoint(fromStartToEnd=false) {
        let a = (fromStartToEnd) ? (slides.length - 1) : 1;

        toSlide(a);

        dots.forEach((dot, i) => {
            if (i == dots.length -1) {
                dot.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/(2*(dots.length - 1))}ms`;
                if (dot.previousElementSibling) {
                    dot.previousElementSibling.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/(2*(dots.length - 1))}ms`;
                }
                if (dot.nextElementSibling) {
                    dot.nextElementSibling.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/(2*(dots.length - 1) )}ms`;
                }
                
                if (fromStartToEnd) {
                    setTimeout(() => {
                        if (dot.previousElementSibling) {
                            dot.previousElementSibling.classList.add('active-line');
                        } 
                        setTimeout(() => {
                            dot.classList.add('active-dot');
                        }, (slideTransDur+slideTransDelay)/(2*(dots.length - 1)));
                    }, (i-1)*(slideTransDur+slideTransDelay)/(dots.length - 1));
                } else {
                    setTimeout(() => {
                        if (dot.nextElementSibling) {
                            dot.nextElementSibling.classList.remove('active-line');
                        }
                        
                        setTimeout(() => {
                            dot.classList.remove('active-dot');
                        }, ((slideTransDur+slideTransDelay)/((3*(dots.length - 1)))));
                        setTimeout(() => {
                            if (dot.previousElementSibling) {
                                dot.previousElementSibling.classList.remove('active-line');
                            } 
                        }, ((slideTransDur+slideTransDelay)/((3*(dots.length - 1)))*2));
                        
                    }, (dots.length - 1 - i)*(slideTransDur+slideTransDelay)/(dots.length - 1));
                }

            } else {
                dot.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/(3*(dots.length - 1) )}ms`;
                if (dot.previousElementSibling) {
                    dot.previousElementSibling.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/(3*(dots.length - 1))}ms`;
                }
                if (dot.nextElementSibling) {
                    dot.nextElementSibling.querySelector('.slider__progress').style.transitionDuration = `${(slideTransDur+slideTransDelay)/(3*(dots.length - 1))}ms`;
                }

                if (fromStartToEnd) {
                    setTimeout(() => {
                        if (dot.previousElementSibling) {
                            dot.previousElementSibling.classList.add('active-line');
                        } 
                        
                        setTimeout(() => {
                            dot.classList.add('active-dot');
                        }, ((slideTransDur+slideTransDelay)/((3*(dots.length - 1)))));
                        setTimeout(() => {
                            if (dot.nextElementSibling) {
                                dot.nextElementSibling.classList.add('active-line');
                            }
                        }, ((slideTransDur+slideTransDelay)/((3*(dots.length - 1)))*2));
                        
                    }, (i - 1)*(slideTransDur+slideTransDelay)/(dots.length-1));
                } else {
                    setTimeout(() => {
                        if (dot.nextElementSibling) {
                            dot.nextElementSibling.classList.remove('active-line');
                        }
                        
                        setTimeout(() => {
                            dot.classList.remove('active-dot');
                        }, ((slideTransDur+slideTransDelay)/((3*(dots.length - 1)))));
                        setTimeout(() => {
                            if (dot.previousElementSibling) {
                                dot.previousElementSibling.classList.remove('active-line');
                            } 
                        }, ((slideTransDur+slideTransDelay)/((3*(dots.length - 1)))*2));
                        
                    }, (dots.length - 1 - i)*(slideTransDur+slideTransDelay)/(dots.length - 1));
                }
            }
        });
    }

    function setUpDefDurAndDel(slideDur, slideDel, elDur, lastElDur) {
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

    function toNext() {
        toRemoveELSwipe(wrapper);
        toRemoveELBtn(btnNext, dotsWrapper);
        let curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num'),
            lastDotNum =+slider.querySelector('.last-dot').getAttribute('data-dotnum');

        setUpDefDurAndDel(slideTransDur, slideTransDelay, ((slideTransDur+slideTransDelay)/3), ((slideTransDur+slideTransDelay)/2));        

        if (curSlideNum == lastDotNum) {
            fromPointToPoint();

        } else {
            toSlide();
            activeDot();
        }

        if (isTouchSupported) {
            setTimeout(() => {
                toAddELBtn(btnNext, dotsWrapper);
                toAddELSwipe(wrapper);
            }, (slideTransDur+slideTransDelay+200));
        } else {
            setTimeout(() => {
                toAddELBtn(btnNext, dotsWrapper);
                toAddELSwipe(wrapper);
            }, (slideTransDur+slideTransDelay+100));
        }
        
        X1 = 0;
        X2 = 0;
    }

    function toPrev() {
        toRemoveELSwipe(wrapper);
        toRemoveELBtn(btnNext, dotsWrapper);
        let curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num');

        setUpDefDurAndDel(slideTransDur, slideTransDelay, ((slideTransDur+slideTransDelay)/3), ((slideTransDur+slideTransDelay)/2)); 

        if (curSlideNum == 0) {
            fromPointToPoint(true);
        } else {
            toSlide((slides.length - 1));
            activeDot();
        }
        setTimeout(() => {
            toAddELBtn(btnNext, dotsWrapper);
            toAddELSwipe(wrapper);
        }, (slideTransDur+slideTransDelay+100));

        X1 = 0;
        X2 = 0;
    }

    function toggleDots(e) {
        const target = e.target;

        if (target.classList.contains('slider__dot') || target.classList.contains('slider__progress')) {
            let dotnum = +target.getAttribute('data-dotnum') || +target.parentElement.getAttribute('data-dotnum'),
                num = +document.querySelector('.current-slide').getAttribute('data-num'),
                res = dotnum - num,
                speed = Math.fround(slideTransDur/Math.fround(Math.sqrt(Math.abs(res)))),
                speedDel = Math.fround((slideTransDelay)/Math.fround(Math.sqrt(Math.abs(res)))),
                dotsSpeed = ((speed + speedDel) / 3),
                timerSlide, timerDot;       

            setUpDefDurAndDel(speed, speedDel, dotsSpeed, (dotsSpeed * 3 / 2)); 
             
            if (res > 0) { 
                toSlide();
                activeDot(dotsSpeed);
                timerSlide = setInterval(toSlide, (speed + speedDel));
                timerDot = setInterval(activeDot, (speed + speedDel), (dotsSpeed));
                setTimeout(() => {
                    toAddELBtn(btnNext, dotsWrapper);
                    toAddELSwipe(wrapper);
                    clearInterval(timerSlide);
                }, (Math.abs(res) - 1) * (speed + speedDel + 30));
                setTimeout(() => {
                    clearInterval(timerDot);
                }, (Math.abs(res) - 1) * ((speed + speedDel + 30)));
            } else if (res < 0) {
                toSlide((slides.length - 1));
                activeDot(dotsSpeed);
                timerSlide = setInterval(toSlide, (speed + speedDel), (slides.length - 1));
                setTimeout(() => {
                    toAddELBtn(btnNext, dotsWrapper);
                    toAddELSwipe(wrapper);
                    clearInterval(timerSlide);
                }, (Math.abs(res) - 1) * (speed + speedDel+30));
                timerDot = setInterval(activeDot, (speed + speedDel), (dotsSpeed));
                setTimeout(() => {
                    clearInterval(timerDot);
                }, (Math.abs(res) - 1) * (speed + speedDel + 30));
            }
            
        }
    }

    function setDataAndDur(arr, dataSelector, lastObjSelector, slides=false) {
        arr.forEach((item, i) => {
            item.setAttribute(dataSelector, i);
            if (slides) {
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

    setDataAndDur(slides, 'data-num', '', true);
    setDataAndDur(dots, 'data-dotnum', 'last-dot');
    setDataAndDur(lines, 'data-line', 'last-line');

    toSwipe(newSlides);

    toAddELBtn(btnNext, dotsWrapper);
   
    toAddELSwipe(wrapper);

}; 

cardSlider();