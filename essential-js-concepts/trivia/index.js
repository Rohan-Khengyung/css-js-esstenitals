const revealBtn = document.getElementById('reveal-btn')
const answer = document.getElementById('answer')
const question = document.getElementById('question')

revealBtn.addEventListener('click', function(){
    answer.style.display = 'block'
    question.style.color = '#1434A4'
    question.style.backgroundColor = '#68e1fd'
    revealBtn.style.display = 'none'
})