type props = {
  text: string;
  submit?: boolean;
  testId?: string;
};

export const Button = ({ text, submit, testId }: props) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      className="mx-2 rounded border-2 border-green-900 bg-white py-2 px-4 text-green-900"
      data-testid={testId}
    >
      {text}
    </button>
  );
};
