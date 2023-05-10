function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;

  if (errors.length) {
    errorsDisplay = (
      <div className="text-rose-500 mb-4">
        <ul>
          {errors.map((error, i) => <li key={i}>{error}</li>)}
        </ul>
      </div>
    );
  }

  return errorsDisplay;
}

export default ErrorsDisplay;