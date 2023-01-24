const cards = [...document.querySelectorAll('li .back')];
const card_front = [...document.querySelectorAll('.front')];
let setScore = document.querySelector('.score section h4')
const start_btn = document.querySelector('.start_btn')
const hour_glass = document.querySelector('.score i');
const play_again = document.querySelector('.play-again');
const img_list = [
    {img:'/img/apple.png',count:2},
    {img:'/img/cherry.png',count:2},
    {img:'/img/coconut.png',count:2},
    {img:'/img/lime.png',count:2},
    {img:'/img/orange.png',count:2},
    {img:'/img/pineapple.png',count:2},
    {img:'/img/strawberry.png',count:2},
    {img:'/img/mango.png',count:2},
]
const winning_combo = {}
let user_choices = []
let onCard1 = true;
let score = 0;
let cards_correct = 0;
let points_per_card = 100;
let game_started = false;

const calculate_score = ()=>{
    if(game_started == true)
        score+=points_per_card;
        setScore.innerText = score;
}
const decrease_points = ()=>{
    if(game_started && points_per_card > 10){
        points_per_card -= 5
    }
}
// decreases points per card every 5 seconds 
setInterval(decrease_points,5000)

let items_remaining = ()=>{
    return img_list.filter(item=>item.count > 0)
}

const flip_card = (card)=>{
    card.parentElement.parentElement.classList.add('active')
}
const celebrate = ()=>{
    if(game_started && cards_correct == 8){
        document.querySelector('.game-board').classList.add('winner');
        if(!localStorage.getItem('highScore') || localStorage.getItem('highScore') < score){
            localStorage.setItem('highScore', score);
            display_high_score();
        }
    }
}
const display_high_score = ()=>{
    if(localStorage.getItem('highScore'))
        return document.querySelector('.highScore p').innerText = localStorage.getItem('highScore');
}
display_high_score();

const check_if_active_cards_are_winning = ()=>{
    let img1 = user_choices[0].getAttribute('src')
    let img2 = user_choices[1].getAttribute('src')
    if( img1 == img2){
        console.log(user_choices[0].src,user_choices[0].src)
        user_choices[0].parentElement.parentElement.classList.add('correct');
        user_choices[1].parentElement.parentElement.classList.add('correct');
        cards_correct++;
        calculate_score()
        celebrate();
    }else{
        user_choices[0].parentElement.parentElement.classList.remove('active');
        user_choices[1].parentElement.parentElement.classList.remove('active');
    }
    user_choices.shift();
    user_choices.shift();
}

const startGame = ()=>{
    game_started = true;
    hour_glass.style.display = 'block';
    cards.forEach((element,idx)=>{
        let remaining_items = items_remaining();
        let remaining_item_idx = Math.floor(Math.random() * remaining_items.length);
        element.src = remaining_items[remaining_item_idx].img;
        remaining_items[remaining_item_idx].count--;
        if(!winning_combo[remaining_items[remaining_item_idx].img])winning_combo[remaining_items[remaining_item_idx].img] = [];
        winning_combo[remaining_items[remaining_item_idx].img].push(idx);
    })
}


    card_front.forEach((element,idx)=>{
        element.addEventListener('click',async ()=>{
            flip_card(element)
            console.log('cards remaining',items_remaining().length)
            if(onCard1){
                onCard1 = false;
                return user_choices.push(cards[idx]);
                }
                user_choices.push(cards[idx]);
            onCard1 = true;
            setTimeout(() => {
                setTimeout(check_if_active_cards_are_winning, 2000)
            })
        })
    })

const reset = ()=>{
    setScore.innerText = 0;
    [...document.querySelectorAll('li')].forEach(item=>{item.classList.remove('active');item.classList.remove('correct') });
    document.querySelector('.game-board').classList.remove('winner');
}
start_btn.addEventListener('click',()=>{
    reset();
    startGame()
})

play_again.addEventListener('click',()=>{
    reset()
    startGame()
})
