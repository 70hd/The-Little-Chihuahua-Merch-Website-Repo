type InputProps = {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  action: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
};

const Input = ({
  id,
  type,
  name,
  value,
  placeholder,
  action,
  required,
}: InputProps) => {
  return (
    <input
      id={String(id)}
      type={type === "email" ? "email" : "text"}
      name={name}
      value={value}
      onChange={action}
      placeholder={placeholder}
      required={required}
      className="border-[.5px] text-[1.1rem] text-black/75 border-black/75 p-3 pr-10 rounded appearance-none focus:outline-none focus:ring-0 w-full max-w-[606px]"
    />
  );
};

export default Input;
