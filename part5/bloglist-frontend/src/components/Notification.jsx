const Notification = ({ notification }) => notification ? <div role="alert" className={`notification ${notification.type}`}>{notification.text}</div> : null
export default Notification
