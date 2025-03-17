import { useEffect, useState } from 'react';

const App = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/recipe', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ request: "spaghetti carbonara" }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setData(data.message))
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }, []);

    return (
        <div>
            <h1>{data ? data : 'Loading...'}</h1>
        </div>
    );
};

export default App;
