const FiltroInput = ({ label, name, value, onChange, type="text" }) => (
    <div className="flex-1">
      <label className="text-sm">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2 mt-1"
      />
    </div>
  );

  export default FiltroInput;