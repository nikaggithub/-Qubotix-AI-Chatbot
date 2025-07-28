const API_KEY = 'AIzaSyAWN80Ujyzpw6uRJdO-Ak9aJOablA_5sMA';
// Replace with your actual Gemini API key – this stores the API key to authenticate requests to the Gemini API.

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
// The base URL of the Gemini API used to generate content (for text-based responses).

const chatMessages = document.getElementById('chat-messages');
// Gets the DOM element with the ID 'chat-messages', where the chat messages (user and bot) will be displayed.

const userInput = document.getElementById('user-input');
// Gets the DOM element with the ID 'user-input', which is the input field where the user types their message.

const sendButton = document.getElementById('send-button');
// Gets the DOM element with the ID 'send-button', which is the button the user clicks to send their message.

async function generateResponse(prompt) {
    // Defines an asynchronous function `generateResponse` that takes the user's input (prompt) and generates a response from the API.

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        // Sends a POST request to the Gemini API endpoint with the API key appended to the URL.
        method: 'POST',
        // Specifies the HTTP method (POST) to send data to the API.

        headers: {
            'Content-Type': 'application/json',
        },
        // Sets the request headers to indicate that the content being sent is in JSON format.

        body: JSON.stringify({
            // The body of the request, converting the user's message into the format required by the API.
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                            // The user's input (`prompt`) is inserted into the request payload.
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        // Checks if the API request was unsuccessful (i.e., the response is not OK).
        throw new Error('Failed to generate response');
        // If there's an error, an exception is thrown with an error message.
    }

    const data = await response.json();
    // Converts the API response to JSON format.

    return data.candidates[0].content.parts[0].text;
    // Returns the first generated response from the API (the text part of the response).
}

function cleanMarkdown(text) {
    // Defines a function `cleanMarkdown` to remove any Markdown formatting (like headers, bold text, etc.) from the response.
    return text
        .replace(/#{1,6}\s?/g, '')
        // Removes any Markdown headers (e.g., #, ##, ###).

        .replace(/\*\*/g, '')
        // Removes bold formatting (double asterisks **).

        .replace(/\n{3,}/g, '\n\n')
        // Limits excessive newlines to a maximum of two (replaces more than two newlines with two).

        .trim();
    // Removes any whitespace from the start and end of the string.
}

function addMessage(message, isUser) {
    // Defines a function `addMessage` to add a new message to the chat display. It takes the `message` (text) and `isUser` (boolean indicating whether the message is from the user or the bot).
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    // Creates a new `div` element for the message and adds the 'message' CSS class.

    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    // Adds a class based on whether the message is from the user ('user-message') or the bot ('bot-message').

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    // Creates an image element for the profile picture (either the user or the bot) and adds the 'profile-image' CSS class.

    profileImage.src = isUser ? 'https://ideogram.ai/assets/progressive-image/balanced/response/kjiZm3kfRgKLl_K4b8LXbA' : 'data:image/png;base64,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';
    // Sets the image source depending on whether it's a user or bot message ('user.jpg' or 'bot.jpg').

    profileImage.alt = isUser ? 'User' : 'Bot';
    // Sets the alternate text for the image (for accessibility), either 'User' or 'Bot'.

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    // Creates a `div` element to hold the text content of the message and adds the 'message-content' CSS class.

    messageContent.textContent = message;
    // Sets the text content of the message.

    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    // Appends the profile image and message content to the message element.

    chatMessages.appendChild(messageElement);
    // Appends the complete message (with profile image and text) to the chat messages section.

    chatMessages.scrollTop = chatMessages.scrollHeight;
    // Scrolls the chat to the bottom to ensure the latest message is visible.
}

async function handleUserInput() {
    // Defines an asynchronous function `handleUserInput` to process and handle the user’s input.
    const userMessage = userInput.value.trim();
    // Retrieves the user input from the input field and trims any leading/trailing whitespace.

    if (userMessage) {
        // If the user has entered a message (i.e., it's not empty):
        addMessage(userMessage, true);
        // Adds the user's message to the chat (as a user message).

        userInput.value = '';
        // Clears the input field.

        sendButton.disabled = true;
        userInput.disabled = true;
        // Disables the send button and the input field to prevent multiple messages being sent while the bot responds.

        try {
            const botMessage = await generateResponse(userMessage);
            // Calls the `generateResponse` function to get the bot's reply.

            addMessage(cleanMarkdown(botMessage), false);
            // Adds the bot's cleaned response to the chat.
        } catch (error) {
            console.error('Error:', error);
            // Logs any error that occurs during the bot response.

            addMessage('Sorry, I encountered an error. Please try again.', false);
            // Displays an error message in the chat if something goes wrong.
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
            // Re-enables the send button and the input field, and puts the focus back on the input for further user interaction.
        }
    }
}

sendButton.addEventListener('click', handleUserInput);
// Adds an event listener to the send button that calls `handleUserInput` when clicked.

userInput.addEventListener('keypress', (e) => {
    // Adds an event listener for when a key is pressed in the input field.
    if (e.key === 'Enter' && !e.shiftKey) {
        // Checks if the 'Enter' key is pressed and Shift is not held (to distinguish from Shift+Enter for newlines).
        e.preventDefault();
        // Prevents the default behavior of adding a newline.

        handleUserInput();
        // Calls `handleUserInput` to send the message.
    }
});