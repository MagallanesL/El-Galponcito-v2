import './authbutton.css'

const AuthButton = ({ onClick, text }) => {
  return (
    <button className="auth-button" onClick={onClick}>
    {text}
  </button>
  );
};

export default AuthButton;
