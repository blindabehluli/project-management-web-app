import React from 'react';
import withContext from '../Context';

const Authenticated = ({ context  }) => {
  const authUser = context.authenticatedUser;
  return (
  <div className="">
    <div className="">
      <h1>{authUser.name} is authenticated!</h1>
      <p>Your username is {authUser.username}.</p>
    </div>
  </div>
  );
}

export default withContext(Authenticated);