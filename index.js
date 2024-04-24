function submitData() {
    let firstname = document.querySelector('input[name=firstname]');

    let lastname = document.querySelector('input[name=lastname]');
    let age = document.querySelector('input[name=age]');
    let gender = document.querySelector('input[name=gender]:checked');
    let description = document.querySelector('textarea');
    let interestDOM = document.querySelectorAll('input[name=interest]:checked')

    let interest = "";
    for(let i = 0; i< interestDOM.length;i++){
        interest += interestDOM[i].value
        if(i != interestDOM.length -1){
            interest += ", "
        }
    }
    const data = {
        firstname : firstname.value,
        lastname: lastname.value,
        age: age.value,
        gender: gender.value,
        description: description.value,
        interest: interest
    }
    console.log(data);
}