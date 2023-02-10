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
    use:  (header) => {
        appendToHeader(header)
    },
    get: async (url) => {
        const requestOptions = {
            method: 'GET'
        };
        return fetch(url, requestOptions).then(handleResponse);
    },
    post : async (url, body) => {
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };
        return fetch(url, requestOptions).then(handleResponse);
    },
    put : async (url, body) => {
        const requestOptions = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        };
        return fetch(url, requestOptions).then(handleResponse);    
    },
    delete: async (url) => {
        const requestOptions = {
            method: 'DELETE'
        };
        return fetch(url, requestOptions).then(handleResponse);
    }
    }
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

