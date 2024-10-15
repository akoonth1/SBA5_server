




document.getElementById('editor').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Form submitted');
    //document.getElementById('editor').submit();
    console.log(document.getElementById('editor').value);
    let input_nodes = document.querySelectorAll('input');
    console.log(input_nodes);
    let data = {};
    input_nodes.forEach(input => {
        data[input.name] = input.value;
    });
    console.log(data);
    let id = document.getElementById('id').value;
    let response = await fetch(`/mart/users/${id}/edit`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
  console.log(response);


    if (response.status === 303) {
        let redirectUrl = response.headers.get('Location');
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            console.error('No redirect URL found in the response');
        }
    } else if (response.ok) {
        console.log('User updated successfully');
    } else {
        console.error('Failed to update user:', response.statusText);
    }
});