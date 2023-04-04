import React from 'react';
import { Navigate } from 'react-router-dom';
import withContext from '../Context';

const UserSignOut = ({context}) => {
  context.actions.signOut();

  return (
    <Navigate to="/" />
  );
}

export default withContext(UserSignOut);