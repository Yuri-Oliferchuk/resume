let infoObj = {};
let request = new XMLHttpRequest();
request.open('GET', '../api/<%= lang %>/admin/info');
request.responseType = 'json';
request.send();

request.onload = async() => {
    infoObj = await request.response;
    document.getElementById('name').value = infoObj.name;
    document.getElementById('profession').value = infoObj.profession;
    document.getElementById('text').value = infoObj.text;
    document.getElementById('contact').value = infoObj.contacts;
}

const superuser = '<%= superuser%>';
console.log(superuser);
if(!superuser){
    document.forms['form']['name'].disabled = true;
    document.forms['form']['profession'].disabled = true;
    document.forms['form']['text'].disabled = true;
    document.forms['form']['contact'].disabled = true;
} else {
    document.forms['form']['name'].disabled = false;
    document.forms['form']['profession'].disabled = false;
    document.forms['form']['text'].disabled = false;
    document.forms['form']['contact'].disabled = false;
}