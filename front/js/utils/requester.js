export function fetcher(){
    let headers ={
        'Content-Type': 'application/json',
    };

    function appendToHeader(header) {
        headers = {
            ...headers,
            ...header
        }
    };

    return{
    use,
    get,
    post,
    put,
    delete: _delete
    }
};


async function use(header) {
    appendToHeader(header)
};


async function get(url) {
    const requestOptions = {
        method: 'GET'
    };
    return fetch(url, requestOptions).then(handleResponse);
};

async function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
};


async function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
};


async function _delete(url) {
    const requestOptions = {
        method: 'DELETE'
    };
    return fetch(url, requestOptions).then(handleResponse);
};


async function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text); 
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
};

