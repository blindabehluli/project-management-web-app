import React from 'react';
import withContext from '../Context';

const Authenticated = ({ context  }) => {
  const authUser = context.authenticatedUser;
  return (
  <div className="flex justify-center items-center p-12">
    <div className="text-indigo-500 text-2xl font-bold">
      <h1>{authUser.firstName} is authenticated! This is a Private Route</h1>
    </div>
  </div>
  );
}

export default withContext(Authenticated);