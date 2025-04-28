const cards = document.querySelectorAll('.card');

let matchedCards=0;
let cardOne , cardTwo;
let disableClick = false;

//second move flipping the cards and see if there is a matching
const flipCard = (e) => {
  let clickedCard = e.target;
  if ( disableClick ) return;
  clickedCard.classList.add('flip');
  if (clickedCard !== cardOne) {
    if (!cardOne) {
      return cardOne=clickedCard;
    }
    cardTwo=clickedCard;
    disableClick = true;
    //add the source of images to lets to compare them
    let cartOneImg = cardOne.querySelector('img').src;
    let cartTwoImg = cardTwo.querySelector('img').src;
    matchCards(cartOneImg,cartTwoImg);
  }
}
//fourth card to shuffle cards
const shuffleCard = () => {
    let arr =[1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
    for (let i =arr.length-1 ; i>0 ; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; };
    cards.forEach((card,index) => {
      card.classList.remove('flip');
      let imgTag = card.querySelector('img');
      imgTag.src=`images/img-${arr[index]}.png`;
    });
}

shuffleCard();

//third move to see the matching cards
const matchCards = (img1,img2) => {
  if (img1 === img2 ) {
    matchedCards++;
    if (matchedCards === 8) {
      setTimeout(() => {
        return shuffleCard();
      },2000);
    }
    cardOne='',cardTwo='';
    return disableClick=false;
  }
  setTimeout(() => {
    cardOne.classList.add('shake');
    cardTwo.classList.add('shake');
  },400);
  setTimeout(() => {
    cardOne.classList.remove('shake','flip');
    cardTwo.classList.remove('shake','flip');
    cardOne='',cardTwo='';
    disableClick=false;
  },1200);
}
// first move is adding listener to the click of each cart
cards.forEach(card => {
  card.addEventListener('click',flipCard);
});