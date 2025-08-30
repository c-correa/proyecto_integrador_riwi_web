// utils/messages.js
export function showMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;

    Object.assign(messageDiv.style, {
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1000',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backgroundColor: type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1',
        color: type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460',
        border: `1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'}`
    });

    document.body.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), 5000);
}
