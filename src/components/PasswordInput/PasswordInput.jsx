import { forwardRef, useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import './PasswordInput.css'

export const PasswordInput = forwardRef(MyInput);

function MyInput({ name, ...props }, ref) {
  const [isPasswordLegible, setIsPasswordLegible] = useState(false);

  function togglePasswordInputType() {
    setIsPasswordLegible(!isPasswordLegible);
  }

  return (
    <div className='passwordInput'>
      <input
        type={isPasswordLegible ? 'text' : 'password'}
        id={name}
        ref={ref}
        name={name}
        {...props}
      />
      {!isPasswordLegible && (
        <button type="button" onClick={togglePasswordInputType}>
          <HiEye />
        </button>
      )}
      {isPasswordLegible && (
        <button type="button" onClick={togglePasswordInputType}>
          <HiEyeSlash />
        </button>
      )}
    </div>
  );
}