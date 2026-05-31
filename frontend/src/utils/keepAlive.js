const BACKEND_URL = 'https://algeria-wander-hods.onrender.com';

export const startKeepAlive = () => {
    // Ping the backend every 10 minutes to prevent sleep
    const ping = () => {
        fetch(`${BACKEND_URL}/api/wilayas/`, { method: 'GET' })
            .catch(() => { }); // silently ignore errors
    };

    ping(); // ping immediately on load
    setInterval(ping, 10 * 60 * 1000); // then every 10 minutes
};