

fetch('tyontekijat.json')
    .then(response => response.json())
    .then(data => myFunction(data))
    .catch(error => console.log(error));

function myFunction(arr) {
    let html = `
    <table>
        <thead>
            <tr>
                <td>Etunimi</td>
                <td>Sukunimi</td>
                <td>Osoite</td>
                <td>Kotipuhelin</td>
                <td>Työpuhelin</td>
            </tr>
        </thead>
        <tbody>`;
    for(let hlo of arr.tyontekijat) {
        html += `
            <tr>
                <td>${hlo.firstName}</td>
                <td>${hlo.lastName}</td>
                <td>${hlo.address}</td>
                <td>${hlo.phone.home}</td>
                <td>${hlo.phone.work}</td>
                </tr>`;
    }
    html += `</tbody></table>`;
    document.getElementById("duunarit").innerHTML = html;
}