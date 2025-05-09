type InputProps = {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  action: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ id, name, value, placeholder, action }: InputProps) => {
  return (
    <input
      id={String(id)}
      type="text"
      name={name}
      value={value}
      onChange={action}
      placeholder={placeholder}
      className="border-[.5px] text-[1.1rem] text-black/75 border-black/75 p-3 pr-10 rounded appearance-none focus:outline-none focus:ring-0 w-full max-w-[606px]"
    />
  );
};

export default Input;
