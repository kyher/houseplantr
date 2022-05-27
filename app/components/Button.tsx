type props = {
  text: string;
  submit?: boolean;
  testId?: string;
};

export const Button = ({ text, submit, testId }: props) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      className="mx-2 rounded bg-green-900 py-2 px-4 text-white"
      data-testid={testId}
    >
      {text}
    </button>
  );
};
