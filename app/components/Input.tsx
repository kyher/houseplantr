type props = {
  name: string;
  ref?: React.RefObject<HTMLInputElement>;
  invalid?: boolean;
  error?: string;
  type?: string;
  autoFocus?: boolean;
  required?: boolean;
};

export const Input = ({
  name,
  ref,
  invalid,
  error,
  type,
  autoFocus,
  required,
}: props) => {
  return (
    <input
      ref={ref}
      data-testid={name}
      type={type ? type : "text"}
      autoComplete={type === "email" ? "email" : ""}
      name={name}
      className="mb-5 w-full rounded-md border-2 border-blue-500 px-3 text-lg leading-loose text-black"
      aria-invalid={invalid}
      aria-errormessage={error}
      required={required}
      autoFocus={autoFocus}
    />
  );
};
