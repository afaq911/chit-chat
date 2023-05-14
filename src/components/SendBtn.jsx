import React from "react";

const SendBtn = () => {
  return (
    <span data-testid="send" data-icon="send" className="">
      <svg viewBox="0 0 24 24" width="24" height="24" className="">
        <path
          fill="currentColor"
          d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
        ></path>
      </svg>
    </span>
  );
};

export default SendBtn;
