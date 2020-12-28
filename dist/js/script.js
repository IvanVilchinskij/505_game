"use strict";

window.addEventListener('DOMContentLoaded', function () {
  /* Webp */
  function testWebP(callback) {
    var webP = new Image();

    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };

    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });

  var cardSlider = function cardSlider() {
    var slider = document.querySelector('.slider'),
        wrapper = slider.querySelector('.slider__wrapper'),
        slides = slider.querySelectorAll('.slider__slide'),
        btnNext = slider.querySelector('.slider__next'),
        dotsWrapper = slider.querySelector('.slider__dots'),
        dots = slider.querySelectorAll('.slider__dot'),
        lines = slider.querySelectorAll('.slider__line');
    var newSlides = Array.from(slides),
        slideTransDur = 500,
        slideTransDelay = 0,
        isTouchSupported = 'ontouchstart' in window ? true : false,
        EVENTS = {
      POINTER_DOWN: isTouchSupported ? 'touchstart' : 'mousedown',
      POINTER_UP: isTouchSupported ? 'touchend' : 'mouseup',
      POINTER_MOVE: isTouchSupported ? 'touchmove' : 'mousemove',
      POINTER_CLICK: isTouchSupported ? 'touchend' : 'click'
    },
        X1,
        X2,
        clickMouse;

    function shiftArray(arr, cnt) {
      newSlides = arr.slice(cnt).concat(arr.slice(0, cnt));
      return newSlides;
    }

    function workWithClass(_ref) {
      var item = _ref.item,
          addClass = _ref.addClass,
          removeClass1 = _ref.removeClass1,
          removeClass2 = _ref.removeClass2,
          removeClass3 = _ref.removeClass3,
          removeClass4 = _ref.removeClass4;
      item.classList.remove(removeClass1);
      item.classList.remove(removeClass2);
      item.classList.remove(removeClass3);
      item.classList.remove(removeClass4);
      item.classList.add(addClass);
    }

    function toSwipe(arr) {
      arr.forEach(function (slide, i) {
        if (i != slides.length - 1) {
          slide.style.zIndex = slides.length - i;
        }

        switch (i) {
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

          case arr.length - 2:
            workWithClass({
              item: slide,
              addClass: 'prevprev-slide',
              removeClass1: 'third-slide',
              removeClass2: 'current-slide',
              removeClass3: 'prev-slide',
              removeClass4: 'second-slide'
            });
            break;

          case arr.length - 1:
            workWithClass({
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

    function onMouseDown(e) {
      e.preventDefault();
      var down = getMouse(e);
      X1 = down.x;
      clickMouse = true;
      return X1;
    }

    function onMouseUp(e) {
      var xUp = getMouse(e);
      var curSlide = slider.querySelector('.current-slide'),
          prevSlide = slider.querySelector('.prev-slide');
      clickMouse = false;
      X2 = xUp.x;

      if (X1 && X2) {
        if (X1 - X2 > 0 && Math.abs(X1 - X2) / 502 > 1 / 6) {
          toNext();
        } else if (X1 - X2 < 0 && Math.abs(X1 - X2) / 502 > 1 / 6) {
          toPrev();
        } else if (Math.abs(X1 - X2) / 502 < 1 / 6) {
          setUpDefDurAndDel(slideTransDur, slideTransDelay, (slideTransDur + slideTransDelay) / 3, (slideTransDur + slideTransDelay) / 2);
        }
      }

      curSlide.style.left = "";
      prevSlide.style.left = "";
      prevSlide.style.opacity = '';
    }

    function onMouseMove(e) {
      var xNow = e.pageX - wrapper.getBoundingClientRect().left,
          curSlide = slider.querySelector('.current-slide'),
          prevSlide = slider.querySelector('.prev-slide');

      if (clickMouse && X1 - xNow > 0) {
        curSlide.style.transitionDuration = "";
        curSlide.style.transitionDelay = '';
        curSlide.style.left = "".concat(-(X1 - xNow), "px");
        prevSlide.style.left = "";
      } else if (clickMouse && X1 - xNow < 0) {
        prevSlide.style.transitionDuration = "";
        prevSlide.style.transitionDelay = '';
        prevSlide.style.left = "calc(-100% + 118px + ".concat(-(X1 - xNow), "px)");
        prevSlide.style.opacity = '1';
        curSlide.style.left = "";
      }

      if (clickMouse && (xNow < 60 && X1 > 60 || xNow > 502 && X1 < 502)) {
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

    function toRemoveELBtn(btn, dots) {
      btn.removeEventListener(EVENTS.POINTER_CLICK, toNext, false);
      dots.removeEventListener(EVENTS.POINTER_CLICK, toggleDots, false);
      wrapper.removeEventListener(EVENTS.POINTER_MOVE, onMouseMove, false);
    }

    function toSlide() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      shiftArray(newSlides, a);
      toSwipe(newSlides);
      toRemoveELSwipe(wrapper);
      toRemoveELBtn(btnNext, dotsWrapper);
    }

    function activeDot() {
      var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (slideTransDur + slideTransDelay) / 3;
      var slideNum = +slider.querySelector('.current-slide').getAttribute('data-num');
      dots.forEach(function (dot, i) {
        if (i <= slideNum && i != 0) {
          if (i == slides.length - 1) {
            dot.previousElementSibling.classList.add('active-line');
            setTimeout(function () {
              dot.classList.add('active-dot');
            }, speed * 3 / 2);
          } else {
            if (dot.previousElementSibling) {
              dot.previousElementSibling.classList.add('active-line');
            }

            setTimeout(function () {
              dot.classList.add('active-dot');
            }, speed);
            setTimeout(function () {
              if (dot.nextElementSibling) {
                dot.nextElementSibling.classList.add('active-line');
              }
            }, speed * 2);
          }
        } else if (i > slideNum) {
          if (i == slides.length - 1) {
            dot.classList.remove('active-dot');
            setTimeout(function () {
              if (dot.previousElementSibling) {
                dot.previousElementSibling.classList.remove('active-line');
              }
            }, speed * 3 / 2);
          } else {
            setTimeout(function () {
              if (dot.previousElementSibling) {
                dot.previousElementSibling.classList.remove('active-line');
              }
            }, speed * 2);
            setTimeout(function () {
              dot.classList.remove('active-dot');
            }, speed);

            if (dot.nextElementSibling) {
              dot.nextElementSibling.classList.remove('active-line');
            }
          }
        }
      });
    }

    function fromPointToPoint() {
      var fromStartToEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var a = fromStartToEnd ? slides.length - 1 : 1;
      toSlide(a);
      dots.forEach(function (dot, i) {
        if (i == dots.length - 1) {
          dot.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / (2 * (dots.length - 1)), "ms");

          if (dot.previousElementSibling) {
            dot.previousElementSibling.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / (2 * (dots.length - 1)), "ms");
          }

          if (dot.nextElementSibling) {
            dot.nextElementSibling.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / (2 * (dots.length - 1)), "ms");
          }

          if (fromStartToEnd) {
            setTimeout(function () {
              if (dot.previousElementSibling) {
                dot.previousElementSibling.classList.add('active-line');
              }

              setTimeout(function () {
                dot.classList.add('active-dot');
              }, (slideTransDur + slideTransDelay) / (2 * (dots.length - 1)));
            }, (i - 1) * (slideTransDur + slideTransDelay) / (dots.length - 1));
          } else {
            setTimeout(function () {
              if (dot.nextElementSibling) {
                dot.nextElementSibling.classList.remove('active-line');
              }

              setTimeout(function () {
                dot.classList.remove('active-dot');
              }, (slideTransDur + slideTransDelay) / (3 * (dots.length - 1)));
              setTimeout(function () {
                if (dot.previousElementSibling) {
                  dot.previousElementSibling.classList.remove('active-line');
                }
              }, (slideTransDur + slideTransDelay) / (3 * (dots.length - 1)) * 2);
            }, (dots.length - 1 - i) * (slideTransDur + slideTransDelay) / (dots.length - 1));
          }
        } else {
          dot.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / (3 * (dots.length - 1)), "ms");

          if (dot.previousElementSibling) {
            dot.previousElementSibling.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / (3 * (dots.length - 1)), "ms");
          }

          if (dot.nextElementSibling) {
            dot.nextElementSibling.querySelector('.slider__progress').style.transitionDuration = "".concat((slideTransDur + slideTransDelay) / (3 * (dots.length - 1)), "ms");
          }

          if (fromStartToEnd) {
            setTimeout(function () {
              if (dot.previousElementSibling) {
                dot.previousElementSibling.classList.add('active-line');
              }

              setTimeout(function () {
                dot.classList.add('active-dot');
              }, (slideTransDur + slideTransDelay) / (3 * (dots.length - 1)));
              setTimeout(function () {
                if (dot.nextElementSibling) {
                  dot.nextElementSibling.classList.add('active-line');
                }
              }, (slideTransDur + slideTransDelay) / (3 * (dots.length - 1)) * 2);
            }, (i - 1) * (slideTransDur + slideTransDelay) / (dots.length - 1));
          } else {
            setTimeout(function () {
              if (dot.nextElementSibling) {
                dot.nextElementSibling.classList.remove('active-line');
              }

              setTimeout(function () {
                dot.classList.remove('active-dot');
              }, (slideTransDur + slideTransDelay) / (3 * (dots.length - 1)));
              setTimeout(function () {
                if (dot.previousElementSibling) {
                  dot.previousElementSibling.classList.remove('active-line');
                }
              }, (slideTransDur + slideTransDelay) / (3 * (dots.length - 1)) * 2);
            }, (dots.length - 1 - i) * (slideTransDur + slideTransDelay) / (dots.length - 1));
          }
        }
      });
    }

    function setUpDefDurAndDel(slideDur, slideDel, elDur, lastElDur) {
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

    function toNext() {
      toRemoveELSwipe(wrapper);
      toRemoveELBtn(btnNext, dotsWrapper);
      var curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num'),
          lastDotNum = +slider.querySelector('.last-dot').getAttribute('data-dotnum');
      setUpDefDurAndDel(slideTransDur, slideTransDelay, (slideTransDur + slideTransDelay) / 3, (slideTransDur + slideTransDelay) / 2);

      if (curSlideNum == lastDotNum) {
        fromPointToPoint();
      } else {
        toSlide();
        activeDot();
      }

      if (isTouchSupported) {
        setTimeout(function () {
          toAddELBtn(btnNext, dotsWrapper);
          toAddELSwipe(wrapper);
        }, slideTransDur + slideTransDelay + 200);
      } else {
        setTimeout(function () {
          toAddELBtn(btnNext, dotsWrapper);
          toAddELSwipe(wrapper);
        }, slideTransDur + slideTransDelay + 100);
      }

      X1 = 0;
      X2 = 0;
    }

    function toPrev() {
      toRemoveELSwipe(wrapper);
      toRemoveELBtn(btnNext, dotsWrapper);
      var curSlideNum = +slider.querySelector('.current-slide').getAttribute('data-num');
      setUpDefDurAndDel(slideTransDur, slideTransDelay, (slideTransDur + slideTransDelay) / 3, (slideTransDur + slideTransDelay) / 2);

      if (curSlideNum == 0) {
        fromPointToPoint(true);
      } else {
        toSlide(slides.length - 1);
        activeDot();
      }

      setTimeout(function () {
        toAddELBtn(btnNext, dotsWrapper);
        toAddELSwipe(wrapper);
      }, slideTransDur + slideTransDelay + 100);
      X1 = 0;
      X2 = 0;
    }

    function toggleDots(e) {
      var target = e.target;

      if (target.classList.contains('slider__dot') || target.classList.contains('slider__progress')) {
        var dotnum = +target.getAttribute('data-dotnum') || +target.parentElement.getAttribute('data-dotnum'),
            num = +document.querySelector('.current-slide').getAttribute('data-num'),
            res = dotnum - num,
            speed = Math.fround(slideTransDur / Math.fround(Math.sqrt(Math.abs(res)))),
            speedDel = Math.fround(slideTransDelay / Math.fround(Math.sqrt(Math.abs(res)))),
            dotsSpeed = (speed + speedDel) / 3,
            timerSlide,
            timerDot;
        setUpDefDurAndDel(speed, speedDel, dotsSpeed, dotsSpeed * 3 / 2);

        if (res > 0) {
          toSlide();
          activeDot(dotsSpeed);
          timerSlide = setInterval(toSlide, speed + speedDel);
          timerDot = setInterval(activeDot, speed + speedDel, dotsSpeed);
          setTimeout(function () {
            toAddELBtn(btnNext, dotsWrapper);
            toAddELSwipe(wrapper);
            clearInterval(timerSlide);
          }, (Math.abs(res) - 1) * (speed + speedDel + 30));
          setTimeout(function () {
            clearInterval(timerDot);
          }, (Math.abs(res) - 1) * (speed + speedDel + 30));
        } else if (res < 0) {
          toSlide(slides.length - 1);
          activeDot(dotsSpeed);
          timerSlide = setInterval(toSlide, speed + speedDel, slides.length - 1);
          setTimeout(function () {
            toAddELBtn(btnNext, dotsWrapper);
            toAddELSwipe(wrapper);
            clearInterval(timerSlide);
          }, (Math.abs(res) - 1) * (speed + speedDel + 30));
          timerDot = setInterval(activeDot, speed + speedDel, dotsSpeed);
          setTimeout(function () {
            clearInterval(timerDot);
          }, (Math.abs(res) - 1) * (speed + speedDel + 30));
        }
      }
    }

    function setDataAndDur(arr, dataSelector, lastObjSelector) {
      var slides = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      arr.forEach(function (item, i) {
        item.setAttribute(dataSelector, i);

        if (slides) {
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

    setDataAndDur(slides, 'data-num', '', true);
    setDataAndDur(dots, 'data-dotnum', 'last-dot');
    setDataAndDur(lines, 'data-line', 'last-line');
    toSwipe(newSlides);
    toAddELBtn(btnNext, dotsWrapper);
    toAddELSwipe(wrapper);
  };

  cardSlider();

  var tabs = function tabs() {
    var progressBar = document.querySelector('.progress-bar'),
        tabDots = progressBar.querySelectorAll('.progress-bar__dot'),
        tabLines = progressBar.querySelectorAll('.progress-bar__line'),
        blocksWrapper = document.querySelector('.features__content'),
        blocks = blocksWrapper.querySelectorAll('.block'),
        titles = blocksWrapper.querySelectorAll('.block__title'),
        progresses = progressBar.querySelectorAll('.progress-bar__progress');
    var offsets = [],
        numOfBlock,
        res,
        durTime = 300;
    blocks.forEach(function (block, i) {
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

    function getFloatStyle(el, prop) {
      return parseFloat(window.getComputedStyle(el, null).getPropertyValue(prop));
    }

    var a = getFloatStyle(blocks[0].lastElementChild, 'height'),
        b = getFloatStyle(blocks[0].firstElementChild, 'margin-bottom');
    blocks[0].style.marginBottom = "".concat(a + b, "px");

    function setAtr(arr, atrName) {
      arr.forEach(function (item, i) {
        item.setAttribute(atrName, i);
      });
    }

    setAtr(tabDots, 'data-progressDot');
    setAtr(tabLines, 'data-progressLine');
    setAtr(titles, 'data-title');
    setAtr(blocks, 'data-block');

    function control() {
      tabLines.forEach(function (line, i) {
        var distance = offsets[i + 1] - offsets[i] - 14;
        line.style.height = "".concat(distance, "px");
      });
      requestAnimationFrame(control);
    }

    control();

    function activeBar(res) {
      var delay = (3 - Math.abs(res)) * durTime * 2 / (Math.abs(res) + 1);
      console.log(delay);
      blocks.forEach(function (block, i) {
        if (block.classList.contains('active')) {
          tabDots.forEach(function (dot, j) {
            if (j <= i && j != 0) {
              if (res == 1) {
                if (j == 1) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay / 2, "ms");
                  console.log(dot.firstElementChild);
                } else if (j == 2) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  console.log(dot.firstElementChild);
                }

                dot.classList.add('active-dot');
              } else if (res == 2) {
                if (j == 1) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  dot.classList.add('active-dot');
                } else if (j == 2) {
                  dot.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                  setTimeout(function () {
                    dot.classList.add('active-dot');
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
                    dot.classList.remove('active-dot');
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
                  line.classList.add('active');
                }, delay);
              } else if (res == 1) {
                line.firstElementChild.style.transitionDuration = "".concat(delay / 2, "ms");
                setTimeout(function () {
                  line.classList.add('active');
                }, delay / 2);
              }
            } else {
              if (res == -2) {
                line.firstElementChild.style.transitionDuration = "".concat(delay, "ms");
                setTimeout(function () {
                  line.classList.remove('active');
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

    function computeDistance() {
      titles.forEach(function (title, i) {
        offsets[i] = title.getBoundingClientRect().top;
      });
      requestAnimationFrame(computeDistance);
    }

    computeDistance();
    /* activeBar(); */

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
          } else {
            var heightBody = getFloatStyle(block.lastElementChild, 'height');
            block.classList.add('active');
            block.style.marginBottom = "".concat(heightBody + titleMb, "px");
          }
        });
        console.log(res);
        activeBar(res);
      }
    });
  };

  tabs();
});