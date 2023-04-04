import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import withContext from '../Context';

const UserSignOut = ({ context }) => {
  useEffect(() => {
    const signOut = () => {
      context.actions.signOut();
    };
    signOut();
  }, [context.actions]);

  return <Navigate to="/" />;
};

export default withContext(UserSignOut);