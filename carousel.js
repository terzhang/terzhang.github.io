const carousel = document.querySelector(".merry-go-round");
const firstImg = document.querySelectorAll(".merry-go-round li")[0];
// const arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false,
  isDragging = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;

// arrowIcons.forEach((icon) => {
//   icon.addEventListener("click", () => {
//     let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
//     // if clicked icon is left, reduce width value from the carousel scroll left else add to it
//     carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
//   });
// });

const dragStart = (e) => {
  //   console.log("dragStart");
  // updating global variables value on mouse down event
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  //   console.log("dragging");
  // scrolling images/carousel to left according to mouse pointer
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
};

const dragStop = () => {
  //   console.log("dragStop");
  isDragStart = false;
  carousel.classList.remove("dragging");

  if (!isDragging) return;
  isDragging = false;
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);
carousel.addEventListener("touchend", dragStop);
