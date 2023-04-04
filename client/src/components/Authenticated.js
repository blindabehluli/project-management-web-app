import React from 'react';
import withContext from '../Context';

const Authenticated = ({ context  }) => {
  const authUser = context.authenticatedUser;
  return (
  <div className="">
    <div className="">
      <h1>{authUser.firstName} is authenticated!</h1>
    </div>
  </div>
  );
}

export default withContext(Authenticated);