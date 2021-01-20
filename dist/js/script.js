"use strict";

window.addEventListener('DOMContentLoaded', function () {
  /* Webp */
  var webPTest = function webPTest() {
    testWebP(function (support) {
      if (support == true) {
        document.querySelector('body').classList.add('webp');
      } else {
        document.querySelector('body').classList.add('no-webp');
      }
    });

    function testWebP(callback) {
      var webP = new Image();

      webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
      };

      webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
  };

  webPTest();

  var openChooseLang = function openChooseLang(blockSelector, btnSelector) {
    var block = document.querySelector(blockSelector),
        btn = block.querySelector(btnSelector);
    btn.addEventListener('click', function () {
      btn.classList.toggle('active');
    });
  };

  openChooseLang('.main', '.lang__setlang');

  var linkScrol = function linkScrol() {
    var linksNav = document.querySelectorAll('[href^="#"]');
    linksNav.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var hash = this.href.replace(/[^#]*(.*)/, '$1');
        smoothScroll(hash, 1000);
      });
    });

    function smoothScroll(tr, duration) {
      var target = document.querySelector(tr),
          tragetPosition = target.getBoundingClientRect().top,
          stratPosition = window.pageYOffset,
          differPositions = tragetPosition - stratPosition,
          windowHeight = document.documentElement.clientHeight,
          distance = differPositions > windowHeight ? differPositions : tragetPosition,
          startTime = null;
      requestAnimationFrame(animation);

      function animation(currentTime) {
        if (startTime === null) {
          startTime = currentTime;
        }

        var timeElapsed = currentTime - startTime,
            run = ease(timeElapsed, stratPosition, distance, duration);
        window.scrollTo(0, run);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      function ease(timeElapsed, stratPosition, distance, duration) {
        timeElapsed /= duration / 2;

        if (timeElapsed < 1) {
          return distance / 2 * timeElapsed * timeElapsed + stratPosition;
        }

        timeElapsed--;
        return -(distance / 2) * (timeElapsed * (timeElapsed - 2) - 1) + stratPosition;
      }
    }
  };

  linkScrol();

  var cardSlider = function cardSlider(_ref) {
    var sliderSelector = _ref.sliderSelector,
        sliderWrapper = _ref.sliderWrapper,
        slideSelector = _ref.slideSelector,
        nextBtnSelector = _ref.nextBtnSelector,
        dotsWrapperSelector = _ref.dotsWrapperSelector,
        dotSelector = _ref.dotSelector,
        lineSelector = _ref.lineSelector,
        animDuration = _ref.animDuration,
        animDelay = _ref.animDelay,
        slidePart = _ref.slidePart;
    var slider = document.querySelector(sliderSelector),
        wrapper = slider.querySelector(sliderWrapper),
        slides = slider.querySelectorAll(slideSelector),
        btnNext = slider.querySelector(nextBtnSelector),
        dotsWrapper = slider.querySelector(dotsWrapperSelector),
        dots = slider.querySelectorAll(dotSelector),
        lines = slider.querySelectorAll(lineSelector);
    var newSlides = Array.from(slides),
        slideTransDur = animDuration,
        slideTransDelay = animDelay,
        partOfSLide = slidePart,
        isTouchSupported = 'ontouchstart' in window ? true : false,
        EVENTS = {
      POINTER_DOWN: isTouchSupported ? 'touchstart' : 'mousedown',
      POINTER_UP: isTouchSupported ? 'touchend' : 'mouseup',
      POINTER_MOVE: isTouchSupported ? 'touchmove' : 'mousemove',
      POINTER_CLICK: isTouchSupported ? 'touchend' : 'click'
    },
        X1,
        X2,
        Y1,
        Y2,
        clickMouse;
    setAttrAndDur(slides, 'data-num', '', true);
    setAttrAndDur(dots, 'data-dotnum', 'last-dot');
    setAttrAndDur(lines, 'data-line', 'last-line');
    flipSlide(newSlides);
    addELforBtn(btnNext, dotsWrapper);
    addELforSwipe(wrapper);

    function setAttrAndDur(arr, attrName, lastObjSelector) {
      var slidesDur = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      arr.forEach(function (item, i) {
        item.setAttribute(attrName, i);

        if (slidesDur) {
          item.style.transitionDuration = "".concat(slideTransDur, "ms");
          item.style.transitionDelay = "".concat(slideTransDelay, "ms");
        } else {
          item.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / 3, "ms");

          if (i == arr.length - 1) {
            item.classList.add(lastObjSelector);
            item.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / 2, "ms");
          }
        }
      });
    }

    function flipSlide(arr) {
      arr.forEach(function (slide, i) {
        if (i != slides.length - 1) {
          slide.style.zIndex = slides.length - i;
        }

        switch (i) {
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

          case arr.length - 2:
            toggleClasses({
              item: slide,
              addClass: 'prevprev-slide',
              removeClass1: 'third-slide',
              removeClass2: 'current-slide',
              removeClass3: 'prev-slide',
              removeClass4: 'second-slide'
            });
            break;

          case arr.length - 1:
            toggleClasses({
              item: slide,
              addClass: 'prev-slide',
              removeClass1: 'third-slide',
              removeClass2: 'current-slide',
              removeClass3: 'prevprev-slide',
              removeClass4: 'second-slide'
            });
            slide.style.zIndex = slides.length + 1;
            break;
        }
      });
    }

    function toggleClasses(_ref2) {
      var item = _ref2.item,
          addClass = _ref2.addClass,
          removeClass1 = _ref2.removeClass1,
          removeClass2 = _ref2.removeClass2,
          removeClass3 = _ref2.removeClass3,
          removeClass4 = _ref2.removeClass4;
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

    function removeELforBtn(btn, dots) {
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
      var curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num'),
          lastDotNum = +slider.querySelector('.last-dot').getAttribute('data-dotnum');
      setupDurAndDel(slideTransDur, slideTransDelay, (slideTransDur + slideTransDelay) / 3, (slideTransDur + slideTransDelay) / 2);

      if (curSlideNum == lastDotNum) {
        fromPointToPoint();
      } else {
        toSlide();
        activeDot();
      }

      if (isTouchSupported) {
        setTimeout(function () {
          addELforBtn(btnNext, dotsWrapper);
          addELforSwipe(wrapper);
        }, slideTransDur + slideTransDelay + 200);
      } else {
        setTimeout(function () {
          addELforBtn(btnNext, dotsWrapper);
          addELforSwipe(wrapper);
        }, slideTransDur + slideTransDelay + 100);
      }

      X1 = 0;
      X2 = 0;
      Y1 = 0;
      Y2 = 0;
    }

    function setupDurAndDel(slideDur, slideDel, elDur, lastElDur) {
      slides.forEach(function (item) {
        item.style.transitionDuration = "".concat(slideDur, "ms");
        item.style.transitionDelay = "".concat(slideDel, "ms");
      });
      dots.forEach(function (dot, i) {
        dot.querySelector('.slider__progress').style.transitionDuration = "".concat(elDur, "ms");

        if (i == dots.length - 1) {
          dot.querySelector('.slider__progress').style.transitionDuration = "".concat(lastElDur, "ms");
        }
      });
      lines.forEach(function (line, i) {
        line.querySelector('.slider__progress').style.transitionDuration = "".concat(elDur, "ms");

        if (i == lines.length - 1) {
          line.querySelector('.slider__progress').style.transitionDuration = "".concat(lastElDur, "ms");
        }
      });
    }

    function fromPointToPoint() {
      var fromStartToEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var a = fromStartToEnd ? slides.length - 1 : 1;
      toSlide(a);
      dots.forEach(function (dot, i) {
        var prevEl = dot.previousElementSibling,
            nextEl = dot.nextElementSibling,
            sumOfDurs = slideTransDur + slideTransDelay,
            totalDur = sumOfDurs / (dots.length - 1);
        var parts = i == dots.length - 1 ? 2 : 3;
        dot.querySelector('.slider__progress').style.transitionDuration = "".concat(totalDur / parts, "ms");

        if (prevEl) {
          prevEl.querySelector('.slider__progress').style.transitionDuration = "".concat(totalDur / parts, "ms");
        }

        if (nextEl) {
          nextEl.querySelector('.slider__progress').style.transitionDuration = "".concat(totalDur / parts, "ms");
        }

        if (fromStartToEnd) {
          var k = i == dots.length - 1 ? 1 : 1 / 3;
          setTimeout(function () {
            if (prevEl) {
              toggleActiveClass(prevEl, 'active-line');
            }

            setTimeout(function () {
              return toggleActiveClass(dot, 'active-dot');
            }, totalDur * k);

            if (parts == 3) {
              setTimeout(function () {
                if (nextEl) {
                  toggleActiveClass(nextEl, 'active-line');
                }
              }, 2 * totalDur / 3);
            }
          }, (i - 1) * totalDur);
        } else {
          setTimeout(function () {
            if (nextEl) {
              toggleActiveClass(nextEl, 'active-line', false);
            }

            if (parts == 2) {
              setTimeout(function () {
                return toggleActiveClass(dot, 'active-dot', false);
              }, totalDur / (parts + 1));
              setTimeout(function () {
                if (prevEl) {
                  toggleActiveClass(prevEl, 'active-line', false);
                }
              }, 2 * totalDur / (parts + 1));
            } else if (parts == 3) {
              setTimeout(function () {
                return toggleActiveClass(dot, 'active-dot', false);
              }, totalDur / parts);
              setTimeout(function () {
                if (prevEl) {
                  toggleActiveClass(prevEl, 'active-line', false);
                }
              }, 2 * totalDur / parts);
            }
          }, (dots.length - 1 - i) * totalDur);
        }
      });
    }

    function toSlide() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      shiftArray(newSlides, a);
      flipSlide(newSlides);
      removeELforSwipe(wrapper);
      removeELforBtn(btnNext, dotsWrapper);
    }

    function shiftArray(arr, cnt) {
      newSlides = arr.slice(cnt).concat(arr.slice(0, cnt));
      return newSlides;
    }

    function toggleActiveClass(el, activeClass) {
      var add = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (add) {
        el.classList.add(activeClass);
      } else {
        el.classList.remove(activeClass);
      }
    }

    function toggleDots(e) {
      var target = e.target,
          dotClassName = dotSelector.replace(/\./g, '');

      if (target.classList.contains(dotClassName) || target.classList.contains('slider__progress')) {
        var dotnum = +target.getAttribute('data-dotnum') || +target.parentElement.getAttribute('data-dotnum'),
            num = +document.querySelector('.current-slide').getAttribute('data-num'),
            res = dotnum - num,
            speedDur = Math.fround(slideTransDur / Math.fround(Math.sqrt(Math.abs(res)))),
            speedDel = Math.fround(slideTransDelay / Math.fround(Math.sqrt(Math.abs(res)))),
            sumSpeeds = speedDur + speedDel,
            dotsSpeed = sumSpeeds / 3,
            timerSlide,
            timerDot;

        var slideByDot = function slideByDot(parm) {
          toSlide(parm);
          activeDot(dotsSpeed);
          timerSlide = setInterval(toSlide, sumSpeeds, parm);
          timerDot = setInterval(activeDot, sumSpeeds, dotsSpeed);
          setTimeout(function () {
            addELforBtn(btnNext, dotsWrapper);
            addELforSwipe(wrapper);
            clearInterval(timerSlide);
          }, (Math.abs(res) - 1) * (sumSpeeds + 30));
          setTimeout(function () {
            return clearInterval(timerDot);
          }, (Math.abs(res) - 1) * (sumSpeeds + 30));
        };

        setupDurAndDel(speedDur, speedDel, dotsSpeed, dotsSpeed * 3 / 2);

        if (res > 0) {
          slideByDot();
        } else if (res < 0) {
          slideByDot(slides.length - 1);
        }
      }
    }

    function activeDot() {
      var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (slideTransDur + slideTransDelay) / 3;
      var slideNum = +slider.querySelector('.current-slide').getAttribute('data-num');
      dots.forEach(function (dot, i) {
        if (i <= slideNum && i != 0) {
          if (i == slides.length - 1) {
            toggleActiveClass(dot.previousElementSibling, 'active-line');
            setTimeout(function () {
              return toggleActiveClass(dot, 'active-dot');
            }, speed * 3 / 2);
          } else {
            if (dot.previousElementSibling) {
              toggleActiveClass(dot.previousElementSibling, 'active-line');
            }

            setTimeout(function () {
              return toggleActiveClass(dot, 'active-dot');
            }, speed);
            setTimeout(function () {
              if (dot.nextElementSibling) {
                toggleActiveClass(dot.nextElementSibling, 'active-line');
              }
            }, speed * 2);
          }
        } else if (i > slideNum) {
          if (i == slides.length - 1) {
            toggleActiveClass(dot, 'active-dot', false);
            setTimeout(function () {
              if (dot.previousElementSibling) {
                toggleActiveClass(dot.previousElementSibling, 'active-line', false);
              }
            }, speed * 3 / 2);
          } else {
            setTimeout(function () {
              if (dot.previousElementSibling) {
                toggleActiveClass(dot.previousElementSibling, 'active-line', false);
              }
            }, speed * 2);
            setTimeout(function () {
              return toggleActiveClass(dot, 'active-dot', false);
            }, speed);

            if (dot.nextElementSibling) {
              toggleActiveClass(dot.nextElementSibling, 'active-line', false);
            }
          }
        }
      });
    }

    function onMouseMove(e) {
      var xNow = e.pageX - wrapper.getBoundingClientRect().left,
          yNow = e.pageY - document.documentElement.scrollTop - wrapper.getBoundingClientRect().top,
          curSlide = slider.querySelector('.current-slide'),
          prevSlide = slider.querySelector('.prev-slide');
      var slideWidth = getFloatStyle(curSlide, 'width'),
          slideHeight = wrapper.offsetHeight,
          slideBorderHeightEnd = slideHeight / 10,
          slideBorderEnd = slideWidth / 8.3;

      if (clickMouse && X1 - xNow > 0) {
        curSlide.style.transitionDuration = "";
        curSlide.style.transitionDelay = '';
        curSlide.style.left = "".concat(-(X1 - xNow), "px");
        prevSlide.style.left = "";
      } else if (clickMouse && X1 - xNow < 0) {
        prevSlide.style.transitionDuration = "";
        prevSlide.style.transitionDelay = '';
        prevSlide.style.left = "calc(-85% + ".concat(-(X1 - xNow), "px)");
        prevSlide.style.opacity = '1';
        curSlide.style.left = "";
      }

      if (clickMouse && (xNow < slideBorderEnd && X1 > slideBorderEnd || xNow > slideWidth - slideBorderEnd && X1 < slideWidth || yNow < slideBorderHeightEnd && Y1 > 0 || yNow > slideHeight - slideBorderHeightEnd && Y1 < slideHeight)) {
        onMouseUp(e);
      }
    }

    function getFloatStyle(el, prop) {
      return parseFloat(window.getComputedStyle(el, null).getPropertyValue(prop));
    }

    function onMouseUp(e) {
      var cordUp = getMouse(e);
      var curSlide = slider.querySelector('.current-slide'),
          prevSlide = slider.querySelector('.prev-slide');
      clickMouse = false;
      var slideWidth = getFloatStyle(curSlide, 'width');
      X2 = cordUp.x;
      Y2 = cordUp.y;

      if (X1 && X2) {
        if (X1 - X2 > 0 && Math.abs(X1 - X2) / slideWidth > 1 / partOfSLide) {
          toNext();
        } else if (X1 - X2 < 0 && Math.abs(X1 - X2) / slideWidth > 1 / partOfSLide) {
          toPrev();
        } else if (Math.abs(X1 - X2) / slideWidth < 1 / partOfSLide) {
          setupDurAndDel(slideTransDur, slideTransDelay, (slideTransDur + slideTransDelay) / 3, (slideTransDur + slideTransDelay) / 2);
        }
      }

      curSlide.style.left = "";
      prevSlide.style.left = "";
      prevSlide.style.opacity = '';
    }

    function getMouse(e) {
      var mx, my;

      if (isTouchSupported) {
        var touches = e.changedTouches;

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
      var curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num');
      setupDurAndDel(slideTransDur, slideTransDelay, (slideTransDur + slideTransDelay) / 3, (slideTransDur + slideTransDelay) / 2);

      if (curSlideNum == 0) {
        fromPointToPoint(true);
      } else {
        toSlide(slides.length - 1);
        activeDot();
      }

      setTimeout(function () {
        addELforBtn(btnNext, dotsWrapper);
        addELforSwipe(wrapper);
      }, slideTransDur + slideTransDelay + 100);
      X1 = 0;
      X2 = 0;
      Y1 = 0;
      Y2 = 0;
    }

    function onMouseDown(e) {
      var down = getMouse(e);
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

  var tabs = function tabs() {
    var progressBar = document.querySelector('.progress-bar'),
        tabDots = progressBar.querySelectorAll('.progress-bar__dot'),
        tabLines = progressBar.querySelectorAll('.progress-bar__line'),
        blocksWrapper = document.querySelector('.features__content'),
        blocks = blocksWrapper.querySelectorAll('.block'),
        titles = blocksWrapper.querySelectorAll('.block__title'),
        progresses = progressBar.querySelectorAll('.progress-bar__progress');
    var durTime = 300,
        a = getFloatStyle(blocks[0].lastElementChild, 'height'),
        b = getFloatStyle(blocks[0].firstElementChild, 'margin-bottom'),
        offsets = [],
        numOfBlock,
        res;
    blocks.forEach(function (block, i) {
      if (i == 0) {
        block.style.marginBottom = "".concat(a + b, "px");
      }

      if (block.classList.contains('active')) {
        numOfBlock = i;
      }
    });
    progresses.forEach(function (item, i) {
      item.style.transitionDuration = "".concat(durTime, "ms");

      if (i == progresses.length - 1) {
        item.style.transitionDuration = "".concat(2 * durTime, "ms");
      }
    });
    setAtr(tabLines, 'data-progressLine');
    setAtr(blocks, 'data-block');
    controlDistance();
    computeDistance();
    blocksWrapper.addEventListener('click', function (e) {
      var target = e.target;

      if (target && target.classList.contains('title')) {
        var n = target.parentNode.getAttribute('data-block');
        res = n - numOfBlock;
        numOfBlock = n;
        var titleMb = getFloatStyle(target, 'margin-bottom');
        blocks.forEach(function (block, i) {
          if (i != n) {
            block.classList.remove('active');
            block.style.marginBottom = "";
            block.lastElementChild.style.top = "-10%";
          } else {
            var heightBody = getFloatStyle(block.lastElementChild, 'height'),
                heightTitle = getFloatStyle(target, 'height');
            block.classList.add('active');
            block.lastElementChild.style.top = "calc(".concat(heightTitle, "px + 0.4em)");
            block.style.marginBottom = "".concat(heightBody + titleMb, "px");
          }
        });
        activeBar(res);
      }
    });

    function getFloatStyle(el, prop) {
      return parseFloat(window.getComputedStyle(el, null).getPropertyValue(prop));
    }

    function setAtr(arr, atrName) {
      arr.forEach(function (item, i) {
        item.setAttribute(atrName, i);
      });
    }

    function controlDistance() {
      tabLines.forEach(function (line, i) {
        var dotHeight = +getFloatStyle(tabDots[0], 'height'),
            distance = offsets[i + 1] - offsets[i] - dotHeight;
        line.style.height = "".concat(distance, "px");
      });
      requestAnimationFrame(controlDistance);
    }

    function computeDistance() {
      titles.forEach(function (title, i) {
        offsets[i] = title.getBoundingClientRect().top;
      });
      requestAnimationFrame(computeDistance);
    }

    function activeBar(res) {
      var delay = (3 - Math.abs(res)) * durTime * 2 / (Math.abs(res) + 1);
      blocks.forEach(function (block, i) {
        if (block.classList.contains('active')) {
          tabDots.forEach(function (dot, j) {
            if (j <= i && j != 0) {
              if (res == 1) {
                if (j == 1) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay / 2, "ms");
                } else if (j == 2) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                }

                dot.classList.add('active-dot');
              } else if (res == 2) {
                if (j == 1) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  dot.classList.add('active-dot');
                } else if (j == 2) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  setTimeout(function () {
                    return dot.classList.add('active-dot');
                  }, 2 * delay);
                }
              }
            } else {
              if (res == -1) {
                if (j == 2) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  dot.classList.remove('active-dot');
                } else if (j == 1) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay / 2, "ms");
                  setTimeout(function () {
                    dot.classList.remove('active-dot');
                  }, delay / 2);
                }
              } else if (res == -2) {
                if (j == 2) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  dot.classList.remove('active-dot');
                } else if (j == 1) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  setTimeout(function () {
                    return dot.classList.remove('active-dot');
                  }, 2 * delay);
                }
              }
            }
          });
          tabLines.forEach(function (line, j) {
            if (j <= i && j != 0) {
              if (res == 2) {
                line.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                setTimeout(function () {
                  return line.classList.add('active');
                }, delay);
              } else if (res == 1) {
                line.firstElementChild.style.transitionDuration = "".concat(delay / 2, "ms");
                setTimeout(function () {
                  return line.classList.add('active');
                }, delay / 2);
              }
            } else {
              if (res == -2) {
                line.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                setTimeout(function () {
                  return line.classList.remove('active');
                }, delay);
              } else if (res == -1) {
                line.firstElementChild.style.transitionDuration = "".concat(delay / 2, "ms");
                line.classList.remove('active');
              }
            }
          });
        }
      });
    }
  };

  tabs();

  var openMenu = function openMenu(blockSelector, btnSelector, menuSelector, linkClass) {
    var block = document.querySelector(blockSelector),
        btn = block.querySelector(btnSelector),
        menu = block.querySelector(menuSelector),
        body = document.body;
    btn.addEventListener('click', function () {
      toggleClass();
    });
    block.addEventListener('click', function (e) {
      var target = e.target;

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
});