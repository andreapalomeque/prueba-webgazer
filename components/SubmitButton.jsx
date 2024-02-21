const SubmitButton = ({ isLoading, loadingText, text, onClick }) => (
  <button
    type="submit"
    className="mt-6 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
    disabled={isLoading}
    onClick={onClick}
  >
    {isLoading ? loadingText : text}
  </button>
);

export default SubmitButton;
