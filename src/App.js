import { useState } from 'react';

const App = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const surpriseOptions = [
        'Generate a meal plan for a week based on my dietary preferences',
        'Summarize the key points from the latest tech news',
        'Explain the significance of quantum computing in simple terms'
    ];

    // const surprise = () => {
    //     const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    //     setValue(randomValue);
    // };

    const getResponse = async () => {
        if (!value) {
            setError("Error: Please ask a question 🛑");
            return;
        }

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const response = await fetch("https://gemini-ai-v0sm.onrender.com/gemini", options);
            const data = await response.text();

            setChatHistory(oldChatHistory => [...oldChatHistory, {
                role: "user",
                parts: [value]
            },
            {
                role: "model",
                parts: data
            }]);

            setValue("");

        } catch (error) {
            console.error(error);
            setError("Something went wrong! Please try again later. 🛑");
        }
    };

    const clear = () => {
        setValue("");
        setError("");
        setChatHistory([]);
    };

    return (
        <div className="app">
            <h1>Gemini AI</h1>
            <h2>How can I help you today?</h2>
            <div className="suggestions">
                {surpriseOptions.map((option, index) => (
                    <div key={index} className="suggestion-box" onClick={() => setValue(option)}>
                        {option}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="Enter a prompt here"
                    onChange={(e) => setValue(e.target.value)}
                />
                {!error && <button onClick={getResponse}>Ask Me</button>}
                {error && <button onClick={clear}>Clear</button>}
            </div>
            {error && <p className="error">{error}</p>}
            <div className="search-result">
                {chatHistory.map((chatItem, _index) =>
                    <div key={_index}>
                        <p className={`answer ${chatItem.role}`}>
                            {chatItem.role}: {chatItem.parts}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;


