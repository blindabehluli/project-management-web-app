import React from 'react';

const Form = (props) => {
  const {
    cancel,
    errors,
    submit,
    submitButtonText,
    elements,
  } = props;

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  return (
    <>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        {elements()}
        <div className="">
          <button className="text-green-500 font-bold mr-2" type="submit">{submitButtonText}</button>
          <button className="text-rose-500 font-bold ml-2" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}

function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;

  if (errors.length) {
    errorsDisplay = (
      <div className="text-rose-500">
        <ul>
          {errors.map((error, i) => <li key={i}>{error}</li>)}
        </ul>
      </div>
    );
  }

  return errorsDisplay;
}

export default Form;